<template>

  <Layout style="margin-top: 50px;">
      <Content :style="{margin: '15px 20px 0'}">
        <Tabs>
          <TabPane label="邮箱配置" icon="md-mail" >
            <Card class="cardShadow" style="margin-top: 10px;padding-left: 8px; padding-right: 8px;">
              <Form  @submit.native.prevent :label-width="100" style="max-width: 600px; margin: auto;" >
                <FormItem label="邮箱昵称">
                  <Input v-model="mailFormItem.emailname"  placeholder="邮箱昵称" maxlength="50"  size="large"></Input>
                </FormItem>
                <FormItem label="邮箱地址">
                  <Input v-model="mailFormItem.emails"  placeholder="邮箱地址" maxlength="200"  size="large"></Input>
                </FormItem>
                <FormItem label="授权码">
                  <Input v-model="mailFormItem.emailkey"  placeholder="授权码" maxlength="200"  size="large"></Input>
                </FormItem>

                <FormItem label="SMTP服务器">
                  <Input v-model="mailFormItem.emailurl"  placeholder="SMTP服务器" maxlength="200"  size="large"></Input>
                </FormItem>
                <FormItem label="端口">
                  <Input v-model="mailFormItem.port" type="number" placeholder="端口 如:465" maxlength="10"  size="large"></Input>
                </FormItem>

                <FormItem label="是否开启">
                  <i-switch v-model="usingSwitch" size="large">
                    <span slot="1">开启</span>
                    <span slot="0">关闭</span>
                  </i-switch>
                </FormItem>
                <div style="color: rgb(228 102 70);font-size: 12px; font-weight: 200;">
                  <p>提示：</p>
                  <p>保存配置前，推荐先进行下方测试，填写一个自己能接收的邮箱地址进行测试，测试无误后再进行开启并保存。</p>
                  <br />
                </div>
<!--                <Button type="primary" icon="md-done-all" long shape="circle" @click="mailTestMsg">测试</Button>-->
                <div style="text-align: center">
                  <ButtonGroup shape="circle">
                    <Button type="primary" @click="mailTestMsg">
                      <Icon type="ios-arrow-back"></Icon>
                      测 试
                    </Button>
                    <Button type="primary" @click="SaveConfig(1)">
                      保 存
                      <Icon type="ios-arrow-forward"></Icon>
                    </Button>
                  </ButtonGroup>
                </div>
              </Form>
            </Card>

          </TabPane>
          <TabPane label="图片鉴别" icon="ios-hand">

            <Card class="cardShadow" style="margin-top: 10px;padding-left: 8px; padding-right: 8px;">
              <Form  @submit.native.prevent :label-width="100" style="max-width: 600px; margin: auto;" >

                <FormItem label="鉴别源">
                  <Tag    size="large">百度鉴别</Tag>
                </FormItem>
                <div v-show="reviewType==1">
                  <FormItem label="APP_ID">
                    <Input v-model="imgReviewFormItem.appId"  placeholder="APP_ID" maxlength="500"  size="large"></Input>
                  </FormItem>
                  <FormItem label="API_KEY">
                    <Input v-model="imgReviewFormItem.apiKey"  placeholder="API_KEY" maxlength="500"  size="large"></Input>
                  </FormItem>
                  <FormItem label="SECRET_KEY">
                    <Input v-model="imgReviewFormItem.secretKey"  placeholder="SECRET_KEY" maxlength="500"  size="large"></Input>
                  </FormItem>
                </div>
                <div v-show="reviewType==2">
                  <FormItem label="API_KEY">
                    <Input v-model="imgReviewFormItem.apiKey"  placeholder="API_KEY" maxlength="500"  size="large"></Input>
                  </FormItem>
                </div>
                <FormItem label="是否开启">
                  <i-switch v-model="imgReviewSwitch" size="large">
                    <span slot="1">开启</span>
                    <span slot="0">关闭</span>
                  </i-switch>
                </FormItem>
                <div style="color: rgb(228 102 70);font-size: 12px; font-weight: 200;">
                  <p>注意：</p>
                  <p>部分鉴别平台有图像大小或图像格式限制，并非所有图像全部可以鉴别，具体请自行前往对接平台的官方文档查看,并且只能同时开启一个鉴别接口。</p>
                  <br />
                </div>
                <div style="text-align: center">
                  <Button type="primary" shape="circle" @click="SaveConfig(2)">保 存</Button>
                </div>
              </Form>
            </Card>
          </TabPane>
          <TabPane label="其他配置" icon="ios-filing" disabled>更多功能待开发</TabPane>
        </Tabs>
      </Content>

      <Modal  v-model="ismailtest" :footer-hide="true">
        <br />
        <Form  @submit.native.prevent>
          <FormItem >
            <Input prefix="md-mail-open" v-model="mailFormItem.tomail" placeholder="填待接收邮件的邮箱" size="large" style="width: 100%" />
          </FormItem>
          <div style="color: rgb(228 102 70);font-size: 14px; font-weight: 200;" v-show="iserror">
            <p>异常提示：</p>
            <p>{{errortext}}</p>
            <br />
          </div>
          <FormItem>
            <Button type="primary" icon="ios-paper-plane" long shape="circle"  @click="mailTest">发 送</Button>
          </FormItem>
        </Form>
      </Modal>

    <Footer class="layout-footer-center" >{{this.$store.state.metaInfo.webname}} &copy; Control Panel</Footer>
    </Layout>


</template>

<script>
import {request} from "../../network/request";

export default {
  name: "more-setting",
  data(){
    return{
      mailFormItem:{},
      imgReviewFormItem:{},
      ismailtest:false,
      errortext:null,
      iserror:false,
      reviewType:1

  }
  },
  mounted() {
    this.$Spin.show();
    this.getDatas();
  },
  methods: {
    getDatas(){
      request(
          "/admin/root/getOrderConfig",
          {}).then(res => {
        this.$Spin.hide();
        if(res.status==200){
          var json = res.data.data;
          if(res.data.code=='200'){
            this.mailFormItem=json.emailConfig;
            this.imgReviewFormItem = json.imgreview;
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
    SaveConfig(type){
      var url = '';
      var param = {};
      if(type==1){
        url='updateEmailConfig';
        param = this.mailFormItem;
      }else if(type == 2){
        url='updateimgReviewConfig';
        param = this.imgReviewFormItem;
      }
      this.$Spin.show();
      request(
          "/admin/root/"+url,
          param).then(res => {
            this.$Spin.hide();
            if(res.status==200){
              if(res.data.code=='200'){
                this.$Message.success(res.data.info);
              }else{
                this.$Message.error(res.data.info);
              }
            }else{
              this.$Message.error("请求时出现错误");
            }
      }).catch(err => {
        // this.$Spin.hide();
        console.log(err);
        this.$Message.error('服务器请求错误');
      })
    },
    mailTestMsg(){
      this.ismailtest = true;
    },
    mailTest(){
      request(
          "/admin/root/mailTest",
          this.mailFormItem).then(res => {
        this.$Spin.hide();
        if(res.status==200){
          if(res.data.code=='200'){
            this.iserror = false;
            this.errortext = null;
            this.$Message.success(res.data.info);
          }else{
            this.iserror = true;
            this.errortext = res.data.info;
            this.$Message.warning(res.data.info);
          }
        }else{
          this.$Message.error("请求时出现错误");
        }
      }).catch(err => {
        // this.$Spin.hide();
        console.log(err);
        this.$Message.error('服务器请求错误');
      })
    },



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
