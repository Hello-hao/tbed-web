<template>
  <div>
    <div id="uploadDiv" style=" height: 180px;width: 100%; border-radius: 5px;cursor: pointer; text-align: center;">
      <div class="up_style">
        <Icon type="md-camera" size="48" :color="icocolor"/>
      </div>
      <p style="position: relative; top: 106px; font-size: 1.7vh; letter-spacing:2px; " :style="{'color':icocolor}">
        &nbsp;拖拽上传</p>
    </div>
    <!--@file-complete="fileComplete"-->
    <uploader v-show="false" :options="options" class="uploader-example" ref="uploader"
              :file-status-text="statusText"
              @file-added="fileAdded"
              @files-submitted="onFilesSubmitted"
              @file-success="fileSuccess"
              @complete="complete"
              @file-removed="fileRemoved"
              @file-error="fileError">
      <uploader-unsupport></uploader-unsupport>
      <uploader-drop>

        <uploader-btn v-show="false" :attrs="attrs">选择图像</uploader-btn>
        <!--      <uploader-btn :attrs="attrs">select images</uploader-btn>-->
        <!--      <uploader-btn :directory="true">选择文件夹</uploader-btn>-->
      </uploader-drop>
      <Modal width="720" v-model="progressModal" :footer-hide="true">
        <br/>
        <div style="height: 400px;overflow: auto;text-align: center;">
          <uploader-list>
            <!--通过slot-scope绑定文件实例-->
            <div slot-scope="props">
              <div class="nofilelist_sty" v-if="props.fileList<1">
                <p>
                  <Icon type="logo-dropbox" size="80"/>
                </p>
                <p style="font-size: 14px">暂无上传记录</p></div>
              <div v-else v-for="file in props.fileList" :key="file.id">
                <uploader-file
                    :class="['file_' + file.id, customStatus,'my-filelist']"
                    :list="true"
                    :file="file"
                ></uploader-file>
              </div>
            </div>
          </uploader-list>
        </div>
      </Modal>
    </uploader>

  </div>

</template>

<script>
//引入

import {request} from "@/network/request";
import md5 from "js-md5";
import Bus from '../../assets/js/bus'
import {v4 as uuidv4} from 'uuid';
import SparkMD5 from 'spark-md5';

export default {
  name: "uploadList",
  data() {
    let self = this
    return {
      progressModal: false,
      //详细的配置文档https://blog.csdn.net/NineWaited/article/details/126594331
      options: {
        target: this.$http.defaults.baseURL + '/uploadChunkFile',
        testChunks: false, // 是否分片-不分片
        allowDuplicateUploads: true,//上传过的文件可以再上传
        simultaneousUploads: 2,//默认是3
        chunkSize: 20 * 1024 * 1024,//分块的大小，默认就是1m = 1*1024*1024
        // 额外的自定义查询参数
        query: (file, chunk) => {
          return {
            ...file.params,
          }
        },
        headers: {
          'Access-Control-Allow-Origin': '*',
          'usersOrigin': md5(window.location.protocol + '//' + window.location.host),
          "Authorization": localStorage.getItem('Authorization')
        },
        // 处理请求结果
        processResponse(response, cb, file, chunk) {

          const json = JSON.parse(response)
          if (json.data.totalChunks == json.data.chunkNumber) {
            if (json.code == '200') {
              setTimeout(() => {
                let ret = self.fileComplete(file);
                ret.then(function (data) {
                  return cb(null, response)
                }, function (info) {
                  console.log('fileComplete Error')
                });
              }, 100)

            } else {
              return cb(true, response)
            }
          } else {
            //说明不是最后一个分块，正常返回值
            return cb(null, response)
          }

          // self.tests('12332322')

        },
        processParams: function (params, File) {
          // var datas = File.params;
          // if(params.totalChunks>1){
          //   datas.isChunk='yes'
          // }else{
          //   datas.isChunk='no'
          // }
          // File.params = datas
          // Bus.$emit('processParams');

          return params;
        },
        parseTimeRemaining: function (timeRemaining, parsedTimeRemaining) {
          return parsedTimeRemaining
              .replace(/\syears?/, '年')
              .replace(/\days?/, '天')
              .replace(/\shours?/, '小时')
              .replace(/\sminutes?/, '分钟')
              .replace(/\sseconds?/, '秒')
        }
        // checkChunkUploadedByResponse: function (chunk, message) {
        //   let objMessage = JSON.parse(message);
        //   console.log('objMessage',objMessage);
        //   // 获取当前的上传块的集合
        //   let chunkNumbers = objMessage.result.chunkNumbers;
        //   // 判断当前的块是否被该集合包含，从而判定是否需要跳过
        //   return (chunkNumbers || []).indexOf(chunk.offset + 1) >= 0;
        // }
      },
      attrs: {
        accept: 'image/*'
      },
      statusText: {
        success: '成功',
        error: '出错',
        uploading: '上传中',
        paused: '暂停中',
        waiting: '等待中'
      },
      customStatus: '',
      uploadData: null,
      imgCount: 0,
      errType: 0,
    }
  },
  props: {
    // 上传地址
    icocolor: {
      type: String,
      default: "#515860"
    },
  },
  methods: {
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
    showProgressModel() {
      this.progressModal = true;
    },
    setAssign(e) {
      var uploader = this.$refs.uploader.uploader;
      uploader.assignDrop(e)
    },
    setUploadInfo(json) {
      this.uploadData = json;
    },
    // setAssignDrop(e){
    //   var uploader = this.$refs.uploader.uploader;
    //   uploader.assignDrop(e)
    // },
    // 所有的文件都上传成功
    complete() {
      // console.log('complete', arguments)
    },
    //添加文件后事件，可判断类型
    fileAdded(file) {
      file.params = {
        uuid: uuidv4().replace(/-/g, ""),
      }
      Bus.$emit('fileAdded');

      this.imgCount = this.imgCount + 1
      var msg = ''
      if ((file.size / 1024) > this.uploadData.filesize) {
        msg = '[' + file.name + ']文件不可超过' + (this.uploadData.filesize / 1024).toFixed(2) + 'MB'
        this.errType = 1
      }
      //判断格式
      if (file.fileType.indexOf('image/') == -1) {
        msg = '[' + file.name + ']的文件格式不受支持'
        this.errType = 2
      }
      if (this.imgCount > this.uploadData.imgcount) {
        msg = '单次上传最多不得超过[' + this.uploadData.imgcount + ']个文件'
        this.errType = 3
      }
      // this.statusSet(file.id, 'md5')
      if (msg != '') {
        file.ignored = true
        if (this.errType == 3) {
          this.imgCount > this.uploadData.imgcount + 1 ? this.errType = 0 : this.errType = 3
        }
        if (this.errType > 0) {
          this.$Notice.warning({
            title: '文件上传限制',
            desc: msg
          });
        }
      }
    },
    //和 filesAdded 类似，但是是文件已经加入到上传列表中，一般用来开始整个的上传
    filesSubmitted(files, fileList, event) {

    },
    onFilesSubmitted(files, fileList, event) {
      this.imgCount = 0
      this.errType = 0
      if (fileList.length > 0) {
        //弹出上传记录列表窗
        this.showProgressModel();
      }
      //替换原有的上传进度列表的图标
      this.$nextTick(() => {
        for (let i = 0; i < files.length; i++) {
          var dom = document.querySelector(`.file_${files[i].id} .uploader-file-name`);
          dom.innerHTML = '<span style="width: 24px; height: 24px; display: inline-block; vertical-align: top; margin-top: 8px; margin-right: 20px;"><svg t="1675929824801" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3858" width="24" height="24"><path d="M0 0h1024v1024H0V0z" fill="#202425" opacity=".01" p-id="3859"></path><path d="M955.733333 238.933333a170.666667 170.666667 0 1 0-341.333333 0 170.666667 170.666667 0 0 0 341.333333 0zM448.7168 290.816a34.133333 34.133333 0 0 0-59.255467 0L38.673067 904.635733A34.133333 34.133333 0 0 0 68.3008 955.733333h701.576533a34.133333 34.133333 0 0 0 29.627734-51.063466L448.750933 290.781867z" fill="#11AA66" p-id="3860"></path><path d="M721.3056 529.749333a34.133333 34.133333 0 0 1 59.255467 0l214.254933 374.920534A34.133333 34.133333 0 0 1 965.188267 955.733333H536.6784a34.133333 34.133333 0 0 1-29.627733-51.063466l214.254933-374.954667z" fill="#FFAA44" p-id="3861"></path></svg></span>' + dom.innerText
        }
      })      // console.log('触发 onFilesSubmitted 事件',files, fileList)
    },
    // 一个根文件（文件夹）成功上传完成。
    async fileComplete(file) {
      var ret = await this.getFileMD5(file.file);
      console.log('合并文件的对象=', file)
      return await new Promise((resolve, reject) => {


        this.statusSet(file.id, 'processing')
        // const file = arguments[0].file;
        var obj = {}
        // if(arguments[0].params.isChunk=='no'){
        //   return
        // }
        obj.md5 = ret
        obj.uuid = file.params.uuid
        obj.day = window.localStorage.getItem('img_day')
        obj.filename = file.name
        obj.imgIdentifier = file.uniqueIdentifier//arguments[0].uniqueIdentifier
        request(
            "/processFile",
            obj, 1800000).then(res => {
          this.$Spin.hide();
          this.statusRemove(file.id)
          if (res.status == 200) {
            var json = res.data.data;
            if (json != null) {
              this.$emit('returnImgData', json);
            }
            resolve(true);
          } else {
            this.$Message.error("请求时出现错误");
            reject(false)
          }
        }).catch(err => {
          console.log(err);
          reject(false)
        })
      })

    },
    //文件成功上传，第一个参数rootFile是或包含File对象，file是File对象，message是服务端响应内容字符串，chunk是chunk实例，应该是本文件最后一个块实例。chunk.xhr.status就是这个文件上传的响应码
    fileSuccess(rootFile, file, message, chunk) {
      // var data = JSON.parse(message)
      // if(data.code=="202"){
      //   var json = data.data;
      //   this.statusSet(file.id, 'ok')//transcoding
      //   if(json!=null){
      //     this.$emit('returnImgData',json);
      //   }
      // }

    },
    //一个文件被移除
    fileRemoved(file) {

    },
    //文件上传过程出错
    fileError(rootFile, file, message, chunk) {

    },
    /**
     * 新增的自定义的状态: 'md5'、'merging'、'transcoding'、'failed'
     * @param id
     * @param status
     */
    statusSet(id, status) {
      let statusMap = {
        md5: {
          text: '校验MD5',
          bgc: '#fff'
        },
        ok: {
          text: '上传成功',
          // bgc: '#e2eeff'
        },
        processing: {
          text: '处理中',
          bgc: '#e2eeff'
        },
        failed: {
          text: '上传失败',
          bgc: '#e2eeff'
        }
      }

      this.customStatus = status
      this.$nextTick(() => {
        const statusTag = document.createElement('p')
        statusTag.className = `custom-status-${id} custom-status`
        if (status == 'ok') {
          statusTag.innerHTML = '<span style="line-height: 60px;" title="上传完成"><svg t="1675321805849" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5782" width="18" height="18"><path d="M830.8736 349.707378 441.890133 738.668089C433.3568 747.201422 421.774222 752.002844 409.713778 752.002844 397.653333 752.002844 386.070756 747.201422 377.537422 738.668089L193.149156 554.234311C175.354311 536.462222 175.354311 507.653689 193.149156 489.8816 210.921244 472.109511 239.707022 472.109511 257.501867 489.8816L409.713778 642.139022 766.520889 285.354667C784.292978 267.582578 813.101511 267.582578 830.8736 285.354667 848.645689 303.126756 848.645689 331.935289 830.8736 349.707378M512 0C229.239467 0 0 229.239467 0 512 0 794.760533 229.239467 1024 512 1024 794.783289 1024 1024 794.760533 1024 512 1024 229.239467 794.783289 0 512 0" fill="#21B5B5" p-id="5783"></path></svg></span>'
        } else if (status == 'processing') {
          document.querySelector(`.file_${id}`).style.backgroundColor = 'rgb(226, 238, 255)'
          statusTag.innerHTML = statusMap[status].text//'<span style="line-height: 60px;" title="上传完成"><svg t="1675321805849" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5782" width="18" height="18"><path d="M830.8736 349.707378 441.890133 738.668089C433.3568 747.201422 421.774222 752.002844 409.713778 752.002844 397.653333 752.002844 386.070756 747.201422 377.537422 738.668089L193.149156 554.234311C175.354311 536.462222 175.354311 507.653689 193.149156 489.8816 210.921244 472.109511 239.707022 472.109511 257.501867 489.8816L409.713778 642.139022 766.520889 285.354667C784.292978 267.582578 813.101511 267.582578 830.8736 285.354667 848.645689 303.126756 848.645689 331.935289 830.8736 349.707378M512 0C229.239467 0 0 229.239467 0 512 0 794.760533 229.239467 1024 512 1024 794.783289 1024 1024 794.760533 1024 512 1024 229.239467 794.783289 0 512 0" fill="#21B5B5" p-id="5783"></path></svg></span>'
        } else {
          statusTag.innerText = statusMap[status].text
        }
        statusTag.style.backgroundColor = statusMap[status].bgc
        // document.querySelector(`.file_${id} .uploader-file-status span`).style.display = 'none'
        let spanList = document.querySelectorAll(`.file_${id} .uploader-file-status>span`)
        // console.log(spanList);
        if (spanList.length > 0) {
          for (let i = 0; i < spanList.length; i++) {
            spanList[i].style.display = 'none'
          }
        }
        const statusWrap = document.querySelector(`.file_${id} .uploader-file-status`)
        statusWrap.appendChild(statusTag)
      })
    },
    statusRemove(id) {
      this.customStatus = ''
      this.$nextTick(() => {
        const statusTag = document.querySelector(`.custom-status-${id}`)
        statusTag.remove()
      })
    },

  },
  mounted() {
    var uploader = this.$refs.uploader.uploader;
    uploader.assignBrowse(document.getElementById('uploadDiv'))
    this.$nextTick(() => {
      window.uploader = this.$refs.uploader.uploader
    })
  }


}
</script>

<style scoped>

.up_style {
  /*background-image: url("../../assets/img/upload-img.svg");*/
  background-size: contain; /*按比例缩放*/
  background-repeat: no-repeat; /*还有repeat-x,y等*/
  background-position: 100% 100%;
  height: 50px;
  width: 50px;
  position: absolute;
  left: 50%;
  right: 50%;
  transform: translate(-50%, -50%);
  top: 45%;
}

.uptext_style {
  background-image: url("../../assets/img/text/upimg_text.png");
  background-size: contain; /*按比例缩放*/
  background-repeat: no-repeat; /*还有repeat-x,y等*/
  background-position: 100% 100%;
  height: 45px;
  width: 120px;
  position: absolute;
  left: 50%;
  right: 50%;
  transform: translate(-50%, -50%);
  bottom: 3px;

}

.uploader-example {
  height: 280px;
}

/*隐藏暂停按钮*/
.uploader-list /deep/ .uploader-file-actions > span:first-child {
  display: none;
  float: left;
  width: 16px;
  height: 16px;
  margin-top: 16px;
  margin-right: 10px;
  cursor: pointer;
}

.nofilelist_sty {
  margin-top: 120px;
}

</style>
<style>
.uploader-file-icon {
  display: none;
}


.upload-img {
  font-weight: bold;
  -webkit-transition-property: -webkit-transform;
  -webkit-transition-duration: 1s;
  -moz-transition-property: -moz-transform;
  -moz-transition-duration: 1s;
  -webkit-animation: rotate 3s linear infinite;
  -moz-animation: rotate 3s linear infinite;
  -o-animation: rotate 3s linear infinite;
  animation: rotate 3s linear infinite;
}

@-webkit-keyframes rotate {
  from {
    -webkit-transform: rotate(0deg)
  }
  to {
    -webkit-transform: rotate(360deg)
  }
}

@-moz-keyframes rotate {
  from {
    -moz-transform: rotate(0deg)
  }
  to {
    -moz-transform: rotate(359deg)
  }
}

@-o-keyframes rotate {
  from {
    -o-transform: rotate(0deg)
  }
  to {
    -o-transform: rotate(359deg)
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg)
  }
  to {
    transform: rotate(359deg)
  }
}

</style>
