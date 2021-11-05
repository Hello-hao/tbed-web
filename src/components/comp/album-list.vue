<template>
  <div>
    <div style="margin:0 auto;max-height: 60vh;overflow-x: hidden;overflow-y: auto;">
      <Divider>画廊信息</Divider>
      <Row>
        <Col :xs="24" :sm="24" :md="12" :lg="12"><Input v-model="albumtitle" maxlength="30" style="width: 266px;margin: auto;"><span slot="prepend" placeholder="画廊标题">标题</span></Input></Col>
        <Col :xs="24" :sm="24" :md="12" :lg="12"><Input v-model="password" maxlength="30" style="width: 266px;margin: auto;"><span slot="prepend" placeholder="可留空">密码</span></Input></Col>
      </Row>

      <Divider>图片列表</Divider>
      <List style="max-height: 60vh;overflow: auto;" v-for="(album,key) in albumlist" :key="key">
        <ListItem>
          <ListItemMeta :avatar="album.imgurl"  />
          <Input  type="textarea" v-model="album.notes" :rows="2" maxlength="100" placeholder="图片说明/描述,可留空" />
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
    }
  },
  data () {
    return {
      albumtitle:null,
      password:null,
    }
  },
  mounted(){
    this.shuoming = this.albumlist;
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
      console.log("====="+JSON.stringify(param))
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
