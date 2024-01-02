<template>

  <Layout style="margin-bottom: 50px;">
    <v-contextmenu ref="contextmenu" :eventType="$store.state.isMobile=='pc'?'contextmenu':'noContextmenu'"
                   @contextmenu="contextmenuClick">
      <v-contextmenu-item @click="showCopyImgUrl">
        <Icon type="ios-git-merge" size="16"/>&nbsp;复 制
      </v-contextmenu-item>
      <hr style=" border: 2px solid #ffffff; "/>
      <v-contextmenu-item @click.native="rightClickDelete">
        <Icon type="ios-trash-outline" size="16"/>&nbsp;删&nbsp;除
      </v-contextmenu-item>
      <hr style=" border: 2px solid #ffffff; "/>
      <v-contextmenu-item @click="allSett">
        <Icon type="ios-book-outline" size="16"/>&nbsp;分享画廊
      </v-contextmenu-item>
      <hr style=" border: 2px solid #ffffff; " v-if="select.selectIndex.length==1"/>
      <v-contextmenu-item v-if="select.selectIndex.length==1" @click="updateFileName('img')">
        <Icon type="ios-create-outline" size="16"/>&nbsp;图像名称
      </v-contextmenu-item>
      <hr style="background: #dadada; border: 2px solid #ffffff; " v-if="select.selectIndex.length>0"/>
      <v-contextmenu-item v-if="select.selectIndex.length==1" @click="menuImgInfo">
        <Icon type="ios-alert-outline" size="16"/>&nbsp;详&nbsp;情
      </v-contextmenu-item>
    </v-contextmenu>
    <Drawer title="图像筛选" :closable="false" v-model="treePopup" @on-close="closeDrawer"
            :width="screenWidth<=368?screenWidth:368">
      <Form @submit.native.prevent style="margin-top: 30px;">
        <Divider plain>图像分类</Divider>
        <FormItem style="width: 100%;text-align: center;">
          <RadioGroup v-model="searchData.selectUserType" type="button" style="width: 100%">
            <Radio label="me">我的图像</Radio>
            <Radio label="all">用户图像</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem>
          <Select v-model="searchData.order" style="width:100%" placeholder="筛选排序方式">
            <Option value="desc" key="desc">时间倒序</Option>
            <Option value="asc" key="asc">时间顺序</Option>
            <Option value="sizeDesc" key="sizeDesc">大小倒序</Option>
            <Option value="sizeAsc" key="sizeAsc">大小顺序</Option>
          </Select>
        </FormItem>
        <Divider plain>名称搜索</Divider>
        <FormItem>
          <Input style="width: 100%" size="default" v-model="searchData.searchname"
                 placeholder="图像名称/地址后缀(可模糊搜索)">
          </Input>
        </FormItem>
        <Divider plain>高级选项（选填）</Divider>
        <FormItem v-if="$store.state.RoleLevel=='admin'">
          <Select style="width: 100%;" v-model="searchData.searchbucket" filterable clearable
                  placeholder="存储源(默认全部)">
            <Option v-for="item in bucketlist" :value="item.id" :key="item.id">
              {{ item.keyname }}
            </Option>
          </Select>
        </FormItem>
        <FormItem v-if="$store.state.RoleLevel=='admin' && searchData.selectUserType=='all'">
          <Input style="width: 100%" size="default" v-model="searchData.searchtext" placeholder="填写用户名">
            <Select v-model="searchData.searchtype" slot="prepend" style="width: 80px">
              <Option value="1">包含</Option>
              <Option value="0">排除</Option>
            </Select>
          </Input>
        </FormItem>
        <FormItem>
          <DatePicker style="width: 100%;" @on-change="startDateChange" format="yyyy-MM-dd HH:mm:ss" type="datetime"
                      split-panels placeholder="起始日期段(默认不限)"></DatePicker>
        </FormItem>
        <FormItem>
          <DatePicker style="width: 100%;" @on-change="stopDateChange" format="yyyy-MM-dd HH:mm:ss" type="datetime"
                      split-panels placeholder="结束日期段(默认当前日期)"></DatePicker>
        </FormItem>
        <FormItem>
          <CheckboxGroup>
            <Checkbox label="违规图片" v-model="searchData.violation" border></Checkbox>
          </CheckboxGroup>
        </FormItem>

      </Form>
      <div style="width: 100%; height: 55px; position: fixed; bottom: 0; left: 0;text-align: right; padding: 10px;">
        <div style="width: 75px; display: inline-block;">
          <Button shape="circle" @click="hideDrawer">取消</Button>
        </div>
        <div style="width: 75px; display: inline-block;">
          <Button type="primary" shape="circle" @click="tosearch">检索</Button>
        </div>
      </div>
    </Drawer>
    <!--        minHeight: '500px'-->
    <Content :style="{margin: '15px 5px 0', }">
        <p style="position: fixed;right: 30px;z-index: 1;bottom: 68px;">
          <Button type="primary" shape="circle" icon="ios-search"
                  style="z-index: 1;margin-right: 8px;box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 6px 0px;"
                  @click.native="treePopup = true">筛选
          </Button>
          <Dropdown trigger="click"
                    style="z-index: 1;box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 6px 0px;border-radius: 50%;">
            <Button type="primary" shape="circle">
              操作
              <Icon type="ios-arrow-down"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem :disabled="select.selectIndex.length==0"
                            @click.native="()=>{(select.selectIndex.length==0)?false:allSett()}">
                <Icon type="ios-book" size="16"/>
                生成画廊
              </DropdownItem>
              <DropdownItem :disabled="select.selectIndex.length==0 || select.selectIndex.length>1"
                            @click.native="()=>{(select.selectIndex.length==0 || select.selectIndex.length>1)?false:menuImgInfo()}">
                <Icon type="ios-information-circle" size="16"/>
                图像详情
              </DropdownItem>
              <DropdownItem :disabled="select.selectIndex.length==0 || select.selectIndex.length>1"
                            @click.native="()=>{(select.selectIndex.length==0 || select.selectIndex.length>1)?false:updateFileName('img')}">
                <Icon type="ios-create" size="16"/>
                修改名称
              </DropdownItem>
              <DropdownItem :disabled="select.selectIndex.length==0"
                            @click.native="()=>{(select.selectIndex.length==0)?false:showCopyImgUrl()}">
                <Icon type="ios-copy" size="16"/>
                复制分享
              </DropdownItem>
              <DropdownItem @click.native="selectAll">
                <Icon type="md-checkmark-circle" size="16"/>
                全部选中
              </DropdownItem>
              <DropdownItem @click.native="noselectAll">
                <Icon type="md-checkmark-circle-outline" size="16"/>
                取消选中
              </DropdownItem>
              <DropdownItem :disabled="select.selectIndex.length==0"
                            @click.native="()=>{(select.selectIndex.length==0)?false:delSelectImg()}">
                <Icon type="md-trash" size="16"/>
                删除选中
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </p>
<!--        <div class="" id="box" ref="dom">-->
<!--          <ul id="sortAble">-->
<!--            <li v-for="(item,index) in imglist" :ref="`imgLi_${item.id}`" :key="index" v-contextmenu:contextmenu>-->
<!--              <div :style="{width: imgWidth+'px', height:imgWidth+'px'}">-->
<!--                <span class="formatTag">{{ item.imgname.substr(item.imgname.lastIndexOf("\.") + 1) }}</span>-->
<!--                <img :style="{width: imgWidth+'px', }" :id="'myimg_'+index"-->
<!--                     :v-lazy="item.imgurl"-->
<!--                     :src="item.imgurl"-->
<!--                     :key="item.imgurl"-->
<!--                     :ref="`myImages_${item.id}`"-->
<!--                />-->
<!--                <svg @click="selectImgs(item)" t="1664620013040" class="icon myselect"-->
<!--                     :style="{'background':select.selectIndex.indexOf(item.id)>-1?'#FFF':'#a5a5a5'}"-->
<!--                     viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6479" width="200"-->
<!--                     height="200">-->
<!--                  <path-->
<!--                      d="M771.607273 359.726545l-289.28 349.09091a34.839273 34.839273 0 0 1-50.594909 3.374545l-176.174546-162.909091a34.955636 34.955636 0 0 1-1.931636-49.361454 34.978909 34.978909 0 0 1 49.338182-1.931637l149.131636 137.890909 265.728-320.698182a34.932364 34.932364 0 0 1 53.783273 44.544M884.363636 46.545455H139.636364C88.436364 46.545455 46.545455 88.436364 46.545455 139.636364v744.727272c0 51.2 41.890909 93.090909 93.090909 93.090909h744.727272c51.2 0 93.090909-41.890909 93.090909-93.090909V139.636364c0-51.2-41.890909-93.090909-93.090909-93.090909"-->
<!--                      :fill="select.selectIndex.indexOf(item.id)>-1?'#1580ff':'#FFF'" p-id="6480"></path>-->
<!--                </svg>-->
<!--                <div class="topCeng" :style="{background: item.violation==null?'':'rgb(255,0,0, .36)'}"-->
<!--                     @click="lookImg(item)"></div>-->
<!--              </div>-->
<!--            </li>-->
<!--          </ul>-->
<!--        </div>-->
        <div class="image-grid"  id="box" ref="dragElement">
          <div v-for="(item,index) in imglist" :ref="`imgLi_${item.id}`" :key="index" attrtype="image" :itemid="item.id" v-contextmenu:contextmenu class="image-item">
            <img class="image"
                 :id="'myimg_'+index" :alt="item.src"
                 v-lazy="Number(item.sizes)>52428800?bigImg:item.src+''"
                 loading="lazy"
                 :src="Number(item.sizes)>52428800?bigImg:item.src+''"
                 :key="item.src"
                 :ref="`myImages_${item.id}`"
                 @click="setImgIndex(index)"
            />
            <div v-if="item.violation!=null" class="imgMask" @click="setImgIndex(index)"></div>
            <svg  @click="selectImgs(item)" t="1664620013040" class="icon myselect" :style="{'background':select.selectIndex.indexOf(item.id)>-1?'#FFF':'#a5a5a5'}" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6479" width="200" height="200"><path d="M771.607273 359.726545l-289.28 349.09091a34.839273 34.839273 0 0 1-50.594909 3.374545l-176.174546-162.909091a34.955636 34.955636 0 0 1-1.931636-49.361454 34.978909 34.978909 0 0 1 49.338182-1.931637l149.131636 137.890909 265.728-320.698182a34.932364 34.932364 0 0 1 53.783273 44.544M884.363636 46.545455H139.636364C88.436364 46.545455 46.545455 88.436364 46.545455 139.636364v744.727272c0 51.2 41.890909 93.090909 93.090909 93.090909h744.727272c51.2 0 93.090909-41.890909 93.090909-93.090909V139.636364c0-51.2-41.890909-93.090909-93.090909-93.090909" :fill="select.selectIndex.indexOf(item.id)>-1?'#1580ff':'#FFF'" p-id="6480"></path></svg>

          </div>
        </div>

        <div style="width: 100%;text-align: center;color: #797b7f;" v-show="noImgMsg">
          <Icon type="ios-filing" size="56"/>
          <p>当前未找到任何图像</p>
        </div>

      <div class="example-code-more">
        <Button type="dashed" :loading="nextButloading" @click="selectPhoto" :disabled="btntext=='所有数据加载完毕'"
                long>
          {{ btntext }}
        </Button>
      </div>
    </Content>

    <CoolLightBox
        :items="imglist"
        :index="imgIndex"
        loop
        @close="imgIndex = null">
    </CoolLightBox>

    <!--详细信息-->
    <Modal v-model="isimginfo" :footer-hide="true">

      <List :split="false">
        <!--    @click="updateFileName"    text-decoration:underline;  -->
        <ListItem><span style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;"><Icon
            style="font-size: 32px;" type="md-image"/>&nbsp;&nbsp;&nbsp;<span style="font-size: 18px;cursor: pointer;">{{
            rightClickData == null ? '暂缺数据' : rightClickData.idname
          }}</span></span>
        </ListItem>
      </List>

      <Tabs>
        <TabPane label="图像信息" icon="ios-images">

          <div style="line-height: 32px;margin-bottom: 40px;">
            <p><span class="infotitle"> 文件大小：</span><span
                style="font-size: 14px;">{{
                rightClickData == null ? '暂缺数据' : rightClickData.sizes > 0 ? this.formatBytes(rightClickData.sizes, 2) : ''
              }}</span>
            </p>
            <p><span class="infotitle"> 文件类型：</span><span
                style="font-size: 14px;">{{ rightClickData == null ? '未知' : rightClickData.format }}</span></p>
            <p><span class="infotitle"> 来源IP：</span><span
                style="font-size: 14px;">{{ rightClickData == null ? '暂缺数据' : rightClickData.abnormal }}</span></p>
            <p><span class="infotitle"> 上传日期：</span><span
                style="font-size: 14px;">{{
                rightClickData == null ? '暂缺数据' : rightClickData.updatetime ? rightClickData.updatetime : ''
              }}</span>
            </p>
            <p><span class="infotitle"> 上传者：</span><span style="font-size: 14px;">{{ upName }}</span></p>
            <p><span class="infotitle"> 所属存储源：</span><span style="font-size: 14px;">{{ bucketname }}</span></p>
            <p><span class="infotitle|"> 存储性质：</span><span
                style="font-size: 14px;">{{
                rightClickData == null ? '暂缺数据' : (rightClickData.imgtype == 0 ? '持久' : '暂存')
              }}</span>
            </p>
          </div>
          <p style="color: rgb(228 102 70);font-size: 12px; font-weight: 200;position: absolute; bottom: 10px; display: block; left: 0; width: 100%;z-index: 1;"
             align="center" v-show="isViolation.isControl">{{ isViolation.info }}</p>
          <div class="QRCodestyle">
            <vue-qr
                :text="rightClickData?rightClickData.imgurl?rightClickData.imgurl:'未获取到文件信息':'未获取到文件信息'"
                :size="160"></vue-qr>
          </div>
        </TabPane>
      </Tabs>
    </Modal>

    <!-- 生成画廊 -->
    <Modal v-model="visible" :footer-hide="true" width="620" :styles="{top: '20px'}">
      <Tabs>
        <TabPane label="画廊" icon="ios-images">
          <Spin size="large" fix v-if="spinShow"></Spin>
          <album-list :albumlist="albumlist" @return-data='returnData'/>
        </TabPane>
      </Tabs>
    </Modal>
    <!--            画廊生成后显示详情界面-->
    <Modal v-model="isAlbum" :footer-hide="true" :title="albumData.title">
      <Form @submit.native.prevent :label-width="70" style="margin-top: 30px;height: 303px;">
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
      <div class="QRCodestyle2" style="text-align: center;">
        <vue-qr :text="albumData.url?albumData.url:'无法获取图像地址'" :size="200"></vue-qr>
      </div>
      <div style="text-align: center;">
        <p>对方通过扫码即可访问画廊</p>
      </div>
    </Modal>
    <Modal
        v-model="delPrompt"
        @on-ok="asyncOK"
        :loading="delLoading"
        width="400">
      <p>确定删除所选图像吗？</p>
      <br />
      <p>
        <Checkbox v-model="forceDel"><span style="color: indianred">强制删除</span></Checkbox>
        <Tooltip max-width="200" content="图片源无论是否删除成功，也要删除该图像的记录（适用于存储源失效等意外情况导致记录删不掉）">
          <Icon type="md-help-circle" style="cursor: pointer;" size="18" color="#6e6e6e" />
        </Tooltip>
      </p>
    </Modal>
    <!-- 删除失败的图像 -->
    <Modal v-model="isDelImgModal" :footer-hide="true" title="存在删除失败的图像，请检查">
      <Form @submit.native.prevent :label-width="70"
            style="margin-top: 10px;height: 350px;min-height: 150px;overflow-y:auto; ">
        <List header="Header" footer="Footer" border size="small"
              v-for="(item,index) in delProgress.errorlist?delProgress.errorlist:[]" :key="index">
          <ListItem>{{ item }}</ListItem>
        </List>
      </Form>
    </Modal>

    <Modal v-model="copyAllImgUrl.isCopyMsg" :footer-hide="true">
      <br/>
      <Card :dis-hover="true" :bordered="false" :shadow="false">
        <Divider><span style=" color: #5a5a5a;">一键复制格式</span></Divider>
        <Button type="success" class="cobyOrderSn_url" data-clipboard-action="copy"
                :data-clipboard-text="copyAllImgUrl.urlTexts_url" @click="copyAll('url')" long>图像链接格式
        </Button>
        <br><br>
        <Button type="primary" class="cobyOrderSn_html" data-clipboard-action="copy"
                :data-clipboard-text="copyAllImgUrl.urlTexts_html" @click="copyAll('html')" long>HTML格式
        </Button>
        <br><br>
        <Button type="warning" class="cobyOrderSn_md" data-clipboard-action="copy"
                :data-clipboard-text="copyAllImgUrl.urlTexts_md" @click="copyAll('md')" long>Markdown格式
        </Button>
        <br><br>
        <Button type="error" class="cobyOrderSn_diy" data-clipboard-action="copy"
                :data-clipboard-text="copyAllImgUrl.urlTexts_diy" @click="copyAll('diy')" long>自定义格式
        </Button>
        <br><br>
        <Input v-model="copyAllImgUrl.myurl" placeholder="请输入要复制的链接格式" :clearable="true"/>
        <p style="color: #6b6b6b;font-size: 12px;">格式说明：<br/>在输入框填入你想生成并复制的链接格式，格式中的图片链接用<b
            style="color: #eb3e21;">
          @myurl@ </b> 通配符填充</p>
      </Card>
    </Modal>

    <Spin class="loadSpin" v-if="isDelfun" fix style="color: #5F5F5FFF;">
      <svg viewBox="25 25 50 50">
        <circle cx="50" cy="50" r="20"></circle>
      </svg>
      <div style="font-size: 16px;letter-spacing: 2px;">
        {{ delProgress.succ ? delProgress.succ : 0 }}/{{ delImgCount }}
      </div>
    </Spin>
    <Footer class="layout-footer-center">{{ this.$store.state.metaInfo.webname }} &copy; Control Panel</Footer>
  </Layout>


</template>

<script src="../../assets/js/photo.js">

</script>
<style lang="less">
.chosen {
  .countTag {
    display: block;
  }
}

</style>
<style scoped>
.topCeng svg {
  width: 8.75em;
}

.loadSpin svg {
  width: 3.75em;
  transform-origin: center;
  animation: rotate 2s linear infinite;
}
</style>
<style>
/*违规图像遮罩*/
.imgMask{
  height: 100%;
  width: 100%;
  position: absolute;
  border-radius: 5px;
  backdrop-filter: blur(6px);
  background-image: url("../../assets/img/notlook.png");
  background-repeat: no-repeat;
  background-size: 28%;
  background-position: center;
  top: 0;
  left: 0;
  cursor: pointer;
}
circle {
  fill: none;
  stroke: #2f72fc;
  stroke-width: 4;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -35px;
  }
  100% {
    stroke-dashoffset: -125px;
  }
}

/*图像列表样式开始*/
.image-grid {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  grid-gap: 10px; /* 设置图片之间的间距 */
}
.folder-grid{
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  grid-gap: 15px; /* 设置图片之间的间距 */
}
.image-item {
  position: relative;
  height: 200px;
  overflow: hidden; /* 确保图片不会溢出其容器 */
  border-radius: 4px;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 确保图片不会拉伸，并且填充整个容器 */
  cursor: pointer;
}

/*#box {
  margin-top: 28px;
}

#box ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  !*position: absolute;*!
  !*top: 220px;*!
}*/

/*#box li {
  !*padding: 3px;*!
  list-style: none;
  margin: 10px;
  position: relative;
  !*border: 1px solid #eee;*!
}*/

/*#box img {
  cursor: pointer;
  height: 145px;
  !*height: 115px;*!
  object-fit: cover;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 10px 0px;
  transform: translateZ(0);
  transition: all 0.6s ease-in;
  -webkit-transition: all 0.6s ease-in;
}*/

/*图像列表样式  结束*/
/*.countTag{*/
/*  display: none;*/
/*  min-width: 30px;*/
/*  height: 30px;*/
/*  background: rgb(63 63 63);*/
/*  position: absolute;*/
/*  top: -10px;*/
/*  right: -10px;*/
/*  z-index: 1;*/
/*  box-shadow: 0 1px 6px rgba(255, 255, 255 ,.2);*/
/*  color: #e3e1e1;*/
/*  border-radius: 15px;*/
/*  padding: 0 10px;*/
/*  line-height: 29px;*/
/*  font-size: 12px;*/
/*}*/
.formatTag {
  display: none;
  width: fit-content;
  height: 20px;
  background: rgba(38, 38, 38, .72);
  position: absolute;
  top: 5px;
  left: 5px;
  z-index: 1;
  box-shadow: 0 1px 6px rgba(255, 255, 255, .2);
  color: #e3e1e1;
  border-radius: 3px;
  padding: 0 10px;
  line-height: 17px;
  overflow: hidden;
  white-space: nowrap;
  max-width: 80%;
  text-overflow: ellipsis;
}

.myselect {
  width: 1.8em;
  height: 1.8em;
  box-shadow: 0 1px 6px rgba(58, 58, 58, .2);
  border-radius: 4px;
  position: absolute;
  top: 6px;
  left: 6px;
  z-index: 1;
  color: #e3e1e1;
  line-height: 17px;
  cursor: pointer;
  background: #ababab;
}

.topCeng {
  width: 100%;
  height: 145px;
  position: absolute;
  bottom: 5px;
  left: 0;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0);
  animation: fade 800ms infinite;
}

.example-code-more {
  text-align: center;
  cursor: pointer;
  padding: 30px 0;
  font-size: 16px;
  line-height: 30px;
  font-weight: bold;
}

.imgdivstyle {
  height: 160px;
  margin-top: 10px;
  text-align: center;
  margin-right: 2px;
}

.imgstyle-max {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 5px;
  border: 1px solid #eee;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 10px 0px;
  transform: translateZ(0);
}

.icostyle {
  margin: 0 3px 0 3px;
  font-size: 22px;
  line-height: 28px;
  transition: transform 0.2s;
}

.img-search {
  position: absolute;
  width: 100%;
  min-width: 512px;
  height: 15px;
  z-index: 1;
}

.img-search-div {
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

.infotitle {
  color: #464c5b;
  font-size: 14px;
  font-weight: 500;
  margin-right: 10px;
}

.QRCodestyle {
  height: 160px;
  width: 160px;
  position: absolute;
  right: 5px;
  bottom: 20px;
  opacity: 0.7;
}

.QRCodestyle2 {
  height: 200px;
  width: 200px;
  position: absolute;
  right: 0;
  left: 0;
  opacity: 0.7;
  margin: auto;
  bottom: 47px;
}

.ivu-radio-wrapper {
  width: 50%;
  text-align: center;
}

</style>
