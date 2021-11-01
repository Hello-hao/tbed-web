import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import axios from 'axios'
import Iview from 'view-design'
import clipboard from 'clipboard'
import preview from 'vue-photo-preview'
import VueLazyload from 'vue-lazyload'
import Viewer from 'v-viewer';
import MetaInfo from 'vue-meta-info';
import 'viewerjs/dist/viewer.css'
import 'vue-photo-preview/dist/skin.css'
import "animate.css"
import 'view-design/dist/styles/iview.css'
import './my-theme/index.less';
import '@/assets/css/font.less';
import './assets/css/style.css'
import md5 from "js-md5";
import "babel-polyfill";

Vue.config.productionTip = false

Vue.prototype.clipboard = clipboard
Vue.prototype.$store = store
Vue.prototype.$http = axios;

function getWebInfo () {
  return new Promise((resolve, reject) => {
    axios.get('/webInfo'+'?'+new Date().getTime()+Math.random()+Math.ceil(Math.random()*(10000-99999)+99999)).then(data => {
      var json = data.data.data;
      if(json){
        json.splitline="-";
        store.commit("cahngeMetaInfo", json);
      }
      resolve();
    }).catch(error => {
      console.log(error);
      reject()
    })
  })
}

async function init() {
  await getWebInfo();
}

var options = {
  // index: 0,
  escKey: false,
  showHideOpacity:false,
  bgOpacity:0.6,
  allowPanToNext:true,
  closeOnScroll:false,
  mouseUsed:true,
  tapToClose: false,
  tapToToggleControls: true,
  clickToCloseNonZoomable: true,
  timeToIdle: 4000
};

Vue.use(Iview).use(preview,options).use(Viewer,{
  defaultOptions: {
    navbar:false
  }
}).use(MetaInfo)

Vue.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 1
})

axios.defaults.withCredentials = true;
axios.defaults.timeout = 60000;
axios.defaults.method = 'POST';
axios.defaults.headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'usersOrigin':md5(window.location.protocol+'//'+window.location.host)
}
//注册拦截器
axios.interceptors.request.use(config => {
  config.headers.usersOrigin = md5(window.location.protocol+'//'+window.location.host)
  if (store.state.Authorization) {
    config.headers.Authorization = localStorage.getItem('Authorization');
  } else if (localStorage.getItem('Authorization')) {
    config.headers.Authorization = localStorage.getItem('Authorization');
  }
  return config;
}, error => {
  console.log("拦截器-请求错误：" + error);
})

axios.interceptors.response.use(config => {
  store.state.auth = true;
  store.state.authInfo='';
  if (config.data.code == 406 || config.data.code == '406') {
    console.log("前端域名配置错误")
    store.state.authInfo='前端域名配置错误';
    store.state.authInfo='';
    store.state.auth = false;
  } else if (config.data.code == 403) {
    location.replace("/login");
  }
  return config;
}, error => {
  console.log("拦截器-相应错误：" + error);
})
axios.get('/hellohao/config.json'+'?'+new Date().getTime()+Math.random()+Math.ceil(Math.random()*(10000-99999)+99999)).then(data => {
  var json = data.data;
  store.commit("setServerHost", json.serverHost);
  axios.defaults.baseURL = json.serverHost;

  new Vue({
    render: h => h(App),
    router,
    store,
    beforeCreate(){
      init();
    },
  }).$mount('#app')

})

if (window.console) {
  console.log("%c -          %c  %c  ","background: url(data:image/png;base64,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) no-repeat;background-size: 200px;font-size:50px;", "","");
  console.log("%cTbed.hellohao.cn %c  %c  ","color:#59a869;font-weight:bold;font-size:xx-large", "","");
  console.log("%c本站由Hellohao独立开发 ©2019 Hellohao-All Rights Reserved %c  %c  ","color:#59a869;font-weight:bold;font-size:smaller", "","");
}



