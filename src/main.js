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
import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'
import '@/assets/css/hamburgers.min.css';

Vue.config.productionTip = false

Vue.prototype.clipboard = clipboard
Vue.prototype.$store = store
Vue.prototype.$http = axios;
Vue.prototype.$locStorage = locStorage;

var _hmt = _hmt || [];

function getWebInfo() {
    return new Promise((resolve, reject) => {
        axios.get('/webInfo' + '?' + new Date().getTime() + Math.random() + Math.ceil(Math.random() * (10000 - 99999) + 99999)).then(data => {
            var json = data.data.data;
            if (json) {
                json.splitline = "-";
                store.commit("cahngeMetaInfo", json);

                var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
                link.type = 'image/x-icon';
                link.rel = 'shortcut icon';
                link.href = json.webfavicons ? json.webfavicons : '';
                document.getElementsByTagName('head')[0].appendChild(link);
                if (json.baidu != null && json.baidu != '') {
                    // console.log('开始百度统计+', json.baidu)
                    window._hmt = _hmt;
                    (function () {
                        var hm = document.createElement("script");
                        hm.src = "https://hm.baidu.com/hm.js?" + json.baidu;
                        var s = document.getElementsByTagName("script")[0];
                        s.parentNode.insertBefore(hm, s);
                    })();
                }

                // const scriptInfo = document.createElement("script")
                // scriptInfo.type = "text/javascript"
                // scriptInfo.setAttribute("data-callType","callScript")
                // // scriptInfo.contains(`console.log(666666666666666666)`)
                // // scriptInfo.src = "需要引入的js路径"
                // document.head.appendChild(scriptInfo)
            }
            resolve();
        }).catch(error => {
            console.log(error);
            reject()
        })
    })
}

router.beforeEach((to, from, next) => {
    if (_hmt) {
        if (to.path) {
            _hmt.push(['_trackPageview', to.fullPath]);
        }
    }
    next();
});

async function init() {
    await getWebInfo();
}

var options = {
    escKey: false,
    showHideOpacity: false,
    bgOpacity: 0.6,
    allowPanToNext: true,
    closeOnScroll: false,
    mouseUsed: true,
    tapToClose: false,
    tapToToggleControls: true,
    clickToCloseNonZoomable: true,
    timeToIdle: 4000
};

Vue.use(Iview).use(preview, options).use(Viewer, {
    defaultOptions: {
        navbar: false
    }
}).use(MetaInfo).use(contentmenu)

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
    'usersOrigin': md5(window.location.protocol + '//' + window.location.host)
}

axios.interceptors.request.use(config => {
    if (config.url.indexOf('user/login') != -1) {
        config.headers.verifyCode = localStorage.getItem('verifyCode');
    }
    if (config.url.indexOf('user/retrievePass') != -1) {
        config.headers.verifyCodeForRetrieve = localStorage.getItem('verifyCodeForRetrieve');
    }
    if (config.url.indexOf('user/register') != -1) {
        config.headers.verifyCodeForRegister = localStorage.getItem('verifyCodeForRegister');
    }
    config.headers.usersOrigin = md5(window.location.protocol + '//' + window.location.host)
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
    store.state.authInfo = '';
    if (config.data.code == 406 || config.data.code == '406') {
        console.log("前端域名配置错误")
        store.state.authInfo = '前端域名配置错误';
        // store.state.authInfo='';
        store.state.auth = false;
    } else if (config.data.code == 403) {
        location.replace("/login");
    }
    return config;
}, error => {
    console.log("拦截器-相应错误：" + error);
})
axios.get('/hellohao/config.json' + '?' + new Date().getTime() + Math.random() + Math.ceil(Math.random() * (10000 - 99999) + 99999)).then(data => {
    var json = data.data;
    store.commit("setServerHost", json.serverHost);
    axios.defaults.baseURL = json.serverHost;

    new Vue({
        render: h => h(App),
        router,
        store,
        beforeCreate() {
            init();
        },
    }).$mount('#app')

})

if (window.console) {
    console.log("\n".concat(" %c Hellohao图像托管 ", "FREE", " ").concat("", " %c http://tbed.hellohao.cn ", "\n", "\n"), "color: #fadfa3; background: #030307; padding:5px 0;", "background: #fadfa3; padding:5px 0;");

}



