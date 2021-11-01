<style scoped>
.expand-row{
  margin-bottom: 16px;
}
</style>
<template>
  <div>
    <Row class="expand-row">
      <Col span="8">
        <span class="expand-key">注册日期: </span>
        <span class="expand-value">{{ row.birthder }}</span>
      </Col>
      <Col span="8">
        <span class="expand-key">用户组: </span>
        <span class="expand-value">{{ row.groupname }}</span>
      </Col>
      <Col span="8">
        <span class="expand-key">密码: </span>
        <span class="expand-value">{{ row.password }}</span>
      </Col>
    </Row>
    <Row>
      <Col span="8">
        <span class="expand-key">容量: </span>
        <span class="expand-value">{{getMemory}}</span>
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  name: "table-expand.vue",
  props: {
    row: Object
  },
  methods:{
    //自动计算大小
    formatBytes(a,b){if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]}
},
  computed: {
    getMemory: function () {
      if(this.row.memory){
        return this.formatBytes((this.row.memory*1024*1024),2);//参数二的意思是两位小数
      }else{
        return '0B';
      }
    }
  },
}
</script>

<style scoped>

</style>
