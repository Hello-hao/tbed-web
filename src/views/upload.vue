<template>
<div>
  <div class="mycard  animate__delay-0.8s">
    <Row class="animate__animated animate__delay-0.8s animate__fadeInDown"   style="overflow: hidden;">
      <Col flex="1" style="padding: 8px;">
        <Card class="cardShadow"
              :class="{'Hollowed':true}"
              @mouseover="mouseOver"
              @mouseleave="mouseLeave"
              style="margin-top: 10px;padding-left: 8px; padding-right: 8px;cursor:pointer;" @click.native="showUrlUploadMsg">
          <div class="myupdiv" >
            <img :src="linkImg" referrerpolicy="no-referrer" style="width: 45px;" class="toolImg"  />
            <p style="font-size: 18px;margin-top: 5px;line-height: 32px; font-size: 1.0vh;color: #808794;text-align: right;">
              URL上传
            </p>
          </div>
        </Card>
      </Col>
      <Col flex="1" style="padding: 8px;">
        <Card class="cardShadow"
              :class="{'Hollowed':false}"
              @mouseover="mouseOver"
              @mouseleave="mouseLeave"
              style="margin-top: 10px;padding-left: 8px; padding-right: 8px;cursor:pointer;" @click.native="showtermMsg">
          <div class="myupdiv">
            <img :src="timeImg" class="toolImg" />
            <p style="font-size: 18px;margin-top: 5px;line-height: 32px ;text-align: right;font-size: 1.0vh;color: #808794;">
              <span v-if="data.day==0">永久</span>
              <span v-else>{{data.day}}天失效</span>
            </p>
          </div>
        </Card>
      </Col>
    </Row>
  </div>

  <Card id="box" class="mycard upcard img_list_box animate__animated  animate__delay-0.8s animate__fadeInUp"
         :class="{'Hollowed':false,'testback':true}">
    <div class="img_list_arr" style="text-align:center;">
      <div class="demo-upload-list animate__animated animate__delay-1.5s  animate__fadeIn" v-for="(item,index) in uploadList" v-bind:key="item.uid">
        <template v-if="item.status === 'finished'" >
          <img style="cursor:pointer;"  preview="2" :data-pswp-uid="index" :preview-text="item.name"  :src="item.response.data.url" />
          <div class="demo-upload-list-cover">
            <Icon type="md-checkmark-circle" style="margin: 0 5px;" :style="{color:(selectIndexUid.indexOf(item.uid)>=0?'#43b984':'#c7c7c7')}" @click.native="clickImg(item.response.data.imguid,item.uid)" title="选择"></Icon>
            <Icon type="md-trash"  style="margin: 0 5px;" @click.native="handleRemove(item)" title="删除图像"></Icon>
            <Icon type="md-git-branch"  style="margin: 0 5px;" @click.native="getImgLink(item)" title="分享链接"></Icon>
          </div>
        </template>
        <template v-else>
          <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
        </template>
      </div>
      <Upload
          ref="upload"
          :paste="true"
          :disabled="getUploadSwitch"
          :show-upload-list="false"
          :default-file-list="defaultList"
          :format="uploadInfo.suffix"
          :max-size="uploadInfo.filesize"
          :on-success="handleSuccess"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          :before-upload="handleBeforeUpload"
          :on-error="uploadError"
          :multiple="true"
          :data="data"
          :headers="headers"
          :action="this.$http.defaults.baseURL+'/upload'"
          type="drag"
          style="display:contents;width:120px;">
        <div style="width: 100%;height:118px;">
          <div style="width: 98px;height: 64px;margin: 0px auto;text-align: center;position: absolute;left: 0;right: 0;top: 30px;" v-show="!getUploadSwitch">
            <Icon type="ios-camera" size="36"></Icon>
            <p style="text-align: center;color: #515a6e;font-size: xx-small;">拖拽图像到此处</p>
          </div>
          <div style="height: 64px;margin: 0px auto;text-align: center;position: absolute;left: 0;right: 0;top: 30px;" v-show="getUploadSwitch">
            <p style="text-align: center;color: #515a6e;font-size: x-small;">{{this.uploadInfo.uploadInfo}}</p>
          </div>
        </div>
      </Upload>
      <Modal  v-model="visible" :footer-hide="true"  width="620" >
        <Tabs>
          <TabPane label="画廊" icon="ios-images" >
            <album-list :albumlist="albumlist"  @return-data='returnData' />
          </TabPane>
          <TabPane label="更多" icon="ios-filing" disabled>更多功能待开发</TabPane>
        </Tabs>
      </Modal>

      <Modal  v-model="IsImgLink" :footer-hide="true" >
        <br />
        <List  :split="false" >
          <ListItem>
            <Input v-model="imgLinkForUrl" class="cobyOrderSn" data-clipboard-action="copy" :data-clipboard-text="imgLinkForUrl" @click.native="copy" ><span slot="prepend">U R L</span></Input>
          </ListItem>
          <ListItem >
            <Input v-model="imgLinkForHtml" class="cobyOrderSn" data-clipboard-action="copy" :data-clipboard-text="imgLinkForHtml" @click.native="copy" ><span slot="prepend">HTML</span></Input>
          </ListItem>
          <ListItem >
            <Input v-model="imgLinkForMD" class="cobyOrderSn" data-clipboard-action="copy" :data-clipboard-text="imgLinkForMD" @click.native="copy" ><span slot="prepend">Markdown</span></Input>
          </ListItem>
        </List>
      </Modal>

      <Modal  v-model="isAlbum" :footer-hide="true" :title="albumData.title">
        <Form  @submit.native.prevent :label-width="70" style="margin-top: 30px;" >
          <FormItem label="链接">
            <Input v-model="albumData.url" style="width: auto;width: 100%"  />
          </FormItem>
          <FormItem label="密码">
            <Input v-model="albumData.password" style="width: auto;width: 100px;"  />
            <Button style="position: absolute;right: 30px;" size="small" type="primary" shape="circle" class="cobyOrderSn" data-clipboard-action="copy" :data-clipboard-text="'画廊链接：'+albumData.url+'提取码：'+albumData.password+' 复制这段内容后用浏览器打开，即可查看画廊哦'" @click.native="copy">复 制</Button>
          </FormItem>
        </Form>
        <div class="QRCodestyle" v-if="albumData.url" style="text-align: center;">
          <vue-qr  :text="albumData.url" :size="200"></vue-qr>
        </div>
        <div style="text-align: center;">
          <p>对方通过扫码即可访问画廊</p>
        </div>
      </Modal>

      <!--URL上传窗-->
      <Modal  v-model="urlUploadMsg" :footer-hide="true">
        <br />
        <Form  @submit.native.prevent>
          <FormItem >
            <Input @on-change="onGetLines" type="textarea" v-model="imgUrl" :rows="5"   placeholder="图像链接请按照每行一条填写" />
          </FormItem>
          <p style="text-align: center;color: #d55757;" v-show="tempURLErr" >您所输入的行数已经超过单次可上传的数量</p>
          <p style="text-align: center;color: #5f5f5f;" v-text="'单次批量上传 '+tempLink+'/'+this.uploadInfo.imgcount"></p>
          <FormItem>
            <Button :disabled="tempURLErr" type="primary" :loading="loading" icon="md-cloud-upload" long shape="circle" @click="uploadForUrl" >UPLOAD</Button>
          </FormItem>
        </Form>
      </Modal>

      <!--上传期限-->
      <Modal  v-model="termMsg" :footer-hide="true">
        <br />
        <Form  @submit.native.prevent>
          <FormItem label="文件有效期">
            <Select v-model="data.day" style="width:100px" @on-change="selectTerm">
              <Option v-for="item in dayList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Form>
      </Modal>

    </div>
  </Card>
  <Spin fix v-if="spinShow">
    <Icon type="ios-loading" size=42 style="color: #5f5f5f" class="hellohao-spin-icon-load"></Icon>
    <div style="line-height: 42px;color: #5f5f5f">批量上传中，请耐心等待</div>
  </Spin>
</div>

</template>

<script src="../assets/js/upload.js">

</script>

<style scoped>
.ivu-upload-drag{
  background: rgba(255, 255, 255, 0);
  border: 1px dashed #dcd9d9;
}
</style>

<style>

/*.ivu-upload-drag{*/
/*  background: rgba(255, 255, 255, 0);*/
/*  border: 1px dashed #dcd9d9;*/
/*}*/

.demo-upload-list {
  line-height: 28px;
  width: 120px;
  height: 120px;
  box-shadow:0 2px 9px 0 rgba(0,0,0,.1);
  background-image: linear-gradient(147deg, #fffcf9, #cde8f6);
}
.demo-upload-list-cover {
   display: block;
  background: rgba(0,0,0,.5);
  height: 25px;
}
.select-img-list{
  position: absolute;
  top: 92px;
  width: 65px;
  height: 30px;
  transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  left: 73px;
  background: #57a3f3;
}

.select-img-icon{
  position: absolute;
  top: 4px;
  left: 26px;
  color: #FFF;
  transform: rotate(37deg);
  -ms-transform: rotate(37deg);
  font-weight: 600;
  font-size: large;
}
.demo-upload-list-cover i {
  color:rgba(255,255,255,0.6);
  font-size: 18px;
}
.demo-upload-list-cover i:hover {
  color: #fff;
}
.mycard{
  max-height: 600px;
  margin: 25px auto;
  width: 55%;
  min-width: 40vh;
  overflow-y: auto;
}

.ivu-modal-header p, .ivu-modal-header-inner {
  width: 85%;
  font-size: xx-small;

}

.ivu-avatar {
  width: 42px;
  height: 42px;
  border-radius: 5px;
}

.ivu-card-bordered {
  border: 0;
  border-color: #e8eaec;
  box-shadow: 0 2px 5px 1px rgba(64,60,67,.16);
}


.demo::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.infotitle{
  font-size: 16px;
}

.myupdiv{
  text-align:center;
  height: 80px;
  /*padding: 10px;*/
  /*font-weight: bold;*/
  min-width: 65px;
  -webkit-transition:all 0.5s ease 0s;
  -moz-transition:all 0.5s ease 0s;
  transition:all 0.5s ease 0s;
}
.toolImg{
  width: 50px;
  -webkit-transition:all 0.5s ease 0s;
  -moz-transition:all 0.5s ease 0s;
  transition:all 0.5s ease 0s;
}
.myupdiv:hover{
  opacity: 0.5;
  /*margin-top: 10px;*/
  -webkit-transition:all 0.5s ease 0s;
  -moz-transition:all 0.5s ease 0s;
  transition:all 0.5s ease 0s;
}

</style>
