<template>
  <div class="layout">
    <Layout :style="{minHeight: '100vh'}">
      <Layout>

        <div style="width: 100%;height: 100%;background-color: rgba(51,51,51,0.36);position: fixed;z-index: 9;"
             @click="showMenu" v-show="isCollapsed"></div>
        <!--        <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)',minWidth: '380px',position: 'fixed',top: '0',width: '100%',zIndex:'12'}">-->
        <div class="layout-nav" v-show="true">
          <Menu mode="horizontal" theme="light" active-name="1">
            <MenuItem name="men01">
              <img @click="goHome" :src="$store.state.metaInfo.logo==null?hellohaologo:$store.state.metaInfo.logo"
                   style="width: 135px;vertical-align: middle;"/>
            </MenuItem>
            <!--              <MenuItem   @click.native="goHome">-->
            <!--                <Icon type="md-home"/>-->
            <!--                <span>首 页</span>-->
            <!--              </MenuItem>-->
            <template v-if="screenWidth>1024">
              <MenuItem name="control" v-if="screenWidth>768" @click.native="adminmenuItem('/',null)">
                <Icon type="md-speedometer"/>
                <span>仪表盘</span>
              </MenuItem>
              <Submenu name="men1" v-if="screenWidth>768">
                <template slot="title">
                  <Icon type="md-contact"/>
                  <span>个人中心</span>
                </template>
                <MenuItem name="photo" @click.native="adminmenuItem('/photo','个人中心')">我的相册</MenuItem>
                <MenuItem name="gallery" @click.native="adminmenuItem('/gallery','个人中心')">画廊管理</MenuItem>
              </Submenu>
              <Submenu name="men5">
                <template slot="title">
                  <Icon type="md-color-fill"/>
                  <span>我的设置</span>
                </template>
                <MenuItem name="usersetting" @click.native="adminmenuItem('/usersetting','我的设置')">密码修改
                </MenuItem>
                <MenuItem name="api" v-if="$store.state.metaInfo.api==1"
                          @click.native="adminmenuItem('/api','我的设置')">API文档
                </MenuItem>
              </Submenu>
              <Submenu name="men2" v-if="$store.state.RoleLevel=='admin'">
                <template slot="title">
                  <Icon type="md-contacts"/>
                  <span>用户管理</span>
                </template>
                <MenuItem name="user" @click.native="adminmenuItem('/user','用户管理')">用户列表</MenuItem>
                <MenuItem name="group" @click.native="adminmenuItem('/group','用户管理')">分发群组</MenuItem>
                <MenuItem name="capacity" @click.native="adminmenuItem('/capacity','用户管理')">扩容码</MenuItem>
              </Submenu>
              <Submenu name="men3" v-if="$store.state.RoleLevel=='admin'">
                <template slot="title">
                  <Icon type="ios-switch"/>
                  <span>系统设置</span>
                </template>
                <MenuItem name="storage" @click.native="adminmenuItem('/storage','系统设置')">存储设置</MenuItem>
                <MenuItem name="setting" @click.native="adminmenuItem('/setting','系统设置')">站点设置</MenuItem>
                <MenuItem name="MoreSetting" @click.native="adminmenuItem('/moresetting','系统设置')">更多设置
                </MenuItem>
              </Submenu>
              <Submenu name="men4" v-if="$store.state.RoleLevel=='admin'">
                <template slot="title">
                  <Icon type="md-git-branch"/>
                  <Badge dot :offset="wzxy" :count="isshow"><span>更 多</span></Badge>
                </template>
                <MenuItem name="about" @click.native="adminmenuItem('/about','系统设置')">
                  <Badge dot :count="isshow" :offset="wzxy2">关于程序</Badge>
                </MenuItem>
              </Submenu>
              <!--                <Submenu name="3" >-->
              <!--                  <template slot="title">-->
              <!--                    <Icon type="md-contact" style="font-size: large;" />-->
              <!--                    用户管理-->
              <!--                  </template>-->
              <!--                  <MenuGroup>-->
              <!--                    <MenuItem name="setpass" @click.native="adminmenuItem('/usersetting','个性设置')">修改密码</MenuItem>-->
              <!--                    <MenuItem name="exit" @click.native="exit">退出登录</MenuItem>-->
              <!--                  </MenuGroup>-->
              <!--                </Submenu>-->
              <Icon type="md-exit" class="exit-style" title="退出登录" @click.native="exit" size="28"
                    style="float: right; margin-right: 20px; line-height: 55px;cursor: pointer;"/>
            </template>
            <template v-else>
              <Icon @click.native="showMenu" type="md-menu" size="28"
                    style="float: right; margin-right: 20px; line-height: 55px; "/>
            </template>
          </Menu>
        </div>

        <!--    移动端状态栏   -->
        <div v-show="isMenu!='none'" class="move-style animate__animated"
             :class="{'animate__fadeInDown' :isMenu=='show','animate__fadeOutUp' :isMenu=='hide'}">
          <p style="text-indent: 8px;" @click="adminmenuItem('/',null)">
            <Icon type="md-speedometer" size="16"/>&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-weight: bold">仪表盘</span>
          </p>
          <Collapse simple>
            <Panel name="1">
              <span style="font-weight: bold">个人中心</span>
              <List size="small" slot="content" :split="false">
                <ListItem style="text-indent: 34px;" @click.native="adminmenuItem('/photo','个人中心')">我的相册
                </ListItem>
                <ListItem style="text-indent: 34px;" @click.native="adminmenuItem('/gallery','个人中心')">画廊管理
                </ListItem>
              </List>
            </Panel>
            <Panel name="2">
              <span style="font-weight: bold">我的设置</span>
              <List size="small" slot="content" :split="false">
                <ListItem style="text-indent: 34px;" @click.native="adminmenuItem('/usersetting','我的设置')">密码修改
                </ListItem>
                <ListItem style="text-indent: 34px;" v-if="$store.state.metaInfo.api==1"
                          @click.native="adminmenuItem('/api','我的设置')">API文档
                </ListItem>
              </List>
            </Panel>
            <Panel name="3" v-if="$store.state.RoleLevel=='admin'">
              <span style="font-weight: bold">用户管理</span>
              <List size="small" slot="content" :split="false">
                <ListItem style="text-indent: 34px;" @click.native="adminmenuItem('/user','个人中心')">用户列表
                </ListItem>
                <ListItem style="text-indent: 34px;" @click.native="adminmenuItem('/group','个人中心')">分发群组
                </ListItem>
                <ListItem style="text-indent: 34px;" @click.native="adminmenuItem('/capacity','个人中心')">扩容码
                </ListItem>
              </List>
            </Panel>
            <Panel name="4" v-if="$store.state.RoleLevel=='admin'">
              <span style="font-weight: bold">系统设置</span>
              <List size="small" slot="content" :split="false">
                <ListItem style="text-indent: 34px;" @click.native="adminmenuItem('/storage','系统设置')">存储设置
                </ListItem>
                <ListItem style="text-indent: 34px;" @click.native="adminmenuItem('/setting','系统设置')">站点设置
                </ListItem>
                <ListItem style="text-indent: 34px;" @click.native="adminmenuItem('/moresetting','系统设置')">更多设置
                </ListItem>
              </List>
            </Panel>
            <Panel name="5" v-if="$store.state.RoleLevel=='admin'">
              <span style="font-weight: bold">更 多</span>
              <List size="small" slot="content" :split="false">
                <ListItem style="text-indent: 34px;" @click.native="adminmenuItem('/about','关于程序')">关于程序
                </ListItem>
              </List>
            </Panel>

          </Collapse>
          <p style="text-indent: 8px;" @click="exit">
            <Icon type="md-exit" size="16"/>&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-weight: bold">退 出</span></p>
        </div>


        <Content style="padding: 16px;height: 100vh; overflow:auto;position: relative;">
          <div style="background: #F8F8F8;height: auto;">
            <router-view></router-view>
          </div>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import {request} from "@/network/request";

export default {
  data() {
    return {
      isMenu: 'none',
      isRouterAlive: true,
      isshow: 0,
      wzxy: [22, 1],
      wzxy2: [3, 0],
      hellohaologo: require("../../assets/img/hellohaologo.svg"),
      tagname: null,
      screenWidth: document.body.clientWidth,
      isCollapsed: false,
    };
  },
  methods: {
    showMenu() {
      if (this.isMenu == 'none') {
        this.isMenu = 'show'
        this.isCollapsed = true
      } else {
        if (this.isMenu == 'show') {
          this.isMenu = 'hide'
          this.isCollapsed = false
        } else {
          this.isMenu = 'show'
          this.isCollapsed = true
        }
      }
    },
    goHome() {
      window.location.href = "/"
    },
    adminmenuItem(tarPath, tagname) {
      this.isCollapsed = false;
      this.isMenu = 'none'
      // if (this.$route.path !== "/admin"+tarPath) {
      this.tagname = tagname;
      // var tagname = this.$refs.datamenu.dataset.name;
      this.$router.replace("/admin" + tarPath)
    },
    exit() {
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
    logout() {
      request(
          "/user/logout",
          {}).then(res => {
        console.log(res);
        if (res.status == 200) {
          var json = res.data;
          this.$store.state.loginStatus = false;
          localStorage.removeItem('Authorization');
          localStorage.removeItem('RoleLevel');
          this.$router.replace("");
          this.$Message.success(json.info);
          setTimeout(() => {
            // this.$router.replace("/")
            location.reload()
            // this.$router.go(0)
          }, 1500)

        } else {
          this.$Message.error("请求时出现错误");
        }
      }).catch(err => {
        console.log(err);
        this.$Message.error('服务器请求错误');
      })
    },

  },
  mounted() {
    this.$Spin.hide();
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        this.screenWidth = window.screenWidth
        if (window.screenWidth > 1024) {
          this.isMenu = 'none'
        }
        // console.log("屏幕宽度=="+this.screenWidth);
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
  metaInfo() {
    return {
      title: "控制台|" + this.$store.state.metaInfo.webname + this.$store.state.metaInfo.splitline + this.$store.state.metaInfo.websubtitle,
      meta: [
        {
          name: "keywords",
          content: this.$store.state.metaInfo.keywords
        }, {
          name: "description",
          content: this.$store.state.metaInfo.webms
        }
      ]
    }
  }

}
</script>
<style scoped>
.ivu-collapse {
  border: 0px;
}

.exit-style:hover {
  color: #2d8cf0;
}

.ivu-collapse > .ivu-collapse-item {
  border-top: 0px solid #dcdee2;
}

.animate__fadeInDown {
  --animate-duration: .5s;
}

.animate__fadeOutUp {
  --animate-duration: .5s;
}

.move-style {
  max-width: 95%;
  width: 100%;
  margin: auto;
  padding: 15px;
  background: #FFF;
  border-radius: 10px;
  -webkit-box-shadow: 0px 5px 30px rgb(0 0 0 / 16%);
  box-shadow: 0px 5px 30px rgb(0 0 0 / 16%);
  position: absolute;
  left: 0;
  right: 0;
  top: 65px;
  z-index: 9;
  max-height: 400px;
  overflow-y: auto;
}

/*}*/
.layout-con {
  height: 100%;
  width: 100%;
}

.ivu-menu {
  z-index: 12;
}

.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width .2s ease .2s;
}

.menu-item i {
  transform: translateX(0px);
  transition: font-size .2s ease, transform .2s ease;
  vertical-align: middle;
  font-size: 16px;
}

.collapsed-menu span {
  width: 0px;
  transition: width .2s ease;
}

.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size .2s ease .2s, transform .2s ease .2s;
  vertical-align: middle;
  font-size: 22px;
}

.layout-logo {
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

.menucolo {
  color: rgba(255, 255, 255, .7);
}

.menucolo:hover {
  color: rgba(255, 255, 255, 1);
}

.layout-nav {
  position: inherit;
  right: 1px;
}

.miniW {
  position: fixed;
}

body {
  overflow-y: hidden;
  overflow-x: hidden;
}


</style>
