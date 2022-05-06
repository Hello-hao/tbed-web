import {request} from "@/network/request";
import vueQr from 'vue-qr'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import albumList from '../../components/comp/album-list.vue'

export default {
    name: "photo",
    data () {
        return {
            isPageLoad:true,
            isDelfun:false, //删除时的遮罩控制
            delProgress:{},//删除时的实时数据
            delOver:false,//是否删除完成了
            delImgCount:0,//删除选中图片的总个数
            isDelImgModal:false,//删除失败的图像展示框
            screenWidth:document.body.clientWidth,
            httpText:window.location.protocol,
            hostText:window.location.host,
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
            pageSize:40,
            selecttype:2,
            type:'picture',
            selectIndex:[],
            selectImgUrl:[],
            selectImgUid:[],
            bucketname:null,
            bucketlist:[],
            selectUserType:'me',
            searchtype:'1',//查询的文本类型
            searchtext:null,//查询的文本
            searchbucket:'',
            searchStartDate:null,
            searchStopDate:null,
            submitData:[],
            toolBottom:10,
            nextButloading:false,
            btntext:'加载更多',
            treePopup: false,
            violation:false,
            moveImgLoading:false,
            noImgMsg : false,//没有图像的时候提示
            //画廊
            isAlbum:false,
            visible: false,
            albumlist:[],
            albumData:{},
            spinShow:true,
            copyImgUrl:{
                IsImgLink:false,
                imgLinkForUrl:null,
                imgLinkForMD:null,
                imgLinkForHtml:null,
            }

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
            paramJson.selectUserType = this.selectUserType;
            if(this.selectUserType=='me'){
                paramJson.selecttype = null;
                paramJson.username = null;
            }else{
                paramJson.selecttype = this.searchtype;
                paramJson.username = this.searchtext;
            }
            paramJson.source=this.searchbucket;
            paramJson.starttime=this.searchStartDate==''?null:this.searchStartDate;
            paramJson.stoptime=this.searchStopDate==''?null:this.searchStopDate;
            paramJson.violation = this.violation;
            this.treePopup = false;
            request(
                "/admin/selectPhoto",
                paramJson).then(res => {
                if(res.status==200){
                    if(res.data.code=='200'){
                        var arr = res.data.data.rows;
                        this.nextButloading=false;
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
            if(this.selectImgUid.indexOf(item.imguid) == -1){
                this.selectImgUid.push(item.imguid);
            }else{
                this.selectImgUid.splice(this.selectImgUid.indexOf(item.imguid),1);
            }

        },
        //显示画廊窗
        allSett(){
            if(this.selectIndex.length>0){
                this.getAlbumImgList();
                this.visible = true;
            }else{
                this.$Message.info('请选择要操作的图片');
            }
        },
        //获取选中的画廊图片信息
        getAlbumImgList(){
            var param={
                imguidlist:this.selectImgUid//JSON.stringify(this.selectIndex),
            }
            request(
                "/getAlbumImgList",
                param).then(res => {
                this.$Spin.hide();
                if(res.status==200){
                    var json = res.data.data;
                    this.albumlist = json;

                    this.selectIndex = [];
                    this.selectImgUrl = [];
                    this.selectImgUid = [];

                    this.spinShow = false;
                }else{
                    this.$Message.error("请求时出现错误");
                }
            }).catch(err => {
                this.$Spin.hide();
                console.log(err);
                this.$Message.error('服务器请求错误');
            })
        },
        returnData(data){
            this.visible = false;
            this.albumData = data;
            if(this.albumData.password==null || this.albumData==''){
                this.albumData.password='无';
            }
            this.albumData.url = window.location.protocol+'//'+window.location.host+'/h/'+data.url;
            this.isAlbum=true;
        },
        selectAll(){
            this.selectIndex = [];
            this.selectImgUrl = [];
            this.selectImgUid = [];
            for (let i = 0; i < this.imglist.length; i++) {
                this.selectIndex.push(this.imglist[i].id);
                this.selectImgUrl.push(this.imglist[i].imgurl);
                this.selectImgUid.push(this.imglist[i].imguid);
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
            // paramJson.images=this.selectIndex;
            paramJson.images=this.selectIndex.toString()+"";
            this.delImgCount = this.selectIndex.length;//删除图像的总个数。用作页面显示
            this.TimeingDelImg();
            request(
                "/admin/deleImages",
                paramJson).then(res => {
                if(res.status==200){
                    // if(index!=null){
                    //     this.imglist.splice(index, 1);
                    // }else{
                    //     for (let i = 0; i < this.imglist.length; i++) {
                    //         for (let j = 0; j < this.selectIndex.length; j++) {
                    //             if(this.imglist[i].id==this.selectIndex[j]){
                    //                 this.imglist.splice(i, 1);
                    //             }
                    //         }
                    //     }
                    // }

                }else{
                    this.$Message.error("请求时出现错误");
                }

            }).catch(err => {
                console.log(err);
                this.$Message.error('服务器请求错误');
            })
        },

        TimeingDelImg(){
            var that = this;
            var interval = setInterval(function(){
                that.GetDelprogress();
                if(that.delOver){
                    clearInterval(interval);
                    that.isDelfun = false;
                    that.$Message.success("删除完成");
                    this.selectIndex = [];
                    this.selectImgUrl = [];
                    this.selectImgUid = [];
                    var oklist = that.delProgress.oklist;
                    if(that.delProgress.errorlist!=null){
                        if(that.delProgress.errorlist>0){
                            this.isDelImgModal=true;
                        }
                    }
                    if(oklist.length>0){
                        for (let i = 0; i < that.imglist.length; i++) {
                            for (let j = 0; j < oklist.length; j++) {
                                if(that.imglist[i].id==oklist[j]){
                                    that.imglist.splice(i, 1);
                                }
                            }
                        }
                    }

                }else{
                    // that.$Message.warning("正在删除");
                    that.isDelfun = true;
                }
            }, 500);
        },

        getBucketName(id) {
            this.bucketname = "";
            for (let i = 0; i < this.bucketlist.length; i++) {
                if(id==this.bucketlist[i].id){
                    this.bucketname = this.bucketlist[i].keyname;
                }
            }
        },
        showCopyImgUrl(img){
            this.copyImgUrl.imgLinkForUrl = img.imgurl;
            this.copyImgUrl.imgLinkForHtml = '<img src="'+img.imgurl+'" alt="'+img.imgname+'" />';
            this.copyImgUrl.imgLinkForMD = '!['+img.imgname+']('+img.imgurl+')';
            this.copyImgUrl.IsImgLink=true;
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

        //删除时的实时刷新
        GetDelprogress(){
            this.$http(
                "/admin/GetDelprogress",
                {}).then(res => {
                if(res.status==200){
                    var json = res.data;
                    if(json!=null && json !=undefined && json!=""){
                        this.delProgress = json.data;
                        if(json.data.delover=='true' || json.data.delover==true){
                            this.delOver = true;
                            this.timesRun = 0;
                        }
                    }
                }else{
                    this.$Message.error("获取进度_请求时出现错误");
                }
            }).catch(err => {
                console.log(err);
                this.$Message.error('获取进度_服务器请求错误');
            })
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
        albumList,
        Treeselect,
        vueQr,
    }

}
