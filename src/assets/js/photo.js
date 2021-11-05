import {request} from "@/network/request";
import vueQr from 'vue-qr'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'


export default {
    name: "photo",
    data () {
        return {
            screenWidth:document.body.clientWidth,
            httpText:window.location.protocol,
            hostText:window.location.host,
            viewType:1,//1-大图模式 2-小图
            upName:null,
            imgage:null,
            isViolation:{
                isControl:false,
                info:"此图像可能存在违规内容 建议删除"
            },
            issearchimg:false,
            isimginfo:false,
            imglist: [],
            pageNum:1,
            pageSize:20,
            selecttype:2,
            type:'picture',
            selectIndex:[],
            selectImgUrl:[],
            bucketname:null,
            bucketlist:[],
            searchtype:'1',//查询的文本类型
            searchtext:null,//查询的文本
            searchbucket:'',
            searchStartDate:null,
            searchStopDate:null,
            submitData:[],
            toolBottom:5,
            nextButloading:false,
            btntext:'加载更多',
            treePopup: false,
            violation:false,
            moveImgLoading:false,
            noImgMsg : false//没有图像的时候提示

        }
    },
    methods: {
        selectPhoto(){
            this.issearchimg = false;
            // this.$Spin.show();
            this.nextButloading=true;
            var paramJson={};
            paramJson.pageNum=this.pageNum;
            paramJson.pageSize=this.pageSize;
            paramJson.selecttype = this.searchtype;
            paramJson.username = this.searchtext;
            paramJson.source=this.searchbucket;
            paramJson.starttime=this.searchStartDate==''?null:this.searchStartDate;
            paramJson.stoptime=this.searchStopDate==''?null:this.searchStopDate;
            paramJson.violation = this.violation;

            request(
                "/admin/selectPhoto",
                paramJson).then(res => {
                if(res.status==200){
                    if(res.data.code=='200'){
                        var arr = res.data.data.rows;
                        this.nextButloading=false;
                        this.treePopup = false;
                        if(arr.length>0){
                            this.imglist=this.imglist.concat(arr);
                            this.pageNum++;
                            if(this.imglist.length<this.pageSize){
                                this.btntext='所有数据加载完毕';
                            }else{
                                this.btntext='加载更多';
                            }
                        }else{
                            this.btntext='所有数据加载完毕';
                        }
                        if(this.imglist.length==0){
                            this.noImgMsg = true;
                        }
                    }else{
                        this.$Message.warning(res.data.info);
                    }
                }else{
                    this.$Message.error("请求时出现错误");
                }
            }).catch(err => {
                console.log(err);
                this.$Message.error('服务器请求错误');
            })
        },
        selectImgs(item){
            if(this.selectIndex.indexOf(item.id) == -1){
                this.selectIndex.push(item.id);
            }else{
                this.selectIndex.splice(this.selectIndex.indexOf(item.id),1);
            }

            if(this.selectImgUrl.indexOf(item.imgurl) == -1){
                this.selectImgUrl.push(item.imgurl);
            }else{
                this.selectImgUrl.splice(this.selectImgUrl.indexOf(item.imgurl),1);
            }

        },
        selectAll(){
            this.selectIndex = [];
            this.selectImgUrl = [];
            for (let i = 0; i < this.imglist.length; i++) {
                this.selectIndex.push(this.imglist[i].id);
                this.selectImgUrl.push(this.imglist[i].imgurl);
            }
            this.$Message.success("已选中"+this.selectIndex.length+"张图像");
        },
        noselectAll(){
            if(this.selectIndex.length>0){
                this.selectIndex = [];
                this.$Message.success("已清空所选图像");
            }else{
                this.$Message.warning("你还没有选择图像哦");
            }
        },
        searchimg(){
            this.issearchimg = true;
        },
        startDateChange(e){
            console.log(e)
            this.searchStartDate = e;
        },
        stopDateChange(e){
            console.log(e)
            this.searchStopDate = e;
        },
        //检测两个日期大小
        compareDate(checkStartDate, checkEndDate) {
            var arys1= new Array();
            var arys2= new Array();
            if(checkStartDate != null && checkEndDate != null) {
                arys1=checkStartDate.split('-');
                  var sdate=new Date(arys1[0],parseInt(arys1[1]-1),arys1[2]);
                arys2=checkEndDate.split('-');
                var edate=new Date(arys2[0],parseInt(arys2[1]-1),arys2[2]);
                if(sdate > edate) {
                    alert("日期开始时间大于结束时间");
                    return false;
                }  else {
                    alert("通过");
                    return true;
                }
            }
        },

        //搜索触发
        tosearch(){
            this.pageNum = 1;
            this.imglist = [];
            this.selectIndex = [];
            this.selectImgUrl = [];
            this.selectPhoto();
        },
        imgInfo (e) {
            this.isimginfo = true;
            this.getBucketName(e.source);
            if(e.username!=null){
                this.upName =e.username;
            }else{
                this.upName = '游客';
            }
            if(e.violation!=null && e.violation!=""){
                this.isViolation.isControl = true;
            }else{
                this.isViolation.isControl = false;
            }
            this.imgage = e;
        },

        delSelectImg(){
            if(this.selectIndex.length==0){
                this.$Message.warning("请先选择要操作的数据");
                return false;
            }
            this.$Modal.confirm({
                title: '确认删除',
                content: '<p>确认删除所选图像吗</p>',
                onOk: () => {
                    this.deleteImages(null,null);
                },
                onCancel: () => {
                }
            });

        },
        delImg(id,index){
            this.$Modal.confirm({
                title: '确认删除',
                content: '<p>确认删除所选图像吗</p>',
                onOk: () => {
                    this.deleteImages(id,index);
                },
                onCancel: () => {
                }
            });

        },
        deleteImages(id,index){
            this.$Spin.show();
            var paramJson={};
            if(id==null){
                if(this.selectIndex.length==0){
                    this.$Message.warning("所选数据丢失，不可操作");
                    return false;
                }
            }else{
                this.selectIndex=[];
                this.selectIndex.push(id);
            }
            paramJson.images=this.selectIndex;
            request(
                "/admin/deleImages",
                paramJson).then(res => {
                if(res.status==200){
                    if(index!=null){
                        this.imglist.splice(index, 1);
                    }else{
                        for (let i = 0; i < this.imglist.length; i++) {
                            for (let j = 0; j < this.selectIndex.length; j++) {
                                if(this.imglist[i].id==this.selectIndex[j]){
                                    this.imglist.splice(i, 1);
                                }
                            }
                        }
                    }
                    this.selectIndex = [];
                    this.selectImgUrl = [];
                    this.$Spin.hide();
                    if(res.data.code=='200'){
                        this.$Message.success(res.data.info);
                    }else{
                        this.$Message.warning(res.data.info);
                    }
                    this.selectIndex=[];
                }else{
                    this.$Message.error("请求时出现错误");
                }

            }).catch(err => {
                this.$Spin.hide();
                console.log(err);
                this.$Message.error('服务器请求错误');
            })
        },

        getBucketName(id) {
            this.bucketname = "";
            for (let i = 0; i < this.bucketlist.length; i++) {
                if(id==this.bucketlist[i].id){
                    this.bucketname = this.bucketlist[i].keyname;
                }
            }
        },
        copy(){
            var clipboard = new this.clipboard('.cobyOrderSn')
            clipboard.on('success', e => {
                this.$Message.success('复制成功');
                clipboard.destroy()
            })
            clipboard.on('error', e => {
                this.$Message.error('该浏览器不支持自动复制');
                clipboard.destroy()
            })
        },
        getStorage(){
            request(
                "/admin/getStorageName",
                {}).then(res => {
                if(res.status==200){
                    this.$Spin.hide();
                    this.bucketlist = res.data.data;
                    this.$Spin.hide();
                }
            }).catch(err => {
                this.$Spin.hide();
                console.log(err);
                this.$Message.error('服务器请求错误');
            })
        },
        formatBytes(a,b){if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]},
        showViewType(){
            this.$Spin.show();
            setTimeout(() =>{
                if(this.viewType==1){
                    this.toolBottom = 15;
                    this.viewType=2;
                    this.selectPhoto();
                }else{
                    this.toolBottom = 5;
                    this.viewType=1;
                    this.selectPhoto();
                }
                this.$Spin.hide();
            },1000);

        },

    },
    mounted(){
        window.onresize = () => {
            return (() => {
                window.screenWidth = document.body.clientWidth
                this.screenWidth = window.screenWidth
            })()
        }
        this.$Spin.show();
        this.getStorage();
        this.selectPhoto();
    },
    components:{
        Treeselect,
        vueQr,
    }

}
