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
import locStorage from './assets/js/utils/locStorage.js'
import img404 from './assets/img/img404.jpg'
import imgloading from './assets/img/imgloading.gif'

Vue.config.productionTip = false

Vue.prototype.clipboard = clipboard
Vue.prototype.$store = store
Vue.prototype.$http = axios;
Vue.prototype.$locStorage = locStorage;

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

// 配置项
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: img404,
  loading: imgloading,
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
  if(config.url.indexOf('user/login')!= -1){
    config.headers.verifyCode = localStorage.getItem('verifyCode');
  }
  if(config.url.indexOf('user/retrievePass')!= -1){
    config.headers.verifyCodeForRetrieve = localStorage.getItem('verifyCodeForRetrieve');
  }
  if(config.url.indexOf('user/register')!= -1){
    config.headers.verifyCodeForRegister = localStorage.getItem('verifyCodeForRegister');
  }
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
  console.log("\n %c Hellohao图像托管 Tbed开源版 %c https://github.com/Hello-hao/Tbed","color:#fff;font-size:14px;background:linear-gradient(90deg,#fda085,#f6d365);padding:5px 0;border-radius: 15px 0 0 15px;","color:#000;background:linear-gradient(90deg,#f6d365,#fda085);padding:5px 15px 5px 0px;border-radius:  0 15px 15px 0;font-size:14px;");
}



