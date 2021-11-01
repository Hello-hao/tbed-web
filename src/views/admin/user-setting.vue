<template>

  <Layout style="margin-top: 50px;">
      <Content :style="{margin: '15px 20px 0'}">

        <Card class="cardShadow" style="margin-top: 10px;padding-left: 8px; padding-right: 8px;">
          <Form  @submit.native.prevent :label-width="100" style="max-width: 600px; margin: auto;" >
            <FormItem label="用户邮箱">
              <Input  v-model="userInfo.email" :disabled="this.$store.state.RoleLevel=='user'" placeholder="用户邮箱" maxlength="100"  size="large"></Input>
            </FormItem>
            <FormItem label="用户名">
              <Input  v-model="userInfo.username" :disabled="this.$store.state.RoleLevel=='user'" placeholder="用户名" maxlength="50"  size="large"></Input>
            </FormItem>
            <FormItem label="密码">
              <Input v-model="userInfo.password"  placeholder="密码" maxlength="50"  size="large"></Input>
            </FormItem>
            <FormItem label="确认密码">
              <Input v-model="passwordTow"  placeholder="确认密码" maxlength="50"  size="large"></Input>
            </FormItem>

<!--            <div style="color: rgb(228 102 70);font-size: 12px; font-weight: 200;">-->
<!--              <p>提示：</p>-->
<!--              <p>保存配置前，推荐先进行下方测试，填写一个自己能接收的邮箱地址进行测试，测试无误后再进行开启并保存。</p>-->
<!--              <br />-->
<!--            </div>-->
            <!--                <Button type="primary" icon="md-done-all" long shape="circle" @click="mailTestMsg">测试</Button>-->
            <div style="text-align: center">
                <Button type="primary" shape="circle" @click="SaveUserConfig">
                  保 存
                </Button>
            </div>
          </Form>
        </Card>

      </Content>

    <Footer class="layout-footer-center" >{{this.$store.state.metaInfo.webname}} &copy; Control Panel</Footer>
    </Layout>


</template>

<script>
import {request} from "../../network/request";

export default {
  name: "user-setting",
  data(){
    return{
      userInfo:{
        username:null,
        email:null,
        password:null
      },
      passwordTow:null
  }
  },
  mounted() {
    this.$Spin.show();
    this.getDatas();
  },
  methods: {
    getDatas(){
      request(
          "/admin/getUserInfo",
          {}).then(res => {
        this.$Spin.hide();
        if(res.status==200){
          var json = res.data.data;
          if(res.data.code=='200'){
            this.userInfo.username=json.username;
            this.userInfo.email=json.email;
          }else{
            this.$Message.error(res.data.info);
          }
        }else{
          this.$Message.error("请求时出现错误");
        }
      }).catch(err => {
        console.log(err);
        this.$Message.error('服务器请求错误');
      })
    },
    SaveUserConfig(){
      if(this.userInfo.password!=null){
        var arr = new Array();
        arr = this.userInfo.password.split(" ");
        if(arr.length != 1){
          this.$Message.warning("密码不能包含空格");
          return false;
        }
        if(this.userInfo.password!=this.passwordTow){
          this.$Message.warning("密码输入不一致，请重新输入");
          return false;
        }
        if(this.userInfo.password.length>50){
          this.$Message.warning("密码过长请重新设置");
          return false;
        }
        if(this.userInfo.password.length<6){
          this.$Message.warning("密码长度不得小于6位");
          return false;
        }
      }
      if(this.userInfo.password==null || this.userInfo.password=='' || this.passwordTow==null || this.passwordTow==''){
        this.$Message.warning("请输入密码");
        return false;
      }

      this.$Spin.show();
      request(
          "/admin/setUserInfo",
          this.userInfo).then(res => {
            this.$Spin.hide();
            if(res.status==200){
              if(res.data.code=='200'){
                this.$Message.success(res.data.info);
                setTimeout(()=>{
                  this.logout();
                },2000)
              }else{
                this.$Message.warning(res.data.info);
              }
            }else{
              this.$Message.error("请求时出现错误");
            }
      }).catch(err => {
        this.$Spin.hide();
        console.log(err);
        this.$Message.error('服务器请求错误');
      })
    },
    logout(){
      this.$http(
          "/user/logout",
          {}).then(res => {
        if(res.status==200){
          var json = res.data;
          this.$store.state.loginStatus= false;
          localStorage.removeItem('Authorization');
          localStorage.removeItem('RoleLevel');
          this.$router.replace("");
          this.$Message.success(json.info);
          location.reload();
        }else{
          this.$Message.error("请求时出现错误");
        }
      }).catch(err => {
        console.log(err);
        this.$Message.error('服务器请求错误');
      })
    }




  },
  computed: {

    imgReviewSwitch:{
      get() {
        return this.imgReviewFormItem.using==1?true:false;
      },
      set(val){
        this.imgReviewFormItem.using=val?1:0;
      }
    },
    usingSwitch:{
      get() {
        return this.mailFormItem.using==1?true:false;
      },
      set(val){
        this.mailFormItem.using=val?1:0;
      }
    }


  }

}
</script>

<style scoped>
.cardShadow{
  border-radius: 10px;
  margin-top: 10px;
}
</style>