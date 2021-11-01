<template>

  <Layout style="margin-top: 50px;">

    <Drawer title="图像类别" :closable="false"  v-model="treePopup"  :width="screenWidth<=368?screenWidth:368">

      <Form  @submit.native.prevent style="margin-top: 30px;">

        <FormItem label="存储源">
              <Select v-model="searchbucket" filterable clearable placeholder="存储源(默认全部)">
                <Option v-for="item in bucketlist" :value="item.storageType" :key="item.id">{{ item.keyname }}</Option>
              </Select>
        </FormItem>
        <FormItem label="起始日期">
          <DatePicker @on-change="startDateChange" format="yyyy-MM-dd HH:mm:ss" type="datetime"  split-panels placeholder="起始日期段(默认不限)"></DatePicker>
        </FormItem>
        <FormItem label="结束日期">
          <DatePicker @on-change="stopDateChange" format="yyyy-MM-dd HH:mm:ss" type="datetime"  split-panels placeholder="结束日期段(默认当前日期)"></DatePicker>
        </FormItem>
        <FormItem label="用户名">
          <Input v-model="searchtext" placeholder="填写用户名">
            <Select v-model="searchtype" slot="prepend" style="width: 100px">
              <Option value="1">包含</Option>
              <Option value="0">排除</Option>
            </Select>
          </Input>
        </FormItem>
        <FormItem label="图像类型">
          <CheckboxGroup>
            <Checkbox label="违规图片" v-model="violation" border></Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>

      <div style="width: 100%; height: 55px; position: absolute; bottom: 0; left: 0;text-align: right; padding: 10px;">
        <div style="width: 75px; display: inline-block;">
          <Button shape="circle" @click="treePopup = false">取消</Button>
        </div>
        <div style="width: 75px; display: inline-block;">
          <Button type="primary" shape="circle" @click="tosearch">检索</Button>
        </div>
      </div>
    </Drawer>

<!--        minHeight: '500px'-->
        <Content :style="{margin: '15px 5px 0', }">
          <viewer :images="imglist">
            <p style="position: fixed;right: 30px;z-index: 1;bottom: 68px;">
<!--              @click="searchimg" -->
              <Button type="primary" shape="circle" icon="ios-search" style="z-index: 1;margin-right: 8px;box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 6px 0px;" @click.native="treePopup = true">筛选</Button>
              <Dropdown trigger="click" style="z-index: 1;box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 6px 0px;border-radius: 50%;">
                <Button type="primary" shape="circle">
                   操作
                  <Icon type="ios-arrow-down"></Icon>
                </Button>
                <DropdownMenu slot="list">
                  <DropdownItem  @click.native="selectAll"><Icon type="md-checkmark-circle" size="16"  /> 全部选中</DropdownItem>
                  <DropdownItem  @click.native="noselectAll"><Icon type="md-checkmark-circle-outline" size="16"  /> 取消选中</DropdownItem>
                  <DropdownItem @click.native="delSelectImg"><Icon type="md-trash" size="16"  /> 删除选中</DropdownItem>
                  <DropdownItem divided @click.native="showViewType"><Icon type="md-eye" size="16"  /> {{viewType==1?'小图模式':'大图模式'}}</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </p>

           <Row class="animate__animated animate__fadeIn animate__delay-1.5s">
            <Col flex="1" v-for="(item,index) in imglist" :key="index">
              <div class="imgdivstyle"  :class="[viewType==1?'divimgstyle-max':'divimgstyle-min']">
                <span class="formatTag">{{item.imgurl.substr(item.imgurl.lastIndexOf("\.")+1)}}</span>
                <img :class="[viewType==1?'imgstyle-max':'imgstyle-min']"  class="imgstyle" style="cursor:pointer;" :src="item.imgurl+''"   >
<!--                <img :class="[viewType==1?'imgstyle-max':'imgstyle-min']"  class="imgstyle" style="cursor:pointer;" :src="'666'"  onerror="this.src='http://tc.hellohao.cn/img/img404.jpg'" >-->
                <div class="img-tool-cover" :style="{bottom:toolBottom+ 'px'}">
                  <Icon style="cursor:pointer;" @click.native="selectImgs(item)" :type="selectIndex.indexOf(item.id)>-1?'ios-checkmark-circle':'ios-checkmark-circle-outline'" :class="{'icostylecolor' : selectIndex.indexOf(item.id)>-1}"  class="icostyle"  title="选择" ></Icon>
                  <Icon style="cursor:pointer;" type="md-link icostyle cobyOrderSn"   title="链接" data-clipboard-action="copy" :data-clipboard-text="item.imgurl" @click.native="copy" />
                  <Icon style="cursor:pointer;" type="md-trash icostyle" @click.native="delImg(item.id,index)"  title="删除" ></Icon>
                  <Icon style="cursor:pointer;" :color="item.violation==null?'':'rgb(228 102 70)'" type="md-information-circle icostyle" @click.native="imgInfo(item)" title="信息"></Icon>
                </div>
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
         <!--筛选窗-->
        <Modal  v-model="issearchimg" :footer-hide="true">
          <br />
          <Form  @submit.native.prevent>
            <FormItem>
              <Row>
                <Col span="11">
                  <Select v-model="searchbucket" filterable clearable placeholder="存储源(默认全部)">
                    <Option v-for="item in bucketlist" :value="item.storageType" :key="item.id">{{ item.keyname }}</Option>
                  </Select>
                </Col>
                <Col span="2" style="text-align: center"></Col>
                <Col span="11">
<!--                  <DatePicker type="daterange" @on-change="setsearchdate" split-panels placeholder="日期段(默认不限)"  separator="~"></DatePicker>-->
                </Col>
              </Row>
            </FormItem>
            <FormItem >
              <Input v-model="searchtext" placeholder="填写用户名">
                <Select v-model="searchtype" slot="prepend" style="width: 100px">
                  <Option value="1">包含</Option>
                  <Option value="0">排除</Option>
                </Select>
              </Input>
            </FormItem>
            <FormItem>
              <Button type="primary" icon="ios-search" long shape="circle" @click="tosearch">SEARCH</Button>
            </FormItem>
          </Form>
        </Modal>

        <!--详细信息-->
    <Modal  v-model="isimginfo" :footer-hide="true">

      <List :split="false" >
        <ListItem><span style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;"><Icon style="font-size: 32px;" type="md-image" />&nbsp;&nbsp;&nbsp;<span style="font-size: 18px;">{{imgage==null?'暂缺数据':imgage.imgname}}</span></span></ListItem>
      </List>

      <Tabs>
        <TabPane label="图像信息" icon="ios-images" >

          <div style="line-height: 32px;margin-bottom: 40px;">
            <p><span class="infotitle"> 文件大小：</span><span style="font-size: 14px;">{{imgage==null?'暂缺数据':imgage.sizes>0?this.formatBytes(imgage.sizes,2):''}}</span></p>
            <p><span class="infotitle"> 文件类型：</span><span style="font-size: 14px;">{{imgage==null?'未知':imgage.format}}</span></p>
            <p><span class="infotitle"> 来源IP：</span><span style="font-size: 14px;">{{imgage==null?'暂缺数据':imgage.abnormal}}</span></p>
            <p><span class="infotitle"> 上传日期：</span><span style="font-size: 14px;">{{imgage==null?'暂缺数据':imgage.updatetime?imgage.updatetime:''}}</span></p>
            <p><span class="infotitle"> 上传者：</span><span style="font-size: 14px;">{{upName}}</span></p>
            <p><span class="infotitle"> 所属存储源：</span><span style="font-size: 14px;">{{bucketname}}</span></p>
            <p><span class="infotitle|"> 存储性质：</span><span style="font-size: 14px;">{{imgage==null?'暂缺数据':(imgage.imgtype==0?'持久':'暂存')}}</span></p>
          </div>
          <p style="color: rgb(228 102 70);font-size: 12px; font-weight: 200;position: absolute; bottom: 10px; display: block; left: 0; width: 100%;z-index: 1;" align="center" v-show="isViolation.isControl">{{isViolation.info}}</p>
          <div class="QRCodestyle">
            <vue-qr  :text="imgage?imgage.imgurl?imgage.imgurl:'未获取到文件信息':'未获取到文件信息'" :size="160"></vue-qr>
          </div>
        </TabPane>
      </Tabs>
      </Modal>


    <Footer class="layout-footer-center" >{{this.$store.state.metaInfo.webname}} &copy; Control Panel</Footer>
      </Layout>


</template>

<script src="../../assets/js/photo.js">

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
  /*width: 300px;*/
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius:5px;
  border: 1px solid #eee;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 10px 0px;
  transform: translateZ(0);
}
.imgstyle-min{
  /*width: 155px;*/
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius:5px;
  border: 1px solid #eee;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 10px 0px;
  transform: translateZ(0);
}
.divimgstyle-max{
  min-width: 300px;
  height: 160px;
  margin: 10px;
}
.divimgstyle-min{
  min-width: 155px;
  height: 150px;
  margin: 10px;
}
.img-tool-cover{
  display: block;
  position: absolute;
  /*bottom: 5px;*/
  left: 0;
  right: 0;
  background: rgba(255,255,255,.87);
  height: 30px;
  width: 124px;
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
  right: 5px;
  bottom: 20px;
  opacity: 0.7;
}
.QRCodestyle2{
  height: 200px;
  width: 200px;
  position: absolute;
  right: 0;
  left: 0;
  opacity: 0.7;
  margin: auto;
  bottom: 47px;
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

</style>
