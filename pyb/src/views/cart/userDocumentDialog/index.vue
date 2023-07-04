<template>
  <!-- modal fade 资质信息-->
  <el-dialog title="资质信息" :visible.sync="dialogVisible" :before-close="handleClose" width="35%" top="20px" close-on-press-escape :center="true">
    <div class="modal-header"></div>
    <div class="modal-body">
      <el-form size="mini" label-width="100px" :label-position="'left'">
        <div class="contentul">
          <el-divider content-position="left"><span style="font-size:20px">营业执照</span></el-divider>
          <el-form-item label="公司名称" style="padding-top:12px;">
            <el-input size="small" type="text" value="" name="companyname" style="width: 100%" placeholder="公司名称" v-model="companyname"></el-input>
          </el-form-item>
          <el-form-item label="营业执照:">
            <el-upload
              class="uploadCompanyimg"
              :headers="headers"
              action="/api/consumer/user/miniComDocuments/uploadDocumentsFile"
              :before-upload="beforeUpload"
              :on-success="(response, file, fileList) => uploadSuccess('companyimg', response, file, fileList)"
              :on-error="uploadError"
              :data="uploadDoc"
              accept=".png,.jpeg,.jpg,.gif,.bmp"
            >
              <el-button size="small" icon="el-icon-upload2" class="pass-portrait-filebtn-1025">点击上传</el-button>
              <span slot="tip" class="el-upload__tip" style="margin-left:10px;">只能上传jpg/png文件，且不超过1MB</span>
            </el-upload>
          </el-form-item>
          <div class="companyul" style="padding-bottom:4px;">
            <p style="margin-top:25px; display:none;" id="file-name-a">
              <span class="w_p_span"></span>
              <a href="javascript:;" class="color08d">营业执照已上传</a>
              <input name="companyimg" v-model="companyimg" value="" type="hidden" />
            </p>
          </div>
          <el-divider content-position="left"><span style="font-size: 20px;">注册商标</span></el-divider>
          <el-form-item label="注册商标名称:" style="padding-top:8px;">
            <el-input size="small" type="text" value="" class="corporate_name" style="width: 100%" placeholder="注册商标名称" name="brandname" v-model="brandname"></el-input>
          </el-form-item>
          <el-form-item label="注册商标文件:">
            <el-upload
              class="uploadBrandname"
              :headers="headers"
              action="/api/consumer/user/miniComDocuments/uploadDocumentsFile"
              :before-upload="beforeUpload"
              :on-success="(response, file, fileList) => uploadSuccess('brandimg', response, file, fileList)"
              :on-error="uploadError"
              :data="uploadDoc"
              accept=".png,.jpeg,.jpg,.gif,.bmp"
            >
              <el-button size="small" icon="el-icon-upload2" class="pass-portrait-filebtn-1025">点击上传</el-button>
              <span slot="tip" class="el-upload__tip" style="margin-left:10px;">只能上传jpg/png文件，且不超过1MB</span>
            </el-upload>
          </el-form-item>
          <div class="brandul" style="padding-bottom:4px;">
            <p style="margin-top:25px; display:none;" id="file-name-b">
              <span class="w_p_span"></span>
              <a href="javascript:;" class="color08d">注册商标文件已上传</a>
              <input name="brandimg" v-model="brandimg" value="" type="hidden" />
            </p>
          </div>
          <el-divider content-position="left"><span style="font-size: 20px">条形码注册证</span></el-divider>
          <el-form-item label="公司名称:" style="padding-top:8px;">
            <el-input size="small" type="text" value="" class="corporate_name" style="width: 100%" placeholder="公司名称" name="codename" v-model="codename"></el-input>
          </el-form-item>
          <el-form-item label="条形码注册证:">
            <el-upload
              class="uploadCodename"
              :headers="headers"
              action="/api/consumer/user/miniComDocuments/uploadDocumentsFile"
              :before-upload="beforeUpload"
              :on-success="(response, file, fileList) => uploadSuccess('codeimg', response, file, fileList)"
              :on-error="uploadError"
              :data="uploadDoc"
              accept=".png,.jpeg,.jpg,.gif,.bmp"
            >
              <el-button size="small" icon="el-icon-upload2" class="pass-portrait-filebtn-1025">点击上传</el-button>
              <span slot="tip" class="el-upload__tip" style="margin-left:10px;">只能上传jpg/png文件，且不超过1MB</span>
            </el-upload>
          </el-form-item>
          <div class="codeul">
            <p style="margin-top:25px; display:none;" id="file-name-c">
              <span class="w_p_span"></span>
              <a href="javascript:;" class="color08d">条形码注册证上传成功</a>
              <input name="codeimg" v-model="codeimg" value="" type="hidden" />
            </p>
          </div>
        </div>
        <input type="hidden" name="docid" value="" v-model="docid" />
      </el-form>
    </div>
    <div class="modal-footer" style="border-top:none;text-align:center;">
      <el-button type="danger" @click="addOrUpdate">确认</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getComDocumentsByUid, updateDefault, saveOrUpdate } from '@/api/users/userComDocumentsApi';

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  name: 'UserDocumentDialog',
  data() {
    return {
      userAllDocuments: [],
      companyname: '',
      companyimg: '',
      brandname: '',
      brandimg: '',
      codename: '',
      codeimg: '',
      showData: {},
      docid: 0,
      current: 'selected',
      currentData: 0,
      pageNumber: 0,
      pageSize: 6,
      totalCount: 0,
      labelPosition: 'right',
      headers: {
        token: localStorage.getItem('Access-Token'),
        Authorization: localStorage.getItem('Access-Token')
      },
      uploadDoc: { folder: 'uploads/picture' }
    };
  },
  created() {
    this.getDocuments(0, 6);
  },
  methods: {
    getDocuments(pageNumber, pageSize) {
      var _this = this;
      const reqParam = {
        data: {
          pageNumber: pageNumber,
          pageSize: pageSize
        }
      };
      getComDocumentsByUid(reqParam)
        .then(res => {
          if (res.code === '000000') {
            this.userAllDocuments = res.data;
            this.pageNumber = res.pageNumber;
            this.pageSize = res.pageSize;
            this.totalCount = res.totalCount;
          } else {
            _this.$message({
              type: 'error',
              message: res.message
            });
          }
        })
        .catch(err => {
          console.log(err.message);
        });
    },
    //鼠标事件
    changeActive(e) {
      e.target.querySelector('.rightLink').style.cssText += 'display:block';
    },
    removeActive(e) {
      e.target.querySelector('.rightLink').style.cssText += 'display:none';
    },
    //设置弹窗li的选择状态
    addClass: function(currentData) {
      this.currentData = currentData;
    },
    //上传文件的判断
    beforeUpload(file) {
      var fileName = file.name;
      const reg = /\.(png|jpeg|jpg|gif|bmp)$/;
      const extension = reg.test(fileName);
      const fileSize = file.size / 1024 / 1024 < 1;
      if (!extension) {
        this.$message({
          message: '上传文件只能是 png、jepg、jpg、gif、bmp格式!',
          type: 'warning'
        });
      }
      if (!fileSize) {
        this.$message({
          message: '上传文件大小不能超过 1MB!',
          type: 'warning'
        });
      }
      return extension && fileSize;
    },
    //上传成功的方法
    uploadSuccess(img, response, file, fileList) {
      if (response.code === '000000') {
        if (img === 'companyimg') {
          this.companyimg = response.data;
        } else if (img === 'brandimg') {
          this.brandimg = response.data;
        } else if (img === 'codeimg') {
          this.codeimg = response.data;
        }
        this.$message({
          type: 'success',
          message: '上传成功'
        });
      } else {
        this.$message({
          type: 'error',
          message: response.message
        });
      }
    },
    //上传失败执行的方法
    uploadError(err, file, fileList) {
      console.log(err);
    },
    //添加修改共用方法
    addOrUpdate() {
      if (this.companyname == '') {
        this.$message({
          type: 'error',
          message: '公司名称不能为空'
        });
        return false;
      }
      const reqParam = {
        data: {
          id: this.docid,
          name: this.companyname,
          companyname: this.companyname,
          companyimg: this.companyimg,
          brandname: this.brandname,
          brandimg: this.brandimg,
          codename: this.codename,
          codeimg: this.codeimg
        }
      };
      // console.log(reqParam);
      saveOrUpdate(reqParam)
        .then(res => {
          if (res.code === '000000') {
            this.$message({
              type: 'success',
              message: '执行成功'
            });
            this.handleClose();
          } else {
            this.$message({
              type: 'error',
              message: res.message
            });
          }
        })
        .catch(err => {
          console.log(err.message);
        });
    },
    cancel() {
      this.$emit('showDialog');
      // this.dialogVisible = false;
    },
    handleClose(done) {
      this.$emit('showDialog');
      // done();
    },
    getPageData(page) {
      this.getDocuments(page, this.pageSize);
    }
  }
};
</script>
<style lang="scss" scoped></style>
