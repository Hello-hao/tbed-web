<template>
  <Layout style="margin-top: 50px;">
      <Content :style="{margin: '15px 20px 0'}">
        <p style="position: fixed;right: 58px;z-index: 1;bottom: 68px;">
          <Button type="primary" shape="circle" icon="md-trash" style="z-index: 1;margin-right: 8px;box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 6px 0px;" @click="deleSelectGallery" >删除选中</Button>
        </p>
        <Card class="cardShadow" style="margin-top: 10px;padding-left: 8px; padding-right: 8px;">
            <Table  :loading="loading" ref="selection" :columns="columns" :data="GalleryList"  @on-selection-change="selectGallery">
              <template slot-scope="{ row }" slot="action">
                <strong>{{ row.name }}</strong>
              </template>
              <template slot-scope="{row,index}" slot="action" >
<!--                <Icon type="md-settings tablebut"  @click="showsettingGroup(row,index)" />-->
                <Icon type="md-trash tablebut" :value="index" @click="deleGallery(row.albumkey)" />
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
    <Footer class="layout-footer-center" >{{this.$store.state.metaInfo.webname}} &copy; Control Panel</Footer>
    </Layout>



</template>
<script>
import {request} from "@/network/request";
export default {
  name: "gallery",
  data () {
    return {
      loading:true,
      pageNum:1,
      pageSize:10,
      total:0,
      GalleryList:[],
      albumkeyList:[],
      columns: [
        {
          type: 'selection',
          width: 55,
          align: 'center'
        },
        {
          title: '画廊标题',
          minWidth: 200,
          key: 'albumtitle'
        },
        {
          title: '画廊地址',
          minWidth: 300,
          // key: 'albumkey',
          render: (h, params) => {
            return h('a', {
              attrs: {
                name: params.row.albumkey,
                target:'_blank',
                href: window.location.protocol+'//'+window.location.host+'/h/'+params.row.albumkey
              }
            }, window.location.protocol+'//'+window.location.host+'/h/'+params.row.albumkey);
          }
        },
        {
          title: '创建日期',
          tooltip:true,
          minWidth: 130,
          align: 'center',
          key: 'createdate'
        },
        {
          title: '创建人',
          minWidth: 130,
          align: 'center',
          // key: 'userid'
          render: (h, params) => {
            if(params.row.userid==0){
              return h('span', {}, '访客');
            }else{
              return h('span', {}, params.row.username);
            }
          }
        },
        {
          title: '访问密码',
          align:'center',
          width:100,
          // key: 'memory'
          render: (h, params) => {
            if(params.row.password){
              return h('span', {}, params.row.password);
            }else{
              return h('span', {}, '无');
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

      groupList: []
    }
  },
  mounted() {
    this.$Spin.show();
    this.getGalleryList();
    // this.getStorage();
    this.$Spin.hide();
  },
  methods: {
    toPageIndex(pageNum){
      this.pageNum = pageNum;
      this.getUserList();

    },
    toPageSize(pageSize){
    },

    getGalleryList(){
      var paramJson={};
      paramJson.pageNum=this.pageNum;
      paramJson.pageSize=this.pageSize;
      request(
          "/admin/getGalleryList",
          paramJson).then(res => {
            if(res.status==200){
              this.loading = false;
              this.GalleryList = res.data.data;
            }
      }).catch(err => {
        console.log(err);
        this.$Message.error('服务器请求错误');
      })
    },
    selectGallery(selection){
      if(selection.length>0){
        for (let i = 0; i < selection.length; i++) {
          this.albumkeyList.push(selection[i].albumkey);
        }
      }else{
        this.albumkeyList = [];
      }
    },
    deleSelectGallery(){
      if(this.albumkeyList.length==0){
        this.$Message.warning("请先选择要操作的数据");
        return;
      }
      this.$Modal.confirm({
        title: '确认删除',
        content: '<p>您确认删除所选画廊吗</p>',
        onOk: () => {
          this.sendDeleGallery();
        },
        onCancel: () => { }
      });
    },
    deleGallery(id){
      this.$Modal.confirm({
        title: '确认删除',
        content: '<p>您确认删除所选画廊吗</p>',
        onOk: () => {
          this.sendDeleGallery(id);
        },
        onCancel: () => { }
      });
    },
    sendDeleGallery(albumkey){
      this.loading = true;
      var paramJson={};
      if(albumkey!=null && albumkey != ''){
        let arr = [];
        arr.push(albumkey);
        paramJson.albumkeyList = arr;
      }else{
        if(this.albumkeyList.length==0){
          this.loading = false;
          this.$Message.warning("请先选择要操作的数据");
          return false;
        }
        paramJson.albumkeyList=this.albumkeyList;
      }
      request(
          "/admin/deleGallery",
          paramJson).then(res => {
        console.log(res);
        if(res.status==200){
          if(res.data.code=='200'){
            this.$Message.success(res.data.info);
          }else{
            this.$Message.warning(res.data.info);
          }
          this.getGalleryList();
        }else{
          this.$Message.error("请求时出现错误");
        }
        this.loading = false;
      }).catch(err => {
        this.loading = false;
        console.log(err);
        this.$Message.error('服务器请求错误');
      })
    }


  }
}
</script>
<style>
.tablebut{
  font-size: 18px;
  margin-left: 10px;
}
</style>
