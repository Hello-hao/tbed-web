<template>
  <!--  -->
  <div class="app" id="app">
    <div v-if="$store.state.auth==false">
      <div style="width: 100%;height: 100px; text-align: center; margin-top: 150px;">
        <h1>{{ $store.state.authInfo }}</h1>
      </div>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>

import store from "@/store";

export default {

  data() {
    return {}
  },
  mounted() {
    if (this.$store.state.auth) {
      this.checkLogin();
    }
    if (this._isMobile()) {
      this.$store.commit("setIsMobile", 'phone');
    } else {
      this.$store.commit("setIsMobile", 'pc');
    }
  },
  methods: {
    _isMobile() {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      return flag;
    },
    checkLogin() {
      this.$http(
          '/checkStatus' + '?' + new Date().getTime() + Math.random() + Math.ceil(Math.random() * (10000 - 99999) + 99999),
          {}).then(res => {
        if (res.status == 200) {
          var json = res.data;
          if (json.code == '200') {
            this.$store.state.loginStatus = true;
            localStorage.setItem('RoleLevel', json.data.RoleLevel);
            localStorage.setItem('userName', json.data.userName);
            store.commit("setUserName", json.data.userName);
            if (this.$router.history.current.path == '/login' || this.$router.history.current.path == '/register') {
              this.$router.replace("/");
            }
          } else {
            if (json.code == '406') {
              this.$Message.warning({
                content: json.info,
                duration: 10
              });
            } else {
              this.$Message.warning(json.info);
            }
            this.$store.state.loginStatus = false;
            localStorage.removeItem('Authorization');
            localStorage.removeItem('RoleLevel');
            this.$router.replace("");
          }
        } else {
          this.$Message.error("请求时出现错误");
        }
      }).catch(err => {
        console.log(err);
        this.$Message.error('服务器请求错误');
      })
    },
  }

}
</script>

<style>
html, body, .app {
  height: 100%;
  /*overflow: hidden;*/
}

.app {
  font-family: Noto Sans SC, "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-style: normal;
  font-weight: 400;
}
</style>
