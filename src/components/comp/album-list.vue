<template>
  <div>
    <div style="margin:0 auto;max-height: 60vh;overflow-x: hidden;overflow-y: auto;">
      <Divider>画廊信息</Divider>
      <Row>
        <Col :xs="24" :sm="24" :md="12" :lg="12"><Input v-model="albumtitle" maxlength="30" style="width: 266px;margin: auto;"><span slot="prepend" placeholder="画廊标题">标题</span></Input></Col>
        <Col :xs="24" :sm="24" :md="12" :lg="12"><Input v-model="password" maxlength="30" style="width: 266px;margin: auto;"><span slot="prepend" placeholder="可留空">密码</span></Input></Col>
      </Row>

      <Divider>图片列表</Divider>
      <List style="max-height: 60vh;overflow: auto;" v-for="(album,index) in albumlist" :key="index">
        <ListItem>
<!--          <ListItemMeta :avatar="album.imgurl"  />-->
          <div style="width: 100%;padding: 0 10px;">
          <Row>
            <Col flex="100px">
                <div style="width: 100%;text-align: center;">
                  <img :src="album.imgurl" style="height: 70px; max-width:80px;object-fit:cover; border-radius: 5px;" />
                </div>
            </Col>
            <Col flex="auto">
              <Input  type="textarea" v-model="album.notes" :rows="3" maxlength="500" placeholder="图片说明/描述,可留空" />
            </Col>
            <Col flex="60px" v-if="ischange">
              <div calss="toolbar" style="width: 100%;height: 80px; text-align: center;">
                <div style=" height: 36px; line-height: 36px;">
                  <Button size="small" @click="updateImg(index)">修改</Button>
                </div>
                <div style=" height: 36px; line-height: 36px;">
                  <Button size="small">删除</Button>
                </div>
              </div>
            </Col>
          </Row>
    </div>

        </ListItem>
      </List>
    </div>
    <Button type="primary" shape="circle" @click.native="submitAlbum" style="float: right;margin-right: 10px;" >保存</Button>
    <!-- 个人相册弹窗 -->
    <Modal  v-model="isMyImages" :footer-hide="true"  width="800" >
      <Content :style="{margin: '15px 5px 0', }" style="overflow-y: auto;height:600px;">
        <viewer>
          <Row class="animate__animated animate__fadeIn animate__delay-1.5s">
            <Col flex="1" v-for="(item,index) in imglist" :key="index">
              <div class="imgdivstyle divimgstyle-min" >
<!--                <span class="formatTag">{{item.imgurl.substr(item.imgurl.lastIndexOf("\.")+1)}}</span>-->
                <img class="imgstyle-min imgstyle"  style="cursor:pointer;" v-lazy="item.imgurl+''" :src="item.imgurl+''"  :key="item.imgurl"   >
              </div>
            </Col>
          </Row>
          <div style="width: 100%;text-align: center;color: #797b7f;" v-show="noImgMsg">
            <Icon type="ios-filing" size="56" />
            <p>当前未找到任何图像</p>
          </div>
        </viewer>
        <div class="example-code-more">
          <Button type="dashed" :loading="nextButloading"  @click="selectPhoto" :disabled="btntext=='所有数据加载完毕'" long>{{btntext}}</Button>
        </div>
      </Content>
    </Modal>
  </div>

</template>

<script>

 import {request} from "../../network/request";

export default {
  name: "album-list",
  props: {
    albumlist: {
      type: Array,
      // default: () => [],
      require:true
    },
    ischange: {
      type: Boolean,
      default: () => false,
      require:false
    },

  },
  data () {
    return {
      albumtitle:null,
      password:null,
      pageNum:1,
      pageSize:30,
      isMyImages:false,
      imglist:[],
      btntext:'加载更多',
      noImgMsg:false,
      nextButloading:false,
    }
  },
  mounted(){
    console.log(this.albumlist.length)
    // if(this.ischange && this.albumlist.length>0){
    //   this.albumlist = this.albumlist[0].albumlist;
    //   this.password = this.albumlist[0].password;
    // }
  },
  methods: {
    getTilePass(atitle,apass){
      if(atitle!=null && atitle!='' && apass!=null && apass!='' ){
        this.albumtitle = atitle;
        this.password = apass;
      }
    },
    submitAlbum(){
      if(this.albumtitle==null || this.albumtitle==''){
        this.$Message.warning("画廊标题不能为空");
        return false;
      }
      if(this.albumlist.length==0){
        this.$Message.warning("画廊图像不存在");
        return false;
      }
      var param = {
        albumtitle:this.albumtitle,
        password:this.password,
        albumlist:this.albumlist
      }
      // console.log("====="+JSON.stringify(param))
      request(
          "/SaveForAlbum",
          param,
          this.$store,this.$router,this.$serverHost).then(res => {
        this.$Spin.hide();
        if(res.status==200){
          var json = res.data.data;
          if(res.data.code=='200'){
            this.$emit('return-data',json);
          }else{
            this.$Message.error(res.data.info);
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
    //修改画廊的方法
    updateImg(index){
      console.log(this.albumlist[index])
      this.isMyImages = true;
      this.selectPhoto();
    },
    selectPhoto(){
      var paramJson={};
      paramJson.pageNum=this.pageNum;
      paramJson.pageSize=this.pageSize;
      paramJson.selectUserType = 'me';
      paramJson.selecttype = null;
      paramJson.username = null;
      paramJson.violation = false;
      this.nextButloading=true;
      request(
          "/admin/selectPhoto",
          paramJson).then(res => {
        if(res.status==200){
          if(res.data.code=='200'){
            var arr = res.data.data.rows;
            if(arr.length>0){
              this.imglist=this.imglist.concat(arr);
              this.pageNum++;
              if(this.imglist.length<this.pageSize){
                this.btntext='所有数据加载完毕';
              }else{
                this.btntext='加载更多';
              }
            }else{
              this.btntext='所有数据加载完毕';
            }
            if(this.imglist.length==0){
              this.noImgMsg = true;
            }
          }else{
            this.$Message.warning(res.data.info);
          }
        }else{
          this.$Message.error("请求时出现错误");
        }
      }).catch(err => {
        console.log(err);
        this.$Message.error('服务器请求错误');
      })

    }

  }



}
</script>

<style>
.ivu-avatar {
  width: 42px;
  height: 42px;
  border-radius: 5px;
  box-shadow: 0 0 6px #c1c1c1;
}
.imgdivstyle{
  height: 160px;
  margin-top: 10px;
  text-align: center;
  margin-right: 2px;
}
.divimgstyle-min{
  min-width: 155px;
  height: 150px;
  margin: 10px;
}
.formatTag{
  display: block;
  width: 50px;
  height: 20px;
  background: rgba(38, 38, 38 ,.72);
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 1;
  box-shadow: 0 1px 6px rgba(255, 255, 255, .2);
  color: #e3e1e1;
  border-radius: 3px;
}
.imgstyle-min{
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius:5px;
  border: 1px solid #eee;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 10px 0px;
  transform: translateZ(0);
}
</style>
