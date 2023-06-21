<template>

  <Layout style="margin-bottom: 50px;">
    <Content :style="{margin: '15px 20px 0', }">
      <p style="position: fixed;right: 58px;z-index: 1;bottom: 68px;">
        <Button type="primary" shape="circle" icon="md-filing"
                style="z-index: 1;margin-right: 8px;box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 6px 0px;" @click="SaveConfig"
                :loading="loading">保存
        </Button>
      </p>

      <Tabs>
        <TabPane label="功能配置" icon="ios-images">
          <Row>
            <Col flex="1" style="padding: 8px;">
              <Card :bordered="true" style="margin-top: 10px;padding-left: 8px; padding-right: 8px;padding-top: 20px;">
                <Form style="min-width: 70px;">
                  <FormItem label="游客上传">
                    <i-switch v-model="isupdateSwitch" size="large">
                      <span slot="open">On</span>
                      <span slot="close">Off</span>
                    </i-switch>
                  </FormItem>
                </Form>
              </Card>

            </Col>
            <Col flex="1" style="padding: 8px;">
              <Card :bordered="true" style="margin-top: 10px;padding-left: 8px; padding-right: 8px;padding-top: 20px;">
                <Form style="min-width: 70px;">
                  <FormItem label="用户上传">
                    <i-switch v-model="usercloseSwitch" size="large">
                      <span slot="open">On</span>
                      <span slot="close">Off</span>
                    </i-switch>
                  </FormItem>
                </Form>
              </Card>
            </Col>
            <Col flex="1" style="padding: 8px;">
              <Card :bordered="true" style="margin-top: 10px;padding-left: 8px; padding-right: 8px;padding-top: 20px;">
                <Form style="min-width: 70px;">
                  <FormItem label="图床API">
                    <i-switch v-model="apiSwitch" size="large">
                      <span slot="open">On</span>
                      <span slot="close">Off</span>
                    </i-switch>
                  </FormItem>
                </Form>
              </Card>
            </Col>
            <Col flex="1" style="padding: 8px;">
              <Card :bordered="true" style="margin-top: 10px;padding-left: 8px; padding-right: 8px;padding-top: 20px;">
                <Form style="min-width: 70px;">
                  <FormItem label="目录">
                    <Select v-model="uploadConfig.urltype" placeholder="目录格式" style="width: 70%;">
                      <Option :value="1">/用户名</Option>
                      <Option :value="2">/年/月/日</Option>
                    </Select>
                  </FormItem>
                </Form>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col span="24" style="margin-bottom: 10px;">
              <Card shadow>
                <p slot="title">
                  <Icon type="ios-contacts-outline" size="18"/>
                  访客相关设置
                </p>
                <Row>
                  <Col flex="1">
                    <Form style="padding: 16px;">
                      <FormItem label="访客可用总量">
                        <!--                            <Tooltip content="输入-1为无限制" theme="light" >-->
                        <Input v-model="uploadConfig.visitormemory" style="width: 130px;">
                          <span slot="append">Mb</span>
                        </Input>
                        <!--                            </Tooltip>-->
                      </FormItem>
                    </Form>
                  </Col>

                  <Col flex="1">
                    <Form style="padding: 16px;">
                      <FormItem label="图像大小">
                        <Input v-model="uploadConfig.filesizetourists" style="width: 130px;">
                          <!--                              <span slot="prepend">http://</span>-->
                          <span slot="append">Mb</span>
                        </Input>
                      </FormItem>
                    </Form>
                  </Col>
                  <Col flex="1" style="text-align: center">
                    <Form style="padding: 16px;">
                      <FormItem label="上传最多">
                        <Input v-model="uploadConfig.imgcounttourists" style="width: 130px;">
                          <!--                              <span slot="prepend">http://</span>-->
                          <span slot="append">张</span>
                        </Input>
                      </FormItem>
                    </Form>
                  </Col>
                </Row>

              </Card>
            </Col>
            <Col span="24" style="margin-bottom: 10px;">
              <Card shadow>
                <p slot="title">
                  <Icon type="ios-contacts" size="18"/>
                  用户相关设置
                </p>

                <Row>
                  <Col flex="1">
                    <Form style="padding: 16px;">
                      <FormItem label="新用户分配">
                        <Input v-model="uploadConfig.usermemory" style="width: 130px;">
                          <span slot="append">Mb</span>
                        </Input>
                      </FormItem>
                    </Form>
                  </Col>

                  <Col flex="1">
                    <Form style="padding: 16px;">
                      <FormItem label="图像大小">
                        <Input v-model="uploadConfig.filesizeuser" style="width: 130px;">
                          <!--                              <span slot="prepend">http://</span>-->
                          <span slot="append">Mb</span>
                        </Input>
                      </FormItem>
                    </Form>
                  </Col>
                  <Col flex="1" style="text-align: center">
                    <Form style="padding: 16px;">
                      <FormItem label="上传最多">
                        <Input v-model="uploadConfig.imgcountuser" style="width: 130px;">
                          <!--                              <span slot="prepend">http://</span>-->
                          <span slot="append">张</span>
                        </Input>
                      </FormItem>
                    </Form>
                  </Col>

                </Row>

              </Card>
            </Col>
          </Row>

          <Row>
            <Col span="24" style="margin-bottom: 10px;">
              <Card shadow>
                <p slot="title">
                  <Icon type="md-cog" size="18"/>
                  其他设置
                </p>

                <Form style="padding: 16px;">
                  <FormItem label="图像格式" :label-width="90">
                    <Input v-model="uploadConfig.suffix"
                           placeholder="请输入图像格式后缀用,隔开(英文逗号),仅限图像格式"/>
                  </FormItem>
                  <FormItem label="IP黑名单" :label-width="90">
                    <Input v-model="uploadConfig.blacklist" type="textarea" :rows="4"
                           placeholder="请输入要禁止上传的用户IP 用;隔开(英文分号)"/>
                  </FormItem>

                </Form>
              </Card>
            </Col>
          </Row>

        </TabPane>
        <TabPane label="站点配置" icon="ios-bookmark">
          <!--            <p style="font-size: xx-small;color: rgb(228 102 70);">注意：【图像查重】开启后图像页面的收藏功能无法将不可用，开启前请熟知</p>-->
          <Row>
            <Col flex="1" style="padding: 8px;">
              <Card :bordered="true" style="margin-top: 10px;padding-left: 8px; padding-right: 8px;padding-top: 20px;">
                <Form style="min-width: 70px;">
                  <FormItem label="站点注册">
                    <i-switch v-model="registerSwitch" size="large">
                      <span slot="open">On</span>
                      <span slot="close">Off</span>
                    </i-switch>
                  </FormItem>
                </Form>
              </Card>
            </Col>

            <Col flex="1" style="padding: 8px;">
              <Card :bordered="true" style="margin-top: 10px;padding-left: 8px; padding-right: 8px;padding-top: 20px;">
                <Form style="min-width: 70px;">
                  <FormItem label="图像查重">
                    <i-switch v-model="checkduplicateSwitch" size="large">
                      <span slot="open">On</span>
                      <span slot="close">Off</span>
                    </i-switch>
                  </FormItem>
                </Form>
              </Card>
            </Col>

          </Row>

          <Row>
            <Col span="24" style="margin-bottom: 10px;">
              <Card shadow>
                <p slot="title">
                  <Icon type="md-globe" size="18"/>
                  站点信息
                </p>

                <Form style="padding: 16px;">
                  <FormItem label="站点标题" :label-width="90">
                    <Input v-model="config.webname" maxlength="50" placeholder="请输入网站的标题"
                           style="max-width: 500px;"/>
                  </FormItem>
                  <FormItem label="后端域名" :label-width="90">
                    <Input v-model="config.domain" maxlength="100" placeholder="请输入后端的服务域名或ip:port"
                           style="max-width: 500px;"/>
                    <p style="font-size: 12px;">
                      注意：如果使用本地存储源保存文件，则需要在[存储源设置]-[编辑本地策略]添加后端域名</p>
                  </FormItem>
                  <FormItem label="站点副标题" :label-width="90">
                    <Input v-model="config.websubtitle" maxlength="100" placeholder="请输入网站的副标题"
                           style="max-width: 500px;"/>
                  </FormItem>
                  <FormItem label="站点LOGO" :label-width="90">
                    <Input v-model="config.logo" maxlength="500" placeholder="请输入LOGO链接(输入‘hellohao’使用默认)"/>
                  </FormItem>
                  <FormItem label="favicon图标" :label-width="90">
                    <Input v-model="config.webfavicons" maxlength="500" placeholder="请输入站点favicon图标URL地址"/>
                  </FormItem>
                  <FormItem label="站点关键词" :label-width="90">
                    <Input v-model="config.webkeywords" maxlength="500" placeholder="多个关键词用(英文)“ , ”隔开"/>
                  </FormItem>
                  <FormItem label="站点描述" :label-width="90">
                    <Input type="textarea" v-model="config.webms" :rows="4" maxlength="500"
                           placeholder="请输入站点描述文本"/>
                  </FormItem>
                  <FormItem label="站内资讯" :label-width="90">
                    <Input type="textarea" v-model="config.explain" :rows="4" maxlength="1000"
                           placeholder="请输入站内资讯/公告文本(留空则不显示,支持html标签)"/>
                  </FormItem>
                  <FormItem label="关于弹窗" :label-width="90">
                    <Input type="textarea" v-model="config.aboutinfo" :rows="4" maxlength="1000"
                           placeholder="请输入站内关于菜单的内容,支持html标签"/>
                  </FormItem>
                  <FormItem label="百度统计ID" :label-width="90">
                    <Input v-model="config.baidu" maxlength="500" placeholder="百度统计代码中的ID部分"/>
                    <p style="font-size: 12px;">
                      如：hm.baidu.com/hm.js?<span style="color:red;">07dbce86da2a2ec8f5bf771adf59f94e</span> (仅输入红字部分即可)
                    </p>
                  </FormItem>
                  <FormItem label="备案显示" :label-width="90">
                    <Input type="textarea" v-model="config.links" :rows="4" maxlength="5000"
                           placeholder="站点底部备案信息，不填写则不显示"/>
                  </FormItem>

                </Form>
              </Card>
            </Col>
          </Row>

        </TabPane>
        <TabPane label="客户端配置" icon="md-desktop">
          <Row>
            <Col span="24" style="margin-bottom: 10px;">
              <Card shadow>
                <p slot="title">
                  <Icon type="md-desktop" size="18"/>
                  客户端配置
                </p>
                <Form style="padding: 16px;">
                  <FormItem label="程序控制" :label-width="110">
                    <Input clearable v-model="appclient.isuse" maxlength="50" placeholder="on\off（其他字符均为关闭）"
                           style="max-width: 600px;"/>
                  </FormItem>
                  <FormItem label="程序标题" :label-width="110">
                    <Input clearable v-model="appclient.appname" maxlength="20" placeholder="程序主界面标题"
                           style="max-width: 600px;"/>
                  </FormItem>
                  <FormItem label="标题LOGO" :label-width="110">
                    <Input clearable v-model="appclient.applogo" maxlength="500"
                           placeholder="程序主界面图标，图像比例为1:1，如：300x300" style="max-width: 600px;"/>
                  </FormItem>
                  <FormItem label="程序版本" :label-width="110">
                    <Input clearable v-model="appclient.appupdate" maxlength="50" placeholder="按照格式严谨填写：如1.0.1"
                           style="max-width: 600px;"/>
                  </FormItem>
                  <FormItem label="新版地址(WIN)" :label-width="110">
                    <Input clearable v-model="appclient.winpackurl" maxlength="500" placeholder="新版本安装包下载地址"
                           style="max-width: 600px;"/>
                  </FormItem>
                  <FormItem label="新版地址(MAC)" :label-width="110">
                    <Input clearable v-model="appclient.macpackurl" maxlength="500" placeholder="新版本安装包下载地址"
                           style="max-width: 600px;"/>
                  </FormItem>
                  <FormItem>
                    <p style="font-size: 12px;">程序获取：图床客户端程序可在<a target="_blank"
                                                                              href="http://tbed.hellohao.cn">Hellohao图像托管官网</a>获取
                    </p>
                    <p style="font-size: 12px;">版本号填写：查看开发者的<a target="_blank"
                                                                          href="http://tbed.hellohao.cn">程序发布平台</a>，获取最新的程序版本号，按照规定格式填写进上方对应输入框(如：6.5.1)，当用户版本小于此版本时会触发更新。
                    </p>

                  </FormItem>

                </Form>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </Content>
    <Footer class="layout-footer-center">{{ this.$store.state.metaInfo.webname }} &copy; Control Panel</Footer>
  </Layout>

</template>

<script>
import {request} from "../../network/request";

export default {
  name: "setting",
  data() {
    return {
      loading: false,
      uploadConfig: {},
      sysConfig: {},
      config: {},
      appclient: {},

    }
  },
  mounted() {
    this.$Spin.show();
    this.getDatas();
  },
  methods: {
    getDatas() {
      request(
          "/admin/root/getSettingConfig",
          {}).then(res => {
        this.$Spin.hide();
        if (res.status == 200) {
          var json = res.data.data;
          if (res.data.code == '200') {
            this.uploadConfig = json.uploadConfig;
            this.config = json.config;
            this.sysConfig = json.sysConfig;
            this.appclient = json.appClient;
          } else {
            this.$Message.error("获取数据失败，请稍后再试");
          }
        } else {
          this.$Message.error("请求时出现错误");
        }
      }).catch(err => {
        console.log(err);
        this.$Message.error('服务器请求错误');
      })
    },
    SaveConfig() {
      this.loading = true;
      if (this.uploadConfig.suffix == null || this.uploadConfig.suffix.replace(/\s*/g, '') == "") {
        this.$Message.warning("支持的图像格式不能为空");
        this.loading = false;
        return false;
      }
      if (this.config.webname == null || this.config.webname.replace(/\s*/g, '') == "") {
        this.$Message.warning("站点名称不能为空");
        this.loading = false;
        return false;
      }
      if (this.config.domain == null || this.config.domain.replace(/\s*/g, '') == "") {
        this.$Message.warning("WEB域名不能为空");
        this.loading = false;
        return false;
      }
      if (Number(this.uploadConfig.filesizetourists) > 5120 || Number(this.uploadConfig.filesizeuser) > 5120) {
        this.$Message.warning("单文件大小不得超过5120 MB");
        this.loading = false;
        return false;
      }
      if (Number(this.uploadConfig.usermemory) > 1048576) {
        this.$Message.warning("用户初始容量不得超过1048576 MB");
        this.loading = false;
        return false;
      }
      if (Number(this.uploadConfig.imgcountuser) > 1000 || Number(this.uploadConfig.imgcounttourists) > 1000) {
        this.$Message.warning("单次上传数量上限为1000");
        this.loading = false;
        return false;
      }

      var params = {
        uploadConfig: this.uploadConfig,
        config: this.config,
        sysConfig: this.sysConfig,
        appClient: this.appclient
      }
      request(
          "/admin/root/updateConfig",
          params).then(res => {
        this.loading = false;
        if (res.status == 200) {
          if (res.data.code == '200') {
            this.$Message.success(res.data.info);
          } else {
            this.$Message.error(res.data.info);
          }
        } else {
          this.$Message.error("请求时出现错误");
        }
      }).catch(err => {
        // this.$Spin.hide();
        this.loading = false;
        console.log(err);
        this.$Message.error('服务器请求错误');
      })
    },

  },
  computed: {
    isupdateSwitch: {
      get() {
        return this.uploadConfig.isupdate == 1 ? true : false;
      },
      set(val) {
        this.uploadConfig.isupdate = val ? 1 : 0;
      }
    },
    usercloseSwitch: {
      get() {
        return this.uploadConfig.userclose == 1 ? true : false;
      },
      set(val) {
        this.uploadConfig.userclose = val ? 1 : 0;
      }
    },
    watermarkSwitch: {
      get() {
        return this.uploadConfig.watermark == 1 ? true : false;
      },
      set(val) {
        this.uploadConfig.watermark = val ? 1 : 0;
      }
    },
    apiSwitch: {
      get() {
        return this.uploadConfig.api == 1 ? true : false;
      },
      set(val) {
        this.uploadConfig.api = val ? 1 : 0;
      }
    },
    registerSwitch: {
      get() {
        return this.sysConfig.register == 1 ? true : false;
      },
      set(val) {
        this.sysConfig.register = val ? 1 : 0;
      }
    },
    guidepageSwitch: {
      get() {
        return this.sysConfig.guidepage == 1 ? true : false;
      },
      set(val) {
        this.sysConfig.guidepage = val ? 1 : 0;
      }
    },
    checkduplicateSwitch: {
      get() {
        return this.sysConfig.checkduplicate == 1 ? true : false;
      },
      set(val) {
        this.sysConfig.checkduplicate = val ? 1 : 0;
      }
    }


  }

}
</script>

<style scoped>

</style>
