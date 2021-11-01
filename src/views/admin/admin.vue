
<template>
  <div class="layout">
    <Layout :style="{minHeight: '100vh'}">
<!--     :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto'}"  @on-collapse="expand"-->
      <Sider   style="height: 100vh;z-index: 15; " breakpoint="md" collapsible :collapsed-width="78" v-model="isCollapsed" :class="{'miniW' : screenWidth<=768}">
        <Menu  :accordion="true" active-name="control" theme="dark" width="auto" :class="menuitemClasses" style="overflow-y: auto; overflow-x: hidden;height: 90vh;">
          <MenuItem name="men01">
<!--            <span style="font-size: x-large;width: 100%;"  @click="goHome">Hellohao</span>-->
<!--            <img @click="goHome" :src="$store.state.metaInfo.logo" style="width: 135px;" v-if="$store.state.metaInfo.logo!=null || $store.state.metaInfo.logo!=''" />-->
            <img @click="goHome" :src="$store.state.metaInfo.logo==null?hellohaologo:$store.state.metaInfo.logo" style="width: 135px;"  />
          </MenuItem>
          <MenuItem name="control" style="background: #515a6e;" @click.native="adminmenuItem('/',null)">
            <Icon type="md-speedometer" class="menucolo"/>
            <span class="menucolo">仪表盘</span>
          </MenuItem>

          <Submenu name="men1">
            <template slot="title">
              <Icon type="md-contact" class="menucolo" />
              <span class="menucolo">个人中心</span>
            </template>
            <MenuItem name="photo" @click.native="adminmenuItem('/photo','个人中心')">我的相册</MenuItem>
            <MenuItem name="gallery" @click.native="adminmenuItem('/gallery','个人中心')">画廊管理</MenuItem>
          </Submenu>

          <Submenu name="men5">
            <template slot="title">
              <Icon type="md-color-fill" class="menucolo" />
              <span class="menucolo">个性设置</span>
            </template>
            <MenuItem name="photo" @click.native="adminmenuItem('/usersetting','个性设置')">密码修改</MenuItem>
            <MenuItem v-if="$store.state.metaInfo.watermark==1" name="watermark" @click.native="adminmenuItem('/watermark','个性设置')">水印配置</MenuItem>
            <MenuItem v-if="$store.state.metaInfo.api==1" name="api" @click.native="adminmenuItem('/api','API文档')">API文档</MenuItem>
          </Submenu>

          <Submenu name="men2" v-if="$store.state.RoleLevel=='admin'">
            <template slot="title">
              <Icon type="md-contacts" class="menucolo"/>
              <span class="menucolo">用户管理</span>
            </template>
            <MenuItem name="user" @click.native="adminmenuItem('/user','用户管理')">用户列表</MenuItem>
            <MenuItem name="group" @click.native="adminmenuItem('/group','用户管理')">分发群组</MenuItem>
            <MenuItem name="capacity" @click.native="adminmenuItem('/capacity','用户管理')">扩容码</MenuItem>
          </Submenu>

          <Submenu name="men3" v-if="$store.state.RoleLevel=='admin'">
            <template slot="title">
              <Icon type="ios-switch" class="menucolo"/>
              <span class="menucolo">系统设置</span>
            </template>
            <MenuItem name="storage" @click.native="adminmenuItem('/storage','系统设置')">存储设置</MenuItem>
            <MenuItem name="setting" @click.native="adminmenuItem('/setting','系统设置')">站点设置</MenuItem>
            <MenuItem name="MoreSetting" @click.native="adminmenuItem('/moresetting','系统设置')">更多设置</MenuItem>
          </Submenu>

          <Submenu name="men4" v-if="$store.state.RoleLevel=='admin'">
            <template slot="title">
              <Icon type="md-git-branch" class="menucolo"/>
              <Badge dot :offset="wzxy" :count="isshow"><span class="menucolo" >更多</span></Badge>
            </template>
            <MenuItem name="about" @click.native="adminmenuItem('/about','系统设置')" ><Badge dot :count="isshow" :offset="wzxy2">关于程序</Badge></MenuItem>
          </Submenu>
        </Menu>
      </Sider>
      <Layout>
        <div style="width: 100%;height: 100%;background-color: rgba(51,51,51,0.36);position: fixed;z-index: 14;" @click="expand" v-show="!isCollapsed && screenWidth<=768"></div>
        <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)',minWidth: '380px',position: 'fixed',top: '0',width: '100%',zIndex:'12'}">
          <Breadcrumb :style="{float: 'left'}">
            <BreadcrumbItem v-for="(item,index)  in this.$route.matched" :key="index">
              {{item.meta.title}}
            </BreadcrumbItem>
          </Breadcrumb>
          <div class="layout-nav" >

            <Menu mode="horizontal" theme="light" active-name="1">

              <Submenu name="3" >
                <template slot="title">
                  <Icon type="md-contact" style="font-size: large;" />
                  用户管理
                </template>
                <MenuGroup>
                  <MenuItem name="setpass" @click.native="adminmenuItem('/usersetting','个性设置')">修改密码</MenuItem>
                  <MenuItem name="exit" @click.native="exit">退出登录</MenuItem>
                </MenuGroup>
              </Submenu>

            </Menu>
          </div>

        </Header>
        <Content  style="padding: 16px;height: 100vh; overflow:auto;">

<!--          <Card :bordered="false">-->
<!--            min-height: 600px;-->
            <div style="background: #F8F8F8;height: auto;">
              <router-view></router-view>
            </div>
<!--          </Card>-->
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import {request} from "@/network/request";

export default {
  data () {
    return {
      isshow:0,
      wzxy:[8,33],
      wzxy2:[8,5],
      hellohaologo:require("../../assets/img/hellohaologo-w.svg"),
      tagname:null,
      screenWidth: document.body.clientWidth,
      isCollapsed: false,
    };
  },
  methods:{
    expand(){
      this.isCollapsed = true;
    },
    goHome (){
      // this.$router.replace("/")
      window.location.href="/"
    },
    adminmenuItem (tarPath,tagname){
      // if (this.$route.path !== "/admin"+tarPath) {
      this.tagname = tagname;
      // var tagname = this.$refs.datamenu.dataset.name;
      this.$router.replace("/admin"+tarPath)
    },
    exit(){
      this.$Modal.confirm({
        title: '确定要退出你的账号吗？',
        content: '<p>期待你再次登录  (๑ó﹏ò๑)</p>',
        onOk: () => {
          this.logout();
        },
        onCancel: () => {
          //this.$Message.info('Clicked cancel');
        }
      });
    },
    logout(){
      request(
          "/user/logout",
          {}).then(res => {
        console.log(res);
        if(res.status==200){
          var json = res.data;
          this.$store.state.loginStatus= false;
          localStorage.removeItem('Authorization');
          localStorage.removeItem('RoleLevel');
          this.$router.replace("");
          this.$Message.success(json.info);
            setTimeout(()=>{
              // this.$router.replace("/")
              location. reload()
              // this.$router.go(0)
            },1500)

        }else{
          this.$Message.error("请求时出现错误");
        }
      }).catch(err => {
        console.log(err);
        this.$Message.error('服务器请求错误');
      })
    },

  },
  mounted(){
    this.$Spin.hide();
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        this.screenWidth = window.screenWidth
      })()
    }

  },
  computed: {
    menuitemClasses: function () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    }
  },
  metaInfo(){
    return {
      title: "控制台|"+this.$store.state.metaInfo.webname+this.$store.state.metaInfo.splitline+this.$store.state.metaInfo.websubtitle,
      meta: [
        {
          name: "keywords",
          content: this.$store.state.metaInfo.keywords
        }, {
          name: "description",
          content: this.$store.state.metaInfo.description
        }
      ]
    }
  }

}
</script>
<style scoped>

.layout-con{
  height: 100%;
  width: 100%;
}
.ivu-menu {
  z-index: 12;
}

.menu-item span{
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width .2s ease .2s;
}
.menu-item i{
  transform: translateX(0px);
  transition: font-size .2s ease, transform .2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span{
  width: 0px;
  transition: width .2s ease;
}
.collapsed-menu i{
  transform: translateX(5px);
  transition: font-size .2s ease .2s, transform .2s ease .2s;
  vertical-align: middle;
  font-size: 22px;
}
.layout-logo{
  width: 100px;
  height: 30px;
  /*background: #5b6270;*/
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  /*left: 20px;*/
  line-height: 35px;
  color: #FFF;
  font-size: x-large;
}
.menucolo{
  color: rgba(255,255,255,.7);
}
.menucolo:hover{
  color: rgba(255,255,255,1);
}

.layout-nav{
  position: inherit;
  right: 1px;
}

.miniW{
 position: fixed;
}

body{
  overflow-y: hidden;
  overflow-x: hidden;
}


</style>
