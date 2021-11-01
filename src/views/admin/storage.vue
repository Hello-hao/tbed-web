<template>
  <Layout style="margin-top: 50px;">
      <Content :style="{margin: '15px 20px 0'}">
        <Row :gutter="16" >
          <Col flex="1" v-for="(sto,index) in storageList" :key="index">
            <Card :bordered="true" :shadow="true" style="margin-top: 10px;min-width: 300px;">
              <p slot="title" style="display: inline-block;height: 25px;"><img style="max-width: 85px;" :src="require('../../assets/img/icons/'+(sto.storageType).toString()+'.png')" /> <Tooltip :content="(takeEffect(sto.id) || sto.storageType==5)?'当前状态:可用':'当前状态:不可用'" theme="light" style="float: right;"> <Icon type="md-radio-button-off" size="20" color="#499c54" v-if="(takeEffect(sto.id) || sto.storageType==5)" /> <Icon type="md-power" size="20" color="#c75450" v-else /> </Tooltip></p>
              <div class="stostyle">
                <p >{{sto.keyname}}</p>
                <p style="position: absolute; bottom: 33px;"><span>已用空间：</span><span style="font-weight: bold;color: #464c5b;">
                  {{usedCapacity(sto.id)}}
                </span></p>
                <ButtonGroup size="small" shape="circle" class="cardSty">
                  <Button type="primary" @click="getStorageById(sto.id)">
                    <Tooltip content="编辑"  theme="light" style="float: right;">
                    <Icon type="md-build" />
                    </Tooltip>
                  </Button>
                </ButtonGroup>
              </div>
            </Card>
          </Col>
        </Row>
      </Content>


    <!--筛选窗-->
    <Modal  v-model="storageWindow" :footer-hide="true">
      <br />
      <Form  @submit.native.prevent  >

        <FormItem>
          <Select :disabled="this.viewType=='edit'"  v-model="bucketType" filterable placeholder="存储源" size="large" @on-change="selectStorageType">
            <Option v-for="item in bucketArr" :value="item.storageType" :key="item.storageType">{{ item.storageName }}</Option>
          </Select>
        </FormItem >
        <div v-if="bucketType!=null">
          <!--  //网易  阿里云-->
          <div v-if="(bucketType==1 || bucketType==2 )">
            <FormItem >
              <Input v-model="addAccessKey" prefix="ios-create" placeholder="AccessKey" size="large" style="width: 100%" />
            </FormItem>
            <FormItem >
              <Input  v-model="addAccessSecret" prefix="ios-create" placeholder="AccessSecret" size="large" style="width: 100%" />
            </FormItem>
            <FormItem>
              <Tooltip content="需带有http://或https:// 结尾不需要带/" max-width="200" theme="light" style="width: 100%">
                <Input  v-model="addEndpoint" prefix="ios-create" placeholder="Endpoint(外网)" size="large" style="width: 100%" />
              </Tooltip>
            </FormItem>
            <FormItem >
              <Input v-model="addBucketname" prefix="ios-create" placeholder="桶名称" size="large" style="width: 100%" />
            </FormItem>
          </div>
          <!--  腾讯 -->
          <div v-if="(bucketType==6)">
            <FormItem >
              <Input v-model="addAccessKey" prefix="ios-create" placeholder="SecretId" size="large" style="width: 100%" />
            </FormItem>
            <FormItem >
              <Input v-model="addAccessSecret" prefix="ios-create" placeholder="SecretKey" size="large" style="width: 100%" />
            </FormItem>
            <FormItem>
              <Tooltip content="如：北京地区就写ap-beijing" theme="light" style="width: 100%">
                <Input v-model="addEndpoint" prefix="ios-create" placeholder="地区代码" size="large" style="width: 100%" />
              </Tooltip>
            </FormItem>
            <FormItem >
              <Input v-model="addBucketname" prefix="ios-create" placeholder="桶名称" size="large" style="width: 100%" />
            </FormItem>
          </div>
          <!--  又拍 Ufile -->
          <div v-if="(bucketType==3 || bucketType==8)">
            <FormItem >
              <Input v-model="addAccessKey" prefix="ios-create" placeholder="操作员" size="large" style="width: 100%" />
            </FormItem>
            <FormItem >
              <Input v-model="addAccessSecret" prefix="ios-create" placeholder="操作员密码" size="large" style="width: 100%" />
            </FormItem>
            <FormItem >
              <Input v-model="addBucketname" prefix="ios-create" placeholder="桶名称" size="large" style="width: 100%" />
            </FormItem>
          </div>
          <!--七牛云 -->
          <div v-if="(bucketType==4)">
            <FormItem >
              <Input v-model="addAccessKey" prefix="ios-create" placeholder="AccessKey" size="large" style="width: 100%" />
            </FormItem>
            <FormItem >
              <Input v-model="addAccessSecret" prefix="ios-create" placeholder="SecretKey" size="large" style="width: 100%" />
            </FormItem>
            <FormItem>
              <Select v-model="addEndpoint" placeholder="桶地区" size="large">
                <Option value="1" key="1">华东</Option>
                <Option value="2" key="2">华北</Option>
                <Option value="3" key="3">华南</Option>
                <Option value="4" key="4">北美</Option>
                <Option value="5" key="5">东南亚</Option>
              </Select>
            </FormItem>
            <FormItem >
              <Input v-model="addBucketname" prefix="ios-create" placeholder="桶名称" size="large" style="width: 100%" />
            </FormItem>
          </div>
          <!--  FTP -->
          <div v-if="(bucketType==7)">
            <FormItem >
              <Input v-model="addAccessKey" prefix="ios-create" placeholder="FTP账号" size="large" style="width: 100%" />
            </FormItem>
            <FormItem >
              <Input v-model="addAccessSecret" prefix="ios-create" placeholder="FTP密码" size="large" style="width: 100%" />
            </FormItem>
            <FormItem>
              <Tooltip max-width="300" theme="light" style="width: 100%">
                <Input v-model="addEndpoint" prefix="ios-create" placeholder="FTP地址" size="large" style="width: 100%" />
                <div slot="content">
                  <p>按格式填写如：127.0.0.1:21不需要添加ftp:// 推荐使用21默认端口</p>
                  <p>修改过得端口先用xftp等客户端工具测试一下能不能链接</p>
                </div>
              </Tooltip>
            </FormItem>
          </div>
          <!-- 更多 Minio-->


          <FormItem >
            <Tooltip content="需带有http://或https:// 结尾不需要带/" max-width="200" theme="light" style="width: 100%">
              <Input v-model="addRequestAddress" prefix="ios-create" placeholder="请求域名" size="large" style="width: 100%" />
            </Tooltip>
          </FormItem>
          <FormItem >
            <Input prefix="ios-create" v-model="addkeyname" placeholder="策略名称" size="large" style="width: 100%" />
          </FormItem>
        </div>
        <div v-else style="min-height: 130px;text-align: center;color: #9ea7b4;line-height: 35px;">
          <p> Hellohao图像托管</p>
          <p>为获取到正确存储源</p>
        </div>
        <FormItem>
          <Button type="primary" icon="md-done-all" long shape="circle" @click="save">保 存</Button>
        </FormItem>
      </Form>
    </Modal>

    <Footer class="layout-footer-center" >{{this.$store.state.metaInfo.webname}} &copy; Control Panel</Footer>
    </Layout>


</template>
<script src="../../assets/js/storage.js">

</script>
<style scoped>
.stostyle{
  height: 80px;
  width: 80px;
  min-width: 180px;
  font-size: 14px;

}
.cardSty{
  position: absolute;
  bottom: 10px;
  right: 10px;
}
.ivu-card-head {
  border-bottom: 0px solid #e8eaec;
}

</style>
