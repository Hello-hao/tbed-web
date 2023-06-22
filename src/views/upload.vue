<template>
  <div id="bodydom">

    <div class="mycard zdy-time800">
      <Row class="animate__animated zdy-time800"
           :class="{'animate__fadeInDown' : this.$store.state.preludeSwitch}" style="overflow: hidden;">
        <Col flex="1" style="padding: 8px;">
          <Card class="cardShadow"
                :class="{'Hollowed':false}"
                :style="{'background':mytheme.myColor1}"
                style="margin-top: 10px;padding-left: 8px; padding-right: 8px;cursor:pointer;box-shadow: 0 0 3px 3px rgb(0 0 0 / 5%);"
                @click.native="showtermMsg">
            <p v-if="$store.state.isMobile=='pc'" style="font-size: 1.8vh;text-align: left;font-weight: 600;">
              <span :style="{'color':mytheme.myColor2}">存储期限</span>
            </p>
            <div class="myupdiv">
              <img :src="timeImg" class="toolImg"/>
              <p style="font-size: 18px;margin-top: 5px;line-height: 32px ;text-align: right;font-size: 1.0vh;"
                 :style="{'color':mytheme.myColor2}">
                存储期限:
                <span v-if="img_day==0">永久</span>
                <span v-else>{{ img_day }}天</span>
              </p>
            </div>
          </Card>
        </Col>

      </Row>
    </div>

    <Card class="mycard animate__animated zdy-time800" :style="{'overflow-y':'hidden','background':mytheme.myColor1}"
          style="box-shadow: 0 0 3px 3px rgb(0 0 0 / 5%);"
          :class="{'animate__fadeInUp' : this.$store.state.preludeSwitch,'Hollowed':false}">
      <Row>
        <Col span="12" v-show="!getUploadSwitch">
          <div :style="{'border': 'dashed '+mytheme.myColor2+' 1px'}"
               style="height:180px; cursor:pointer;border-radius: 5px;margin-right: 8px;">
            <UploaderList
                ref="UploaderList"
                :icocolor="mytheme.myColor2"
                @returnImgData="returnImgData"
                :formData="{ guid: null, fileCategory: 1, code: 7 }"
                :fileType="'targetFacility'"
            />
          </div>
        </Col>
        <Col span="12" v-show="!getUploadSwitch">
          <div :style="{'border': 'dashed '+mytheme.myColor2+' 1px'}"
               style="height:180px; cursor:pointer;border-radius: 5px;margin-left: 8px;" @click="showUrlUploadMsg">
            <div class="url_style">
              <Icon type="ios-cloud-download" size="48" :color="mytheme.myColor2"/>
            </div>
            <p style="font-size: 1.7vh;color: #494f56;text-align: center;position: relative; top: 106px; letter-spacing: 2px;"
               :style="{'color':mytheme.myColor2}">
              链接转存&nbsp;
            </p>
          </div>
        </Col>
        <Col span="24">
          <div v-show="getUploadSwitch" class="uploadInfoSty" :style="{'color':mytheme.myColor2}">
            <Icon type="md-camera" size="36" :color="mytheme.myColor2"/>&nbsp;&nbsp;or&nbsp;&nbsp;<Icon
              type="ios-cloud-download" size="36" :color="mytheme.myColor2"/>
            <br/>{{ this.uploadInfo.uploadInfo }}
          </div>
        </Col>
      </Row>
    </Card>
    <!--  图片列表  animate__animated animate__fadeIn animate__delay-2s -->

    <Card class="mycard animate__animated zdy-time" :style="{'min-height':'140px','background':mytheme.myColor1}"
          style="box-shadow: 0 0 3px 3px rgb(0 0 0 / 5%);"
          :class="{'animate__fadeIn' : this.$store.state.preludeSwitch,'Hollowed':false}">
      <div class="record_css" :style="{'background':mytheme.myColor3}" @click="getProgress">上传进度</div>
      <div class="img_list_arr" style="text-align:center;margin-top: 15px;" :style="{'color':mytheme.myColor3}">
        <div v-if="uploadList.length==0" style="height: 140px;">
          <div style="height: 140px;padding:20px 0;text-align: center;">
            <h4>
              <Icon type="ios-bulb" size="16"/>
              小提示：
            </h4>
            <p style="font-size: 12px;line-height: 40px;">上传前可选择[上方三个小卡片],选择附加功能哦！</p>
          </div>
        </div>
        <div v-else class="demo-upload-list" v-for="(item,index) in uploadList" v-bind:key="item.imguid">
          <template>
            <img style="cursor:pointer;object-fit: cover;" preview="2" :data-pswp-uid="index" :preview-text="item.name"
                 :srcset="item.briefimgurl?item.briefimgurl:item.url" :src="item.url"/>
            <div class="demo-upload-list-cover">
              <Icon type="md-checkmark-circle" style="margin: 0 5px;"
                    :style="{color:(selectIndex.indexOf(item.imguid)>=0?'#43b984':'#c7c7c7')}"
                    @click.native="clickImg(item.imguid)" title="选择"></Icon>
              <Icon type="md-trash" style="margin: 0 5px;" @click.native="handleRemove(item)" title="删除图像"></Icon>
              <Icon type="md-git-branch" style="margin: 0 5px;" @click.native="getImgLink(item)"
                    title="分享链接"></Icon>
            </div>
          </template>
        </div>
      </div>
    </Card>

    <Modal v-model="visible" :footer-hide="true" width="620">
      <!--                <img :src="ViewURL" v-if="visible" style="max-height: 70vh; display: table-cell;margin: 0 auto;text-align: center;">-->
      <Tabs>
        <TabPane label="画廊" icon="ios-images">
          <album-list :albumlist="albumlist" @return-data='returnData'/>
        </TabPane>
        <TabPane label="更多" icon="ios-filing" disabled>更多功能待开发</TabPane>
      </Tabs>
    </Modal>

    <Modal v-model="IsImgLink" :footer-hide="true">
      <br/>
      <List :split="false">
        <ListItem>
          <Input v-model="imgLinkForUrl" class="cobyOrderSn" data-clipboard-action="copy"
                 :data-clipboard-text="imgLinkForUrl" @click.native="copy"><span slot="prepend">U R L</span></Input>
        </ListItem>
        <ListItem v-if="imgLinkForBriefimgurl!=null && imgLinkForBriefimgurl!=''">
          <Input v-model="imgLinkForBriefimgurl" class="cobyOrderSn" data-clipboard-action="copy"
                 :data-clipboard-text="imgLinkForBriefimgurl" @click.native="copy"><span
              slot="prepend">缩略图</span></Input>
        </ListItem>
        <ListItem>
          <Input v-model="imgLinkForHtml" class="cobyOrderSn" data-clipboard-action="copy"
                 :data-clipboard-text="imgLinkForHtml" @click.native="copy"><span slot="prepend">HTML</span></Input>
        </ListItem>
        <ListItem>
          <Input v-model="imgLinkForMD" class="cobyOrderSn" data-clipboard-action="copy"
                 :data-clipboard-text="imgLinkForMD" @click.native="copy"><span slot="prepend">Markdown</span></Input>
        </ListItem>
      </List>
    </Modal>

    <!--            画廊生成后显示详情界面-->
    <Modal v-model="isAlbum" :footer-hide="true" :title="albumData.title">
      <Form @submit.native.prevent :label-width="70" style="margin-top: 30px;">
        <FormItem label="链接">
          <Input v-model="albumData.url" style="width: auto;width: 100%"/>
        </FormItem>
        <FormItem label="密码">
          <Input v-model="albumData.password" style="width: auto;width: 100px;"/>
          <Button style="position: absolute;right: 30px;" size="small" type="primary" shape="circle" class="cobyOrderSn"
                  data-clipboard-action="copy"
                  :data-clipboard-text="'画廊链接： '+albumData.url+' 提取码：'+albumData.password+' 复制这段内容后用浏览器打开，即可查看画廊哦'"
                  @click.native="copy">复 制
          </Button>
        </FormItem>
      </Form>
      <div class="QRCodestyle" v-if="albumData.url" style="text-align: center;">
        <vue-qr :text="albumData.url" :size="200"></vue-qr>
      </div>
      <div style="text-align: center;">
        <p>对方通过扫码即可访问画廊</p>
      </div>
    </Modal>

    <!--URL上传窗-->
    <Modal v-model="urlUploadMsg" :footer-hide="true">
      <br/>
<!--      <Form @submit.native.prevent>-->
<!--        <FormItem>-->
<!--          <Input @on-change="onGetLines" type="textarea" v-model="imgUrl" :rows="5"-->
<!--                 placeholder="图像链接请按照每行一条填写(部分非直链图像或防盗链图像可能会转存失败)"/>-->
<!--        </FormItem>-->
<!--        <p style="text-align: center;color: #d55757;" v-show="tempURLErr">您所输入的行数已经超过单次可上传的数量</p>-->
<!--        <p style="text-align: center;color: #5f5f5f;"-->
<!--           v-text="'单次批量上传 '+tempLink+'/'+this.uploadInfo.imgcount"></p>-->
<!--        <FormItem>-->
<!--          <Button :disabled="tempURLErr" type="primary" :loading="loading" icon="md-cloud-upload" long shape="circle"-->
<!--                  @click="uploadForUrl">开始转存-->
<!--          </Button>-->
<!--        </FormItem>-->
<!--      </Form>-->
      <Form  @submit.native.prevent>
        <FormItem >
          <Input @on-change="onGetLines" type="textarea" v-model="imgUrl" :rows="5"   placeholder="图像链接请按照每行一条填写(部分非直链图像可能会转存失败)" />
        </FormItem>
        <Input v-model="referer" placeholder="选填：图片链接所在的网站网址(可解决防盗链)">
          <Button slot="append" icon="md-help-circle" @click.native="urlUploadHelp"></Button>
        </Input>
        <p style="text-align: center;color: #d98282;" v-show="tempURLErr" >所输入行数已超过单次最大限制</p>
        <p style="text-align: center;color: #5f5f5f;" v-text="'单次批量上传 '+tempLink+'/'+this.uploadInfo.imgcount"></p>
        <FormItem>
          <Button :disabled="tempURLErr" type="primary" :loading="loading" icon="md-cloud-upload" long shape="circle" @click="uploadForUrl" >开始转存</Button>
        </FormItem>
      </Form>
    </Modal>

    <!--上传期限-->
    <Modal v-model="termMsg" :footer-hide="true">
      <br/>
      <Form @submit.native.prevent>
        <FormItem label="图像有效期">
          <Select v-model="img_day" style="width:200px" @on-change="selectTerm">
            <Option v-for="item in dayList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <p style="color: #9c9c9c;">设置期限后，上传的图像将在指定时间后被删除</p>
      </Form>
    </Modal>

    <Spin fix v-if="spinShow">
      <Icon type="ios-loading" size=42 style="color: #5f5f5f" class="hellohao-spin-icon-load"></Icon>
      <div style="line-height: 42px;color: #5f5f5f">批量上传中，请耐心等待</div>
    </Spin>

  </div>

</template>

<script src="../assets/js/upload.js">

</script>

<style scoped>
.zdy-time {
  --animate-duration: 1.5s;
}

.zdy-time800 {
  --animate-duration: 0.8s;
}

.ivu-upload-drag {
  background: rgba(255, 255, 255, 0);
  border: 1px dashed #dcd9d9;
}

.hellohao-spin-icon-load {
  animation: ani-hellohao-spin 1s linear infinite;
}

@keyframes ani-hellohao-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}


</style>

<style>
.record_css {
  /*background: #fd6a37;*/
  /*background-image: url("../assets/img/record_ico.svg");*/
  /*background-size:  contain;*/
  /*background-repeat: no-repeat;*/
  /*background-position: 100% 100%;*/
  height: 24px;
  width: 100px;
  box-shadow: 0 1px 5px 0px rgba(87, 87, 87, .55);
  border-radius: 0 0 10px 10px;
  position: absolute;
  left: 50%;
  right: 50%;
  transform: translate(-50%, -50%);
  top: 11px;
  z-index: 1;
  color: #FFF;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
  line-height: 24px;
}

.url_style {
  /*background-image: url("../assets/img/url-img.svg");*/
  background-size: contain; /*按比例缩放*/
  background-repeat: no-repeat; /*还有repeat-x,y等*/
  background-position: 100% 100%;
  height: 50px;
  width: 50px;
  position: absolute;
  left: 50%;
  right: 50%;
  transform: translate(-50%, -50%);
  top: 45%;
}

.progress_sty {
  display: inline-block;
  height: 20px;
  width: 50px;
  border-color: #e8eaec;
  box-shadow: 0 2px 5px 1px rgba(124, 144, 247, .58);
  position: relative;
  bottom: 15px;
  border-radius: 0 0 8px 8px;
  cursor: pointer;
  background: #7b90f8;
  color: #fff;
}

.demo-upload-list {
  line-height: 28px;
  width: 120px;
  height: 120px;
  box-shadow: 0 2px 9px 0 rgba(0, 0, 0, .1);
  background-image: linear-gradient(147deg, #fffcf9, #cde8f6);
}

.demo-upload-list-cover {
  display: block;
  background: rgba(0, 0, 0, .5);
  height: 25px;
}

.select-img-list {
  position: absolute;
  top: 92px;
  width: 65px;
  height: 30px;
  transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  left: 73px;
  background: #57a3f3;
}

.select-img-icon {
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
  color: rgba(255, 255, 255, 0.6);
  font-size: 18px;
}

.demo-upload-list-cover i:hover {
  color: #fff;
}

.mycard {
  max-height: 600px;
  margin: 25px auto;
  width: 66%;
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
  box-shadow: 0 2px 5px 1px rgba(64, 60, 67, .16);
  /*box-shadow: 0 0 18px #dadada;*/
}

.myupdiv {
  /*background-color: #FFFFFF;*/
  text-align: center;
  height: 80px;
  min-width: 65px;
  -webkit-transition: all 0.5s ease 0s;
  -moz-transition: all 0.5s ease 0s;
  transition: all 0.5s ease 0s;
}

.toolImg {
  width: 50px;
  -webkit-transition: all 0.5s ease 0s;
  -moz-transition: all 0.5s ease 0s;
  transition: all 0.5s ease 0s;
}

.myupdiv:hover {
  /*opacity: 0.5;*/
  -webkit-transition: all 0.5s ease 0s;
  -moz-transition: all 0.5s ease 0s;
  transition: all 0.5s ease 0s;
}

/**/
.upload-img {
  font-weight: bold;
  -webkit-transition-property: -webkit-transform;
  -webkit-transition-duration: 1s;
  -moz-transition-property: -moz-transform;
  -moz-transition-duration: 1s;
  -webkit-animation: rotate 3s linear infinite;
  -moz-animation: rotate 3s linear infinite;
  -o-animation: rotate 3s linear infinite;
  animation: rotate 3s linear infinite;
}

@-webkit-keyframes rotate {
  from {
    -webkit-transform: rotate(0deg)
  }
  to {
    -webkit-transform: rotate(360deg)
  }
}

@-moz-keyframes rotate {
  from {
    -moz-transform: rotate(0deg)
  }
  to {
    -moz-transform: rotate(359deg)
  }
}

@-o-keyframes rotate {
  from {
    -o-transform: rotate(0deg)
  }
  to {
    -o-transform: rotate(359deg)
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg)
  }
  to {
    transform: rotate(359deg)
  }
}

.webbgimg {
  filter: blur(10px) brightness(0.5);
  -webkit-animation-name: slideshow--alt;
  animation-name: slideshow--alt;
  -webkit-animation-duration: 10s;
  animation-duration: 10s;
  transform: scale(1.1);
  background-color: #f7f8fa;
  position: fixed;
  opacity: 0.9;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  /*transition: opacity 1s,transform .25s,filter .25s;*/
  transition: opacity 1s;
}

.uploadInfoSty {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  height: 110px;
  width: 100%;
  text-align: center;
  line-height: 26px;
  margin-top: 60px;
}
</style>
