import {request} from "@/network/request";
import vueQr from 'vue-qr'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import albumList from '../../components/comp/album-list.vue'
import {v4 as uuidv4} from 'uuid';

export default {
    name: "photo",
    data() {
        return {
            bigImg:require("../img/bigImg.jpg"),
            pageUUID: null,
            imgWidth: 160,
            rightClickData: {},
            isPageLoad: true,
            isDelfun: false, //删除时的遮罩控制
            delProgress: {},//删除时的实时数据
            delOver: false,//是否删除完成了
            delImgCount: 0,
            isDelImgModal: false,//删除失败的图像展示框
            screenWidth: document.body.clientWidth,
            httpText: window.location.protocol,
            hostText: window.location.host,
            upName: null,
            isViolation: {
                isControl: false,
                info: "此图像可能存在违规内容 建议删除"
            },
            isimginfo: false,
            imglist: [],
            pageNum: 1,
            pageSize: 100,
            selecttype: 2,
            type: 'picture',
            bucketname: null,
            bucketlist: [],
            searchData: {
                selectUserType: 'me',
                order: 'desc',
                searchname: null,//图像名称
                searchbucket: '',
                searchtext: null,//查询的文本
                searchtype: '1',//查询的文本类型
                searchStartDate: null,
                searchStopDate: null,
                violation: false,
            },
            submitData: [],
            toolBottom: 10,
            nextButloading: false,
            btntext: '加载更多',
            treePopup: false,
            moveImgLoading: false,
            noImgMsg: false,//没有图像的时候提示
            //画廊
            isAlbum: false,
            visible: false,
            albumlist: [],
            albumData: {},
            spinShow: true,
            copyAllImgUrl: {
                isCopyMsg: false,
                myurl: '[url=@myurl@][img]@myurl@[/img][/url]',
                urlTexts_url: '',//多选复制
                urlTexts_html: '',//多选复制
                urlTexts_md: '',//多选复制
                urlTexts_diy: '', //多选复制
            },
            select: {
                selectIndex: [],
                selectImgUrl: [],
                selectImgUid: [],
            },
            delPrompt:false,//删除提示框控制
            forceDel:false,//是否强制删除
            delLoading:false,
            imgIndex:null,//当前大图浏览的图片下标
        }
    },
    created() {
        this.pageUUID = uuidv4();
    },
    mounted() {
        this.pageUUID = uuidv4();
        //滚轮监听
        window.addEventListener("scroll", this.handleScroll, true);
        // if (this.$refs.dom.clientWidth <= 356) {
        //     this.imgWidth = 130;
        // } else {
        //     this.imgWidth = 160;
        // }
        const that = this
        window.onresize = () => {
            return (() => {
                try {
                    window.screenWidth = document.body.clientWidth
                    that.screenWidth = window.screenWidth
                    that.clientWidth = that.$refs.dom.clientWidth + 'px';
                    if (that.$refs.dom.clientWidth <= 356) {
                        that.imgWidth = 130;
                    } else {
                        that.imgWidth = 160;
                    }
                } catch (e) {
                    that.imgWidth = 160;
                }
            })()
        }

        this.$Spin.show();
        this.getStorage();
        this.selectPhoto();
    },
    methods: {
        // lookImg(img) {
        //     this.$refs[`myImages_${img.id}`][0].click()
        // },
        setImgIndex(index) {
            try{
                if(Number(this.imglist[index].sizes)>52428800){
                    this.$Message.warning("该图片过大，网站查看可能存在卡顿，请下载后在本机查看。");
                } else {
                    this.imgIndex = index
                }
            }catch (e) {
                console.error(e)
                this.imgIndex = index
            }
        },

        selectPhoto(t) {
            // this.$Spin.show();
            this.nextButloading = true;
            var paramJson = {};
            paramJson.pageNum = this.pageNum;
            paramJson.pageSize = this.pageSize;
            paramJson.selectUserType = this.searchData.selectUserType;
            paramJson.searchname = this.searchData.searchname;
            if (this.searchData.selectUserType == 'me') {
                paramJson.selecttype = null;
                paramJson.username = null;
            } else {
                paramJson.selecttype = this.searchData.searchtype;
                paramJson.username = this.searchData.searchtext;
            }
            paramJson.source = this.searchData.searchbucket;
            paramJson.starttime = this.searchData.searchStartDate == '' ? null : this.searchData.searchStartDate;
            paramJson.stoptime = this.searchData.searchStopDate == '' ? null : this.searchData.searchStopDate;
            paramJson.violation = this.searchData.violation;
            paramJson.order = this.searchData.order;
            if (t == 'search') {
                this.closeDrawer();
            }
            this.treePopup = false;
            request(
                "/admin/selectPhoto",
                paramJson).then(res => {
                if (res.status == 200) {
                    if (res.data.code == '200') {
                        var arr = res.data.data.rows;
                        this.nextButloading = false;
                        if (arr.length > 0) {
                            arr = arr.map(({ imgurl, ...rest }) => {
                                return { src: imgurl, ...rest };
                            });
                            this.imglist = this.imglist.concat(arr);
                            this.pageNum++;
                            if (this.imglist.length < this.pageSize) {
                                this.btntext = '所有数据加载完毕';
                            } else {
                                this.btntext = '加载更多';
                            }
                        } else {
                            this.btntext = '所有数据加载完毕';
                        }
                        if (this.imglist.length == 0) {
                            this.noImgMsg = true;
                        }
                    } else {
                        this.$Message.warning(res.data.info);
                    }
                } else {
                    this.$Message.error("请求时出现错误");
                }
            }).catch(err => {
                console.log(err);
                this.$Message.error('服务器请求错误');
            })
        },
        selectImgs(item) {
            // this.rightClickData =
            if (this.select.selectIndex.indexOf(item.id) == -1) {
                this.select.selectIndex.push(item.id);
                this.rightClickData = item
            } else {
                this.select.selectIndex.splice(this.select.selectIndex.indexOf(item.id), 1);
            }
            if (this.select.selectImgUrl.indexOf(item.src) == -1) {
                this.select.selectImgUrl.push(item.src);
                this.rightClickData = item
            } else {
                this.select.selectImgUrl.splice(this.select.selectImgUrl.indexOf(item.src), 1);
            }

            if (this.select.selectImgUid.indexOf(item.imguid) == -1) {
                this.select.selectImgUid.push(item.imguid);
                this.rightClickData = item
            } else {
                this.select.selectImgUid.splice(this.select.selectImgUid.indexOf(item.imguid), 1);
            }
            if (this.select.selectIndex.length == 1) {
                for (let i = 0; i < this.imglist.length; i++) {
                    if (this.imglist[i].id == this.select.selectIndex[0]) {
                        this.rightClickData = this.imglist[i];
                        break;
                    }
                }
            }
        },
        //显示画廊窗
        allSett() {
            if (this.select.selectIndex.length > 0) {
                this.getAlbumImgList();
                this.visible = true;
            } else {
                this.$Message.info('请选择要操作的图片');
            }
        },
        //获取选中的画廊图片信息
        getAlbumImgList() {
            var param = {
                imguidlist: this.select.selectImgUid
            }
            request(
                "/getAlbumImgList",
                param).then(res => {
                this.$Spin.hide();
                if (res.status == 200) {
                    var json = res.data.data;
                    this.albumlist = json;
                    this.clearSelectData();
                    this.spinShow = false;
                } else {
                    this.$Message.error("请求时出现错误");
                }
            }).catch(err => {
                this.$Spin.hide();
                console.log(err);
                this.$Message.error('服务器请求错误');
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
        selectAll() {
            this.clearSelectData();
            for (let i = 0; i < this.imglist.length; i++) {
                this.select.selectIndex.push(this.imglist[i].id);
                this.select.selectImgUrl.push(this.imglist[i].src);
                this.select.selectImgUid.push(this.imglist[i].imguid);
            }
            this.$Message.success("已选中" + this.select.selectIndex.length + "张图像");
        },
        noselectAll() {
            if (this.select.selectIndex.length > 0) {
                this.select.selectIndex = [];
                this.$Message.success("已清空所选图像");
            } else {
                this.$Message.warning("你还没有选择图像哦");
            }
        },
        startDateChange(e) {
            console.log(e)
            this.searchData.searchStartDate = e;
        },
        stopDateChange(e) {
            console.log(e)
            this.searchData.searchStopDate = e;
        },
        compareDate(checkStartDate, checkEndDate) {
            var arys1 = new Array();
            var arys2 = new Array();
            if (checkStartDate != null && checkEndDate != null) {
                arys1 = checkStartDate.split('-');
                var sdate = new Date(arys1[0], parseInt(arys1[1] - 1), arys1[2]);
                arys2 = checkEndDate.split('-');
                var edate = new Date(arys2[0], parseInt(arys2[1] - 1), arys2[2]);
                if (sdate > edate) {
                    alert("日期开始时间大于结束时间");
                    return false;
                } else {
                    alert("通过");
                    return true;
                }
            }
        },
        tosearch() {
            this.imglist = [];
            this.clearSelectData();
            this.pageNum = 1;
            this.selectPhoto('search');
        },
        imgInfo(e) {
            this.isimginfo = true;
            this.getBucketName(e.source);
            if (e.username != null) {
                this.upName = e.username;
            } else {
                this.upName = '游客';
            }
            if (e.violation != null && e.violation != "") {
                this.isViolation.isControl = true;
            } else {
                this.isViolation.isControl = false;
            }
        },
        delSelectImg() {
            if (this.select.selectIndex.length == 0) {
                this.$Message.warning("请先选择要操作的数据");
                return false;
            }
            this.$Modal.confirm({
                title: '确认删除',
                content: '<p>确认删除所选图像吗</p>',
                onOk: () => {
                    this.deleteImages(null, null);
                },
                onCancel: () => {
                }
            });
        },
        delImg(id, index) {
            this.$Modal.confirm({
                title: '确认删除',
                content: '<p>确认删除所选图像吗</p>',
                onOk: () => {
                    this.deleteImages(id, index);
                },
                onCancel: () => {
                }
            });

        },
        sendDeleteImages(id, index) {
            var paramJson = {}
            if (id == null) {
                if (this.select.selectIndex.length == 0) {
                    this.$Message.warning("所选数据丢失，不可操作");
                    return false
                }
            } else {
                this.select.selectIndex = []
                this.select.selectIndex.push(id)
            }
            paramJson.images = this.select.selectIndex.toString() + ""
            paramJson.uuid = 'DEL-' + this.pageUUID
            paramJson.forceDel = this.forceDel
            this.delImgCount = this.select.selectIndex.length
            request(
                "/admin/deleImages",
                paramJson).then(res => {
                if (res.status != 200) {
                    this.$Message.error("请求时出现错误");
                }
                // else {
                //     this.TimeingDelImg();
                // }
            }).catch(err => {
                console.log(err);
                this.$Message.error('服务器请求错误');
            })

        },
        deleteImages(id, index) {
            var than = this;
            than.sendDeleteImages(id, index);
            setTimeout(() => {
                than.TimeingDelImg();
            }, 300)
        },
        TimeingDelImg() {
            var that = this;
            let temp = false;
            that.isDelfun = true;
            that.delOver = false;
            var paramJson = {}
            paramJson.uuid = 'DEL-' + that.pageUUID;
            console.log('定时器')
            var interval = setInterval(function () {
                let res = that.GetDelprogress(paramJson);
                res.then(function (data) {
                    var oklist = data.oklist;
                    if (oklist.length > 0) {
                        for (let i = 0; i < that.imglist.length; i++) {
                            for (let j = 0; j < oklist.length; j++) {
                                if (that.imglist[i].id == oklist[j]) {
                                    // that.$refs[`imgLi_${oklist[j]}`][0].remove();
                                    that.imglist.splice(i, 1);
                                }
                            }
                        }
                    }
                    if (that.delOver) {
                        clearInterval(interval);
                        that.isDelfun = false;
                        that.$Message.success("删除完成");
                        if (data.errorlist != null) {
                            if (data.errorlist > 0) {
                                that.isDelImgModal = true;
                            }
                        }
                        that.pageUUID = uuidv4()
                        that.clearSelectData()
                        that.delProgress = {}
                    }
                }, function (info) {
                    console.log(info)
                });

                temp = true;
            }, 600);
        },
        getBucketName(id) {
            this.bucketname = "";
            for (let i = 0; i < this.bucketlist.length; i++) {
                if (id == this.bucketlist[i].id) {
                    this.bucketname = this.bucketlist[i].keyname;
                }
            }
        },
        showCopyImgUrl(img) {
            this.copyAllImgUrl.urlTexts_url = '';
            this.copyAllImgUrl.urlTexts_html = '';
            this.copyAllImgUrl.urlTexts_md = '';
            for (let i = 0; i < this.select.selectImgUrl.length; i++) {
                this.copyAllImgUrl.urlTexts_url += this.select.selectImgUrl[i] + '\n'
                this.copyAllImgUrl.urlTexts_html += '<img src="' + this.select.selectImgUrl[i] + '" alt="Image" />\n'
                this.copyAllImgUrl.urlTexts_md += '![image](' + this.select.selectImgUrl[i] + ')\n';
            }
            this.copyAllImgUrl.isCopyMsg = true
        },
        copyAll(type) {
            let arr = this.select.selectImgUrl;
            var clipboard = null;
            switch (type) {
                case 'url':
                    clipboard = new this.clipboard('.cobyOrderSn_url');
                    break;
                case 'html':
                    clipboard = new this.clipboard('.cobyOrderSn_html');
                    break;
                case 'md':
                    clipboard = new this.clipboard('.cobyOrderSn_md');
                    break;
                default:
                    clipboard = new this.clipboard('.cobyOrderSn_diy');
                    if (this.copyAllImgUrl.myurl.search("@myurl@") == -1) {
                        this.$Message.warning('链接格式中必须包含通配符：@myurl@');
                        return;
                    }
                    if (arr.length > 0) {
                        this.copyAllImgUrl.urlTexts_diy = '';
                        let reg = new RegExp('@myurl@', 'g')//g代表全部
                        for (let i = 0; i < arr.length; i++) {
                            var temp = this.copyAllImgUrl.myurl.replace(reg, arr[i]);
                            this.copyAllImgUrl.urlTexts_diy += temp + '\n'
                        }
                    }
            }
            clipboard.on('success', e => {
                this.$Message.success('复制成功');
                // 释放内存
                clipboard.destroy()
            })
            clipboard.on('error', e => {
                console.log(e);
                this.$Message.error('该浏览器不支持自动复制');
                // 释放内存
                clipboard.destroy()
            })
        },
        getStorage() {
            request(
                "/admin/getStorageName",
                {}).then(res => {
                if (res.status == 200) {
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
        formatBytes(a, b) {
            if (0 == a) return "0 Bytes";
            var c = 1024, d = b || 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
                f = Math.floor(Math.log(a) / Math.log(c));
            return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
        },

        //删除时的实时刷新
        async GetDelprogress(paramJson) {
            let than = this;
            return await new Promise((resolve, reject) => {
                request(
                    "/admin/GetDelprogress",
                    paramJson).then(res => {
                    if (res.status == 200) {
                        var json = res.data;
                        if (json != null && json != undefined && json != "") {
                            than.delProgress = json.data;
                            if (json.data.delover == 'true' || json.data.delover == true) {
                                than.delOver = true;
                            } else {
                                than.delOver = false;
                            }
                            resolve(json.data)
                        } else {
                            reject(false)
                        }
                    } else {
                        than.$Message.error("获取进度_请求时出现错误");
                        reject(false)
                    }
                }).catch(err => {
                    console.log(err);
                    than.$Message.error('获取进度_服务器请求错误');
                    reject(false)
                })
            })

        },

        updateFileName(serType) {
            var msg = '请输入图像名称'
            var title = ''
            var newStr = ''
            if (serType == 'img') {
                newStr = this.rightClickData.idname;
                title = '图像名称';
                msg = '请输入图像名称';
            }
            this.$Modal.confirm({
                title: title,
                render: (h) => {
                    return h('Input', {
                        props: {
                            value: newStr,
                            autofocus: true,
                            placeholder: msg
                        },
                        on: {
                            input: (val) => {
                                newStr = val.replace(/\s*/g, "");
                            }
                        }
                    })
                },
                onOk: () => {
                    if (serType == 'img') {
                        this.sendUpdateFileName(newStr)
                    }
                },
                onCancel: () => {
                }
            })
        },

        sendUpdateFileName(newStr) {
            var paramJson = {};
            if (newStr.length < 1 || newStr.length > 50) {
                this.$Message.warning("请填写有效名称");
                return false;
            } else {
                paramJson.name = newStr
                paramJson.imgname = this.rightClickData.imgname
                request(
                    "/admin/setImgFileName",
                    paramJson).then(res => {
                    if (res.status == 200) {
                        if (res.data.code == '200') {
                            this.$Message.success("名称修改成功");
                            this.rightClickData.idname = newStr;
                        } else {
                            this.$Message.warning("名称修改失败");
                        }
                    } else {
                        this.$Message.error("请求时出现错误");
                    }
                }).catch(err => {
                    console.log(err);
                    this.$Message.error('服务器请求错误');
                })
            }
        },
        clearSelectData() {
            this.select.selectIndex = [];
            this.select.selectImgUid = [];
            this.select.selectImgUrl = [];
        },
        //右键事件
        contextmenuClick(e) {
            let data = this.imglist[e.data.key]
            this.rightClickData = data
            if (this.select.selectIndex.length == 0) {
                this.clearSelectData();
                this.select.selectIndex.push(data.id)
                this.select.selectImgUrl.push(data.src)
                this.select.selectImgUid.push(data.imguid)
            } else {
                if (this.select.selectIndex.indexOf(data.id) == -1) {
                    this.clearSelectData();
                    this.select.selectIndex.push(data.id)
                    this.select.selectImgUrl.push(data.src)
                    this.select.selectImgUid.push(data.imguid)
                }
            }
        },

        rightClickDelete(){
            this.forceDel = false //强制删除 恢复默认false
            this.delPrompt = true
        },

        // async rightClickDelete() {
        //     var than = this;
        //     than.$Modal.confirm({
        //         title: '提醒',
        //         content: '<p>是否删除所选图像？</p>',
        //         onOk: () => {
        //             if (than.select.selectIndex.length > 0) {
        //                 this.deleteImages(null, null);
        //             }
        //         },
        //         onCancel: () => {
        //         }
        //     });
        // },
        menuImgInfo() {
            this.imgInfo(this.rightClickData)
        },
        hideDrawer() {
            this.treePopup = false;
            this.closeDrawer();
        },
        closeDrawer() {
            this.searchData = {
                selectUserType: 'me',
                order: 'desc',
                searchname: null,//图像名称
                searchbucket: '',
                searchtext: null,//查询的文本
                searchtype: '1',//查询的文本类型
                searchStartDate: null,
                searchStopDate: null,
                violation: false,
            }
        },
        //删除提示框
        async asyncOK(){
            this.delPrompt = false
            this.delLoading = true
            var than = this
            if(than.select.selectIndex.length>0){
                this.deleteImages(null,null);
            }
            than.delLoading = false

        },

    },
    components: {
        albumList,
        Treeselect,
        vueQr,
    }

}
