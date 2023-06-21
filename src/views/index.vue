<template>
  <Layout
      style="width: 100%;height: 100%;background: #fff;background-repeat: no-repeat; background-size: 100% 100%; -moz-background-size: 100% 100%; ">
    <div style="width: 100%;height: 100%;background-color: rgba(51,51,51,0.36);position: fixed;z-index: 1;"
         @click="showMenu" v-show="isCollapsed"></div>
    <Drawer title="资讯" placement="top" height="363" :closable="false" v-model="$store.state.noticePopup"
            v-if="(this.$store.state.metaInfo.explain!='' && this.$store.state.metaInfo.explain!=null)">
      <div
          style="padding: 0 20px;letter-spacing: 2px; line-height: 26px; font-size: 16px;height: 220px; overflow: auto;"
          v-html="this.$store.state.metaInfo.explain">
      </div>
      <div style="height: 60px; text-align: center; position: absolute; bottom: 10px; left: 0; right: 0; margin: auto;">
        <Checkbox style="font-size: 14px;" v-model="noticeSwitch">三天内不再通知</Checkbox>
        <p>
          <Button shape="circle" @click="noticeChange"> 好 的</Button>
        </p>
      </div>
    </Drawer>

    <Header
        :style="{position: 'fixed', width: '100%',zIndex:'2',padding:'0 10px',height: '64px',background: 'rgba(255, 255, 255, .55)',boxShadow:'0 1px 6px 0 rgba(32, 33, 36, 0.28)'}"
        class="animate__animated animate__fadeInDownBig">
      <Menu mode="horizontal" style="height: 64px;background: #FFF0 " :active-name="$route.params.activeName">
        <div class="layout-logo" style="height: 100%;">
          <!--          <img :src="(metaInfo.logo==null || metaInfo.logo=='')?hellohaologo:metaInfo.logo" style="width: 135px;margin-left: 10px;vertical-align: middle;" />-->
          <img
              :src="$store.state.metaInfo.logo=='hellohao'?hellohaologo:$store.state.metaInfo.logo"
              style="width: 135px;margin-left: 10px;vertical-align: middle;"/>
        </div>
        <div class="layout-nav">
          <template v-if="screenWidth<=1024">
            <Badge :status="$store.state.loginStatus?'success':'warning'" style="    top: -23px;
    right: -64px;"/>
            <div @click="showMenu" :class="{'is-active':isMenu=='show'}" class="hamburger hamburger--collapse"
                 style="z-index: 2">
              <div class="hamburger-box">
                <div class="hamburger-inner"></div>
              </div>
            </div>
          </template>
          <template v-else>
            <MenuItem name="ishome" @click.native="homeClick">
              <Icon type="md-home" style="color: rgb(81, 90, 110);"/>
              <span style="color: rgb(81, 90, 110);">首 页</span>
            </MenuItem>
            <Dropdown trigger="click" name="iscontrol" style="margin-right: 18px;">
              <a href="javascript:void(0)" style="color: #FFF;text-decoration: none;">
                <Icon type="md-person" style="color: rgb(81, 90, 110);"/>&nbsp;
                <span style="color: rgb(81, 90, 110);">我 的</span>
                <Icon type="ios-arrow-down" style="color: rgb(81, 90, 110);"></Icon>
              </a>
              <DropdownMenu slot="list">
                <template @click.native="controlClick" v-if="this.$store.state.loginStatus">
                  <DropdownItem name="isadmin" @click.native="adminClick">个人中心</DropdownItem>
                  <DropdownItem name="exit" @click.native="exit">退 出</DropdownItem>
                </template>
                <template @click.native="loginClick" v-else>
                  <DropdownItem name="login" @click.native="loginClick">登 录</DropdownItem>
                  <DropdownItem name="login" @click.native="registerClick">注 册</DropdownItem>
                </template>
                <DropdownItem name="about" @click.native="about">关 于</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Badge :status="$store.state.loginStatus?'success':'warning'"/>
          </template>

        </div>
      </Menu>
    </Header>


    <Content :style="{margin: '50px auto', minWidth:'45vh',width: '95%',background: '#FFF'}">
      <router-view ref='indexTarget' @showBtn="isShowBtn"></router-view>
      <div :offset-bottom="10" style="position: fixed;right: 55px;bottom: 132px;" class="animate__animated"
           :class="{'animate__bounce' : isShow}" v-show="isShow">
        <Tooltip content="更多功能在这里哦" placement="top" :always="true" :disabled="qpShow">
          <ButtonGroup shape="circle">
            <Button size="large" icon="md-color-palette" style="font-size: 19px;" title="更多功能"
                    @click="getTools"></Button>
            <Button size="large" icon="ios-copy" style="font-size: 19px;" title="复制全部" @click="getCopyMsg"></Button>
            <!--            <Button size="large" icon="md-checkmark-circle-outline" title="全选" @click="allSelect"></Button>-->
          </ButtonGroup>
        </Tooltip>
      </div>
    </Content>
    <Footer class="layout-footer-center"
            v-html="this.$store.state.metaInfo.links?this.$store.state.metaInfo.links:''">
    </Footer>

    <Modal v-model="IsAbout" :footer-hide="true">
      <br/>
      <Card :dis-hover="true" :bordered="false" :shadow="false">
        <div style="text-align:center" v-html="$store.state.metaInfo.aboutinfo">

        </div>
      </Card>
    </Modal>

    <Modal v-model="isCopyMsg" :footer-hide="true">
      <br/>
      <Card :dis-hover="true" :bordered="false" :shadow="false">
        <Divider><span style=" color: #5a5a5a;">一键复制格式</span></Divider>
        <Button type="success" class="cobyOrderSn_url" data-clipboard-action="copy" :data-clipboard-text="urlTexts_url"
                @click="copyAll('url')" long>图像链接格式
        </Button>
        <br><br>
        <Button type="primary" class="cobyOrderSn_html" data-clipboard-action="copy"
                :data-clipboard-text="urlTexts_html" @click="copyAll('html')" long>HTML格式
        </Button>
        <br><br>
        <Button type="warning" class="cobyOrderSn_md" data-clipboard-action="copy" :data-clipboard-text="urlTexts_md"
                @click="copyAll('md')" long>Markdown格式
        </Button>
        <br><br>
        <Button type="error" class="cobyOrderSn_diy" data-clipboard-action="copy" :data-clipboard-text="urlTexts_diy"
                @click="copyAll('diy')" long>自定义格式
        </Button>
        <br><br>
        <Input v-model="myurl" placeholder="请输入要复制的链接格式" :clearable="true"/>
        <p style="color: #6b6b6b;font-size: 12px;">格式说明：<br/>在输入框填入你想生成并复制的链接格式，格式中的图片链接用<b
            style="color: #eb3e21;"> @myurl@ </b> 通配符填充</p>
      </Card>
    </Modal>

    <!--    移动端状态栏   -->
    <div v-show="isMenu!='none'" class="move-style-index animate__animated"
         :class="{'animate__fadeInDown' :isMenu=='show','animate__fadeOutUp' :isMenu=='hide'}">
      <List size="small" slot="content" :split="false">
        <ListItem @click.native="homeClick" style="text-indent: 26px;">
          <Icon type="md-home" size="16"/>
          首 页
        </ListItem>
        <template v-if="this.$store.state.loginStatus">
          <ListItem @click.native="adminClick" style="text-indent: 26px;">
            <Icon type="md-contact" size="16"/>
            个人中心
          </ListItem>
          <ListItem @click.native="about" style="text-indent: 26px;">
            <Icon type="md-information-circle" size="16"/>
            关 于
          </ListItem>
          <ListItem style="text-indent: 26px;" @click.native="exit">
            <Icon type="md-exit" size="16"/>
            退 出
          </ListItem>
        </template>
        <template v-else>
          <ListItem @click.native="loginClick" style="text-indent: 26px;">
            <Icon type="ios-navigate" size="16"/>
            登 录
          </ListItem>
          <ListItem @click.native="registerClick" style="text-indent: 26px;">
            <Icon type="md-person-add" size="16"/>
            注 册
          </ListItem>
          <ListItem @click.native="about" style="text-indent: 26px;">
            <Icon type="md-information-circle" size="16"/>
            关 于
          </ListItem>
        </template>

      </List>
    </div>

  </Layout>
  <!--  </div>-->
</template>
<script>

import {request} from "@/network/request";

export default {

  data() {
    return {
      isMenu: 'none',
      isCollapsed: false,
      noticeSwitch: false,
      urlTexts: '',
      hellohaologo: require("../assets/img/hellohaologo.svg"),
      // testhtml:'HELLOHAO <span>2021制作</span> &copy; BetaForCore',
      IsAbout: false,
      screenWidth: document.body.clientWidth,
      actName: 'ishome',
      isModule: 'imgUpload',//imgUpload
      isShow: false,
      isCopyMsg: false,
      myurl: '[url=@myurl@][img]@myurl@[/img][/url]',
      urlTexts_url: '',
      urlTexts_html: '',
      urlTexts_md: '',
      urlTexts_diy: '',
      qpShow: false,

    }
  },
  beforeCreate() {
    // this.$store.state.preludeSwitch = this.$store.state.metaInfo.guidepage==1;
  },
  mounted() {
    // window.onresize = () => {
    //   return (() => {
    //     window.screenWidth = document.body.clientWidth
    //     this.screenWidth = window.screenWidth
    //   })()
    // }
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        this.screenWidth = window.screenWidth
        if (window.screenWidth > 1024) {
          this.isMenu = 'none'
        }
        //console.log("屏幕宽度=="+this.screenWidth);
      })()
    }


    document.addEventListener('paste', (event) => {
      const items = (event.clipboardData || window.clipboardData).items
      let file = null
      if (!items || items.length === 0) {
        this.$Message.error('当前浏览器不支持本地或请打开图片再复制')
        return
      }
      // 搜索剪切板items
      for (let i = 0; i < items.length; i++) {
        // console.log('==>'+items[i].type);
        if (items[i].type.indexOf('image') !== -1) {
          file = items[i].getAsFile()
          break
        }
      }
      if (file == null) {
        return
      }
      this.$refs.indexTarget.sendImgData(file)

    })

  },
  methods: {

    noticeChange() {
      this.$store.state.noticePopup = false;
      if (this.noticeSwitch) {
        this.$locStorage.set("ISINFORMATION", "ZSZXMSG_KG", (3 * 60 * 24));
      } else {
        localStorage.removeItem('ISINFORMATION');
      }
    },
    isShowBtn(arr) {
      if (arr.length > 0) {
        this.isShow = true;
        var than = this;
        setTimeout(function () {
          than.qpShow = true;
        }, 5000);
      } else {
        this.isShow = false;
      }
    },
    getTools() {
      this.$refs.indexTarget.allSett();
    },
    getCopyMsg() {
      let arr = this.$store.state.copyAllUrl;
      if (arr == null || arr == undefined || arr.length == 0) {
        return;
      }
      this.isCopyMsg = true;
      if (arr.length > 0) {
        this.urlTexts_url = '';
        this.urlTexts_html = '';
        this.urlTexts_md = '';
        for (let i = 0; i < arr.length; i++) {
          // if (arr[i].response.code == '200') {
          this.urlTexts_url += arr[i].url + '\n'
          this.urlTexts_html += '<img src="' + arr[i].url + '" alt="' + arr[i].name + '" />\n'
          this.urlTexts_md += '![' + arr[i].name + '](' + arr[i].url + ')\n';
          // }
        }
      }
    },
    copyAll(type) {
      let arr = this.$store.state.copyAllUrl;
      var clipboard = null;
      switch (type) {
        case 'url':
          clipboard = new this.clipboard('.cobyOrderSn_url');
          break;
        case 'html':
          clipboard = new this.clipboard('.cobyOrderSn_html');
          break;
        case 'md':
          clipboard = new this.clipboard('.cobyOrderSn_md');
          break;
        default:
          clipboard = new this.clipboard('.cobyOrderSn_diy');
          if (this.myurl.search("@myurl@") == -1) {
            this.$Message.warning('链接格式中必须包含通配符：@myurl@');
            return;
          }
          if (arr.length > 0) {
            this.urlTexts_diy = '';
            let reg = new RegExp('@myurl@', 'g')//g代表全部
            for (let i = 0; i < arr.length; i++) {
              var temp = this.myurl.replace(reg, arr[i].url);
              this.urlTexts_diy += temp + '\n'
            }
          }
      }
      clipboard.on('success', e => {
        this.$Message.success('复制成功');
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        console.log(e);
        // 不支持复制
        this.$Message.error('该浏览器不支持自动复制');
        // 释放内存
        clipboard.destroy()
      })
    },

    getRouterInfo(val) {
      // console.log(val);
    },
    loginClick() {
      this.isMenu = 'none'
      this.isCollapsed = false
      this.$router.replace("/login")
      this.isModule = 'login';
    },
    registerClick() {
      this.isMenu = 'none'
      this.isCollapsed = false
      this.$router.replace("/register")
      this.isModule = 'register';
    },
    about() {
      this.isMenu = 'none'
      this.isCollapsed = false
      this.IsAbout = true;
    },
    homeClick() {
      this.isMenu = 'none'
      this.isCollapsed = false
      this.$router.replace("/")
      this.isModule = 'imgUpload';
    },
    adminClick() {
      this.isMenu = 'none'
      this.isCollapsed = false
      this.$Spin.show();
      this.$router.replace("/admin")
      this.isModule = 'admin';
    },

    exit() {
      this.isMenu = 'none'
      this.isCollapsed = false
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
        if (res.status == 200) {
          var json = res.data;
          this.$store.state.loginStatus = false;
          localStorage.removeItem('Authorization');
          localStorage.removeItem('RoleLevel');
          this.$router.replace("");
          this.$Message.success(json.info);
          location.reload();
        } else {
          this.$Message.error("请求时出现错误");
        }
      }).catch(err => {
        console.log(err);
        this.$Message.error('服务器请求错误');
      })
    },
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
  },
  components: {
    // isTransition
  },
  created: function () {

  }
}
</script>

<style scoped>
.animate__fadeInDown {
  --animate-duration: .5s;
}

.animate__fadeOutUp {
  --animate-duration: .5s;
}
</style>
<style>
.ivu-layout-header {
  background: #ffffff;
}

.prelude {
  width: 100%;
  height: 100%;
  position: fixed;
  background: #fff;
  overflow: hidden;
  z-index: 999;
}

.demo-upload-list {
  display: inline-block;
  width: 90px;
  height: 90px;
  text-align: center;
  line-height: 90px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
  margin-right: 4px;
}

.demo-upload-list img {
  width: 100%;
  height: 100%;
}

.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, .6);
}

.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}

.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}

.layout {
  background: #F8F8F8;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}

.layout-logo {
  color: #FFF;
  font-size: x-large;
  position: absolute;
  left: 1px;
}

.layout-nav {
  position: absolute;
  right: 1px;
}

.layout-footer-center {
  text-align: center;
  padding: 10px;
  position: initial;
}

.ivu-input-group .ivu-input, .ivu-input-group .ivu-input-inner-container {
  width: 100%;
  float: left;
  margin-bottom: 0;
  position: relative;
  z-index: 2;
  height: 42px;
}

body {
  overflow: auto;
}

.ivu-badge-status {
  line-height: inherit;
  vertical-align: baseline;
  top: -10px;
  right: 28px;
}

.minWidth {
  display: none;
}

.takeBack {
  position: absolute;
  left: 50%;
  transform: translate(-50%);
  bottom: 60px;
  transition: all 0.6s ease-in;
  -webkit-transition: all 0.6s ease-in;
}

/*.takeBack:hover{*/
/*  transform: scale(1.2);*/
/*}*/
/*重写汉堡*/
.hamburger-inner, .hamburger-inner:after, .hamburger-inner:before {
  position: absolute;
  width: 30px;
  height: 3px;
  transition-timing-function: ease;
  transition-duration: .15s;
  transition-property: transform;
  border-radius: 4px;
  background-color: #515a6d;
}

.hamburger.is-active .hamburger-inner, .hamburger.is-active .hamburger-inner:after, .hamburger.is-active .hamburger-inner:before {
  background-color: #515a6d;
}
</style>
