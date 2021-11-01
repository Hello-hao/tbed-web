<template>
<!--  <div class="layout">-->
    <Layout style="background: #FFF;">

        <Content :style="{margin: '82px auto', background: '#fff', minHeight: '500px',minWidth:'45vh',width: '95%'}">
          <div style="width: 100%;text-align: center;margin-top: 100px;">
            <h1>4 0 4</h1>
            <h2>您所访问的页面不存在</h2>
            <br />
            <Button type="primary" shape="circle" @click.native="goHome">返回首页</Button>
          </div>

        </Content>

<!--      <Footer class="layout-footer-center">2020-2021 &copy; Hellohao</Footer>-->

    </Layout>
<!--  </div>-->
</template>
<script>
export default {
  metaInfo() {
    return {
      title: "页面未找到", // set a title
      meta: [   // set meta
        {
          name: 'keyWords',
          content: this.$store.state.metaInfo.keywords
        },
        {
          name: 'description',
          content: this.$store.state.metaInfo.description
        }
      ]
    }

  },

  name: "404",
  data () {
    return {
    }
  },
  mounted () {
    console.log("您所访问的页面不存在")
  },
  methods: {
  goHome() {
    this.$router.replace("/")
  }
  },
  components: {

  }
}
</script>
<style>

.layout-footer-center{
  text-align: center;
}
.ivu-input-group .ivu-input, .ivu-input-group .ivu-input-inner-container {
  width: 100%;
  float: left;
  margin-bottom: 0;
  position: relative;
  z-index: 2;
  height: 42px;
}





</style>
