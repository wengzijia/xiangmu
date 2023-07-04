<template>
  <div class="custom">
    <el-dialog title="客制化资料" :visible.sync="dialogUploadVisible" :before-close="handleClose" center width="700px">
      <el-form :model="form" :rules="rules">
        <el-form-item label="商品名称:" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" placeholder="请输入您的商品名称" style="width:280px"></el-input>
        </el-form-item>
        <el-form-item label="公司logo:" :label-width="formLabelWidth" prop="region">
          <el-upload
            class="uploadCompanyimg"
            :headers="headers"
            action="/api/consumer/pack/miniPackCustomization/uploadPdfFile"
            :before-upload="beforeUpload"
            :on-success="(response, file, fileList) => uploadSuccess('1', response, file, fileList)"
            :on-remove="(file, fileList) => handleRemove('1', file, fileList)"
            :on-error="uploadError"
            :data="uploadCustom"
          >
            <!-- accept=".png,.jpeg,.jpg,.gif,.bmp" -->
            <el-button size="small" icon="el-icon-upload2" class="pass-portrait-filebtn-1025">点击上传</el-button>
            <span slot="tip" class="el-upload__tip" style="margin-left:10px;">请上传高清图片，大小不超过5MB</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="二维码:" :label-width="formLabelWidth">
          <el-upload
            class="uploadCompanyimg"
            :headers="headers"
            action="/api/consumer/pack/miniPackCustomization/uploadPdfFile"
            :before-upload="beforeUpload"
            :on-success="(response, file, fileList) => uploadSuccess('2', response, file, fileList)"
            :on-error="uploadError"
            :on-remove="(file, fileList) => handleRemove('2', file, fileList)"
            :data="uploadCustom"
          >
            <!-- accept=".png,.jpeg,.jpg,.gif,.bmp" -->
            <el-button size="small" icon="el-icon-upload2" class="pass-portrait-filebtn-1025">点击上传</el-button>
            <span slot="tip" class="el-upload__tip" style="margin-left:10px;">请上传高清图片，大小不超过5MB</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="产品文字资料:" :label-width="formLabelWidth">
          <el-upload
            class="uploadCompanyimg"
            :headers="headers"
            action="/api/consumer/pack/miniPackCustomization/uploadPdfFile"
            :before-upload="beforeUpload"
            :on-success="(response, file, fileList) => uploadSuccess('3', response, file, fileList)"
            :on-error="uploadError"
            :on-remove="(file, fileList) => handleRemove('3', file, fileList)"
            :data="uploadCustom"
          >
            <!-- accept=".png,.jpeg,.jpg,.gif,.bmp" -->
            <el-button size="small" icon="el-icon-upload2" class="pass-portrait-filebtn-1025">点击上传</el-button>
            <span slot="tip" class="el-upload__tip" style="margin-left:10px;">请上传您需要在包装上展示的文字资料，如：产地，配置表，公司名称等</span>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('closeUploadVisible', form.customId)">取 消</el-button>
        <el-button type="primary" @click="UpdateCustom">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addOrUpdateCustomization } from '@/api/zbz/packCategoryApi';

export default {
  name: 'CompanyCustomDialog',
  props: {
    dialogUploadVisible: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data() {
    return {
      gridData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      headers: {
        token: localStorage.getItem('Access-Token'),
        Authorization: localStorage.getItem('Access-Token')
      },
      uploadCustom: { folder: 'uploads/pictures' },
      img1Dist: [],
      img2Dist: [],
      fileDist: [],
      parmsCustom: {
        attributeList: [],
        goodName: null,
        id: null,
        language: 'zh-cn'
      },
      //   dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        customId: null
      },
      rules: {
        name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        region: [{ required: true }]
      },
      formLabelWidth: '120px'
    };
  },
  methods: {
    handleClose() {
      this.$emit('closeUploadVisible', this.form.customId);
    },
    // confirm() {
    //   this.$emit('closeUploadVisible');
    // },
    //上传失败执行的方法
    uploadError(err, file, fileList) {
      console.log(err);
    },

    //上传文件的判断
    beforeUpload(file) {
      //   console.log('file', file);
      //   var fileName = file.name;
      //   const reg = /\.(png|jpeg|jpg|gif|bmp)$/;
      //   const extension = reg.test(fileName);
      const fileSize = file.size / 1024 / 1024 < 5;
      //   if (!extension) {
      //     this.$message({
      //       message: '上传文件只能是 png、jepg、jpg、gif、bmp格式!',
      //       type: 'warning'
      //     });
      //   }
      if (!fileSize) {
        this.$message({
          message: '上传文件大小不能超过 5MB!',
          type: 'warning'
        });
      }
      return fileSize;
      //   return extension && fileSize;
    },
    // 文件列表移除文件时的钩子
    handleRemove(sum, file, fileList) {
      console.log('handleRemove--fileList', fileList);
      if (sum === '1') {
        this.img1Dist = [];
        this.attributeListFn(sum, fileList);
      } else if (sum === '2') {
        this.img2Dist = [];
        this.attributeListFn(sum, fileList);
      } else if (sum === '3') {
        this.fileDist = [];
        this.attributeListFn(sum, fileList);
      }
    },
    // 封装处理数据
    attributeListFn(sum, fileList) {
      let obj = {
        attribute: null,
        type: sum
      };
      if (sum === '1') {
        fileList.map(item => {
          obj.attribute = item.response.data;
        });
        if (fileList.length != 0) {
          this.img1Dist.push(obj);
        }
      } else if (sum === '2') {
        fileList.map(item => {
          obj.attribute = item.response.data;
        });
        if (fileList.length != 0) {
          this.img2Dist.push(obj);
        }
      } else if (sum === '3') {
        fileList.map(item => {
          obj.attribute = item.response.data;
        });
        if (fileList.length != 0) {
          this.fileDist.push(obj);
        }
      }
      this.parmsCustom.attributeList = [...this.img1Dist, ...this.img2Dist, ...this.fileDist];
      //   console.log('99999', this.parmsCustom.attributeList);
    },
    //上传成功的方法
    uploadSuccess(sum, response, file, fileList) {
      console.log('fileList', fileList);
      console.log('file', file);
      if (response.code === '000000') {
        this.attributeListFn(sum, fileList);
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
    // 提交数据
    UpdateCustom() {
      this.parmsCustom.goodName = this.form.name;
      this.parmsCustom.id = this.form.customId;
      if (this.parmsCustom.goodName == '' || this.parmsCustom.goodName == null) {
        // console.log('goodName', this.parmsCustom.goodName);
        this.$message({
          type: 'error',
          message: '请填写商品名称'
        });
      } else {
        if (!this.parmsCustom.attributeList[0]) {
          this.$message({
            type: 'error',
            message: '请上传图片或文件'
          });
        } else {
          let customFlag = this.parmsCustom.attributeList.every(item => item.type !== '1');
          if (customFlag) {
            this.$message({
              type: 'error',
              message: '请上传公司logo'
            });
          } else {
            addOrUpdateCustomization(this.parmsCustom).then(res => {
              //   console.log('addOrUpdateCustomization', res);
              this.form.customId = res.data;
              this.$emit('closeUploadVisible', res.data);
            });
          }
          //   console.log('customFlag', customFlag);
          //   console.log('attributeList', this.parmsCustom.attributeList);
        }
      }
    }
  }
};
</script>

<style>
.custom .demo-block .upload-demo {
  width: 360px;
}
.custom .uploadCompanyimg .el-upload-list__item {
  width: 300px;
}
</style>
