<template>
  <div>
    <!--    <div class="change_key">-->
    <!--      <div class="allChange_key">-->
    <!--左栏目 start-->
    <!--            {include file="common:header_nav"}-->
    <!--左栏目 end-->
    <div class="right_List">
      <div class="UP_right_List">资质资料信息</div>
      <div class="Down_right_List allInvoice01">
        <div class="allInvoice">
          <div class="invoiceHd">
            <button type="button" class="btnBlue" @click="addDocuments()">新增资质信息</button>
          </div>
          <div class="invoice_Main" v-for="(list, index) in userAllDocuments" :key="list.id" @mouseenter="changeActive($event)" @mouseleave="removeActive($event)">
            <div class="forkIcon delfile" @click="delfile($event, list.id)" v-if="list['defaultDf'] === 0"><img src="../../static/index/user/images/552cc15b74087_16.png" alt="" /></div>
            <ul>
              <li class="Hd_Bold">
                资质资料信息
                <span style="color: #c00; margin-right:14px;margin-top:-10px; " v-if="list['defaultDf'] === 1">已默认</span>
              </li>
              <li>
                单位名称：<label class="cname" id="cname">{{ list.name }}</label>
                <!--                <a v-bind:href="'/' + list.companyimg" target="_blank"><b class="rightImg"></b></a>-->
                <a v-if="list.companyimg" :href="'https://alifile.xiaocaiyin.com/' + list.companyimg" target="_blank"><b class="rightImg"></b></a>
                <el-input type="hidden" class="cimg" v-model="list.companyimg" id="cimg" />
              </li>
              <li>
                注册商标名称：<label class="bname" id="brandname">{{ list.brandname }}</label>
                <!--                <a v-bind:href="'/' + list.brandimg" target="_blank"><b class="rightImg"></b></a>-->
                <a v-if="list.brandimg" :href="'https://alifile.xiaocaiyin.com/' + list.brandimg" target="_blank"><b class="rightImg"></b></a>
                <el-input type="hidden" class="bimg" :value="list.brandimg" id="bimg" />
              </li>
              <li>
                条形码注册证名称：<label class="dname" id="dname">{{ list.codename }}</label>
                <!--                <a v-bind:href="'/' + list.codeimg" target="_blank"><b class="rightImg"></b></a>-->
                <a v-if="list.codeimg" :href="'https://alifile.xiaocaiyin.com/' + list.codeimg" target="_blank"><b class="rightImg"></b></a>
                <el-input type="hidden" class="dimg" :value="list.codeimg" id="dimg" />
              </li>
            </ul>
            <!-- <p class="rightLinks">
              <img style="width: 120px" :src="imgUrl" alt="" />
            </p> -->

            <div class="rightLink">
              <a href="javascript:;" @click="setDefault($event, list.id)" class="rightLink_font rightLink_font01 setdefault" v-if="list['defaultDf'] === 0">设为默认</a>
              <a href="javascript:;" @click="editap($event, list.id, index)" class="rightLink_font editap">编辑</a>
              &nbsp;&nbsp;&nbsp;<a href="javascript:;" @click="delfile($event, list.id)" v-if="list['defaultDf'] === 0" class="rightLink_font delfile">删除</a>
            </div>
          </div>
        </div>
        <div class="w_page_0528">
          <el-pagination background layout="prev, pager, next" :total="totalCount" :hide-on-single-page="true" @current-change="getPageData" @prev-click="getPageData" @next-click="getPageData"> </el-pagination>
        </div>
      </div>
    </div>

    <!-- modal fade 资质信息-->
    <el-dialog title="资质信息" :visible.sync="dialogVisible" :before-close="handleClose" width="700px" top="80px" close-on-press-escape>
      <div class="modal-body" style="padding: 0; margin-left: 100px">
        <div class="qualification_information">
          <ul class="w_qualifi_ul" id="w_qualifi_ul1">
            <li v-on:click="addClass(0)" data-id="0" v-bind:class="currentData === 0 ? current : ''">
              <a href="javascript:;"><i class="icon_0527"></i>营业执照</a>
            </li>
            <li v-on:click="addClass(1)" data-id="1" v-bind:class="currentData === 1 ? current : ''">
              <a href="javascript:;"><i class="icon_0527"></i>注册商标</a>
            </li>
            <li v-on:click="addClass(2)" data-id="2" v-bind:class="currentData === 2 ? current : ''">
              <a href="javascript:;"><i class="icon_0527"></i>条形码注册证</a>
            </li>
          </ul>
          <div class="clear"></div>
          <form id="docmentform">
            <div class="contentul">
              <div class="companyul" v-show="currentData === 0">
                <p style="margin: 28px 0">
                  <span class="w_p_span">公司名称：</span>
                  <input type="text" value="" class="corporate_name" name="companyname" v-model="companyname" />
                </p>
                <p>
                  <span class="w_p_span">营业执照：</span>
                  <span class="pass-portrait-openimg-1025">
                    <el-upload
                      class="uploadCompanyimg"
                      :headers="headers"
                      action="/api/consumer/user/miniComDocuments/uploadDocumentsFile"
                      :before-upload="beforeUploadImg"
                      :on-success="(response, file, fileList) => uploadSuccess('companyimg', response, file, fileList)"
                      :on-error="uploadError"
                      accept=".jpg,.png,.jpeg"
                      :data="uploadData"
                    >
                      <el-button size="small" type="primary" class="pass-portrait-filebtn-1025 filesBnt3">点击上传</el-button>
                      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1MB</div>
                    </el-upload>
                  </span>
                </p>
                <p style="margin-top: 25px; display: none" id="file-name-a">
                  <span class="w_p_span"></span>
                  <a href="javascript:;" class="color08d">营业执照已上传</a>
                  <input name="companyimg" v-model="companyimg" value="" type="hidden" />
                </p>
              </div>
              <div class="brandul" v-show="currentData === 1">
                <p style="margin: 25px 0">
                  <span class="w_p_span">注册商标名称：</span>
                  <input type="text" value="" class="corporate_name" name="brandname" v-model="brandname" />
                </p>
                <p style="display: flex; align-items: center">
                  <span class="w_p_span">注册商标文件：</span>
                  <!-- <span>已上传 &nbsp;<img src="{:config('theme_path')}/index/main/images/w_0527_001.png" style="margin-top:-2px;" /></span> -->
                  <span class="pass-portrait-openimg-1025">
                    <el-upload
                      class="uploadBrandname"
                      :headers="headers"
                      action="/api/consumer/user/miniComDocuments/uploadDocumentsFile"
                      :before-upload="beforeUploadImg"
                      :on-success="(response, file, fileList) => uploadSuccess('brandimg', response, file, fileList)"
                      :on-error="uploadError"
                      accept=".jpg,.png,.jpeg"
                      :data="uploadData"
                    >
                      <el-button size="small" type="primary" class="pass-portrait-filebtn-1025 filesBnt3" style="float: left">点击上传</el-button>
                      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1MB</div>
                    </el-upload>
                  </span>
                </p>
                <p style="margin-top: 25px; display: none" id="file-name-b">
                  <span class="w_p_span"></span>
                  <a href="javascript:;" class="color08d">注册商标文件已上传</a>
                  <input name="brandimg" v-model="brandimg" value="" type="hidden" />
                </p>
              </div>
              <div class="codeul" v-show="currentData === 2">
                <p style="margin: 28px 0">
                  <span class="w_p_span">公司名称：</span>
                  <input type="text" value="" class="corporate_name" name="codename" v-model="codename" />
                </p>
                <p>
                  <span class="w_p_span">条形码注册证：</span>
                  <!-- <span>已上传 &nbsp;<img src="{:config('theme_path')}/index/main/images/w_0527_001.png" style="margin-top:-2px;" /></span> -->
                  <span class="pass-portrait-openimg-1025">
                    <el-upload
                      class="uploadCodename"
                      :headers="headers"
                      action="/api/consumer/user/miniComDocuments/uploadDocumentsFile"
                      :before-upload="beforeUploadImg"
                      :on-success="(response, file, fileList) => uploadSuccess('codeimg', response, file, fileList)"
                      :on-error="uploadError"
                      accept=".jpg,.png,.jpeg"
                      :data="uploadData"
                    >
                      <el-button size="small" type="primary" class="pass-portrait-filebtn-1025 filesBnt3">点击上传</el-button>
                      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1MB</div>
                    </el-upload>
                  </span>
                </p>
                <p style="margin-top: 25px; display: none" id="file-name-c">
                  <span class="w_p_span"></span>
                  <a href="javascript:;" class="color08d">条形码注册证上传成功</a>
                  <input name="codeimg" v-model="codeimg" value="" type="hidden" />
                </p>
              </div>
            </div>
            <input type="hidden" name="docid" value="" v-model="docid" />
          </form>
        </div>
      </div>
      <div class="modal-footer" style="border-top: none; text-align: left; padding-left: 202px; margin-top: 12px">
        <button type="button" class="btn btn-primary btn-docment-primary" style="width: 90px" @click="addOrUpdate">确认</button>
        <button type="button" class="btn btn-default" data-dismiss="modal" style="width: 90px" @click="cancel">取消</button>
      </div>
      <!--      </div>-->
      <!-- /.modal-content -->
      <!--        </div>-->
      <!-- /.modal -->
      <!--      </div>-->
    </el-dialog>
  </div>
</template>
<script>
import { deleteById, getComDocumentsByUid, updateDefault, saveOrUpdate } from '@/api/users/userComDocumentsApi';
import { mapActions } from 'vuex';

export default {
  components: {},
  inject: ['reload'], //注入reload方法
  data() {
    return {
      imgUrl: require('../../static/images/invoice.png'),
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
      headers: {
        token: localStorage.getItem('Access-Token'),
        Authorization: localStorage.getItem('Access-Token')
      },
      dialogVisible: false,
      uploadData: {
        folder: 'uploads/picture'
      }
    };
  },
  created() {
    this.getDocuments(0, 6);
  },
  methods: {
    ...mapActions(['Login', 'SmsLogin', 'Logout']),
    changeLoginType(type) {
      this.loginType = type;
    },
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
          console.log(err);
        });
    },
    //鼠标事件
    changeActive(e) {
      e.target.querySelector('.rightLink').style.cssText += 'display:block';
    },
    removeActive(e) {
      e.target.querySelector('.rightLink').style.cssText += 'display:none';
    },
    //修改默认信息
    setDefault(e, id) {
      const reqParam = {
        id: id
      };
      updateDefault(reqParam)
        .then(res => {
          if (res.code === '000000') {
            this.$message({
              type: 'success',
              message: '设置成功'
            });
            this.reload();
          } else {
            this.$message({
              type: 'error',
              message: res.message
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //删除信息
    delfile(e, id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const reqParam = {
            id: id
          };
          deleteById(reqParam)
            .then(res => {
              if (res.code === '000000') {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                });
                this.reload();
              } else {
                this.$message({
                  type: 'error',
                  message: res.message
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {});
    },
    //编辑资质信息
    editap(e, id, index) {
      this.companyname = this.userAllDocuments[index].companyname;
      this.companyimg = this.userAllDocuments[index].companyimg;
      this.brandname = this.userAllDocuments[index].brandname;
      this.brandimg = this.userAllDocuments[index].brandimg;
      this.codename = this.userAllDocuments[index].codename;
      this.codeimg = this.userAllDocuments[index].codeimg;
      this.docid = id;
      this.dialogVisible = true;
    },
    //设置弹窗li的选择状态
    addClass: function(currentData) {
      this.currentData = currentData;
    },
    //上传文件的判断
    beforeUploadImg(file) {
      var fileName = file.name;
      const reg = /\.(png|jpeg|jpg)$/;
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
      console.log(reqParam);
      saveOrUpdate(reqParam)
        .then(res => {
          if (res.code === '000000') {
            this.$message({
              type: 'success',
              message: '执行成功'
            });
            this.reload();
          } else {
            this.$message({
              type: 'error',
              message: res.message
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //添加资质信息 线索窗口
    addDocuments() {
      this.companyname = '';
      this.companyimg = '';
      this.brandname = '';
      this.brandimg = '';
      this.codename = '';
      this.codeimg = '';
      this.docid = 0;
      this.dialogVisible = true;
    },
    cancel() {
      this.dialogVisible = false;
    },
    handleClose(done) {
      done();
    },
    getPageData(page) {
      this.getDocuments(page, this.pageSize);
    }
  }
};
</script>
<style scoped src="../../static/index/css/main.css" />
<style scoped src="../../static/login.css" />
<style scoped src="../../static/index/user/css/reset.css" />
<style scoped src="../../static/index/user/css/all.css" />
<style scoped src="../../static/index/user/css/foot.css" />
<style scoped src="../../static/index/user/css/main.css" />
<style scoped src="../../static/index/user/css/bootstrap.min.css" />
<style scoped src="../../static/index/css/new/public.css" />
<style scoped>
.filesBnt3 {
  position: relative;
  sdisplay: inline-blosck;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 2px;
  padding: 4px 12px;
  overflow: hidden;
  color: #666;
  text-decoration: none;
  text-indent: 0;
  line-height: 16px;
  cursor: pointer;
}
button {
  outline: 0 !important;
}
</style>
