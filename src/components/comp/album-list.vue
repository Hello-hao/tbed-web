<template>
  <div style="height: 510px;">
    <div style="margin:0 auto;height: 500px;overflow-x: hidden;overflow-y: auto;">
      <Divider>画廊信息</Divider>
      <Row>
        <Col :xs="24" :sm="24" :md="12" :lg="12"><Input v-model="albumtitle" maxlength="30"
                                                        style="width: 266px;margin: auto;margin-top: 5px;"><span
            slot="prepend"
            placeholder="画廊标题">标题</span></Input>
        </Col>
        <Col :xs="24" :sm="24" :md="12" :lg="12"><Input v-model="password" maxlength="30"
                                                        style="width: 266px;margin: auto;margin-top: 5px;"><span
            slot="prepend"
            placeholder="可留空">密码</span></Input>
        </Col>
      </Row>
      <Row>
        <div style=" height: 40px; width: 95%;margin: auto; text-align: center; line-height: 50px;margin-top: 10px;"
             v-if="ischange">
          <Button @click="updateImg" type="primary" long>增删图片</Button>
        </div>
      </Row>
      <Divider>图片列表</Divider>
      <List style="max-height: 60vh;overflow: auto;" v-for="(album,index) in ischange?thisAlbumlist:albumlist"
            :key="index">
        <ListItem>
          <!--          <ListItemMeta :avatar="album.imgurl"  />-->
          <div style="width: 100%;padding: 0 10px;min-width: 295px;">
            <Row>
              <Col flex="83px">
                <div style="width: 100%;text-align: center;">
                  <img :src="album.imgurl" style="height: 70px; max-width:80px;object-fit:cover; border-radius: 5px;"/>
                </div>
              </Col>
              <Col flex="auto">
                <Input type="textarea" v-model="album.notes" :rows="3" maxlength="500"
                       placeholder="图片说明/描述,可留空"/>
              </Col>
            </Row>
          </div>

        </ListItem>
      </List>
    </div>
    <div class="example-code-more" style="height: 49px;" v-if="ischange">
      <Button type="primary" :loading="aloading" @click.native="submitUpdateAlbum"
              style="position: absolute;bottom: 10px;right: 10px;">更新
      </Button>
    </div>
    <div class="example-code-more" style="height: 49px;" v-else>
      <Button type="primary" :loading="aloading" @click.native="submitAlbum"
              style="position: absolute;bottom: 10px;right: 10px;">保存
      </Button>
    </div>

    <!-- 个人相册弹窗 -->
    <Modal v-model="isMyImages" :fullscreen="true" @on-ok="isMyImages=false" @on-cancel="isMyImages=false">
      <div @click="toShowDrawer"
           style="background: #5396fb; color: #FFF;width: 84%;height: 30px;margin: 0 auto;cursor: pointer;text-align: center;line-height: 30px;box-shadow: 0 1px 6px 0 rgba(32, 33, 36,.28);border-radius: 5px;">
        已选图像
        <Icon type="ios-arrow-dropdown" size="16"/>
      </div>
      <Drawer :inner="true" :transfer="false" title="已选图像" placement="top" :closable="false" v-model="showDrawer">
        <div style="width: 100%">
          <ul id="menu" v-for="(img,index) in BrowseImages" :key="index">
            <li>
              <div style="width: 64px;height: 64px;position: relative;padding: 2px;">
                <Icon @click="delBrowseImages(img.id,index)" type="md-close-circle"
                      style="position: absolute; z-index: 1; right: -7px; top: -4px;cursor: pointer;"/>
                <img class="imgstyle-toolbar_exp imgstyle" :src="img.imgurl" style="cursor:pointer;">
              </div>
            </li>
          </ul>

        </div>
      </Drawer>
      <Content :style="{margin: '15px 5px 0', }" style="overflow-y: auto;height: 500px;">
<!--        <viewer>-->
          <Row class="animate__animated animate__fadeIn animate__delay-1.5s">
            <Col flex="1" v-for="(item,index) in imglist" :key="index">
              <div class="imgdivstyle_exp divimgstyle-min_exp">
                <span @click="noSelectImageClick(item.id)" class="formatTag_exp"
                      v-show="selectImage.indexOf(item.id)>-1"><Icon type="md-done-all" size="50"
                                                                     style="margin-top: 50px;"/></span>
                <img @click="selectImageClick(index)" class="imgstyle-min_exp imgstyle" v-lazy="item.imgurl+''"
                     :src="item.imgurl+''" :key="item.imgurl">
              </div>
            </Col>
          </Row>
          <div style="width: 100%;text-align: center;color: #797b7f;" v-show="noImgMsg">
            <Icon type="ios-filing" size="56"/>
            <p>当前未找到任何图像</p>
          </div>
<!--        </viewer>-->
        <div class="example-code-more">
          <Button type="dashed" :loading="nextButloading" @click="selectPhoto" :disabled="btntext=='所有数据加载完毕'"
                  long>{{ btntext }}
          </Button>
        </div>
      </Content>
      <div class="example-code-more">
        <Button type="primary" @click="saveNewAlbumlist" style="position: absolute;bottom: 10px;right: 10px;">确定
        </Button>
      </div>
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
      require: true
    },
    ischange: {
      type: Boolean,
      default: () => false,
      require: false
    }

  },
  data() {
    return {
      showDrawer: false,
      aloading: false,
      BrowseImages: [],//已选缩略图浏览抽屉的图片
      thisAlbumlist: [],
      newAlbumlist: [],
      albumtitle: null,
      password: null,
      pageNum: 1,
      pageSize: 30,
      isMyImages: false,
      imglist: [],
      btntext: '加载更多',
      noImgMsg: false,
      nextButloading: false,
      selectImage: [],
      operatState: 'update',//add
      newAlbumArr: [],
      albumkey: null
    }
  },
  mounted() {

  },
  methods: {
    getTilePass(atitle, apass, akey, list) {
      this.albumkey = akey;
      this.thisAlbumlist = list;
      this.BrowseImages = list;
      if (atitle != null && atitle != '') {//&& apass!=null && apass!=''
        this.albumtitle = atitle;
        this.password = apass;
      }
    },
    submitAlbum() {
      if (this.albumtitle == null || this.albumtitle == '') {
        this.$Message.warning("画廊标题不能为空");
        return false;
      }
      if (this.albumlist.length == 0) {
        this.$Message.warning("画廊图像不存在");
        return false;
      }
      this.aloading = true;
      var param = {
        albumtitle: this.albumtitle,
        password: this.password,
        albumlist: this.albumlist
      }
      // console.log("====="+JSON.stringify(param))
      request(
          "/SaveForAlbum",
          param).then(res => {
        this.$Spin.hide();
        if (res.status == 200) {
          this.aloading = false;
          var json = res.data.data;
          if (res.data.code == '200') {
            this.$emit('return-data', json);
          } else {
            this.$Message.error(res.data.info);
          }
        } else {
          this.$Message.error("请求时出现错误");
        }
      }).catch(err => {
        this.$Spin.hide();
        console.log(err);
        this.$Message.error('服务器请求错误');
      })
    },
    //修复画廊的提交方法
    submitUpdateAlbum() {
      this.aloading = true;
      var param = {};
      if (this.albumtitle == null || this.albumtitle == '') {
        this.$Message.warning('画廊标题不能为空');
        return;
      }
      if (this.thisAlbumlist.length == 0) {
        this.$Message.warning('画廊未检出到图像');
        return;
      }
      param.albumkey = this.albumkey;
      param.albumtitle = this.albumtitle;
      param.password = this.password;
      param.albumlist = this.thisAlbumlist;

      request(
          "/admin/UpdateForAlbum",
          param).then(res => {
        this.$Spin.hide();
        if (res.status == 200) {
          this.aloading = false;
          var json = res.data.data;
          if (res.data.code == '200') {
            this.$Message.success(res.data.info);
            this.$emit('return-data', json);
          } else {
            this.$Message.error(res.data.info);
          }
        } else {
          this.$Message.error("请求时出现错误");
        }
      }).catch(err => {
        this.$Spin.hide();
        console.log(err);
        this.$Message.error('服务器请求错误');
      })

    },
    //修改画廊的方法
    updateImg() {
      this.isMyImages = true;
      this.selectImage = [];
      for (let i = 0; i < this.thisAlbumlist.length; i++) {
        this.selectImage.push(this.thisAlbumlist[i].id);
      }
      this.selectPhoto();
    },
    selectPhoto() {
      var paramJson = {};
      paramJson.pageNum = this.pageNum;
      paramJson.pageSize = this.pageSize;
      paramJson.selectUserType = 'me';
      paramJson.selecttype = null;
      paramJson.username = null;
      paramJson.violation = false;
      this.nextButloading = true;
      request(
          "/admin/selectPhoto",
          paramJson).then(res => {
        if (res.status == 200) {
          if (res.data.code == '200') {
            var arr = res.data.data.rows;
            if (arr.length > 0) {
              this.imglist = this.imglist.concat(arr);
              this.pageNum++;
              this.nextButloading = false;
              if (this.imglist.length < this.pageSize) {
                this.btntext = '所有数据加载完毕';
              } else {
                this.btntext = '加载更多';
              }
            } else {
              this.btntext = '所有数据加载完毕';
            }
            if (this.imglist.length == 0) {
              this.noImgMsg = true;
            }
          } else {
            this.$Message.warning(res.data.info);
          }
        } else {
          this.$Message.error("请求时出现错误");
        }
      }).catch(err => {
        console.log(err);
        this.$Message.error('服务器请求错误');
      })

    },
    //选中的图片
    selectImageClick(index) {
      if (this.selectImage.indexOf(this.imglist[index].id) == -1) {
        this.selectImage.push(this.imglist[index].id);
      }
      this.BrowseImages.push(this.imglist[index])
    },
    noSelectImageClick(id) {
      var than = this;
      than.selectImage.splice(this.selectImage.indexOf(id), 1);
      for (let i = 0; i < than.BrowseImages.length; i++) {
        if (id == than.BrowseImages[i].id) {
          than.BrowseImages.splice(i, 1);
          break;
        }
      }

      // than.BrowseImages.forEach((item,index) =>{
      //   if(id==item.id){
      //     than.BrowseImages.splice(index,1);
      //     throw Error();
      //   }
      // })
    },
    saveNewAlbumlist() {
      // for (let i = 0; i <this.selectImage.length; i++) {
      //   var cunzai = false;
      //   var obj = {};
      //   for (let j = 0; j <this.thisAlbumlist.length; j++) {
      //     if(this.thisAlbumlist[j].id==this.selectImage[i]){
      //       obj = this.thisAlbumlist[j];
      //       this.newAlbumArr.push(obj);
      //       cunzai = true;
      //       break;
      //     }
      //   }
      //   if(!cunzai){
      //     this.imglist.forEach(item=>{
      //       if(this.selectImage[i] === item.id){
      //         var json = item;
      //         json.notes = '';
      //         this.newAlbumArr.push(json);
      //       }
      //     })
      //   }
      //   cunzai = false;
      // }
      // this.thisAlbumlist = this.newAlbumArr;
      this.isMyImages = false;
    },
    //点击已选缩略图按钮的时候
    toShowDrawer() {
      this.showDrawer = true;
    },
    delBrowseImages(id, index) {
      var than = this;
      than.BrowseImages.splice(index, 1);
      than.selectImage.forEach((item, index) => {
        if (id == item) {
          than.selectImage.splice(index, 1);
        }
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

.example-code-more {
  text-align: center;
  cursor: pointer;
  padding: 30px 0;
  font-size: 16px;
  line-height: 30px;
  font-weight: bold;
}

.imgdivstyle_exp {
  height: 160px;
  margin-top: 10px;
  text-align: center;
  margin-right: 2px;
}

.divimgstyle-min_exp {
  min-width: 155px;
  height: 151px;
  filter: opacity(1);
  margin: 10px;
  border-radius: 5px;
  transition: all .1s;
}

.imgstyle-toolbar_exp {
  width: 60px;
  height: 60px;
  filter: opacity(1);
  margin: 2px;
  border-radius: 5px;
  transition: all .1s;
  object-fit: cover;
  box-shadow: 0 1px 6px 0 rgba(32, 33, 36, .28);
}

.formatTag_exp {
  display: block;
  width: 100%;
  height: 100%;
  background: rgba(38, 38, 38, .72);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  /*box-shadow: 0 1px 6px rgba(255, 255, 255, .2);*/
  color: #ededed;
  border-radius: 3px;
}

.imgstyle-min_exp {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
  border: 1px solid #eee;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 10px 0px;
  transform: translateZ(0);
}

#menu {
  font-size: 18px;
  font-weight: bold;
}

#menu li {
  text-decoration: none; /*去掉前面的圆点*/
  list-style: none;
  float: left;
  border: 1px solid #FFFFFF;
  /*background-color: #30DDEB;*/
}
</style>
