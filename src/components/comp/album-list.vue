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
                  <Button  size="small">修改</Button>
                </div>
                <div style=" height: 36px; line-height: 36px;">
                  <Button  size="small">删除</Button>
                </div>
              </div>
            </Col>
          </Row>
    </div>

        </ListItem>
      </List>
    </div>
    <Button type="primary" shape="circle" @click.native="submitAlbum" style="float: right;margin-right: 10px;" >保存</Button>

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
    atitle: {
      type: String,
      default: () => null,
      require:false
    },
    apass: {
      type: String,
      default: () => null,
      require:false
    },
  },
  data () {
    return {
      albumtitle:null,
      password:null,
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
</style>
