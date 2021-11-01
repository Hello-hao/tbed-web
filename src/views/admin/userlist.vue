<template>
  <Layout style="margin-top: 50px;">
      <Content :style="{margin: '15px 20px 0'}">
        <p style="position: fixed;right: 58px;z-index: 1;bottom: 68px;">
          <Button type="primary" shape="circle" icon="ios-search" style="z-index: 1;margin-right: 8px;box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 6px 0px;" @click="showSeach">筛 选</Button>
          <Dropdown trigger="click" style="z-index: 1;box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 6px 0px;border-radius: 50%;">
            <Button type="primary" shape="circle">
              操 作
              <Icon type="ios-arrow-down"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem @click.native="disableSelectUser"><Icon type="md-close-circle" /> 禁用选中</DropdownItem>
              <DropdownItem @click.native="deleSelectUser"><Icon type="md-trash" /> 删除选中</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </p>
          <Card class="cardShadow" style="margin-top: 10px;padding-left: 8px; padding-right: 8px;">
            <Table  :loading="loading" ref="selection" :columns="columns" :data="userList"  @on-selection-change="selectuser" >
              <template slot-scope="{ row }" slot="action">
                <strong>{{ row.name }}</strong>
              </template>
              <template slot-scope="{ row, index }" slot="action">
                <div style="max-width: 200px;">
                  <Icon type="md-settings tablebut" :key="index"  @click="showUserInfo(row)" />
                  <Icon type="md-trash tablebut"  @click="deleUser(row.id)" />
                </div>

                <!--        <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">View</Button>-->
                <!--        <Button type="error" size="small" @click="remove(index)">Delete</Button>-->
              </template>
              <Switch v-model="loading"></Switch>
            </Table>
<!--:page-size-opts="[10,20, 30, 50, 100]"-->
            <div style="margin-top: 20px; ">
              <Page :total="total"
                    :page-size="pageSize"
                    @on-change="toPageIndex"
                    @on-page-size-change="toPageSize" />
            </div>

          </Card>

<!--        <Button @click="handleSelectAll(true)">Set all selected</Button>-->
<!--        <Button @click="handleSelectAll(false)">Cancel all selected</Button>-->
      </Content>

      <!--筛选窗-->
      <Modal  v-model="isSearchUser" :footer-hide="true">
        <br />
        <Form  @submit.native.prevent>
          <FormItem >

            <Input prefix="ios-contact" v-model="queryText" placeholder="请输入用户名或邮箱" size="large" style="width: 100%" />
            <!--          <Input v-model="searchtext" placeholder="填写用户名">-->
            <!--            <Select v-model="searchtype" slot="prepend" style="width: 100px">-->
            <!--              <Option value="1">包含</Option>-->
            <!--              <Option value="0">排除</Option>-->
            <!--            </Select>-->
            <!--          </Input>-->
          </FormItem>
          <FormItem style="text-align: center">
<!--            <Button type="primary" icon="ios-search" long shape="circle" @click="toQuery" >SEARCH</Button>-->
<!--            <Button type="error"  shape="circle" long>DELETE</Button>-->

            <ButtonGroup  shape="circle" >
              <Button  type="error" @click="delQuery" >
                重置
                <Icon type="ios-arrow-forward" />
              </Button>
              <Button  type="primary" @click="toQuery">
                <Icon type="ios-search" />
                搜索
              </Button>
            </ButtonGroup>

          </FormItem>
        </Form>
      </Modal>

      <Modal  v-model="updateUserInfoMSG" :footer-hide="true">
        <br />
        <Form  @submit.native.prevent :label-width="80" >
          <FormItem label="用户邮箱">
            <Input v-model="formItem.email"  placeholder="用户邮箱" maxlength="100" show-word-limit size="large"></Input>
          </FormItem>
          <FormItem label="可用容量">
            <Input v-model="formItem.memory" type="number"  placeholder="可用容量" size="large">
              <span slot="append">M</span>
            </Input>
          </FormItem>

          <FormItem label="分发群组">
            <Select v-model="formItem.groupid" filterable placeholder="存储源" size="large">
              <Option v-for="item in grouplist" :value="item.id" :key="item.id">{{ item.groupname }}</Option>
            </Select>
          </FormItem>

          <FormItem label="可用性">
            <i-switch v-model="isOkSwitch" size="large">
              <span slot="1">开启</span>
              <span slot="0">关闭</span>
            </i-switch>
          </FormItem>
            <p style="text-align: center;color: #f56838;">注意：欲要给用户分配分发群组，只能选择未指定用户组的分发群组</p>
<br />
          <Button type="primary" icon="md-done-all" long shape="circle" @click="updateUserInfo">保 存</Button>
        </Form>
      </Modal>

    <Footer class="layout-footer-center" >{{this.$store.state.metaInfo.webname}} &copy; Control Panel</Footer>
    </Layout>


</template>
<script>
import expandRow from './userlist-expand'
import {request} from "@/network/request";
export default {
  name: "userlist",
  data () {
    return {
      isSearchUser:false,
      loading:false,
      pageNum:1,
      pageSize:20,
      total:0,
      updateUserInfoMSG:false,
      grouplist:[],
      queryText:null,
      formItem:{},
      columns: [
        {
          type: 'selection',
          width: 55,
          align: 'center'
        },
        {
          type: 'expand',
          width: 45,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          title: '用户名',
          minWidth:200,
          key: 'username'
        },
        {
          title: '邮箱',
          minWidth:200,
          key: 'email'
        },
        {
          title: '状态',
          minWidth:90,
          align:'center',
          // key: 'memory'
          render: (h, params) => {
            if(params.row.isok==1){
              return (<Icon type="md-checkmark-circle" title="可用" size="20" color="rgb(73 156 84 / 70%)" />);//h('span', {}, '可用');
            }else{
              return (<Icon type="md-close-circle" title="不可用" size="20" color="rgb(252 85 49 / 70%)" />);//h('span', {}, '不可用');
            }
          }
        },
        {
          title: '操作',
          width:120,
          key: 'action',
          slot: 'action',
        }
      ],
      userList: [],
      userIdList:[]
    }
  },
  mounted() {
    this.getUserList();
    this.getStorage();
  },
  methods: {
    getStorage(){
      request(
          "/admin/root/getGrouplistForUsers",
          {}).then(res => {
        if(res.status==200){
          this.grouplist = res.data.data;
        }
      }).catch(err => {
        console.log(err);
        this.$Message.error('服务器请求错误');
      })
    },
    handleSelectAll (status) {
      this.$refs.selection.selectAll(status);
    },
    toPageIndex(pageNum){
      this.pageNum = pageNum;
      this.getUserList();

    },
    toPageSize(pageSize){
      console.log(pageSize);
    },
    getUserList(){
      this.loading = true;
      var paramJson={};
      paramJson.pageNum=this.pageNum;
      paramJson.pageSize=this.pageSize;
      if(this.queryText!=null && this.queryText!=''){
        paramJson.queryText = this.queryText;
      }else{
        paramJson.queryText = null;
      }
      request(
          "/admin/root/getUserList",
          paramJson).then(res => {
        this.isSearchUser = false;
        if(res.status==200){
          var arr = res.data.users;
          this.total = res.data.count;
          if(arr.length>0){
            this.userList = arr;
          }else{
            // console.log("没有数据")
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
    toQuery(){
      if(this.queryText==null || this.queryText.replace(/\s*/g,'')==''){
        return false;
      }
      this.pageNum = 1;
      this.pageSize = 20;
      this.userList =[];
          this.getUserList();
    },
    delQuery(){
      this.queryText=null;
      this.pageNum = 1;
      this.pageSize = 20;
      this.getUserList();
    },
    showSeach(){
      //设置用户列表的删选窗口
      this.isSearchUser = true;
    },
    selectuser(selection){
      if(selection.length>0){
        for (let i = 0; i < selection.length; i++) {
          this.userIdList.push(selection[i].id);
        }
      }else{
        this.userIdList = [];
      }

    },
    showUserInfo(user){
      this.formItem={};
      this.updateUserInfoMSG=true;
      this.formItem=user;
      this.formItem.memory = parseInt(this.formItem.memory);

    },
    deleUser(id){
      this.$Modal.confirm({
        title: '确认删除',
        content: '<p>您确认删除所选用户吗</p>',
        onOk: () => {
          this.sendDeleUser(id);
        },
        onCancel: () => {
          //this.$Message.info('已取消删除');
        }
      });
    },

    deleSelectUser(){
      if(this.userIdList.length==0){
        this.$Message.warning('请选择要操作的数据');
        return;
      }
      this.$Modal.confirm({
        title: '确认删除',
        content: '<p>您确认删除所选用户吗</p>',
        onOk: () => {
          this.sendDeleUser();
        },
        onCancel: () => {
          //this.$Message.info('已取消删除');
        }
      });
    },

    disableSelectUser(){
      if(this.userIdList.length==0){
        this.$Message.warning('请选择要操作的数据');
        return;
      }
      this.$Modal.confirm({
        title: '用户冻结',
        content: '<p>您确认冻结所选用户吗</p>',
        onOk: () => {
          this.senddisableUser();
        },
        onCancel: () => {
          //this.$Message.info('已取消删除');
        }
      });
    },

    sendDeleUser(id){
      this.loading = true;
      var paramJson={};
      if(id==null){
        if(this.userIdList.length==0){
          this.$Message.warning("所选数据丢失，不可操作");
          return false;
        }
      }else{
        this.userIdList=[];
        this.userIdList.push(id);
      }
      paramJson.arr=this.userIdList;

      request(
          "/admin/root/deleUser",
          paramJson).then(res => {
        if(res.status==200){
          if(res.data.code=='200'){
            this.userIdList=[];
            this.$Message.success(res.data.info);
          }else{
            this.$Message.warning(res.data.info);
          }
          this.userList = [];
          this.getUserList();
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

    senddisableUser(){
      this.loading = true;
      var paramJson={};
      if(this.userIdList.length==0){
        this.$Message.warning("所选数据丢失，不可操作");
        return false;
      }
      paramJson.arr=this.userIdList;
      request(
          "/admin/root/disableUser",
          paramJson).then(res => {
        if(res.status==200){
          if(res.data.code=='200'){
            this.userIdList=[];
            this.$Message.success(res.data.info);
          }else{
            this.$Message.warning(res.data.info);
          }
          this.userList = [];
          this.getUserList();
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


    updateUserInfo(){
      var paramJson={};
      if(this.formItem.id=="" || this.formItem.email=="" || this.formItem.memory=="" || this.formItem.groupid==""  || this.formItem.isOkSwitch==""){
        this.$Message.warning("各参数不能为空");
        return;
      }
      if(Number(this.formItem.memory)>1048576){
        this.$Message.warning("容量不得超过1048576");
        return;
      }

      paramJson=this.formItem;
      request(
          "/admin/root/updateUserInfo",
          paramJson).then(res => {
        if(res.status==200){
          if(res.data.code=='200'){
            this.$Message.success(res.data.info);
          }else{
            this.$Message.warning(res.data.info);
          }
          this.updateUserInfoMSG = false;
          this.getUserList();
        }else{
          this.$Message.error("请求时出现错误");
        }
      }).catch(err => {
        console.log(err);
        this.$Message.error('服务器请求错误');
      })
    }


  },
  computed: {
    isOkSwitch: {
      get() {
        return this.formItem.isok==1?true:false;
      },
      set(val){
        this.formItem.isok=val?1:-1;
      }
    },
  },
}
</script>
<style>
.ivu-spin-fix{
z-index: 0;
}
.tablebut{
  font-size: 18px;
  margin-left: 10px;
}
.ivu-table:before {
   z-index: 0;
}
</style>
