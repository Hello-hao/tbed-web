import Vue from "vue"
import Router from "vue-router"


Vue.use(Router)
const VueRouterPush = Router.prototype.replace
Router.prototype.replace = function replace (to) {
    return VueRouterPush.call(this, to).catch(err => err)
}


const index = ()=> import("../views/index.vue")
const login = ()=> import("../views/login.vue")
const register = ()=> import("../views/register.vue")
const upload = ()=> import("../views/upload.vue")
const admin = ()=> import("../views/admin/admin.vue")
const control = ()=> import("../views/admin/control.vue")
const photo = ()=> import("../views/admin/photo.vue")
const userlist = ()=> import("../views/admin/userlist.vue")
const storage = ()=> import("../views/admin/storage.vue")
const group = ()=> import("../views/admin/group.vue")
const capacity = () => import("../views/admin/capacity.vue")
const setting = ()=> import("../views/admin/setting.vue")
const gallery = ()=> import("../views/admin/gallery.vue")
const about = ()=> import("../views/admin/about.vue")
const moreSetting = ()=> import("../views/admin/more-setting.vue")
const userSetting = ()=> import("../views/admin/user-setting.vue")
const api = ()=> import("../views/admin/api.vue")

const art = ()=> import("../views/art.vue")
const notFound = ()=> import("../views/404.vue")


const routes = [
    {
        path:'',
        meta:{
            title:'首页',
        },
        component:index,
        children:[
            {
                path:'login',
                meta:{
                    title:'登录',
                },
                component:login
            },{
                path:'register',
                meta:{
                    title:'注册',
                },
                component:register
            },
            {
                path:'/',//index
                meta:{
                    title:"上传",
                    // requireAuth: true
                },
                component:upload
            },{

                path:'h/*',
                meta:{
                    title:'画廊分享',
                },
                component:art,
            },
            {

                path:'/404',
                meta:{
                    title:'页面不存在',
                },
                component:notFound,
            }
        ]
    },
    {
        path:'/admin',
        meta:{
            title:'控制台',
        },
        component:admin,
        children:[
            // {
            //     path:'/',
            //     redirect:'control'
            // },
            {
                path:'/',
                meta:{
                    title:"仪表盘"
                },
                component:control
            },
            {
                path:'photo',
                meta:{
                    title:"我的相册"
                },
                component:photo
            },
            {
                path:'user',
                meta:{
                    title:"用户列表"
                },
                component:userlist
            },
            {
                path:'storage',
                meta:{
                    title:"存储配置"
                },
                component:storage
            },
            {
                path:'group',
                meta:{
                    title:"分发群组"
                },
                component:group
            },{
                path:'usersetting',
                meta:{
                    title:"密码修改"
                },
                component:userSetting
            },{
                path:'capacity',
                meta:{
                    title:"扩容码"
                },
                component:capacity
            },
            {
                path:'setting',
                meta:{
                    title:"站点配置"
                },
                component:setting
            },
            {
                path:'gallery',
                meta:{
                    title:"画廊管理"
                },
                component:gallery
            },{
                path:'moresetting',
                meta:{
                    title:"更多设置"
                },
                component:moreSetting
            },{
                path:'about',
                meta:{
                    title:"关于程序"
                },
                component:about
            },{
                path:'api',
                meta:{
                    title:"API文档"
                },
                component:api
            }

        ]
    }
]

const router = new Router({
    //配置和组件之间的映射关系
    routes,
    //base:'/tbed/',
    mode:'history'//history  hash
})

router.beforeEach((to,from,next) => {

    if (to.matched.length == 0) {
        next({ path: '/404' })
    }
    var token = localStorage.getItem('Authorization');
    var RoleLevel = localStorage.getItem('RoleLevel');
    if (token == null || token == '' || RoleLevel==null || RoleLevel=='') {
        localStorage.removeItem('Authorization');
        localStorage.removeItem('RoleLevel');
    }
    var fullPath = to.path;
    if ( fullPath == '/login' || fullPath == '/register' || fullPath == '/'
        || fullPath.substring(0, 2)==='/v' || fullPath.substring(0, 2)==='/h') {
        if(fullPath=='/'){
            to.params.activeName = 'ishome';
        }else if(fullPath=='/login' || fullPath == '/register'){
            to.params.activeName = 'iscontrol';
        }
        next();
    }else{
        if(fullPath === '/auth'){
            next();
        }else{
            if (token == null || token == '' || RoleLevel==null || RoleLevel=='') {
                next('/login');
            } else {
                next();
            }
        }
    }
})

//把touter传入实例中
export default router
