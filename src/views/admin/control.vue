<style>
.badge-alone{
  background: #30c479 !important;
}
</style>
<style scoped>

.ivu-card-body {
  padding: 0px;
}
.layout-footer-center{
  text-align: center;
}
.cardstyle{
  height: 100px;
  width: 80px;
  min-width: 80px;
  font-size: 35px;
  padding: 15px;
  width: 100%;
}
.icosty{
  float: right;
  margin-top: 11px;
  margin-right: 20px;
}
.badge-alone{
  background: #b37feb !important;
}
.demo-badge-alone-user{
  background: #2d8cf0 !important;
}
.myico{
  font-size: 38px;
}
.mydiv{
  text-align:center;
  height: 100px;
  padding: 15px;
  font-weight: bold;
}

.ivu-layout {
  background:#f8f8f8;
}

.ivu-modal-footer {
  border-top: 0px;
}
.ivu-modal-header {
  border-bottom: 0px;
}
.ivu-avatar {
  width: 42px;
  height: 42px;
  border-radius: 5px;
  box-shadow: 0 0 0px #c1c1c1;
}
.cardShadow{
  border-radius: 10px;
  /*box-shadow: 3px 3px 5px #e5e5e5, -3px -3px 5px #e5e5e5;*/
  /*box-shadow:0 3px 6px 0 rgba(67,67,67,.25);*/
  margin-top: 10px;
}
</style>

<!--
仪表盘显示内容：
管理员：图片总数  用户总数  非法图片  游客容量
个人 ： 我的图片数  我的画廊  全景图总数  我的容量  更多（token）


图：
管理员：本站本年每月展示总数  用户上传排名
用户 个人本年每月总数
个人 token



-->
<template>

  <Layout style="margin-top: 50px;">
    <Spin size="large" fix v-if="spinShow"></Spin>
      <Content :style="{margin: '15px 20px 0', minHeight: '500px'}">
        <Row :gutter="16" v-if="this.$store.state.RoleLevel=='admin' " class="animate__animated animate__fadeIn animate__delay-0.6s">
          <Col :xs="24" :sm="12" :md="12" :lg="6">
            <Card :shadow="true"  class="cardShadow">
              <p slot="title">图片总数 <Tooltip content="昨日新增图像"  theme="light" style="float: right;"><Badge :count="0" class-name="badge-alone"></Badge></Tooltip></p>
              <div class="cardstyle">
                <count-to :startVal='0' :endVal='imgTotal' :duration=3000></count-to>
                <Icon type="md-images" class="icosty" />
              </div>
            </Card>
          </Col>
          <Col :xs="24" :sm="12" :md="12" :lg="6">
            <Card :shadow="true"   class="cardShadow">
              <p slot="title">用户总数<Tooltip content="昨日新增用户" theme="light" style="float: right;"><Badge :count="0"  class-name="badge-alone"></Badge></Tooltip></p>
              <div class="cardstyle">
                <count-to :startVal='0' :endVal='userTotal' :duration=3000></count-to>
                <Icon type="ios-people" class="icosty" />
              </div>
            </Card>
          </Col>
          <Col :xs="24" :sm="12" :md="12" :lg="6">
            <Card :shadow="true"   class="cardShadow">
              <p slot="title">违规图片<Tooltip :content="ViolationSwitch>0?ViolationSwitch==1?'百度审核:开':'ModerateContent:开':'图像审核:关'" theme="light" style="float: right;"> <Icon type="md-radio-button-off" size="20" color="#499c54" v-show="ViolationSwitch>0" /> <Icon type="md-power" size="20" color="#c75450" v-show="ViolationSwitch==0" /> </Tooltip></p>
              <div class="cardstyle">
                <count-to :startVal='0' :endVal='ViolationImgTotal' :duration=3000></count-to>
                <Icon type="md-eye-off" class="icosty"/>
              </div>
            </Card>
          </Col>
          <Col :xs="24" :sm="12" :md="12" :lg="6">
            <Card  :shadow="true" class="cardShadow">
              <p slot="title">访客容量<Tooltip :content="VisitorUpload==0?'访客上传:关':'访客总容量'" theme="light" style="position: absolute; right: 20px;"><Badge :text="VisitorMemory"  class-name="badge-alone"></Badge></Tooltip></p>
              <div class="cardstyle" style="text-align: center;">
                <i-circle :percent="VisitorProportion" :size="80" stroke-color="#ff9c6e" :stroke-width="9" :trail-width="9">
                  <p style="font-size:14px">{{VisitorProportion}}%</p>
                </i-circle>
              </div>
            </Card>
          </Col>
        </Row>
        <Row class="animate__animated animate__fadeIn animate__delay-0.8s">
          <Col flex="1" style="padding: 8px;">
              <Card class="cardShadow" style="margin-top: 10px;padding-left: 8px; padding-right: 8px;">
                <div class="mydiv">
                  <p><Icon type="md-photos" style="color: #69c0ff;"  class="myico"/></p>
                  <p style="font-size: 18px;line-height: 32px;">
                    <Tooltip content="我的上传数" theme="light" placement="right-start">
                    <count-to :startVal='0' :endVal='myImgTotal' :duration=3000></count-to>
                    </Tooltip>
                  </p>
                </div>
              </Card>
          </Col>
          <Col flex="1" style="padding: 8px;">
            <Card class="cardShadow"  style="margin-top: 10px;padding-left: 8px; padding-right: 8px;">
              <div class="mydiv">
                <p><Icon type="ios-color-palette" style="color: #ff9c6e;"  class="myico"/></p>
                <p style="font-size: 18px;line-height: 32px;display: inline-block;">
                  <Tooltip content="我的画廊数" theme="light" placement="right-start">
                  <count-to :startVal='0' :endVal='myAlbumTitle' :duration=3000></count-to>
                  </Tooltip>
                </p>
              </div>
            </Card>
          </Col>
          <Col flex="1" style="padding: 8px;">
            <Card class="cardShadow" style="margin-top: 10px; padding-left: 8px; padding-right: 8px;">
              <div class="mydiv" style="padding: 6px 15px;">
                <Tooltip content="我的容量" theme="light" placement="right-start" >
                <i-circle :percent="myMemory" dashboard :size="70" stroke-color="#30c479" :stroke-width="9" :trail-width="9">
                  <p style="font-size:14px">{{myMemory}}%</p>
                  <p @click="ShowSpaceExpansion" style="font-size: smaller;color: #32a0e9; cursor:pointer; line-height: 23px;font-weight: 300;"><u>扩容</u></p>
                </i-circle>
                <p style="font-size: 14px;line-height: 16px;">{{myMemorySum}}</p>
                </Tooltip>
              </div>
            </Card>
          </Col>
          <Col flex="1" style="padding: 8px;">
            <Card class="cardShadow" style="margin-top: 10px;">
              <div class="mydiv" style="cursor:pointer;" @click="showToken">
                <p><Icon type="md-happy" style="color: #5cdbd3;" class="myico"/></p>
                <p style="font-size: 16px;line-height: 32px; cursor:pointer;">{{helloText}}{{$store.state.userName}}</p>
              </div>
            </Card>
          </Col>
        </Row>

        <Row :gutter="16" class="animate__animated animate__fadeIn animate__delay-1.5s cardShadow">

          <Col flex="1" >
            <Card :bordered="true" :shadow="true">

              <Row :gutter="16">
                <Col :xs="24" :sm="12" :md="16" :lg="18">
                  <div id="fdiv" style="width: 100%;">
                    <div style="position: absolute;z-index: 1;">
                      <p slot="title">
                        <Dropdown style="margin-left:15px;border-radius: 50%;" trigger="click" v-if="this.$store.state.RoleLevel=='admin' && ok=='true'">
                          <Button size="small" >
                            {{this.viewName}}&nbsp;&nbsp;
                            <Icon type="ios-arrow-down"></Icon>
                          </Button>
                          <DropdownMenu slot="list">
                            <DropdownItem @click.native="viewType(1)"><Icon type="ios-podium-outline" /> 个人</DropdownItem>
                            <DropdownItem @click.native="viewType(2)"><Icon type="ios-podium" /> 全站</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                        <Select v-model="yyyy"  placeholder="年份" size="small" style="width: 80px;margin-left:15px;" @on-change="viewTime">
                          <Option v-for="(item,index) in yyyylist" :value="item" :key="index">{{ item }}</Option>
                        </Select>
                      </p>
                    </div>
                    <div id="container"  style="width:100%;height:400px;" ></div>
                  </div>

                </Col>
                <Col :xs="24" :sm="12" :md="8" :lg="6">
                    <div class="cardstyle" style="height: 350px;width: 100%;padding: 6px;">
                        <Tabs size="small" >
                          <TabPane label="最近上传" icon="md-clock">
                            <div style="height: 290px;width: 100%;padding: 8px;overflow: auto">
                              <List>
                                <ListItem v-for="(img,index) in Recently.RecentlyUploaded" :key="index">
                                  <ListItemMeta :avatar="img.imgurl" :title="img.updatetime"  />
                                </ListItem>
                              </List>
                            </div>
                          </TabPane>
                          <TabPane label="用户榜单" icon="md-flame" v-if="this.$store.state.RoleLevel=='admin' && ok=='true'">
                            <div style="height: 290px;width: 100%;padding: 8px;overflow: auto">
                              <List>
                                <ListItem  v-for="(user,index) in Recently.RecentlyUser" :key="index">
                                  <div v-if="index==0">
                                    <ListItemMeta  :avatar="top1" :title="user.username" :description="'累计上传 '+user.counts+' 张图像'" />
                                  </div>
                                  <div v-else-if="index==1">
                                    <ListItemMeta :avatar="top2" :title="user.username" :description="'累计上传 '+user.counts+' 张图像'" />
                                  </div>
                                  <div v-else-if="index==2">
                                    <ListItemMeta :avatar="top3" :title="user.username" :description="'累计上传 '+user.counts+' 张图像'" />
                                  </div>
                                  <div v-else>
                                    <ListItemMeta :avatar="usertop" :title="user.username" :description="'累计上传 '+user.counts+' 张图像'" />
                                  </div>
                                </ListItem>
                              </List>
                            </div>
                          </TabPane>
                        </Tabs>
                    </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Content>
      <Footer class="layout-footer-center" >{{this.$store.state.metaInfo.webname}} &copy; Control Panel</Footer>
      <Modal
          v-model="SpaceMSG"
          title="我的空间扩容"
          :loading="isloading"
          @on-ok="SpaceExpansion">
        <p style="text-align: center;"><Input v-model="SpaceCode" size="large" prefix="md-pint" placeholder="请输入你的扩容码" style="width: 88%" /></p>
      </Modal>
    </Layout>

</template>
<script>
import {request} from "../../network/request";
import countTo from 'vue-count-to';
// 引入 ECharts 主模块
import * as echarts from 'echarts';
export default {
  name:'control',
  components: {
    countTo,
  },

  data() {
    return {
      helloText:'Hi',
      spinShow:true,
      top1:require("../../assets/img/NO.1.png"),
      top2:require("../../assets/img/NO.2.png"),
      top3:require("../../assets/img/NO.3.png"),
      usertop:require("../../assets/img/usertop.png"),
      ok:'false',
      imgTotal:0,
      userTotal:0,
      ViolationImgTotal:0,
      myImgTotal:0,
      myAlbumTitle:0,
      // myView360Title:0,
      ViolationSwitch:0,
      VisitorProportion:0,
      myMemory:0,
      myMemorySum:0,
      VisitorMemory:"0",
      VisitorUpload:null,
      chartType:1,
      viewName:'个 人',
      yyyy:new Date().getFullYear().toString(),
      yyyylist:[],
      SpaceCode:null,
      SpaceMSG:false,//控制窗口的显示变量
      isloading:true,
      chart:null,
      Recently:{
        RecentlyUser:[],
        RecentlyUploaded:[]
      },
      temp:4,
      //echart相关
      echartsData:{
        tooltip: {},
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [],
            type: 'bar'
          }
        ]
      },
      myChartw:0,
      myCharth:0,
      myChart:null

    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        //获取高度
        this.myCharth = document.getElementById('container').clientHeight;
        //获取宽度
        this.myChartw = document.getElementById('container').clientWidth;
        this.myChart.resize({
          width: this.myChartw,
          height: this.myCharth
        });
      })()
    }

    var now = new Date();
    var hour = now.getHours();
    if(hour < 6) {
      this.helloText="早上好！";
    }else if(hour < 9) {
      this.helloText="早上好！";
    }else if(hour < 12) {
      this.helloText="上午好！";
    }else if(hour < 14) {
      this.helloText="中午好！";
    }else if(hour < 17) {
      this.helloText="下午好！";
    }else if(hour < 19) {
      this.helloText="傍晚好！";
    }else if (hour < 22) {
      this.helloText="晚上好！";
    }else{
      this.helloText="夜里好！";
    }
    this.getDatas();
    this.getRecently();
    this.getYyyy();

  },
  methods: {
    initChart(){
      this.myCharth = document.getElementById('container').clientHeight;
      //获取宽度
      this.myChartw = document.getElementById('container').clientWidth;
      // 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(document.getElementById('container'))
      this.myChart.resize({
        width: this.myChartw,
        height: this.myCharth
      });
      this.getChart();
    },
    getDatas(){
      request(
          "/admin/overviewData",
          {}).then(res => {
        if(res.status==200){
          this.temp--;
          if(this.temp<=0){
            this.spinShow=false;
          }
          var json = res.data.data;
          if(res.data.code=='200'){
            this.ok=json.ok;
            this.imgTotal=json.imgTotal?json.imgTotal:0;
            this.userTotal=json.userTotal?json.userTotal:0;
            this.ViolationImgTotal=json.ViolationImgTotal?json.ViolationImgTotal:0;
            this.myImgTotal=json.myImgTotal?json.myImgTotal:0;
            this.myAlbumTitle=json.myAlbumTitle?json.myAlbumTitle:0;
            this.ViolationSwitch=json.ViolationSwitch?json.ViolationSwitch:0;
            this.VisitorProportion = json.VisitorProportion?json.VisitorProportion:0;
            this.VisitorMemory = json.VisitorMemory?json.VisitorMemory:0;
            this.VisitorUpload = json.VisitorUpload;
            this.myMemory = json.myMemory?json.myMemory:0;
            this.myMemorySum = json.myMemorySum;
          }else{
            this.$Message.error("获取数据失败，请稍后再试");
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

    getChart(){
      var param={
        type:this.chartType,
        yyyy:this.yyyy
      }
      request(
          "/admin/getChart",
          param).then(res => {
        if(res.status==200){
          this.temp--;
          if(this.temp<=0){
            this.spinShow=false;
          }
          var json = res.data.data;
          if(res.data.code=='200'){
            var xarr = [];
            var dataarr = [];
            for (let i = 0; i < json.length; i++) {
              xarr.push(json[i].monthNum);
              dataarr.push(json[i].countNum);
            }
            this.echartsData.xAxis.data=xarr;
            this.echartsData.series[0].data=dataarr;
            this.myChart.setOption(this.echartsData);

          }else{
            this.$Message.error("获取数据失败，请稍后再试");
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

    ShowSpaceExpansion(){
     this.SpaceMSG = true;
    },
    SpaceExpansion(){
      if(!this.SpaceCode){
        this.$Notice.warning({
          title: '扩容码不能为空',
          // desc: '您的空间已成功扩容500Mb'
        });
        this.isloading = false;
        return false;
      }
      var params ={
        code:this.SpaceCode
      };
      request(
          "/admin/SpaceExpansion",
          params).then(res => {
        if(res.status==200) {
          var json = res.data;
          this.isloading = false;
          if (res.data.code == '200') {
            this.$Notice.success({
              title: '扩容成功',
              desc: json.info
            });
            this.getDatas();
          } else {
            this.$Notice.error({
              title:json.info
            });
          }
        }else{
          this.$Message.error('服务器请求错误');
        }
      }).catch(err => {
        // this.$Spin.hide();
        console.log(err);
        this.$Message.error('服务器请求错误');
      })

    },

    getYyyy(){
      request(
          "/admin/getYyyy",
          {}).then(res => {
        if(res.status==200){
          this.temp--;
          if(this.temp<=0){
            this.spinShow=false;
          }
          var json = res.data.data;
          if(res.data.code=='200'){
            if(this.$store.state.RoleLevel =="admin"){
              this.yyyylist = json.allYyyy;
            }else{
              this.yyyylist = json.userYyyy;
            }
          }else{
            this.$Message.error("获取数据失败，请稍后再试");
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
    viewType(type){
      this.chartType = type;
      if(type==1){
        this.viewName = '个 人';
      }else{
        this.viewName = '全 站';
      }
      this.getChart();
    },
    viewTime(yyyy){
      this.yyyy = yyyy;
      this.getChart();
    },
    showToken(){
      console.log("Hellohao!")
    },

    getRecently(){
      request(
          "/admin/getRecently",
          {}).then(res => {
            if(res.status==200){
              this.temp--;
              if(this.temp<=0){
                this.spinShow=false;
              }
              var json = res.data.data;
              if(res.data.code=='200'){
                this.Recently.RecentlyUser = json.RecentlyUser?json.RecentlyUser:[];
                this.Recently.RecentlyUploaded = json.RecentlyUploaded?json.RecentlyUploaded:[];
              }else{
                this.$Message.error("获取数据失败，请稍后再试");
              }
              this.initChart();
            }else{
              this.$Message.error("请求时出现错误");
            }
      }).catch(err => {
        console.log(err);
        this.$Message.error('服务器请求getRecently错误');
      })
    }


  }
  // components: {
  //   'countTo':,
  //    },
}
</script>
