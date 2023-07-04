<template>
  <div class="dcardtabB">
    <el-form class="guigeTop" ref="formData" :model="fdata" label-width="130px" @submit.native.prevent size="small">
      <el-form-item :required="true" key="common" label="订购数量">
        <div>
          <div class="flex inputBx">
            <div class="inputBxrow inputBxrowSize">
              <el-input v-model="fdata.num" style="width: 180px" size="small">
                <template slot="append">套</template>
              </el-input>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item :required="true" label="设计稿">
        <el-radio-group class="EattrMgroup" size="small" v-model="fdata.dnum" button-style="solid">
          <el-row class="Eattrrow">
            <el-radio-button size="small" label="有设计稿">有设计稿</el-radio-button>
          </el-row>
          <el-row class="Eattrrow">
            <el-radio-button size="small" label="有包装样品">有包装样品</el-radio-button>
          </el-row>
          <el-row class="Eattrrow">
            <el-radio-button size="small" label="包装设计">包装设计</el-radio-button>
          </el-row>
        </el-radio-group>
      </el-form-item>
      <el-form-item :required="true" label="描述设计需求" v-if="fdata.dnum == '包装设计'">
        <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 6 }" placeholder="请描述您希望包装达成什么效果；如：这款产品主打创新和科技感... 包装需要突出科技和创新... 要显得高端大气... 主色调为红色..." v-model="fdata.textarea"> </el-input>
      </el-form-item>
      <el-form-item :required="true" label="上传文件" v-if="fdata.dnum == '有设计稿'">
        <el-upload class="upload-demo" ref="upload" :headers="MyHeader" action="/api/consumer/proof/miniProof/uploadProofFile" :on-success="handlePreview" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item :required="true" label="描述设计需求">
        <el-input style="width: 200px" placeholder="输入产品名称" v-model="fdata.productname"> </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'PriceCommontwo',
  props: {
    fdata: Object
  },
  data() {
    return {
      // formData:{
      //   num:'',
      //   dnum:'1',
      //   textarea:'',
      //   productname:'',
      // },
      fileList: [],
      MyHeader: {
        token: localStorage.getItem('Access-Token')
      }
    };
  },
  methods: {
    submitUpload() {
      console.log('fileListfileList', this.fileList);
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      console.log(this.fileList);
      this.fileList = [];
      this.fdata.designimg = '';
    },
    handlePreview(file, fileList) {
      console.log(file);
      if (file.code == '000000') {
        this.fileList = [{ name: fileList.name, url: file.data }];
        this.fdata.designimg = file.data;
      } else {
        this.fileList = [];
        this.fdata.designimg = file.data;
        this.$message({
          message: file.message,
          type: 'error'
        });
      }
      console.log(fileList);
      console.log(this.fileList);
    }
  }
};
</script>
<style>
.inputBx {
  width: 75%;
  display: block;
}
.inputBxrow {
  display: inline-block;
  height: 32px;
}
.inputBxrowSize:nth-child(4) {
  margin-top: 15px;
  border-left: 1px solid #dcdfe6;
}
.dcardtabB .guigeTop {
  background: #fff;
}
</style>
