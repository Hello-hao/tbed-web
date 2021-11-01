import albumList from '../../components/comp/album-list.vue'
import {request} from "../../network/request";
import vueQr from 'vue-qr'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import md5 from "js-md5";

export default {
    metaInfo() {
        return {
            title: this.$store.state.metaInfo.webname+this.$store.state.metaInfo.splitline+this.$store.state.metaInfo.websubtitle, // set a title
            meta: [   // set meta
                {
                    name: 'keyWords',
                    content: this.$store.state.metaInfo.keywords
                },
                {
                    name: 'description',
                    content: this.$store.state.metaInfo.description
                }
            ],
            link: [{
                rel: 'asstes',
                href: 'http://www.hellohao.cn/'
            }]
        }

    },

    name: "upload",
    props: {
        msg: String
    },
    data () {
        return {
            uploadImg:require("../img/uploadImg.png"),
            linkImg:require("../img/link.png"),
            timeImg:require("../img/time.png"),
            isToolImgStyle:'width: 50px;',
            loading:false,
            urlUploadMsg:false,
            termMsg:false,//上传期限的弹窗
            imgUrl:null,
            uploadInfo:{
                suffix:null,
                filesize:null,
                imgcount:null,
            },
            isAlbum:false,
            ViewURL:null,
            albumData:{},
            headers: {
                'usersOrigin':md5(window.location.protocol+'//'+window.location.host),
                "Authorization":localStorage.getItem('Authorization')
            },
            data:{
                day:0,
                classifications:null
            },
            imgListShow:'show',
            selectIndex:[],
            selectIndexUid:[],//这个uid是系统自己生成的一个数字串，仅用于勾选上传图片使用，防止重复图片选一个 都是同一个imguid的问题
            selectImg:[],
            defaultList: [],
            imgName: '',
            visible: false,
            IsImgLink: false,
            uploadList: [],
            // imgLinkForShortLink:null,
            imgLinkForUrl:null,
            imgLinkForMD:null,
            imgLinkForHtml:null,
            images:[],
            imgIndex:null,
            albumlist:[],
            dayList:[{"label":"永久","value":0},{"label":"1天","value":1},{"label":"3天","value":3},{"label":"7天","value":7},{"label":"30天","value":30}],
            IsShowtagMsg:false,
            tagInfo:null,
            tempNum:0//验证是否提示过单次上传个数弹窗

        }
    },
    methods: {

        created(){
            this.imgListShow = 'show';
        },

        handleRemove (file) {
            this.$Modal.confirm({
                title: '确认删除',
                content: '<p>您确认删除该图像吗</p>',
                onOk: () => {
                    this.$Spin.show();
                    var param={
                        imguid:file.response.data.imguid
                    }
                    request(
                        "/deleImagesByUid",
                        param).then(res => {
                        this.$Spin.hide();
                        if(res.status==200){
                            if(res.data.code=='200'){
                                this.$Message.success(res.data.info);
                                const fileList = this.$refs.upload.fileList;
                                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
                            }else{
                                this.$Message.error(res.data.info);
                            }
                        }else{
                            this.$Message.error("请求时出现错误");
                        }
                    }).catch(err => {
                        this.$Spin.hide();
                        console.log(err);
                        this.$Message.error('服务器请求错误');
                    })

                },
                onCancel: () => {
                    // this.$Message.info('已取消删除');
                }
            });

        },
        handleSuccess (res, file) {
            this.tempNum = 0;
            if(res.code!="200"){
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
                this.$Message.error(res.info);
                return false;
            }
            if(res.length>0){
                this.images.push(res[0]);
            }
            let urlText = this.$store.state.copyAllUrl+res.data.url+'\n';
            this.$store.commit("setCopyAllUrl", urlText);
            this.$emit('showBtn',this.uploadList);
            const box = document.getElementById('box');
            box.scrollTop = box.scrollHeight;
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: file.name + ' 的文件格式不受支持.'
            });
        },
        handleMaxSize (file) {
            this.$Notice.warning({
                title: '超过图像大小限制',
                desc: '文件: ' + file.name + ' 太大, 不能超过 '+this.uploadInfo.filesize+' K'
            });
        },
        handleBeforeUpload () {
            const check = this.uploadList.length < this.uploadInfo.imgcount;
            if (!check) {
                if(this.tempNum==0){
                    this.$Notice.warning({
                        name:'imgcount',
                        duration: 0,
                        onClose:this.setImgCountMSG,
                        title: '页面上传图像过多',
                        desc: '系统限制了页面的上传图像数量，上传图像不得超过'+this.uploadInfo.imgcount+'个图像'
                    });
                    this.tempNum=1;
                }

            }
            return check;
        },
        setImgCountMSG(){
            this.tempNum=0;
        },
        uploadError(){
          console.log("图片上传出错")
        },
        allSett(){
            if(this.selectIndex.length>0){
                this.getAlbumImgList();
                this.visible = true;
            }else{
                this.$Message.info('请选择要操作的图片');
            }
        },
        clickImg(key,uid){
            if(this.selectIndexUid.indexOf(uid) == -1){
                this.selectIndex.push(key);
                this.selectIndexUid.push(uid);
            }else{
                this.selectIndex.splice(this.selectIndex.indexOf(key),1);
                this.selectIndexUid.splice(this.selectIndexUid.indexOf(uid),1);
            }

        },
        uploadForUrl(){
            if(this.imgUrl!=null && this.imgUrl!=''){
                if(this.imgUrl.indexOf("http")!=-1 && this.imgUrl.indexOf("://") !=-1 && this.imgUrl.indexOf(".") !=-1){
                    this.loading = true;
                    this.sendUploadForUrl();
                }else{
                    this.$Message.warning("请输入正确格式的链接地址");
                }
            }else{
                this.$Message.warning("请先输入图像链接");
            }

        },
        sendUploadForUrl(){
            var param={
                day:0,
                imgUrl:this.imgUrl
            }
            request(
                "/uploadForUrl",
                param).then(res => {
                this.loading = false;
                this.urlUploadMsg = false;
                if(res.status==200){
                    if(res.data.code=='200'){
                        var json = {
                            "status":"finished",
                            "name":"link.png",
                            "size":0,
                            "percentage":100,
                            "uid":this.getUuid(14,14),
                            "showProgress":false,
                            "response":res.data,
                            "exceptions":null
                        }
                        this.$refs.upload.fileList.push(json);
                        let urlText = this.$store.state.copyAllUrl+res.data.url+'\n';
                        this.$store.commit("setCopyAllUrl", urlText);
                        this.$emit('showBtn',this.uploadList)
                        this.$Message.success("上传成功");
                    }else{
                        this.$Message.warning(res.data.info);
                    }

                }else{
                    this.$Message.error("请求时出现错误");
                }
            }).catch(err => {
                this.$Spin.hide();
                this.loading = false;
                this.urlUploadMsg = false;
                console.log(err);
                this.$Message.error('服务器请求错误');
            })
        },
        //获取选中的画廊图片信息
        getAlbumImgList(){
            var param={
                imguidlist:this.selectIndex
            }
            request(
                "/getAlbumImgList",
                param).then(res => {
                this.$Spin.hide();
                if(res.status==200){
                    var json = res.data.data;
                    this.albumlist = json;

                }else{
                    this.$Message.error("请求时出现错误");
                }
            }).catch(err => {
                this.$Spin.hide();
                console.log(err);
                this.$Message.error('服务器请求错误');
            })
        },
        getUploadInfo(){
            request(
                "/getUploadInfo",
                {}).then(res => {
                this.$Spin.hide();
                if(res.status==200){
                    var json = res.data.data;
                    if(json){
                        this.uploadInfo = json;
                    }else{
                        this.$Message.error("获取当前上传信息时出现错误");
                    }
                }else{
                    this.$Message.error("获取当前上传信息时出现错误");
                }
            }).catch(err => {
                this.$Spin.hide();
                console.log(err);
                this.$Message.error('服务器请求错误');
            })
        },
        getImgLink(img){
            var host = window.location.host;
            this.imgLinkForUrl = img.response.data.url;
            this.imgLinkForHtml = '<img src="'+img.response.data.url+'" alt="'+img.name+'" />';
            this.imgLinkForMD = '!['+img.name+']('+img.response.data.url+')';
            this.IsImgLink = true;
        },
        copyBtn(){
            var e = document.createEvent('MouseEvents')
            e.initEvent('click', true, true)
            document.getElementById('idCopyAll').dispatchEvent(e)
        },
        copy(){
            var clipboard = new this.clipboard('.cobyOrderSn')
            clipboard.on('success', e => {
                this.$Message.success('复制成功');
                // 释放内存
                clipboard.destroy()
            })
            clipboard.on('error', e => {
                // 不支持复制
                this.$Message.error('该浏览器不支持自动复制');
                // 释放内存
                clipboard.destroy()
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
        showUrlUploadMsg(){
            this.urlUploadMsg = true;
        },
        showtermMsg(){
            this.termMsg = true;
        },

        selectTerm(value){
            this.termMsg = false;
            if(value==0){
                this.$Notice.info({
                    title: '您之后上传的数据将会永久保存'
                });
            }else{
                this.$Notice.info({
                    title: '您之后上传的数据将会在'+value+'天后过期'
                });
            }

        },
        // 移入
        mouseOver() {
            this.isToolImgStyle = "width: 50px;\n" +
                "  -webkit-transition:all 0.5s ease 0s;\n" +
                "  -moz-transition:all 0.5s ease 0s;\n" +
                "  transition:all 0.5s ease 0s;";
        },
        // 移出
        mouseLeave() {
            this.isToolImgStyle = "width: 50px;\n";
        },
        getUuid(len, radix) {
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var uuid = [],
                i;
            radix = radix || chars.length;

            if (len) {
                for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
            } else {
                var r;
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';

                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random() * 16;
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }
            return uuid.join('');
        },

    },
    mounted () {
        this.$Spin.show();
        this.getUploadInfo();
        this.uploadList = this.$refs.upload.fileList;
    },
    components: {
        albumList,
        vueQr,
        Treeselect
    },
    computed:{

    }

}
