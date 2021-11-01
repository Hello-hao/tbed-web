<template>
  <Layout style="margin-top: 50px;">
      <Content :style="{margin: '15px 20px 0'}">
        <p style="position: fixed;right: 58px;z-index: 1;bottom: 68px;">
          <Dropdown trigger="click" style="z-index: 1;box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 6px 0px;border-radius: 50%;">
            <Button type="primary" shape="circle">
              操 作
              <Icon type="ios-arrow-down"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem @click.native="deleSelectCodes"><Icon type="md-trash" /> 删除选中</DropdownItem>
              <DropdownItem @click.native="showAdd"><Icon type="md-add-circle" />添 加</DropdownItem>
            </DropdownMenu>
          </Dropdown>

        </p>
        <Card class="cardShadow" style="margin-top: 10px;padding-left: 8px; padding-right: 8px;">
          <Table  :loading="loading" ref="selection" :columns="columns" :data="codeList" @on-selection-change="selectCode">
            <template slot-scope="{ row }" slot="action">
              <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Icon type="ios-copy tablebut cobyOrderSn" :data="index" title="复制" data-clipboard-action="copy" :data-clipboard-text="row.code"  @click="copyCode" />
              <Icon type="md-trash tablebut" title="删除"  @click="deleCodes(row)" />
              <!--        <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">View</Button>-->
              <!--        <Button type="error" size="small" @click="remove(index)">Delete</Button>-->
            </template>
            <Switch v-model="loading"></Switch>
          </Table>
          <div style="margin-top: 20px; ">
            <Page :total="total"
                  :page-size="pageSize"
                  @on-change="toPageIndex"
                  @on-page-size-change="toPageSize" />
          </div>
        </Card>
      </Content>
      <Footer class="layout-footer-center">{{this.$store.state.metaInfo.webname}} &copy; Control Panel</Footer>



    <Modal  v-model="isAdd" :footer-hide="true">
      <br />
      <Form  @submit.native.prevent :label-width="80" >
        <FormItem label="生成数量">
          <Input v-model="formItem.count" type="number"  placeholder="生成的扩容码数量"   size="large"></Input>
        </FormItem>
        <FormItem label="单位容量">
          <Input v-model="formItem.memory" type="number"  placeholder="每个扩容码的容量,最大1048576"  size="large">
            <span slot="append">M</span>
          </Input>
        </FormItem>

        <Button type="primary" icon="md-done-all" long shape="circle" :loading="addLoading" @click="addCodeList">生 成</Button>
      </Form>
    </Modal>


    </Layout>


</template>
<script>
import {request} from "@/network/request";
import expandRow from "@/views/admin/userlist-expand";
export default {
  name: "capacity",
  data () {
    return {
      addLoading:false,
      isAdd:false,
      loading:false,
      pageNum:1,
      pageSize:20,
      total:0,
      formItem:{
        count:10,
        memory:1024
      },
      bucketlist:[],
      columns: [
        {
          type: 'selection',
          width: 55,
          align: 'center'
        },
        {
          title: '编号',
          width: 100,
          key: 'id'
        },
        {
          title: '扩容量(M)',
          width: 200,
          minWidth:150,
          // key: 'value'
          render: (h, params) => {
            if(params.row.value>0){
              return h('span', {}, this.formatBytes(params.row.value,2));
            }else{
              return (<span>0B</span>);//h('span', {}, '关闭');
            }
          }
        },
        {
          title: '扩容码',
          minWidth:400,
          key: 'code'

        },
        {
          title: '操作',
          align:'center',
          width:120,
          key: 'action',
          slot: 'action',
        }
      ],
      codeList: [],
      codeIdList:[]
    }
  },
  mounted() {
    this.$Spin.show();
    this.getCodeList();
    this.$Spin.hide();
  },
  methods: {
    selectCode(selection){
      if(selection.length>0){
        this.codeIdList = selection;
      }else{
        this.codeIdList = [];
      }
    },
    toPageIndex(pageNum){
      this.pageNum = pageNum;
      this.getCodeList();
    },
    toPageSize(pageSize){
      console.log(pageSize);
    },
    getCodeList(){
      this.loading = true;
      var paramJson={};
      paramJson.pageNum=this.pageNum;
      paramJson.pageSize=this.pageSize;
      this.codeList =[];
      request(
          "/admin/root/selectCodeList",
          paramJson).then(res => {
        if(res.status==200){
          var arr = res.data.data;
          this.total = res.data.count;
          if(arr.length>0){
            this.codeList = arr;
          }else{
            console.log("没有数据")
          }
        }else{
          this.$Message.error("请求时出现错误");
        }
        this.loading = false;
      }).catch(err => {
        this.loading = false;
        console.log(err);
        this.$Message.error('服务器请求错误');
      })
    },

    showAdd(){
      this.isAdd = true;
    },
    copyCode(){
      var clipboard = new this.clipboard('.cobyOrderSn')
      clipboard.on('success', e => {
        this.$Message.success('复制成功');
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        console.log(e);
        // 不支持复制
        this.$Message.error('该浏览器不支持自动复制');
        // 释放内存
        clipboard.destroy()
      })
    },
    addCodeList(){
      if(Number(this.formItem.memory)<=0 || Number(this.formItem.memory)>1048576){
        this.$Message.warning("请输入正确的容量值:1~1048576");
        return;
      }
      if(Number(this.formItem.count)<=0 || Number(this.formItem.count)>1000){
        this.$Message.warning("请输入正确的生成数量:1~1000");
        return;
      }
      this.addLoading = true;
      request(
          "/admin/root/addCode",
          this.formItem).then(res => {
        this.addLoading = false;
        if(res.status==200){
          if(res.data.code=='200'){
            this.$Message.success(res.data.info);
            this.getCodeList();
            this.isAdd=false;
          }else{
            this.$Message.warning(res.data.info);
          }
        }
      }).catch(err => {
        this.addLoading = false;
        console.log(err);
        this.$Message.error('服务器请求错误');
      })
    },
    deleCodes(e){
      this.$Modal.confirm({
        title: '确认删除',
        content: '<p>您确认删除所选扩容码信息吗</p>',
        onOk: () => {
          this.sendDeleCodes(e);
        },
        onCancel: () => {
          //this.$Message.info('已取消删除');
        }
      });
    },
    deleSelectCodes(){
      if(this.codeIdList.length==0){
        this.$Message.warning("请先选择要操作的数据");
        return false;
      }
      this.$Modal.confirm({
        title: '确认删除',
        content: '<p>您确认删除所选扩容码信息吗</p>',
        onOk: () => {
          this.sendDeleCodes();
        },
        onCancel: () => {
          //this.$Message.info('已取消删除');
        }
      });
    },
    sendDeleCodes(e){
      this.loading = true;
      var paramJson={};
      if(e==null){
        if(this.codeIdList.length==0){
          this.$Message.warning("所选数据丢失，不可操作");
          return false;
        }
      }else{
        this.codeIdList=[];
        this.codeIdList.push(e);
      }
      paramJson.arr=this.codeIdList;
      request(
          "/admin/root/deleteCodes",
          paramJson).then(res => {
        if(res.status==200){
          if(res.data.code=='200'){
            this.$Message.success(res.data.info);
            this.codeIdList=[];
            this.getCodeList();
          }else{
            this.$Message.warning(res.data.info);
          }
        }else{
          this.$Message.error("请求时出现错误");
        }
        this.loading = false;
      }).catch(err => {
        this.loading = false;
        console.log(err);
        this.$Message.error('服务器请求错误');
      })
    },

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
<style>
.tablebut{
  font-size: 18px;
  margin-left: 10px;
  cursor: pointer;
}
</style>
