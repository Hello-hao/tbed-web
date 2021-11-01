<template>
<!--  -->
  <div class="app" id="app">
    <div v-if="$store.state.auth==false">
      <div style="width: 100%;height: 100px; text-align: center; margin-top: 150px;">
        <h1>{{$store.state.authInfo}}</h1>
      </div>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>

import VConsole from "vconsole";
import store from "@/store";

export default {

  data () {
    return {

    }
  },
  mounted(){
    if(this.$store.state.auth){
      // var vConsole = new VConsole();
      // console.log(vConsole);
      // this.getWebInfo();
      this.checkLogin();
    }
  },
  methods:{
/*    getWebInfo () {
      return new Promise((resolve, reject) => {
        this.$http('/webInfo'+'?'+new Date().getTime()+Math.random()+Math.ceil(Math.random()*(10000-99999)+99999)).then(data => {
          // 是否成功读取需要的配置项
          console.log(data);
          var json = data.data.data;
          if(json){
            json.splitline="-";
            this.$store.commit("cahngeMetaInfo", json);
            // store.commit("setPreludeSwitch", true);
            // this.getMetaInfo();
          }
          // this.$store.state.metaInfo = json;
          resolve();
        }).catch(error => {
          console.log(error);
          reject()
        })
      })
    },*/

    checkLogin(){
      this.$http(
          '/checkStatus'+'?'+new Date().getTime()+Math.random()+Math.ceil(Math.random()*(10000-99999)+99999),
          {}).then(res => {
        if(res.status==200){
          var json = res.data;
          if(json.code=='200'){
            this.$store.state.loginStatus= true;
            // this.$store.state.RoleLevel = json.data.RoleLevel;
            localStorage.setItem('RoleLevel', json.data.RoleLevel);
            localStorage.setItem('userName', json.data.userName);
            store.commit("setUserName", json.data.userName);
            if(this.$router.history.current.path=='/login' || this.$router.history.current.path=='/register'){
              this.$router.replace("/");
            }
          }else{
            this.$store.state.loginStatus= false;
            this.$Message.warning(json.info);
            localStorage.removeItem('Authorization');
            localStorage.removeItem('RoleLevel');
            this.$router.replace("");
          }
        }else{
          this.$Message.error("请求时出现错误");
        }
      }).catch(err => {
        console.log(err);
        // this.reloadCode();
        this.$Message.error('服务器请求错误');
      })
    },
  }

}
</script>

<style>
html,body,.app{
  height: 100%;
  /*overflow: hidden;*/
}
.app{
  font-family: JetBrainsMono,Noto Sans SC,"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  font-style: normal;
  font-weight: 400;
}
</style>
