<template>
  <Layout style="background: #FFF;margin-bottom: 50px;">
    <Content :style="{margin: '15px 20px 0', minHeight: '500px'}">
      <Card style="width:100%; margin:10px auto; box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 3px 2px;" :bordered="false">
        <div>
          <p slot="title" style="font-size: 16px;font-weight: bold;">客户端对接</p>
          <p># Token方式</p>
          <p style="color: #cc2a5b">服务器地址：{{ $store.state.serverHost }}</P>
          <br/>
          <p slot="title" style="font-size: 16px;font-weight: bold;">图像上传</p>
          <p># 邮箱/密码方式</p>
          <p style="color: #cc2a5b">上传头需要是Content-Type: multipart/form-data;</P>
          <br/>
          <Table :columns="columns3" :data="data3"></Table>
          <br/>
          <Table :columns="columns4" :data="data4"></Table>
          <p style="font-size: 16px;margin-top: 20px;font-weight: bold;">返回参数</p>
          <code style="height: 200px; margin-top: 10px;margin-left: 20px;display: inline-block;">
            //成功实例：
            <p>//code:状态码</p>
            <p>//msg:提示信息</p>
            <p>//data:图像上传后的信息</p>
            <p>//name:图像名称</p>
            <p>//url:图像直链</p>
            <p>//size:图像大小</p>
            <br/>

            <p>{</p>
            <p>"code": "200",</p>
            <p>"info": "操作成功",</p>
            <p>"data": {</p>
            <p>"name": "admin/xxx.png",</p>
            <p>"url": "http://xxx.png"</p>
            <p>"size": "1024",</p>
            <p>},</p>
            <p>"exceptions": null</p>
            <p>}</p>
          </code>
          <br/>
        </div>
      </Card>
    </Content>
    <Footer class="layout-footer-center">{{ this.$store.state.metaInfo.webname }} &copy; Control Panel</Footer>

  </Layout>
</template>
<script>
export default {
  name: "api",
  data() {
    return {
      //图像上传
      columns3: [
        {
          title: '功能',
          width: 100,
          key: 'gongneng'
        },
        {
          title: '接口',
          width: 400,
          key: 'jiekou'
        }
      ],
      data3: [
        {
          gongneng: '请求方式',
          jiekou: 'POST',
        },
        {
          gongneng: '请求地址',
          jiekou: this.$store.state.serverHost + '/api/uploadbymail/'
        }
      ],
      columns4: [
        {
          title: '参数名',
          width: 130,
          key: 'ming'
        },
        {
          title: '参数类型',
          width: 130,
          key: 'leixing'
        },
        {
          title: '参数说明',
          width: 135,
          key: 'shuoming'
        }
      ],
      data4: [
        {
          ming: 'file',
          leixing: 'file',
          shuoming: '图像文件',
        },
        {
          ming: 'mail',
          leixing: 'String',
          shuoming: '账户的电子邮箱',
        },
        {
          ming: 'pass',
          leixing: 'String',
          shuoming: '账户的密码',
        },
        {
          ming: 'days',
          leixing: 'String',
          shuoming: '暂存天数，默认为永久，可选：1、3、7、30,其他均无效',
        }
      ],
    }
  },
  mounted() {
    console.log("您所访问的页面不存在")
  },
  methods: {},
  components: {}
}
</script>
<style>

.layout-footer-center {
  text-align: center;
}


</style>
