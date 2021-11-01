<template>

  <Layout style="margin-top: 50px;background: #FFF;">
        <Content :style="{margin: '15px 5px 0', }">
          <div v-if="isShowPass">
                <Content style="width: 350px;margin: 120px auto;text-align: center;padding: 40px 10px; border-radius: 10px; box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);">
                  <Form inline @submit.native.prevent>
                    <FormItem prop="password" style="display: inline-block;width: 80%;">
                      <p style="font-size: 24px;"><Icon type="ios-film" size="26" />画廊</p>
                    </FormItem>
                    <FormItem prop="password" style="display: inline-block;width: 80%;">
                      <Input prefix="md-lock" v-model="password" :maxlength="200" size="large" type="password" password   placeholder="画廊访问密码" style="width: 100%;height: 40px;" />
                    </FormItem>
                    <FormItem style="display: inline-block;width: 80%;">
                      <Button type="primary" shape="circle" @click="selectPhoto">&nbsp;<Icon type="md-arrow-round-forward" />&nbsp;</Button>
                    </FormItem>
                  </Form>
                </Content>
          </div>
          <div v-else>
            <viewer :images="imglist">
              <Row class="animate__animated animate__fadeIn animate__delay-1.5s">
                <Col flex="1" v-for="(item,index) in imglist" :key="index">
                  <div class="imgdivstyle" >
                    <img :class="[viewType==1?'imgstyle-max':'imgstyle-min']"  class="imgstyle" style="cursor:pointer;" :src="item.imgurl+''"  onerror="this.src='http://tc.hellohao.cn/img/img404.jpg'" >
                        <div class="img-tool-cover" :style="{bottom:toolBottom+ 'px'}">
                          <Icon style="cursor:pointer;" type="ios-book icostyle" @click.native="imgInfo(item)" title="信息"></Icon>
                        </div>
                  </div>
                </Col>
              </Row>
            </viewer>
            <div class="example-code-more">
              <Button type="dashed" :loading="nextButloading"  @click="selectPhoto" :disabled="btntext=='所有数据加载完毕'" long>{{btntext}}</Button>
            </div>
          </div>

        </Content>
        <!--详细信息-->
        <Modal  v-model="isimginfo" :footer-hide="true">
          <List :split="false" >
            <ListItem><span style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;"><Icon style="font-size: 32px;" type="ios-book" />&nbsp;&nbsp;&nbsp;<span style="font-size: 18px;"> 描述 </span></span></ListItem>
          </List>
          <div style="line-height: 40px;">
            <p><span class="infotitle">&nbsp;&nbsp;</span><span style="font-size: 14px;">{{(imgage==null || imgage=='')?'无':imgage.notes}}</span></p>
          </div>
        </Modal>
      </Layout>

</template>

<script>
import {request} from "@/network/request";
// import QRCode from 'qrcodejs2'
import vueQr from 'vue-qr'

export default {
  metaInfo() {
    return {
      title: "画廊|"+this.titlename, // set a title
      meta: [   // set meta
        {
          name: 'keyWords',
          content: this.$store.state.metaInfo.keywords
        },
        {
          name: 'description',
          content: this.$store.state.metaInfo.description
        }
      ],
      link: [{
        rel: 'asstes',
        href: 'http://www.hellohao.cn/'
      }]
    }

  },

  name: "art",
  data () {
    return {
      isShowPass:false,
      urlKey:null,
      password:null,
      httpText:window.location.protocol,
      hostText:window.location.host,
      viewType:1,//1-大图模式 2-小图
      // QrLog: require("./favicon.ico.bak"),
      upName:null,
      imgage:null,
      isimginfo:false,
      imglist: [],
      pageNum:1,
      pageSize:20,
      selecttype:2,
      type:'picture',
      selectIndex:[],
      bucketname:null,
      submitData:[],
      $stateOBJ:null,
      toolBottom:5,
      nextButloading:false,
      btntext:'加载更多',
      titlename:''
    }
  },

  methods: {
    selectPhoto(){
      // this.$Spin.show();
      this.nextButloading=true;
      var paramJson={};
      paramJson.pageNum=this.pageNum;
      paramJson.pageSize=this.pageSize;
      paramJson.albumkey = 'TOALBUM'+this.urlKey;
      paramJson.password = this.password;

      request(
          "/getAlbumList",
          paramJson).then(res => {
        console.log(res);
        if(res.status==200){
          var json = res.data;
          if(json.code=='200'){
            this.isShowPass=false;
            var arr = res.data.data.imagesList.rows;
            this.nextButloading=false;
            if(arr.length>0){
              this.imglist=this.imglist.concat(arr);
              this.pageNum++;
              if(this.imglist.length<=this.pageSize){
                this.btntext='所有数据加载完毕';
              }else{
                this.btntext='加载更多';
              }
            }else{
              this.btntext='所有数据加载完毕';
            }
          }else{
            this.$Message.warning(json.info);
          }
        }else{
          this.$Message.error("请求时出现错误");
        }
        // this.$Spin.hide();
      }).catch(err => {
        // this.$Spin.hide();
        console.log(err);
        this.$Message.error('服务器请求错误');
      })
    },

    imgInfo (e) {
      this.isimginfo = true;
      // this.getBucketName(e.source);
      if(e.username!=null){
        this.upName =e.username;
      }else{
        this.upName = '游客';
      }
      this.imgage = e;
    },

    //自动计算大小
    formatBytes(a,b){if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]},

    showViewType(){
      this.$Spin.show();
      setTimeout(() =>{
        if(this.viewType==1){
          this.toolBottom = 15;
          this.viewType=2;
          this.selectPhoto(this.$stateOBJ);
        }else{
          this.toolBottom = 5;
          this.viewType=1;
          this.selectPhoto(this.$stateOBJ);
        }
        this.$Spin.hide();
      },1000);

    },
    getAlbum(){
      var param={
        key:'TOALBUM'+this.urlKey
      }
      request(
          "/checkPass",
          param).then(res => {
        if(res.status==200){
          var json = res.data.data;
          if(res.data.code=='200'){
            if(json.exist){
              //有画廊
              this.titlename = json.album.albumtitle;
              if(json.passType){
                this.isShowPass=true;
              }else{
                this.isShowPass=false;
                this.selectPhoto();
              }
            }else{
              // 无画廊
              this.$Message.warning("画廊不存在");
            }
          }else{
            this.$Message.error("请求时出现错误");
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
  mounted(){
    this.urlKey = window.location.href;
    this.urlKey = window.location.href.substring(this.urlKey.indexOf('h/TOALBUM')+9);
    this.getAlbum();
    //this.selectPhoto();
  },
  components:{
    // vueQr,
  },
  // metaInfo(){
  //   return {
  //     title: "画廊|"+this.titlename,
  //     meta: [
  //       {
  //         name: "keywords",
  //         content: this.$store.state.metaInfo.keywords
  //       }, {
  //         name: "description",
  //         content: this.$store.state.metaInfo.description
  //       }
  //     ]
  //   }
  // }


}

</script>

<style>
.example-code-more {
  text-align: center;
  cursor: pointer;
  padding: 30px 0;
  font-size: 16px;
  line-height: 30px;
  font-weight: bold;
}
.imgdivstyle{
  /*width:300px;*/
  height: 160px;
  margin-top: 10px;
  /*background: #e86868;*/
  text-align: center;
  margin-right: 2px;
}
.imgstyle-max{
  width: 300px;
  height: 160px;
  object-fit: cover;
  border-radius:5px;
  border: 1px solid #eee;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 10px 0px;
  transform: translateZ(0);
}
.imgstyle-min{
  width: 155px;
  height: 150px;
  object-fit: cover;
  border-radius:5px;
  border: 1px solid #eee;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 10px 0px;
  transform: translateZ(0);
}
.img-tool-cover{
  display: block;
  position: absolute;
  /*bottom: 5px;*/
  left: 0;
  right: 0;
  background: rgba(255,255,255,.87);
  height: 30px;
  width: 80px;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 6px 0px;
  margin: 0 auto;
  border-radius: 5px;
  text-align: center;
}

.icostyle{
  margin:0 3px 0 3px;
  font-size: 22px;
  line-height: 28px;
  transition: transform 0.2s;
}
.icostyle:hover{
  transform: scale(1.1);
}
.icostylecolor{
  color: #2d8cf0;
}
.img-search{
  position: absolute;
  width: 100%;
  min-width: 512px;
  height: 15px;
  z-index: 1;
}
.img-search-div{
  margin: auto;
  width: 70%;
  height: 70px;
  background: #FFF;
  padding: 13px;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 6px 0px;
}
.ivu-btn-icon-only {
  width: 55px;
}
.infotitle{
  color: #464c5b;
  font-size: 14px;
  font-weight: 500;
  margin-right: 10px;
}
.QRCodestyle{
  height: 160px;
  width: 160px;
  position: absolute;
  right: 10px;
  bottom: 10px;
  opacity: 0.7;
}
</style>
