<template>
  <div>
    <div class="comBox" v-if="$route.query.orderType == 6">
      <div class="brickBox">
        <div class="brickContenBox">
          <div class="brick">
            <div class="brick-img-box">
              <h2>上传素材文件</h2>
              <!-- <p>已有结构设计文件 需要专业设计师进行设计</p> -->
            </div>
            <div class="box-info" style="margin-bottom:230px;">
              <div class="price-box">
                <p class="cantitle">商品图片：</p>
                <div class="price">
                  <el-upload
                    :headers="MyHeader"
                    action="/api/consumer/proof/miniProof/uploadProofFile"
                    list-type="picture-card"
                    :file-list="fileList"
                    accept=".png,.jpg"
                    :before-upload="beforeAvatarUpload"
                    :on-change="handleChange"
                    :on-success="handleAvatarSuccess"
                    multiple
                    :limit="6"
                    :class="{ disUoloadSty: noneBtnImg }"
                  >
                    <i slot="default" class="el-icon-plus demo3"></i>
                    <div slot="file" slot-scope="{ file }">
                      <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                      <!-- <span>{{ file }}</span> -->
                      <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                          <i class="el-icon-zoom-in"></i>
                        </span>
                        <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file, fileList)">
                          <i class="el-icon-delete"></i>
                        </span>
                      </span>
                    </div>
                  </el-upload>
                  <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="" />
                  </el-dialog>
                </div>
              </div>
            </div>
            <p class="packingbtn"><button @click="upper">上一步</button><button @click="dnext">下一步</button></p>
          </div>
        </div>
      </div>
    </div>

    <div class="comBox" v-else>
      <div class="brickBox">
        <div class="brickContenBox">
          <div class="brick">
            <div class="brick-img-box">
              <h2>上传素材文件</h2>
              <!-- <p>已有结构设计文件 需要专业设计师进行设计</p> -->
            </div>
            <div class="box-info">
              <div class="price-box" style="margin:0">
                <p class="cantitle">商品图片：</p>
                <div class="price">
                  <el-upload
                    :headers="MyHeader"
                    action="/api/consumer/proof/miniProof/uploadProofFile"
                    list-type="picture-card"
                    :file-list="fileList"
                    accept=".png,.jpg"
                    :before-upload="beforeAvatarUpload"
                    :on-change="handleChange"
                    :on-success="handleAvatarSuccess"
                    multiple
                    :limit="6"
                    :class="{ uoloadSty: showBtnDealImg, disUoloadSty: noneBtnImg }"
                  >
                    <i slot="default" class="el-icon-plus"></i>
                    <div slot="file" slot-scope="{ file }">
                      <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                      <!-- <span>{{ file }}</span> -->
                      <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                          <i class="el-icon-zoom-in"></i>
                        </span>
                        <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                          <i class="el-icon-delete"></i>
                        </span>
                      </span>
                    </div>
                  </el-upload>
                  <el-dialog :visible.sync="dialogVisible" style="120px">
                    <img width="100%" :src="dialogImageUrl" alt="" />
                  </el-dialog>
                </div>
              </div>
              <div class="price-box" v-if="$route.query.orderType == 5">
                <p class="cantitle">结构文件：</p>
                <div class="price">
                  <el-upload
                    class="upload-demo"
                    :headers="MyHeader"
                    action="/api/consumer/proof/miniProof/uploadProofFile"
                    :on-remove="handleRemove1"
                    :before-remove="beforeRemove1"
                    :limit="1"
                    :on-exceed="handleExceed1"
                    :on-success="handleAvatarSuccess1"
                  >
                    <span class="updatetxt">上传文件/图片</span>
                  </el-upload>
                </div>
              </div>
              <div slot="tip" class="el-upload__tip upltxt">请上传包装刀模/结构文件格式为：JPG、PDF、DWG 、CDR、AI、TIF、EPS、DXF。</div>
              <div class="price-box">
                <p class="cantitle">文字内容：</p>
                <div class="price">
                  <el-upload
                    class="upload-demo"
                    :headers="MyHeader"
                    action="/api/consumer/proof/miniProof/uploadProofFile"
                    :on-remove="handleRemove2"
                    :before-remove="beforeRemove2"
                    :limit="2"
                    multiple
                    :on-exceed="handleExceed2"
                    :on-success="handleAvatarSuccess2"
                  >
                    <span class="updatetxt">上传文档</span>
                  </el-upload>
                </div>
              </div>
              <div slot="tip" class="el-upload__tip upltxt">*请上传包装上所有产品规格、二维码、条码、说明等文字信息的文档（WORD PDF），有遗漏会 影响设计结果</div>
              <div class="price-box">
                <p class="cantitle">Logo或商标：</p>
                <div class="price">
                  <el-upload
                    class="upload-demo"
                    :headers="MyHeader"
                    action="/api/consumer/proof/miniProof/uploadProofFile"
                    :on-remove="handleRemove3"
                    :before-remove="beforeRemove3"
                    :limit="2"
                    :on-exceed="handleExceed3"
                    multiple
                    :on-success="handleAvatarSuccess3"
                  >
                    <span class="updatetxt">上传图片</span>
                  </el-upload>
                </div>
              </div>
              <div slot="tip" class="el-upload__tip upltxt">最多上传2张</div>
            </div>
            <p class="packingbtn"><button @click="upper">上一步</button><button @click="dnext">下一步</button></p>
            <!-- <p class="packingbtn"><button @click="dnext">立即设计</button></p> -->
          </div>
        </div>
      </div>
    </div>
    <!-- <p class="packingbtn"><button @click="demo">demo</button></p> -->
  </div>
</template>
<script>
export default {
  name: 'uploadimg',
  props: {
    active: Number,
    getUdata: Function
  },
  components: {},
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      uplstatus: true,
      imgarr: [],
      fileList: [],
      textFileList: [],
      logoFileList: [],
      structFile: '',
      noneBtnImg: false,
      limitCountImg: 6,
      MyHeader: {
        token: localStorage.getItem('Access-Token')
      }
    };
  },
  created() {
    console.log(this.MyHeader);
  },
  methods: {
    demo() {
      // console.log('imgarr',this.imgarr);
      // console.log('structFile',this.structFile);
      // console.log('textFileList',this.textFileList);
      console.log('imgarr', this.imgarr);
      this.uplstatus = false;
    },
    changedemo() {
      console.log('changdemoi');
    },
    beforeAvatarUpload(file) {
      const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1);
      const whiteList = ['jpg', 'png', 'jpeg', 'JPG', 'PNG', 'JPEG'];
      if (whiteList.indexOf(fileSuffix) === -1) {
        this.$message.error('上传图片只能是 jpg、png格式', 'error');
        // return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 2MB', 'error');
        // return false;
      }
    },
    handleAvatarSuccess(res, file) {
      if (res.code == '000000') {
        this.imgarr.push(res.data);
      } else {
        this.$message.error(file.name + '上传失败');
        setTimeout(() => {
          var index = this.fileList.findIndex(value => value.uid == file.uid);
          this.fileList.splice(index, 1);
        }, 500);
      }
    },
    handleAvatarSuccess1(res, file) {
      if (res.code == '000000') {
        this.structFile = res.data;
      } else {
        this.$message.error(file.name + '上传失败');
        for (let key in file) {
          delete file[key];
        }
      }
    },
    handleAvatarSuccess2(res, file, fileList) {
      if (res.code == '000000') {
        this.textFileList.push(res.data);
      } else {
        var index = fileList.findIndex(val => val.response.code == '999999');
        this.$message.error(file.name + '上传失败');
        fileList.splice(index, 1);
      }
    },
    handleAvatarSuccess3(res, file, fileList) {
      if (res.code == '000000') {
        this.logoFileList.push(res.data);
      } else {
        var index = fileList.findIndex(val => val.response.code == '999999');
        this.$message.error(file.name + '上传失败');
        fileList.splice(index, 1);
      }
    },
    handleRemove(file, fileList) {
      var index = this.fileList.findIndex(value => value.uid == file.uid);
      this.fileList.splice(index, 1);
      this.imgarr = this.fileList.map(e => {
        return e.response.data;
      });
      this.noneBtnImg = this.imgarr.length >= this.limitCountImg;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      console.log(this.fileList);
    },
    handleChange(file, fileList) {
      const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1);
      const whiteList = ['jpg', 'png', 'jpeg', 'JPG', 'PNG', 'JPEG'];
      if (whiteList.indexOf(fileSuffix) === -1) {
        fileList.splice(-1, 1);
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        fileList.splice(-1, 1);
        return false;
      }
      this.noneBtnImg = this.imgarr.length >= this.limitCountImg;
      this.fileList = fileList.slice(-6);
    },
    dnext() {
      let rid = this.$route.query.orderType;
      let il = this.imgarr.length;
      let tf = this.textFileList.length;
      let lf = this.logoFileList.length;
      if ((rid == 5 && il > 0 && this.structFile && tf > 0 && lf > 0) || (rid == 6 && il > 0) || (rid == 7 && il > 0 && tf > 0 && lf > 0)) {
        this.getUdata();
        this.$emit('changeactive', 2);
      } else {
        this.$message.error('请上传完整资料');
      }
    },
    upper() {
      console.log(12);
      this.$emit('changeactive', 0);
    },
    handleRemove1(file, fileList) {
      this.structFile = '';
      console.log(1, file, fileList);
    },
    handleExceed1(files, fileList) {
      this.$message.warning(`结构文件只能上传一个`);
    },
    beforeRemove1(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleRemove2(file, fileList) {
      this.textFileList = fileList.map(e => {
        return e.response.data;
      });
    },
    handleExceed2(files, fileList) {
      this.$message.warning(`文字文件最多只能上传2个`);
    },
    beforeRemove2(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleRemove3(file, fileList) {
      this.logoFileList = fileList.map(e => {
        return e.response.data;
      });
    },
    handleExceed3(files, fileList) {
      this.$message.warning(`文字文件最多只能上传2个`);
    },
    beforeRemove3(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
  }
};
</script>
<style src="../../static/mulindex/css/attr.css" />
<style>
.comBox .el-input-group__append {
  width: 25px;
  padding: 0 5px;
  text-align: center;
}
.disUoloadSty .el-upload--picture-card {
  display: none; /* 上传按钮隐藏 */
}
.brickBox .el-upload-list--picture-card .el-upload-list__item {
  width: 120px;
  height: 120px;
}
.brickBox .el-upload--picture-card {
  width: 120px;
  height: 120px;
  line-height: 125px;
}
</style>
<style scoped>
.brickBox {
  /* border: 1px solid red; */
  margin-top: 50px;
  padding-bottom: 50px;
}
.cantitle {
  width: 120px;
  text-align: right;
  margin-right: 10px;
}
.price .updatetxt {
  font-size: 16px;
}
.brickContenBox {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.brickContenBox > div {
  margin-bottom: 14px;
}
.ironTitle {
  width: 100%;
  height: 102px;
  line-height: 114px;
  font-size: 28px;
  text-align: center;
  margin: 30px 0;
}
.brick {
  width: 1240px;
  min-height: 600px;
  padding-bottom: 50px;
  background-color: #fff;
  box-sizing: border-box;
  position: relative;
}
.brick-img-box {
  margin: 30px auto;
  text-align: center;
  box-sizing: border-box;
}
.brick-img-box img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.box-info {
  width: 85%;
  margin: auto;
  box-sizing: border-box;
  padding: 8px 15px;
}
.price-box {
  display: flex;
  flex-flow: row wrap;
  /* justify-content: space-between; */
  margin-top: 25px;
}
.price {
  color: #ff0036;
  font-size: 14px;
}
.price span {
  font-size: 20px;
}
.packingbtn {
  /* text-align: center; */
  width: 300px;
  /* position: absolute; */
  /* bottom: 70px;
  left: 0;
  right: 0; */
  margin: auto;
  margin-top: 50px;
}
.brick .packingbtn button {
  outline: none;
  width: 120px;
  height: 40px;
  background: #ffefe6;
  border-radius: 5px;
  font-size: 16px;
  line-height: 30px;
  margin-right: 30px;
  color: #ff610d;
  border: 1px solid #ff610d;
  border-radius: 50px;
}
.brick .packingbtn button:nth-child(2) {
  background: url('../../static/upload/images/packing2.png') no-repeat;
  border: none;
  color: #fff;
  background-size: 100% 100%;
}
.price-box button:hover {
  background-color: #ee0030;
}
.info > div {
  line-height: 25px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #666;
}
.info > div:hover {
  cursor: default;
}
.info > div::before {
  content: '·';
  font-size: 15px;
  font-weight: 700;
  margin-right: 6px;
}
.brick-img-box:hover {
  cursor: pointer;
}
button:hover {
  cursor: pointer;
}
.upltxt {
  margin-left: 130px;
}
.ptext {
  width: 700px;
  /* height: 300px; */
}
</style>
