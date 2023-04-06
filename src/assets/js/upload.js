import albumList from '../../components/comp/album-list.vue'
import {request} from "../../network/request"
import vueQr from 'vue-qr'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import md5 from "js-md5"
import UploaderList from "@/components/comp/uploadList"
// import ColorThief from "colorthief";
import SparkMD5 from "spark-md5";

export default {
    metaInfo() {
        return {
            title: this.$store.state.metaInfo.webname + this.$store.state.metaInfo.splitline + this.$store.state.metaInfo.websubtitle, // set a title
            meta: [   // set meta
                {
                    name: 'keyWords',
                    content: this.$store.state.metaInfo.keywords
                },
                {
                    name: 'description',
                    content: this.$store.state.metaInfo.webms
                }
            ],
            link: [{
                rel: 'asstes',
                href: 'http://www.hellohao.cn/'
            }, {
                link: [{                 // set link
                    rel: 'icon',
                    href: 'https://g.csdnimg.cn/static/logo/favicon32.ico'
                }]
            }]
        }

    },

    name: "upload",
    props: {
        msg: String
    },
    data() {
        return {
            screenWidth: 720,
            uploadImg: require("../img/uploadImg.png"),
            timeImg: require("../img/time.png"),
            // tagImg: require("../assets/img/tag.png"),
            // storeImg: require("../assets/img/store.png"),
            isToolImgStyle: 'width: 50px;',
            loading: false,
            urlUploadMsg: false,
            termMsg: false,//上传期限的弹窗
            imgUrl: null,
            uploadInfo: {
                // - 图片支持格式
                suffix: null,
                // - 图片限制大小（访客、用户）
                filesize: null,
                // - 图片最多同时上传个数
                imgcount: 1,
                // - 上传开关（访客、用户）
                uploadSwitch: 0,
            },
            isAlbum: false,
            albumData: {},
            // data:{
            //     day:0,
            //     classifications:null,
            //     source:0
            // },
            img_day: 0,
            selectIndex: [],
            selectIndexUid: [],//这个uid是系统自己生成的一个数字串，仅用于勾选上传图片使用，防止重复图片选一个 都是同一个imguid的问题
            selectImg: [],
            visible: false,
            IsImgLink: false,
            uploadList: [],
            imgLinkForUrl: null,
            imgLinkForBriefimgurl: null,
            imgLinkForMD: null,
            imgLinkForHtml: null,
            images: [],
            imgIndex: null,
            //画廊多选操作所需变量
            albumlist: [],
            dayList: [{"label": "永久", "value": 0}, {"label": "1天", "value": 1}, {
                "label": "3天",
                "value": 3
            }, {"label": "7天", "value": 7}, {"label": "30天", "value": 30}],
            tempLink: 0,
            tempURLErr: false,
            upUrlNum: -1,
            ismsg: null,
            spinShow: false,
            mytheme: {
                myColor1: 'rgba(255, 255, 255, .9)',//卡片背景
                myColor2: '#515860',//文字颜色/边框颜色/图标颜色
                myColor3: '#f35d58',//按钮颜色
                myColor4: '#515860',
            },
        }
    },
    watch: {
        img_day: function (newval, oldval) {
            localStorage.setItem("img_day", newval)
            // console.log("newval",newval)
            // console.log("oldval",oldval)
        },

    },
    beforeUpdate() {
        //解决弹窗关闭后的延迟问题
        // let chArr = document.body.getElementsByClassName("ivu-modal-mask");
        // for (let i = 0; i < chArr.length; i++) {
        //     if (chArr[i] != null)
        //         chArr[i].remove(chArr[i]);
        // }
    },
    mounted() {
        localStorage.setItem("img_day", this.img_day)
        this.$refs.UploaderList.setAssign(document.getElementById('bodydom'))
        this.$Spin.show();
        this.getUploadInfo();

    },
    methods: {
        returnImgData(data) {
            // console.log('上传页面接到的返回值',data)
            this.uploadList.push(data)
            this.$store.commit("setCopyAllUrl", this.uploadList);
            this.$emit('showBtn', this.uploadList);
        },
        getProgress() {
            this.$refs.UploaderList.showProgressModel()
        },
        async sendImgData(file) {
            if (this.getUploadSwitch) {
                this.$Message.warning("系统暂时关闭了用户上传功能");
                return;
            } else {
                this.$Notice.info({
                    title: '图像上传',
                    desc: '剪贴板图像上传准备开始...'
                });
            }
            var ret = await this.getFileMD5(file);
            var formRrcover = new FormData()
            formRrcover.append('file', file)
            formRrcover.append('day', window.localStorage.getItem('img_day'))
            formRrcover.append('md5', ret)
            this.$http.post('/upload', formRrcover, {
                'Content-type': 'multipart/form-data',
                timeout: 600000
            }).then(res => {
                if (res.data.code == '200') {
                    this.uploadList.push(res.data.data)
                    this.$store.commit("setCopyAllUrl", this.uploadList);
                    this.$emit('showBtn', this.uploadList);
                } else {
                    this.$Message.warning("上传剪贴板图像失败");
                }
            }, err => {
                // 出现错误时的处理
            })
        },
        getFileMD5(file) {
            return new Promise((resolve, reject) => {
                try {
                    var fileReader = new FileReader();
                    var spark = new SparkMD5.ArrayBuffer();
                    fileReader.readAsArrayBuffer(file);
                    fileReader.onload = function (e) {
                        spark.append(e.target.result);
                        var md5 = spark.end();
                        resolve(md5)
                    };
                } catch (e) {
                    reject(null)
                }
            })
        },
        handleRemove(file) {
            this.$Modal.confirm({
                title: '确认删除',
                content: '<p>您确认删除该图像吗</p>',
                onOk: () => {
                    this.$Spin.show();
                    var param = {
                        imguid: file.imguid
                    }
                    request(
                        "/deleImagesByUid",
                        param).then(res => {
                        this.$Spin.hide();
                        if (res.status == 200) {
                            if (res.data.code == '200') {
                                this.$Message.success(res.data.info);
                                for (let i = 0; i < this.uploadList.length; i++) {
                                    if (this.uploadList[i].imguid == file.imguid) {
                                        this.uploadList.splice(i, 1);
                                    }
                                }
                                this.$store.commit("setCopyAllUrl", this.uploadList);
                                this.$emit('showBtn', this.uploadList);
                                this.selectIndex.splice(this.selectIndex.indexOf(file.imguid), 1);
                                this.selectIndexUid.splice(this.selectIndexUid.indexOf(file.imguid), 1);
                            } else {
                                this.$Message.error(res.data.info);
                            }
                        } else {
                            this.$Message.error("请求时出现错误");
                        }
                    }).catch(err => {
                        this.$Spin.hide();
                        console.log(err);
                    })
                },
                onCancel: () => {
                    // this.$Message.info('已取消删除');
                }
            });

        },
//滚动到最下边
        // const box = document.getElementById('box');
        // box.scrollTop = box.scrollHeight;
        allSett() {
            if (this.selectIndex.length > 0) {
                this.getAlbumImgList();
                this.visible = true;
            } else {
                this.$Message.info('请选择要操作的图片');
            }
        },
        clickImg(key) {
            if (this.selectIndex.indexOf(key) == -1) {
                this.selectIndex.push(key);
            } else {
                this.selectIndex.splice(this.selectIndex.indexOf(key), 1);
            }
        },
        uploadForUrl() {
            if (this.imgUrl == null || this.imgUrl == '') {
                this.$Message.warning("请先输入图像链接");
                return;
            }
            if (this.imgUrl != null && this.imgUrl != '') {
                if (this.imgUrl.indexOf("http") != -1 && this.imgUrl.indexOf("://") != -1 && this.imgUrl.indexOf(".") != -1) {
                    this.loading = true;
                    this.sendUploadForUrl(this.imgUrl);
                    this.loading = false;
                    this.urlUploadMsg = false;
                    this.spinShow = true;
                } else {
                    this.$Message.warning("请输入正确格式的链接地址");
                }
            } else {
                this.$Message.warning("请先输入图像链接");
            }
        },
        sendUploadForUrl(urlText) {
            var param = {
                day: this.img_day,
                imgUrl: urlText,
            }
            request(
                "/uploadForUrl",
                param, 1000 * 60 * 120).then(res => {
                this.spinShow = false;
                if (res.status == 200) {
                    this.upUrlNum++;
                    if (res.data.code == '200') {
                        let jsonData = res.data.data;
                        if (jsonData.urls.length > 0) {
                            for (let i = 0; i < jsonData.urls.length; i++) {
                                this.uploadList.push(jsonData.urls[i].data)
                            }
                            if (this.uploadList.length > 0) {
                                this.$store.commit("setCopyAllUrl", this.uploadList);
                                this.$emit('showBtn', this.uploadList);
                            }
                        }
                        this.imgUrl = null;
                        var text = "";
                        if (jsonData.excess > 0) {
                            text = "欲上传总数为: <font color='#6495ed' style='font-size: 16px;'>" + jsonData.counts +
                                "</font><br/>上传失败数为: <font color='#a52a2a' style='font-size: 16px;'>" + jsonData.errcounts +
                                "</font><br/>受系统限制单次上传数量限制，其中<font color='#ff7f50' style='font-size: 16px; '>" + jsonData.excess +
                                "</font>个链接不被执行上传操作";
                        } else {
                            text = "欲上传总数为: <font color='#6495ed' style='font-size: 16px;'>" + jsonData.counts +
                                "</font><br/>上传失败数为: <font color='#a52a2a' style='font-size: 16px;'>" + jsonData.errcounts;
                        }
                        this.$Modal.info({
                            title: "批量上传执行完毕",
                            content: text
                        });
                        this.imgUrl = null;
                    } else {
                        this.$Message.warning(res.data.info);
                    }
                } else {
                    this.$Message.error("请求时出现错误");
                }
            }).catch(err => {
                this.$Spin.hide();
                console.log(err);
                this.$Message.error(err);
            })
        },
        //获取选中的画廊图片信息
        getAlbumImgList() {
            var param = {
                imguidlist: this.selectIndex//JSON.stringify(this.selectIndex),
            }
            request(
                "/getAlbumImgList",
                param).then(res => {
                this.$Spin.hide();
                if (res.status == 200) {
                    var json = res.data.data;
                    this.albumlist = json;

                } else {
                    this.$Message.error("请求时出现错误");
                }
            }).catch(err => {
                this.$Spin.hide();
                console.log(err);
                this.$Message.error('服务器请求错误');
            })
        },
        getUploadInfo() {
            request(
                "/getUploadInfo",
                {}).then(res => {
                this.$Spin.hide();
                if (res.status == 200) {
                    var json = res.data.data;
                    if (json) {
                        this.uploadInfo = json;
                        this.$refs.UploaderList.setUploadInfo(json)
                    } else {
                        this.$Message.error("获取当前上传信息时出现错误");
                    }
                } else {
                    console.error("获取当前上传信息时出现错误");
                }
            }).catch(err => {
                this.$Spin.hide();
                console.log(err);
                this.$Message.error('服务器请求错误');
            })
        },
        getImgLink(img) {
            var host = window.location.host;
            this.imgLinkForUrl = img.url;
            this.imgLinkForBriefimgurl = img.briefimgurl;
            this.imgLinkForHtml = '<img src="' + img.url + '" alt="' + img.name + '" />';
            this.imgLinkForMD = '![' + img.name + '](' + img.url + ')';
            this.IsImgLink = true;
        },
        copyBtn() {
            var e = document.createEvent('MouseEvents')
            e.initEvent('click', true, true)
            document.getElementById('idCopyAll').dispatchEvent(e)
        },
        copy() {
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
        returnData(data) {
            this.visible = false;
            this.albumData = data;
            if (this.albumData.password == null || this.albumData == '') {
                this.albumData.password = '无';
            }
            this.albumData.url = window.location.protocol + '//' + window.location.host + '/h/' + data.url;
            this.isAlbum = true;
        },
        showUrlUploadMsg() {
            if (this.uploadInfo.uploadSwitch == 1) {
                this.urlUploadMsg = true;
            } else {
                this.$Message.warning(this.uploadInfo.uploadInfo);
            }
        },
        showtermMsg() {
            this.termMsg = true;
        },

        selectTerm(value) {
            this.termMsg = false;
            if (value == 0) {
                this.$Notice.info({
                    title: '您之后上传的数据将会永久保存'
                });
            } else {
                this.$Notice.info({
                    title: '您之后上传的数据将会在' + value + '天后过期'
                });
            }
        },

        onGetLines() {
            var tempText = this.imgUrl;
            if (this.imgUrl == '') {
                this.tempLink = 0;
            } else {
                let lines = tempText.split(/\r*\n/);
                let linesCount = lines.length - (navigator.userAgent.indexOf('MSIE') !== -1);
                this.tempLink = linesCount;
                if (this.uploadInfo.imgcount < linesCount) {
                    this.tempURLErr = true;
                } else {
                    this.tempURLErr = false;
                }
            }
        },

        imgOnOk() {
            // var op = 0;
            // var than = this;
            // var interval = null
            // try {
            //     interval = setInterval(function(){
            //         than.$refs.webbgimg.style.opacity=op+' ';
            //         than.$refs.webbgimg.style.display = 'block'
            //         op = op+0.1
            //         if(op>=0.9){
            //             clearInterval(interval);
            //         }
            //     },100)
            // }catch (err){
            //     clearInterval(interval);
            //     console.log(err)
            // }
        },
        imgOnError() {
            console.log("imgOnError-none")
            this.$refs.webbgimg.style.display = 'none'
        },
        //颜色排序
        sortColor(colors) {
            var than = this
            return colors.sort(function (a, b) {
                //由深到浅
                return than.grayLevel(a) - than.grayLevel(b)
            })
        },
        grayLevel(color) {
            //必须要是rgb格式
            var arr = this.getMid(color).split(',')
            var r = arr[0], g = arr[1], b = arr[2];
            return r * 0.299 + g * 0.587 + b * 0.114
        },
        getMid(str) {
            var left = str.indexOf('(') + 1;
            var right = str.indexOf(')');
            return str.slice(left, right);
        },
        //判断颜色深浅色
        hexToRgb(colorChange) {   //HEX十六进制颜色值转换为RGB(A)颜色值
            var grayLevel = colorChange[0] * 0.299 + colorChange[1] * 0.587 + colorChange[2] * 0.114;
            if (grayLevel >= 192) {//浅色模式
                //浅色背景 用深色文字
                return '#28272b';
            } else {
                //深色背景 用浅色文字
                return '#dadada';
            }
        },
    },

    components: {
        albumList,
        vueQr,
        Treeselect,
        UploaderList
    },
    computed: {
        getUploadSwitch: function () {
            return this.uploadInfo.uploadSwitch == 1 ? false : true;
        },
    }

}
