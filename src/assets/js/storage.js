import {request} from "@/network/request";
import countTo from 'vue-count-to';

// CASE WHEN storageType=1 THEN '网易云'
// WHEN storageType=2 THEN '阿里云'
// WHEN storageType=3 THEN '又拍云'
// WHEN storageType=4 THEN '七牛云'
// WHEN storageType=5 THEN '本地'
// WHEN storageType=6 THEN '腾讯云'
// WHEN storageType=7 THEN 'FTP'
// WHEN storageType=8 THEN 'UFile'

export default {
    name: "storage",
    components: {
        countTo,
    },
    data () {
        return {
            //提交的表单，双向绑定
            id:null,//修改的时候才会用到的参数
            addAccessKey:null,
            addAccessSecret:null,
            addEndpoint:null,
            addBucketname:null,
            addRequestAddress:null,
            addkeyname:null,
            bucketType:null,
            storageWindow:false,
            viewType:'edit',
            bucketlist:[],
            storageList:[],
            loadInfo:[],
            bucketArr:[
                {
                    "id":2,
                    "storageType":1,
                    "keyname":"网易云",
                    "storageName":"网易云"
                },
                {
                    "id":1,
                    "storageType":2,
                    "keyname":"阿里云",
                    "storageName":"阿里云"
                },
                {
                    "id":3,
                    "storageType":3,
                    "keyname":"又拍",
                    "storageName":"又拍云"
                },
                {
                    "id":4,
                    "storageType":4,
                    "keyname":"七牛云",
                    "storageName":"七牛云"
                },
                {
                    "id":5,
                    "storageType":5,
                    "keyname":"Localhost",
                    "storageName":"本地"
                },
                {
                    "id":6,
                    "storageType":6,
                    "keyname":"腾讯云a",
                    "storageName":"腾讯云"
                },
                {
                    "id":13,
                    "storageType":7,
                    "keyname":"FTP",
                    "storageName":"FTP"
                },
                {
                    "id":8,
                    "storageType":8,
                    "keyname":"UFile",
                    "storageName":"UFile"
                }
            ]


        }
    },
    mounted() {
        this.$Spin.show();
        this.getStorage();
        this.getKeys();
        this.$Spin.hide();
    },
    methods: {
        selectStorageType(v){
            this.addAccessKey=null;
            this.addAccessSecret=null;
            this.addEndpoint=null;
            this.addBucketname=null;
            this.addRequestAddress=null;
            this.addkeyname=null;
        },
        getStorage(){
            request(
                "/admin/getStorage",
                {}).then(res => {
                if(res.status==200){
                    this.bucketlist = res.data.data;
                    // this.$Message.error("请求时出现错误");
                }
            }).catch(err => {
                console.log(err);
                this.$Message.error('服务器请求错误');
            })
        },
        getKeys(){
            request(
                "/admin/root/getKeysList",
                {}).then(res => {
                if(res.status==200){
                    this.storageList = res.data.data;
                    // this.$Message.error("请求时出现错误");
                    this.getLoadInfo()
                }
            }).catch(err => {
                console.log(err);
                this.$Message.error('服务器请求错误');
            })
        },

        getLoadInfo(){
            for (let i = 0; i < this.storageList.length; i++) {
                var params = {
                    keyId:this.storageList[i].id
                }
                request(
                    "/admin/root/LoadInfo",
                    params).then(res => {
                    if(res.status==200){
                        this.loadInfo.push(res.data.data)
                    }
                }).catch(err => {
                    console.log(err);
                    //this.$Message.error('服务器请求错误');
                })


            }
        },
        takeEffect(id){
            var b = false;
            for (let i = 0; i < this.loadInfo.length; i++) {
                if(this.loadInfo[i].id==id){
                    if(this.loadInfo[i].isok==1){
                        b = true;
                        break;
                    }else{
                        b = false;
                        break;
                    }
                }
            }
            return b;
        },
        usedCapacity(id){
            var b = '';
            for (let i = 0; i < this.loadInfo.length; i++) {
                if(this.loadInfo[i].id==id){
                    b = this.loadInfo[i].usedCapacity;
                    break;
                }
            }
            return b;
        },
        getBucketName(id) {
            for (let i = 0; i < this.bucketlist.length; i++) {
                if(id==this.bucketlist[i].storageType){
                    return this.bucketlist[i].storageName;
                }
            }
        },

        save(){
            if(this.bucketType==null){
                this.$Message.warning('请选择存储源');
                return;
            }else{
                if(this.bucketType==1 || this.bucketType==2 || this.bucketType==4 || this.bucketType==6 ){
                    if(!this.addAccessKey || !this.addAccessSecret || !this.addEndpoint || !this.addBucketname || !this.addRequestAddress){
                        this.$Message.warning('相关参数不能为空');
                        return;
                    }
                }else if(this.bucketType==3 || this.bucketType==8 ){
                    if(!this.addAccessKey || !this.addAccessSecret || !this.addBucketname || !this.addRequestAddress){
                        this.$Message.warning('相关参数不能为空');
                        return;
                    }
                }else if(this.bucketType==7){
                    if(!this.addAccessKey || !this.addAccessSecret || !this.addEndpoint || !this.addRequestAddress){
                        this.$Message.warning('相关参数不能为空');
                        return;
                    }
                }
            }
            if(!this.addkeyname){
                this.$Message.warning('请填写存储策略名称');
                return;
            }
            this.$Spin.show();
            var paramJson={};
            paramJson.storageType = this.bucketType;
            paramJson.AccessKey = this.addAccessKey;
            paramJson.AccessSecret = this.addAccessSecret;
            paramJson.Endpoint = this.addEndpoint;
            paramJson.Bucketname = this.addBucketname;
            paramJson.RequestAddress = this.addRequestAddress;
            paramJson.keyname = this.addkeyname;

            request(
                "/admin/root/updateStorage",
                paramJson).then(res => {
                this.$Spin.hide();
                if(res.status==200){
                    if(res.data.code=='200'){
                        this.storageList =[];
                        this.getKeys();
                        this.storageWindow=false;
                        this.$Message.success(res.data.info);
                    }else{
                        this.$Message.warning(res.data.info);
                    }
                }else{
                    this.$Message.error("请求时出现错误");
                }

            }).catch(err => {
                this.storageWindow=false;
                this.$Spin.hide();
                console.log(err);
                this.$Message.error('服务器请求错误');
            })

        },

        getStorageById(id){
            this.$Modal.confirm({
                title: "修改提醒：",
                okText: '我明白',
                cancelText: '点错了',
                content: "注意！如果把当前存储源修改为其他存储源，将导致当前存储源上传过的所有图像无法删除。",
                onOk: () => {
                    // this.$Spin.show();
                    this.viewType = 'edit';
                    this.sendGetStorageById(id);
                },
            });

        },
        //获取指定存储源
        sendGetStorageById(id){
            var paramJson={};
            if(!id){
                this.$Message.error("修改指令不存在");
            }
            paramJson.id = id;
            request(
                "/admin/root/getStorageById",
                paramJson).then(res => {
                if(res.status==200){
                    this.id = id;
                    if(res.data.code=='200'){
                        let key = res.data.data;
                        this.addAccessKey = key.accessKey;
                        this.addAccessSecret = key.accessSecret;
                        this.addEndpoint = key.endpoint;
                        this.addBucketname = key.bucketname;
                        this.addRequestAddress = key.requestAddress;
                        this.addkeyname = key.keyname;
                        this.bucketType = key.storageType;
                        // this.$Spin.hide();
                        this.storageWindow=true;
                    }
                }else{
                    this.$Message.error("请求时出现错误");
                }
            }).catch(err => {
                // this.$Spin.hide();
                console.log(err);
                this.$Message.error('服务器请求错误');
            })
        },

    },
    computed:{
        isOkSwitch: {
            get() {
                return this.cos;
            },
            set(val){
                console.log('****************'+val);
            }
        },

    }


}
