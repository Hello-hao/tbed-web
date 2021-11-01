<template>
  <Layout style="margin-top: 50px;">
      <Content :style="{margin: '15px 20px 0'}">
        <p style="position: fixed;right: 58px;z-index: 1;bottom: 68px;">
          <Button type="primary" shape="circle" icon="md-add-circle" style="z-index: 1;margin-right: 8px;box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 6px 0px;" @click="showAdd">添 加</Button>
        </p>
        <Card class="cardShadow" style="margin-top: 10px;padding-left: 8px; padding-right: 8px;">
          <Table  :loading="loading" ref="selection" :columns="columns" :data="groupList" >
            <template slot-scope="{ row }" slot="action">
              <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Icon type="md-settings tablebut"  @click="showsettingGroup(row,index)" />
              <Icon type="md-trash tablebut"  @click="deleGroup(row.id)" />
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

    <Modal  v-model="isAdd" :footer-hide="true">
      <br />
      <Form  @submit.native.prevent :label-width="70" >
        <FormItem label="群组名称">
          <Input :disabled="(formItem.id==1 && urlType=='edit')" v-model="formItem.groupname"  placeholder="群组名称" maxlength="20"  size="large"></Input>
        </FormItem>
        <FormItem label="存储源">
          <Select v-model="formItem.keyid" filterable placeholder="存储源" size="large">
            <Option v-for="item in bucketlist" :value="item.id" :key="item.id">{{ item.keyname }}</Option>
          </Select>
        </FormItem>

        <FormItem label="用户组">
          <Select :disabled="(formItem.id==1 && urlType=='edit')" v-model="formItem.usertype" placeholder="用户组" size="large">
            <Option  value="0" >不指定</Option>
            <Option  value="1" >游客</Option>
            <Option  value="2" >用户</Option>
            <Option  value="3" >管理员</Option>
          </Select>
        </FormItem>

        <FormItem label="图像压缩">
          <i-switch v-model="formItem.compress" size="large">
            <span slot="1">开启</span>
            <span slot="0">关闭</span>
          </i-switch>
        </FormItem>
        <div style="color: rgb(228 102 70);font-size: 12px; font-weight: 200;">
          <p>分发群组优先级判定：</p>
          <p>未指定用户组的分发群组且已经分配给指定用户使用的优先级最高，其次是设置有用户组的分发群组。若以上所属的分发群组都没有指定，则一律进默认群组。</p>
          <br />
        </div>

        <Button type="primary" icon="md-done-all" long shape="circle" @click="save">保 存</Button>
      </Form>
    </Modal>

    <Footer class="layout-footer-center" >{{this.$store.state.metaInfo.webname}} &copy; Control Panel</Footer>
    </Layout>


</template>
<script>
import {request} from "@/network/request";
export default {
  name: "group",
  data () {
    return {
      urls:null,
      isAdd:false,
      loading:false,
      pageNum:1,
      pageSize:10,
      total:0,
      formItem:{
        id:null,
        groupname:null,
        keyid:null,
        usertype:"0",
        compress:false
      },
      bucketlist:[],
      columns: [
        {
          title: '分组',
          minWidth:200,
          key: 'groupname'
        },
        {
          title: '存储策略',
          minWidth:200,
          key: 'keyname'
        },
        {
          title: '用户组',
          minWidth:200,
          // key: 'usertype'
          render: (h, params) => {
            if(params.row.usertype==1){
              return h('span', {}, '游客');
            }else if(params.row.usertype==2){
              return h('span', {}, '用户');
            }else if(params.row.usertype==3){
              return h('span', {}, '管理员');
            }else{
              return h('span', {}, '未指定');
            }
          }
        },
        {
          title: '无损压缩',
          align:'center',
          width:100,
          // key: 'memory'
          render: (h, params) => {
            if(params.row.compress==1){
              return (<Icon type="md-radio-button-off" title="已开启" size="20" color="#499c54" />);//h('span', {}, '开启');
            }else{
              return (<Icon type="md-power" title="未开启" size="20" color="#c75450" />);//h('span', {}, '关闭');
            }
          }
        },
        {
          title: '操作',
          align:'center',
          width:120,
          key: 'action',
          slot: 'action',
        }
      ],
      groupList: []
    }
  },
  mounted() {
    this.$Spin.show();
    this.getGroupList();
    this.getStorage();
    this.$Spin.hide();
  },
  methods: {
    toPageIndex(pageNum){
      console.log(pageNum);
      this.pageNum = pageNum;
      this.getUserList();

    },
    toPageSize(pageSize){
      console.log(pageSize);
    },
    getGroupList(){
      this.loading = true;
      var paramJson={};
      paramJson.pageNum=this.pageNum;
      paramJson.pageSize=this.pageSize;

      request(
          "/admin/root/getGroupList",
          paramJson).then(res => {
        if(res.status==200){
          var arr = res.data.data;
          this.total = res.data.count;
          if(arr.length>0){
            this.groupList = arr;
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
    getStorage(){
      request(
          "/admin/getStorageName",
          {}).then(res => {
        if(res.status==200){
          this.bucketlist = res.data.data;
        }
      }).catch(err => {
        console.log(err);
        this.$Message.error('服务器请求错误');
      })
    },

    showAdd(){
      //设置用户列表的删选窗口
      this.urlType='add';
      this.formItem.id = null;
      this.formItem.groupname = null;
      this.formItem.keyid = null;
      this.formItem.usertype = "0";
      this.formItem.compress = false;
      this.isAdd = true;
    },
    showsettingGroup(row,index){
      this.urlType='edit';
      this.isAdd = true;
      this.formItem.id = row.id;
      this.formItem.groupname = row.groupname;
      this.formItem.keyid = row.keyid;
      this.formItem.usertype = row.usertype.toString();
      this.formItem.compress = row.compress==1?true:false;
    },
    save(){
      if(this.urlType=='add'){
        this.urls = 'addGroup';
      }else{
        this.urls = 'updateGroup';
      }
      //addGroup
      request(
          "/admin/root/"+this.urls,
          this.formItem).then(res => {
        if(res.status==200){
          if(res.data.code=='200'){
            this.$Message.success(res.data.info);
            this.getGroupList();
            this.isAdd=false;
          }else{
            this.$Message.warning(res.data.info);
          }
        }
      }).catch(err => {
        console.log(err);
        this.$Message.error('服务器请求错误');
      })
    },
    deleGroup(id){
      this.$Modal.confirm({
        title: '确认删除',
        content: '<p>您确认删除所选分组吗</p>',
        onOk: () => {
          this.sendDeleGroup(id);
        },
        onCancel: () => {
          //this.$Message.info('已取消删除');
        }
      });
    },
    sendDeleGroup(id){
      this.loading = true;
      var paramJson={};
      if(id==null || id == ''){
        this.$Message.warning("所选数据丢失，不可操作");
        return false;
      }else{
        paramJson.id=id;
      }
      request(
          "/admin/root/deleGroup",
          paramJson).then(res => {
        if(res.status==200){
          if(res.data.code=='200'){
            this.$Message.success(res.data.info);
          }else{
            this.$Message.warning(res.data.info);
          }
          this.getGroupList();
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



  }
}
</script>
<style>
.tablebut{
  font-size: 18px;
  margin-left: 10px;
}
</style>
