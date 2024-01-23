<template>
  <Layout style="margin-bottom: 50px;">
    <Content :style="{margin: '15px 20px 0'}">
      <Row :gutter="16">
        <Col flex="1" v-for="(sto,index) in storageList" :key="index">
          <Card :bordered="true" :shadow="true" style="margin-top: 10px;width: 100%;">
            <!--              <p slot="title" style="display: inline-block;height: 25px;"><img style="max-width: 85px;" :src="require('../../assets/img/icons/'+(sto.storageType).toString()+'.png')" /> <Tooltip :content="(takeEffect(sto.id) || sto.storageType==5)?'当前状态:可用':'当前状态:不可用'" theme="light" style="float: right;"> <Icon type="md-radio-button-off" size="20" color="#499c54" v-if="(takeEffect(sto.id) || sto.storageType==5)" /> <Icon type="md-power" size="20" color="#c75450" v-else /> </Tooltip></p>-->
            <div style="text-align: center;">
              <img style="width: 80px;" :src="require('../../assets/img/icons/'+(sto.storageType).toString()+'.png')"/>
              <p style="color: #545454;font-size: 14px;white-space: nowrap; overflow: hidden; text-overflow: ellipsis;max-width: 130px; margin: auto;">
                {{ sto.keyname }}</p>
            </div>
            <div class="stostyle">
              <Tag color="primary">{{ usedCapacity(sto.id) }}</Tag>
              <Tag color="success" v-if="(takeEffect(sto.id) || sto.storageType==5)">可用</Tag>
              <Tag color="error" v-else>停用</Tag>
              <p style="margin-top: 10px;">
                <a @click="getStorageById(sto.id)">编辑</a>
              </p>
            </div>
          </Card>
        </Col>
      </Row>
    </Content>


    <!--筛选窗-->
    <Modal v-model="storageWindow" :footer-hide="true">
      <br/>
      <Form @submit.native.prevent :label-width="88">

        <FormItem label="存储源">
          <Select :disabled="this.viewType=='edit'" v-model="bucketType" filterable placeholder="存储源" size="large"
                  @on-change="selectStorageType">
            <Option v-for="item in bucketArr" :value="item.storageType" :key="item.storageType">{{
                item.storageName
              }}
            </Option>
          </Select>
        </FormItem>
        <div v-if="bucketType!=null">
          <div v-if="(bucketType==1 || bucketType==2 )">
            <FormItem label="AccessKey">
              <Input v-model="addAccessKey" size="large"
                     style="width: 100%"/>
            </FormItem>
            <FormItem label="AccessSecret">
              <Input v-model="addAccessSecret" size="large"
                     style="width: 100%"/>
            </FormItem>
            <FormItem label="Endpoint">
              <Input v-model="addEndpoint" size="large"
                     style="width: 100%"/>
            </FormItem>
            <FormItem label="桶名称">
              <Input v-model="addBucketname" size="large" style="width: 100%"/>
            </FormItem>
          </div>
          <div v-if="(bucketType==6)">
            <FormItem label="SecretId">
              <Input v-model="addAccessKey" size="large"
                     style="width: 100%"/>
            </FormItem>
            <FormItem label="SecretKey">
              <Input v-model="addAccessSecret" size="large"
                     style="width: 100%"/>
            </FormItem>
            <FormItem label="地区代码">
              <Tooltip content="如：北京地区就写ap-beijing" theme="light" style="width: 100%">
                <Input v-model="addEndpoint" size="large" style="width: 100%"/>
              </Tooltip>
            </FormItem>
            <FormItem label="桶名称">
              <Input v-model="addBucketname" size="large" style="width: 100%"/>
            </FormItem>
          </div>
          <div v-if="(bucketType==3)">
            <FormItem label="操作员">
              <Input v-model="addAccessKey" size="large" style="width: 100%"/>
            </FormItem>
            <FormItem label="操作密码">
              <Input v-model="addAccessSecret" size="large"
                     style="width: 100%"/>
            </FormItem>
            <FormItem label="桶名称">
              <Input v-model="addBucketname" size="large" style="width: 100%"/>
            </FormItem>
          </div>
          <div v-if="(bucketType==4)">
            <FormItem label="AccessKey">
              <Input v-model="addAccessKey" size="large"
                     style="width: 100%"/>
            </FormItem>
            <FormItem label="SecretKey">
              <Input v-model="addAccessSecret" size="large"
                     style="width: 100%"/>
            </FormItem>
            <FormItem label="桶地区">
              <Select v-model="addEndpoint" size="large">
                <Option value="1" key="1">华东</Option>
                <Option value="2" key="2">华北</Option>
                <Option value="3" key="3">华南</Option>
                <Option value="4" key="4">北美</Option>
                <Option value="5" key="5">东南亚</Option>
              </Select>
            </FormItem>
            <FormItem label="桶名称">
              <Input v-model="addBucketname" size="large" style="width: 100%"/>
            </FormItem>
          </div>
          <div v-if="(bucketType==7)">
            <FormItem label="FTP账号">
              <Input v-model="addAccessKey" size="large" style="width: 100%"/>
            </FormItem>
            <FormItem label="FTP密码">
              <Input v-model="addAccessSecret" size="large"
                     style="width: 100%"/>
            </FormItem>
            <FormItem label="FTP地址">
              <Tooltip max-width="300" theme="light" style="width: 100%">
                <Input v-model="addEndpoint" size="large" style="width: 100%"/>
                <div slot="content">
                  <p>按格式填写如：127.0.0.1:21不需要添加ftp:// 推荐使用21默认端口</p>
                  <p>修改过得端口先用xftp等客户端工具测试一下能不能链接</p>
                </div>
              </Tooltip>
            </FormItem>
          </div>

          <!-- 更多 S3-->
          <div v-if="(bucketType==8)">
            <FormItem label="AccessKey">
              <Input v-model="addAccessKey" size="large" style="width: 100%" />
            </FormItem>
            <FormItem label="SecretKey">
              <Input v-model="addAccessSecret" size="large" style="width: 100%" />
            </FormItem>
            <FormItem label="Endpoint">
              <Input v-model="addEndpoint" size="large" style="width: 100%" />
            </FormItem>
            <FormItem label="地区">
              <Tooltip content="地区 如不需要可留空,如：auto,us-east-1也可留空" theme="light" max-width="250" style="width: 100%">
                <Input v-model="addRegion" size="large" style="width: 100%" />
              </Tooltip>
            </FormItem>
            <FormItem label="桶名称">
              <Input v-model="addBucketname" size="large" style="width: 100%" />
            </FormItem>
            <FormItem label="存储目录">
              <Tooltip content="上传的总路径存储位置，默认为对象存储的根目录：/，可设置子目录如：/img" max-width="250" theme="light" style="width: 100%">
                <Input v-model="addRootPath" size="large" style="width: 100%" />
              </Tooltip>
            </FormItem>
          </div>

          <div v-if="bucketType==9">
            <FormItem label="账号">
              <Input v-model="addAccessKey"  size="large" style="width: 100%" />
            </FormItem>
            <FormItem label="密码">
              <Input v-model="addAccessSecret" size="large" style="width: 100%" />
            </FormItem>
            <FormItem label="地址">
              <Tooltip max-width="300" theme="light" content="需带有http://或https:// 结尾不需要带/" style="width: 100%">
                <Input v-model="addEndpoint" size="large" style="width: 100%" />
              </Tooltip>
            </FormItem>
            <FormItem label="存储目录">
              <Tooltip content="上传的总路径存储位置，默认为存储源的根目录：/，可设置子目录如：/img" max-width="250" theme="light" style="width: 100%">
                <Input v-model="addRootPath" size="large" style="width: 100%" />
              </Tooltip>
            </FormItem>
          </div>

          <FormItem label="域名类型" v-if="bucketType==9">
            <Checkbox v-model="systransmit">系统分发图片
            </Checkbox>
            <span>
              <Tooltip max-width="200" content="此功能适用于支持WebDAV功能但没有文件外链的情况使用，文件的外链可由系统负责生成转发。如：支持WebDAV的网盘">
                <Icon type="md-alert" size="16" />
              </Tooltip>
            </span>
          </FormItem>
          <FormItem label="请求域名" v-if="(!systransmit) && bucketType==9 && bucketType!=5">
            <Tooltip content="需带有http://或https:// 结尾不需要带/" max-width="200" theme="light" style="width: 100%">
              <Input v-model="addRequestAddress" size="large"
                     style="width: 100%"/>
            </Tooltip>
          </FormItem>
          <FormItem label="策略名称">
            <Input v-model="addkeyname" size="large" style="width: 100%"/>
          </FormItem>
        </div>
        <div v-else style="min-height: 130px;text-align: center;color: #9ea7b4;line-height: 35px;">
          <p> Hellohao图像托管</p>
          <p>未获取到正确存储源</p>
        </div>
        <FormItem>
          <Button type="primary" icon="md-done-all" long shape="circle" @click="save">保 存</Button>
        </FormItem>
      </Form>
    </Modal>

    <Footer class="layout-footer-center">{{ this.$store.state.metaInfo.webname }} &copy; Control Panel</Footer>
  </Layout>


</template>
<script src="../../assets/js/storage.js">

</script>
<style scoped>
.stostyle {
  height: 45px;
  width: 80px;
  min-width: 180px;
  font-size: 14px;
  color: #6b6b6b;
  text-align: center;
  margin: auto;
  margin-top: 15px;
  margin-bottom: 15px;
}

.cardSty {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.ivu-card-head {
  border-bottom: 0px solid #e8eaec;
}
</style>
