<!-- fengjianbo -->
<template>
  <el-container class="login" style="background-color: #eff2f9 ;position: relative;">
    <el-header class="header-nav" style="height: auto;">
      <header-user-nav-top></header-user-nav-top>
      <header-user-nav-bottom></header-user-nav-bottom>
    </el-header>

    <el-container class="allChange_key" style="margin-top:25px;position: relative;">
      <div class="task_head">
        <div class="close">
          <h3>{{ taskList.outName }}</h3>
          <el-button :disabled="taskList.status == 6 || taskList.flowStatus != 1" @click="dialogVisible = true">{{ taskList.status == 6 ? '已关闭' : '关闭' }}</el-button>
        </div>
      </div>
      <el-aside style="margin-top: 60px;width: 214px;'">
        <div ref="downLtBox" :class="topScroll > 190 ? 'positionFixed' : 'positionStatic'" :style="'top:' + topVal + 'px;width: 214px;'">
          <ul class="left_box">
            <li>
              <p>任务编号</p>
              <p>{{ taskList.outNo }}</p>
            </li>
            <li>
              <p>模型类别</p>
              <p style="width:150px">
                <span v-for="(item, index) in taskList.packOutBaseGoodsList" :key="item.baseGoodsId">{{ index > 0 ? ' | ' : '' }}{{ item.modelName }}</span>
              </p>
            </li>
            <li>
              <p>设计类型</p>
              <p>{{ taskList.outType == 0 ? '包装平面设计' : taskList.outType == 1 ? '平面设计' : '3D设计' }}</p>
            </li>
            <li>
              <p>任务单号</p>
              <p>{{ taskList.drawSn }}</p>
            </li>
            <li>
              <p>设计师</p>
              <p>{{ taskList.userApplyRealname }}</p>
            </li>
            <li>
              <p>开始时间</p>
              <p>{{ taskList.startTime == null ? null : formatDateSecond(taskList.startTime) }}</p>
            </li>

            <li>
              <p>领取时间</p>
              <p>{{ taskList.addtime == null ? null : formatDateSecond(taskList.addtime) }}</p>
            </li>
            <li>
              <p>
                金额 <span v-if="taskList.outType == 0">（V{{ taskList.level == null ? 1 : taskList.level }}设计师价格）</span>
              </p>
              <p>
                ￥{{ taskList.price }}<span v-if="taskList.outType == 0"> x {{ designScheme.length }}</span> <span style="margin-left:10px" v-if="taskList.grade && taskList.outType == 1">({{ taskList.grade }}档价格)</span>
              </p>
            </li>
            <li>
              <p>截稿时间</p>
              <p style="color:#ff0036;font-size:16px;font-weight: 700;">{{ taskList.endTime == null ? null : formatDateSecond(taskList.endTime) }}</p>
              <p>{{ theCountdown(formatDateSecond(taskList.endTime).replace(/-/g, '/')) }}</p>
              <!-- <p>{{ theCountdown(formatDateSecond(taskList.endTime)) }}</p> -->
            </li>
          </ul>
          <!-- <div class="tips">
          <p style="margin-bottom:10px">温馨提示：</p>
          <p style="line-height:22px">提交的设计稿件审核通过后，方可提现</p>
        </div> -->
          <div class="tipsMeagge" v-if="taskList.outType != 2">
            <p>温馨提示：</p>
            <div v-if="taskList.outType == 0">
              提交作品审核通过（评分60分以上）则可获得相应等级的报酬，未通过的作品（60分以下），未违背规范和版本要求前提下，平台可以按实际评分来给予折扣报酬
            </div>
            <div v-if="taskList.outType == 1">平面设计，在作品评审时会按ABC三档进行评估，B档符合的会按如上价格，其它会依据实际评估结论给出对应 报酬金额</div>
          </div>
        </div>
      </el-aside>
      <el-main class="login-main" style="padding-left: 10px; width:500px;margin-top: 60px;">
        <div ref="downRtBox">
          <div class="cainterBox">
            <!-- <h3>标题标题标题标题</h3> -->
            <!-- <div class="shareTask">
            <span class="goto">分享任务</span>
          </div> -->
            <div class="processing">
              <!-- <p class="process">傲彩接单流程</p> -->
              <div class="processList">
                <el-steps :space="230" :active="taskList.flowStatus" align-center>
                  <el-step title="设计稿开始"></el-step>
                  <el-step title="上传稿件文件"></el-step>
                  <el-step title="设计稿审核中"></el-step>
                  <el-step title="完成任务"></el-step>
                </el-steps>
              </div>
              <p class="currents" v-if="currText != null">当前处于：{{ currText }}</p>
              <div class="record" v-if="outDocFlag">
                <!-- v-if="taskList.outDocumentsLogList.length" -->
                <div>审核记录：</div>
                <div>
                  <p v-for="outDoc in taskList.outDocumentsLogList" :key="outDoc.id + 'ss'" style="margin-bottom: 10px;">
                    <span style="margin-right:10px">{{ outDoc.adate }}</span
                    >{{ outDoc.terms }}
                    <span v-if="outDoc.status != 1">，{{ outDoc.memo }}</span>
                  </p>
                  <!-- <p><span style="margin-right:10px">2022-04-01 10：00</span> 审核通过/审核不通过（意见说明），任务结束</p> -->
                </div>
              </div>
            </div>
            <ul class="cutter" v-if="taskList.outType == 0">
              <li>
                <span class="cutMode">刀模图</span>

                <a v-for="(vo, i) in taskList.packOutBaseGoodsList" :key="i + 'o'" class="deffilent" @click="downloadWatermarkFileFn(1, vo.fitMap)" target="_blank">{{ vo.modelName }}</a>
                <span class="downloads" @click="downloadWatermarkFileFn(2, taskList.packOutBaseGoodsList)">打包下载</span>
              </li>
              <li>
                <span class="cutMode">示例图</span>
                <!-- <a v-for="(vo, i) in taskList.packOutBaseGoodsList" :key="i + 'o'" class="deffilent" @click="downloadWatermarkFileFn(1, vo.sampleUrl)" target="_blank">{{ vo.sampleUrl }}</a> -->
                <span class="downloads" @click="downloadWatermarkFileFn(3)">打包下载</span>
              </li>
            </ul>
            <div class="bottomBox">
              <div class="designFiles">
                <div class="designFiles_head">
                  <p class="details">设计稿</p>
                  <el-button class="addBtn" v-if="(taskList.flowStatus == 0 || taskList.flowStatus == 1) && taskList.outType == 0" icon="el-icon-plus" @click="addDesign">增加</el-button>
                </div>
                <div class="sourceFile" v-if="taskList.outType != 0">
                  <span>设计源文件：</span>
                  <span style="margin-right:20px">适配图</span>
                  <a class="lookPdf" :href="baseUrl + taskList.fitImg" target="_blank">{{ fileName(taskList.fitImg) }}</a>
                </div>
                <!-- 3D设计的组合主图 -->
                <div v-if="taskList.outType == 2">
                  <div style="margin:20px 0">
                    <div class="file_head">
                      <p class="payFiles">组合主图：</p>
                    </div>
                    <ul class="listFiles">
                      <li>
                        <el-upload
                          class="avatar-uploader"
                          :headers="headers"
                          :disabled="taskList.flowStatus != 1 || taskList.whetherToStart == 0"
                          :action="viewUrl + 'orginFile'"
                          :show-file-list="false"
                          :before-upload="file => beforeUploadFile(file, '1')"
                          :on-success="(response, file, fileList) => uploadDesignSuccess(response, file, fileList, 0, 'z')"
                        >
                          <div class="muchUpFiles">
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                            <p style="color:#8c939d">3D源文件素材包</p>
                            <p style="margin:10px 0;color:#ff0036">.zip</p>
                          </div>
                        </el-upload>
                        <template v-for="(val, idx) in masterList">
                          <a :key="idx" v-if="val.type == 0" class="sample" :href="baseUrl + val.fileUrl" target="_blank">{{ val.name }}</a>
                        </template>
                      </li>
                      <li>
                        <el-upload
                          class="avatar-uploader"
                          :headers="headers"
                          :disabled="taskList.flowStatus != 1 || taskList.whetherToStart == 0"
                          :action="viewUrl + 'orginFile'"
                          :show-file-list="false"
                          :before-upload="file => beforeUploadFile(file, '2')"
                          :on-success="(response, file, fileList) => uploadDesignSuccess(response, file, fileList, 1, 'z')"
                        >
                          <!-- accept=".jpg,.png" -->
                          <div class="muchUpFiles">
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                            <p style="color:#8c939d">3D渲染组合主图</p>
                            <p style="margin:10px 0;color:#ff0036">.png/.jpg</p>
                          </div>
                        </el-upload>
                        <template v-for="(val, idx) in masterList">
                          <a :key="idx" v-if="val.type == 1" class="sample" :href="baseUrl + val.fileUrl" target="_blank">{{ val.name }}</a>
                        </template>
                      </li>
                    </ul>
                  </div>
                </div>
                <!-- 其他盒型类型上传文件部分 -->
                <div :class="index == 0 ? '' : 'selActive'" v-for="(designlist, index) in designScheme" :key="index">
                  <div style="margin:20px 0" v-for="(e, i) in designlist" :key="i">
                    <div class="file_head">
                      <p class="payFiles">
                        <span>{{ e.name }}：</span> <span v-if="taskList.outType == 2 && e.mouldPath && e.skinPath" class="view3d" @click="view3dFile(e.skinPath, e.mouldPath, e.goodsThumbnail)">3D预览</span>
                      </p>
                      <p v-show="(taskList.flowStatus == 0 || taskList.flowStatus == 1) && taskList.outType == 0">
                        <el-button class="addBtn" v-if="index != 0 && i == 0" @click="removeUploadFile(e.sid)">删除</el-button>
                      </p>
                    </div>
                    <!-- 包装平面设计 -->
                    <ul class="listFiles" v-if="taskList.outType == 0">
                      <li>
                        <el-upload
                          class="avatar-uploader"
                          :headers="headers"
                          :disabled="taskList.flowStatus != 1 || taskList.whetherToStart == 0"
                          action="/api/consumer/designer/miniPackOut/uploadFile?file=taskDesignerpdf"
                          :show-file-list="false"
                          :before-upload="file => beforeUploadFile(file, 'pdf')"
                          :on-success="(response, file, fileList) => uploadDesignSuccess(response, file, fileList, 'pdf', e.sid)"
                        >
                          <!-- accept=".psd,.pdf,.cdr" -->
                          <div class="muchUpFiles">
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                            <p style="color:#8c939d">上传源文件</p>
                            <p style="margin:10px 0;color:#ff0036">.psd/.ai/.pdf/.cdr/.tif</p>
                            <!-- <p style="margin:10px 0;color:#7f7f7f">{{ taskList.outType == 0 ? '平面设计' : '其他设计' }}</p> -->
                          </div>
                        </el-upload>
                        <a class="sample" :href="baseUrl + e.pdfUrl" target="_blank">{{ fileName(e.pdfUrl) }}</a>
                      </li>
                      <li>
                        <el-upload
                          class="avatar-uploader"
                          :headers="headers"
                          :disabled="taskList.flowStatus != 1 || taskList.whetherToStart == 0"
                          action="/api/consumer/designer/miniPackOut/uploadFile?file=taskDesignerImg"
                          :show-file-list="false"
                          :before-upload="file => beforeUploadFile(file, 'img')"
                          :on-success="(response, file, fileList) => uploadDesignSuccess(response, file, fileList, 'img', e.sid)"
                        >
                          <!-- accept=".jpg,.png" -->
                          <div class="muchUpFiles">
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                            <p style="color:#8c939d">上传缩略图</p>
                            <p style="margin:10px 0;color:#ff0036">.png/.jpg/.svg</p>

                            <!-- <p style="margin:10px 0;color:#7f7f7f">{{ taskList.outType == 0 ? '平面设计' : '其他设计' }}</p> -->
                          </div>
                        </el-upload>
                        <a class="sample" :href="baseUrl + e.imgUrl" target="_blank">{{ fileName(e.imgUrl) }}</a>
                      </li>
                    </ul>
                    <!-- 平面设计和3d设计 -->
                    <ul class="listFiles" v-else>
                      <li>
                        <el-upload
                          class="avatar-uploader"
                          :headers="headers"
                          :disabled="taskList.flowStatus != 1 || taskList.whetherToStart == 0"
                          :action="viewUrl + 'orginFile'"
                          :show-file-list="false"
                          :before-upload="file => beforeUploadFile(file, '1')"
                          :on-success="(response, file, fileList) => uploadDesignSuccess(response, file, fileList, taskList.outType == 1 ? 7 : 3, e.sid)"
                        >
                          <div class="muchUpFiles">
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                            <p style="color:#8c939d">{{ taskList.outType == 1 ? '转曲源文件' : '3D素模文件' }}</p>
                            <p style="margin:10px 0;color:#ff0036">{{ taskList.outType == 1 ? '.psd/.ai/.pdf/.cdr/.tif' : '.obj' }}</p>
                          </div>
                        </el-upload>
                        <template v-for="(val, idx) in e.moreUrl">
                          <a :key="idx + '1'" v-if="val.type == 7 || val.type == 3" class="sample" :href="baseUrl + val.fileUrl" target="_blank">{{ val.name }}</a>
                        </template>
                      </li>
                      <li>
                        <el-upload
                          class="avatar-uploader"
                          :headers="headers"
                          :disabled="taskList.flowStatus != 1 || taskList.whetherToStart == 0"
                          :action="viewUrl + 'orginFile'"
                          :show-file-list="false"
                          :before-upload="file => beforeUploadFile(file, '2')"
                          :on-success="(response, file, fileList) => uploadDesignSuccess(response, file, fileList, taskList.outType == 1 ? 8 : 4, e.sid)"
                        >
                          <!-- accept=".jpg,.png" -->
                          <div class="muchUpFiles">
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                            <p style="color:#8c939d">{{ taskList.outType == 1 ? '未转曲源文件' : '3D皮肤文件' }}</p>
                            <p style="margin:10px 0;color:#ff0036">{{ taskList.outType == 1 ? '.psd/.ai/.pdf/.cdr/.tif' : '.zip' }}</p>
                          </div>
                        </el-upload>
                        <template v-for="(val, idx) in e.moreUrl">
                          <a :key="idx + '4'" v-if="val.type == 8 || val.type == 4" class="sample" :href="baseUrl + val.fileUrl" target="_blank">{{ val.name }}</a>
                        </template>
                      </li>
                      <li>
                        <el-upload
                          class="avatar-uploader"
                          :headers="headers"
                          :disabled="taskList.flowStatus != 1 || taskList.whetherToStart == 0"
                          :action="viewUrl + 'orginFile'"
                          :show-file-list="false"
                          :before-upload="file => beforeUploadFile(file, '3')"
                          :on-success="(response, file, fileList) => uploadDesignSuccess(response, file, fileList, taskList.outType == 1 ? 9 : 5, e.sid)"
                        >
                          <!-- accept=".jpg,.png" -->
                          <div class="muchUpFiles">
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                            <p style="color:#8c939d">{{ taskList.outType == 1 ? '上传缩略图' : '3D渲染源文件' }}</p>
                            <p style="margin:10px 0;color:#ff0036">{{ taskList.outType == 1 ? '.png/.jpg/.svg' : '.zip' }}</p>

                            <!-- <p style="margin:10px 0;color:#7f7f7f">{{ taskList.outType == 0 ? '平面设计' : '其他设计' }}</p> -->
                          </div>
                        </el-upload>
                        <template v-for="(val, idx) in e.moreUrl">
                          <a :key="idx + '2'" v-if="val.type == 9 || val.type == 5" class="sample" :href="baseUrl + val.fileUrl" target="_blank">{{ val.name }}</a>
                        </template>
                      </li>
                      <li>
                        <el-upload
                          class="avatar-uploader"
                          :headers="headers"
                          :disabled="taskList.flowStatus != 1 || taskList.whetherToStart == 0"
                          :action="viewUrl + 'orginFile'"
                          :show-file-list="false"
                          :before-upload="file => beforeUploadFile(file, '4')"
                          :on-success="(response, file, fileList) => uploadDesignSuccess(response, file, fileList, taskList.outType == 1 ? 10 : 6, e.sid)"
                        >
                          <!-- accept=".jpg,.png" -->
                          <div class="muchUpFiles">
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                            <p style="color:#8c939d">{{ taskList.outType == 1 ? '上传刀模图' : '3D渲染主图' }}</p>
                            <p style="margin:10px 0;color:#ff0036">{{ taskList.outType == 1 ? '.pdf' : '.png/.jpg' }}</p>

                            <!-- <p style="margin:10px 0;color:#7f7f7f">{{ taskList.outType == 0 ? '平面设计' : '其他设计' }}</p> -->
                          </div>
                        </el-upload>
                        <template v-for="(val, idx) in e.moreUrl">
                          <a :key="idx + '3'" v-if="val.type == 10 || val.type == 6" class="sample" :href="baseUrl + val.fileUrl" target="_blank">{{ val.name }}</a>
                        </template>
                      </li>
                      <!-- <li v-show="(taskList.outType == 2 && taskList.flowStatus != 1 )|| (taskList.outType == 2 &&taskList.whetherToStart == 0)" class="view3d" @click="view3dFile(e.skinPath, e.mouldPath, e.goodsThumbnail)">
                      
                        3D预览
                      </li> -->
                    </ul>
                    <div v-if="i == designlist.length - 1">
                      <p style="margin:20px 0">设计理念：</p>
                      <p style="width:550px">
                        <el-input v-if="taskList.flowStatus != 1 || taskList.whetherToStart == 0" type="textarea" :rows="4" placeholder="请输入设计理念" resize="none" v-model="e.think" @change="textareaChange($event, e.sid)"></el-input>
                        <el-input v-else type="textarea" :rows="4" placeholder="请输入设计理念" resize="none" v-model="textarea[e.sid]" @change="textareaChange($event, e.sid)"> </el-input>
                      </p>
                    </div>
                  </div>
                </div>
                <div style="width:400px;text-align:center; margin: auto;" v-if="taskList.flowStatus == 0 || taskList.flowStatus == 1">
                  <p><el-button :disabled="taskList.whetherToStart == 0" class="btn" @click="submitAudit">提交审核</el-button></p>
                  <p class="checkbox" style="display: flex;">
                    <el-checkbox v-model="checked"></el-checkbox>
                    <span style="margin-left:10px;font-size: 13px;text-align: left;">
                      本人承诺提交的作品（含作品中的插画等素材）是由设计师独立原创完成，不存在任何权利纠纷，没有违反民法典、著作权法、商标法、广告法及其它有关法律、法规的规定，不侵害任何第三方的合法权利（包括但不限于第三方的著作权等任何知识产权、名誉权、姓名权、肖像权等中国法律规定的相关权利）</span
                    >
                  </p>
                  <!-- <p class="checkbox">
                <el-checkbox v-model="checked">本人已阅读并同意<a href="/user/designerAgreen" style="color:#409eff;font-size:14px" target="_blank">《设计授权协议》</a> </el-checkbox>
              </p> -->
                </div>
              </div>
              <div style="flex: 0 0 350px;" class="requires">
                <div class="requirements">
                  <p class="require">任务要求：</p>
                  <p v-html="taskList.requirement"></p>
                </div>
                <!-- <div class="requirements">
                <p class="require">规范要求:</p>
                <p v-html="taskList.norm"></p>
              </div>
              <div class="requirements">
                <p class="require">版权要求：</p>
                <p v-html="taskList.copyright"></p>
              </div> -->
              </div>
            </div>

            <div class="requires" v-if="results">
              <div class="requirements">
                <p class="require">
                  审核结果： <span style="color:#67c6ab">{{ results }}</span>
                </p>
                <p>最后审核时间：{{ dTime }}</p>
              </div>
            </div>
            <div class="requires">
              <div class="requirements">
                <p class="require">规范要求:</p>
                <p v-html="taskList.norm"></p>
              </div>
              <div class="requirements">
                <p class="require">版权要求：</p>
                <p v-html="taskList.copyright"></p>
              </div>
            </div>
          </div>
          <div class="closeTask">
            <el-dialog title="关闭任务" :visible.sync="dialogVisible" width="660px">
              <p style="font-size:16px;color:#333;margin-bottom:20px">关闭任务将会影响您升级设计师等级，请谨慎操作，请选择关闭原因：</p>
              <el-radio-group size="medium" fil="#ff0036" text-color="#ff0036" v-model="radio">
                <p style="margin-bottom:14px"><el-radio :label="1">临时有事无法继续完成</el-radio></p>
                <p style="margin-bottom:14px"><el-radio :label="2">任务难度太高无法完成</el-radio></p>
                <p style="margin-bottom:14px"><el-radio :label="3">沟通效率太低放弃任务</el-radio></p>
                <p style="margin-bottom:14px"><el-radio :label="4">任务价格太低放弃任务</el-radio></p>
                <p style="margin-bottom:14px"><el-radio :label="5">其他</el-radio></p>
              </el-radio-group>
              <p style="margin-bottom:14px">补充说明:</p>
              <div>
                <el-input type="textarea" :rows="4" placeholder="请输入您选择其他选项的原因" v-model="textWords" resize="none"></el-input>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="closeTaskFn()">确 定</el-button>
              </span>
            </el-dialog>
          </div>
          <div class="code2">
            <el-dialog title="提示" width="600px" center :visible="showCodeDialog" @close="showCodeDialog = false">
              <p style="text-align: center; margin: 10px;">
                你还没有实名认证和签署《委托设计协议》，请前往签署
              </p>
              <span slot="footer" class="dialog-footer">
                <el-button @click="showCodeDialog = false">取 消</el-button>
                <el-button type="primary" @click="toRead">确 定</el-button>
              </span>
            </el-dialog>
          </div>
          <el-dialog title="3d预览" width="600px" center :visible="show3d" @close="show3d = false">
            <iframe style="width:100%;height:600px" :src="url3d"></iframe>
          </el-dialog>
        </div>

        <!-- <button @click="fn">11111111</button> -->
      </el-main>
    </el-container>
    <el-footer class="footer">
      <foot-top></foot-top>
      <foot-bottom></foot-bottom>
    </el-footer>
  </el-container>
</template>
<script>
import { ACCESS_TOKEN } from '@/store/global-constant';
import { getCurrentUserInfo } from '@/api/users/userApi';
import FootTop from '@/components/footer/FootTop';
import FootBottom from '@/components/footer/FootBottom';
import HeaderUserNavTop from '@/components/header/HeaderUserNavTop';
import HeaderUserNavBottom from '@/components/header/HeaderUserNavBottom';
import { formatDateSecond, theCountdown } from '@/utils/timeUtil';
import { getStylistTaskParticulars, downloadWatermarkFile, zipDownload, getSubmitAudit, closeTask, gainRealSignMessage, getByUserId, geCertificationResults } from '@/api/users/designer';
// 引入下载的工具包
// import QrCode from 'qrcode';

export default {
  components: {
    FootTop,
    FootBottom,
    HeaderUserNavTop,
    HeaderUserNavBottom
  },
  name: 'shareToDesigner',
  data() {
    return {
      topVal: 0,
      topScroll: 0,
      newTime: Math.random(), //为key值获取唯一标识
      uid: '',
      // codeUrl: `/code2/realNameCert?uid=${this.uid}&token=${localStorage.getItem(ACCESS_TOKEN)}`,
      // baseCodeUrl: 'http://192.168.7.20:8000',
      // baseCodeUrl: window.location.origin,
      // codeUrl: '',
      textWords: null,
      showCodeDialog: false,
      closeStatus: false,
      show3d: false,
      radio: null,
      dialogVisible: false,
      textarea: {},
      viewUrl: '/api/consumer/designer/miniPackOut/uploadFile?file=',
      baseUrl: 'http://alifile.xiaocaiyin.com/',
      headers: {
        token: localStorage.getItem(ACCESS_TOKEN),
        Authorization: localStorage.getItem(ACCESS_TOKEN)
      },
      imageUrl: '',
      url3d: '',
      currText: null,
      pdfName: null,
      pdfUrl: null,
      imgUrl: null,
      checked: false,
      copyId: 10000,
      taskList: [],
      newRemainder: null,
      results: null,
      dTime: '',
      demotime: null,
      timer: null,
      outDocFlag: false,
      codeFlag: 0,
      masterList: [], //组合主图
      // addFlag: true, //点击添加按钮，限制请求一次接口
      // 提交传参数
      parmers: [
        {
          id: this.$route.query.id,
          think: null,
          moreUrl: '', //组合主图
          miniPackOutDocumentsList: [
            {
              outGoodsId: '',
              pdfUrl: null,
              jpgUrl: null,
              psdUrl: null,
              moreUrl: '', //存放设计师文件地址json,字段类型:type:0 jpg/png 1 pdf 2 psd 3 3D素模文件 4 3D皮肤文件5 3D渲染源文件 6 3D渲染主图7 转曲源文件8 未转曲源文件9 缩略图文件 10 刀模图文件
              moreUrlList: [], //存放设计师文件地址json,字段类型:type:0 jpg/png 1 pdf 2 psd 3 3D素模文件 4 3D皮肤文件5 3D渲染源文件 6 3D渲染主图7 转曲源文件8 未转曲源文件9 缩略图文件 10 刀模图文件
              fileType: 0
            }
          ]
        }
      ],
      designScheme: [
        [
          {
            name: '手提袋',
            id: 1,
            pdfUrl: null,
            imgUrl: null,
            fileType: null,
            think: null,
            moreUrl: []
          }
        ]
      ],
      realStatus: '', //  0未实名1实名成功2签署完成3合同签署中4签署失败5拒签6未签署
      // baseUrl: 'https://sd.liaotu.com'
      loading: false
    };
  },
  created() {
    this.getStylistTaskParticularsFn();
    // this.theCountdown(this.taskList.endTime);
    this.getUserInfo();
    this.gainRealSignMessageFn();
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, false);
  },
  methods: {
    view3dFile(skinPath, mouldPath, goodsThumbnail) {
      // console.log('skinPath-----', skinPath);
      // console.log('mouldPath-----', mouldPath);
      // console.log('goodsThumbnail-----', goodsThumbnail);
      let baseUrl = 'https://sd.liaotu.com';
      this.url3d = `${baseUrl}/pack/api/pack/3d?skinPath=${skinPath}&mouldPath=${mouldPath}&goodsThumbnail=${goodsThumbnail}`;
      this.show3d = true;
    },
    toRead() {
      this.showCodeDialog = false;
      this.$router.push('/user/certifiedDesigner');
    },
    // 滚动底部对齐（吸底）
    handleScroll() {
      this.$nextTick(() => {
        let leftHeight = this.$refs.downLtBox?.offsetHeight; //左边盒子的高度
        let rightHeight = this.$refs.downRtBox?.offsetHeight; //右边盒子的高度
        let diffHeight = rightHeight - leftHeight; //左右盒子高度差值
        this.topScroll = Math.floor(document.documentElement?.scrollTop || document.body?.scrollTop);
        let sclHt = this.topScroll - diffHeight - 190; //滚动距离-左右高度差值-头部遮盖高度
        if (this.topScroll > diffHeight + 190) {
          //判断滚动到左右两边盒子底部对齐时
          this.topVal = 10 - sclHt;
        } else {
          if (this.topScroll > 190) {
            this.topVal = 10;
          } else {
            this.topVal = 0;
          }
        }
        // console.log('滚动底部对齐（吸底）----', leftHeight, rightHeight, diffHeight, this.topScroll, sclHt);
      });
    },
    // 获取用户信息
    getUserInfo() {
      getCurrentUserInfo().then(res => {
        // this.$set(this, 'userInfo', res.data);
        if (res.code == '000000') {
          this.uid = res.data.id;
          // this.codeUrl = `/realNameCert?uid=${this.uid}&token=${localStorage.getItem(ACCESS_TOKEN)}`;
          // this.codeUrl = `${this.baseCodeUrl}/realNameCert?uid=${this.uid}&token=${localStorage.getItem(ACCESS_TOKEN)}`;
          // console.log('获取用户信息', this.codeUrl);
        }
      });
    },
    // 获取用户实名和签署信息
    gainRealSignMessageFn() {
      gainRealSignMessage().then(res => {
        // console.log('获取用户实名和签署信息', res);
        if (res.code == '000000') {
          this.realStatus = res.data.status; // 0未实名1实名成功2签署完成3合同签署中4签署失败5拒签6未签署
        }
      });
    },
    // 关闭任务
    closeTaskFn() {
      const parm = {
        memo: null,
        outDrawId: this.taskList.id
      };
      if (this.radio == 1) {
        parm.memo = '临时有事无法继续完成';
      } else if (this.radio == 2) {
        parm.memo = '任务难度太高无法完成';
      } else if (this.radio == 3) {
        parm.memo = '沟通效率太低放弃任务';
      } else if (this.radio == 4) {
        parm.memo = '任务价格太低放弃任务';
      } else if (this.radio == 5) {
        parm.memo = this.textWords;
      }
      if (parm.memo != null) {
        closeTask(parm).then(res => {
          this.dialogVisible = false;
          this.closeStatus = true;
          this.getStylistTaskParticularsFn();
        });
      } else {
        this.$message.error('请输入关闭任务理由!');
      }
    },
    // 添加水印
    downloadWatermarkFileFn(type, listName) {
      const prms = {
        content: '傲彩-aocai.cn',
        fileList: [],
        name: '',
        model: 0
      };
      if (type == 1) {
        let urlList = listName.split('/');
        urlList = urlList[urlList.length - 1].split('.');
        prms.fileList.push(listName);
        prms.name = urlList[0];
        // console.log('fileName---urlList', urlList);
      } else if (type == 2) {
        listName.map(item => {
          // console.log(item);
          prms.fileList.push(item.fitMap);
        });
        prms.name = '刀模图文件';
      } else if (type == 3) {
        this.taskList.packOutBaseGoodsList.map(val => {
          prms.fileList.push(val.sampleUrl);
        });
        prms.name = '示例文件';
      }
      // console.log('fileName---prms', prms);
      zipDownload(prms)
        .then(res => {
          // console.log('水印文件', res);
        })
        .catch(err => {
          console.log('水印文件报错', err);
        });
    },
    ...{ formatDateSecond, theCountdown },
    //  设计师我的任务列表-查看详情
    getStylistTaskParticularsFn() {
      // let times = 0;
      let _this = this;
      getStylistTaskParticulars({ id: this.$route.query.id }).then(res => {
        // console.log('res4444', res.data.outDrawChidList);
        if (res.code == '000000') {
          if (res.data.flowStatus == 0) {
            this.currText = '待提交设计稿阶段，请完成设计后，提交设计稿审核';
          } else if (res.data.flowStatus == 1 || res.data.flowStatus == 2) {
            this.currText = '设计稿审核阶段，请耐心等待审核结果';
          } else {
            this.currText = '该设计任务已结束';
          }
          if (res.data.status == 6) {
            this.currText = '该任务因设计师原因已关闭！';
          }
          if (res.data.whetherToStart == 0) {
            this.$message.error('任务未开始!');
          }

          this.taskList = res.data;
          if (this.taskList.flowStatus > 3) {
            this.$set(this.taskList, 'flowStatus', null);
          } else if (this.taskList.flowStatus == 1) {
            this.$set(this.taskList, 'flowStatus', 2);
          } else if (this.taskList.flowStatus == 0) {
            this.$set(this.taskList, 'flowStatus', 1);
          }
          // 初始化模型类型的id和文件状态（包含驳回的数据初始化）--不变的值
          this.taskList.packOutBaseGoodsList.map((item, index) => {
            this.designScheme[0][index] = JSON.parse(JSON.stringify(this.designScheme[0][0]));
            this.designScheme[0][index].id = item.id;
            this.designScheme[0][index].sid = item.id;
            this.designScheme[0][index].name = item.modelName;
            this.designScheme[0][index].sdCategoryId = item.sdCategoryId;
            this.designScheme[0][index].fileType = this.taskList.outType;
            // console.log('模型类型--------', this.designScheme[0][index]);
          });

          //czj
          // _this.designScheme[0] = _this.taskList.packOutBaseGoodsList.map((item, index) => {
          //   return {
          //     name: item.modelName,
          //     id:item.id,//要传的outGoodsId
          //     sid: item.id,
          //     pdfUrl: null,
          //     imgUrl: null,
          //     fileType: _this.taskList.outType,
          //     think: null,
          //     moreUrl: []
          //   };
          // });
          // console.log('this.taskList.packOutBaseGoodsList--', this.taskList.packOutBaseGoodsList);
          // console.log('模型类型designScheme', this.designScheme);
          // console.log('模型类型this.taskLis轮询11111', this.taskList);

          // 上传的图片回显
          if (this.taskList.outDrawChidList.length > 0) {
            this.masterList = this.taskList.outDrawChidList[0].moreUrl ? JSON.parse(this.taskList.outDrawChidList[0].moreUrl) : []; // 组合主图的回显
            this.taskList.outDrawChidList.map((e, i) => {
              this.designScheme[i] = JSON.parse(JSON.stringify(this.designScheme[0]));
              e.miniPackOutDocumentsList.map((vo, io) => {
                let index1 = this.designScheme[i].findIndex(item => item.sdCategoryId == vo.miniPackOutGoods.sdCategoryId);
                this.designScheme[i][index1].imgUrl = vo.miniPackOutDocuments.jpgUrl;
                this.designScheme[i][index1].pdfUrl = vo.miniPackOutDocuments.pdfUrl;
                this.designScheme[i][index1].sid = vo.miniPackOutDocuments.id;
                if (vo.miniPackOutDocuments.moreUrl.length > 0) {
                  this.designScheme[i][index1].moreUrl = JSON.parse(vo.miniPackOutDocuments.moreUrl);
                  let idx = this.designScheme[i][index1].moreUrl.findIndex(item => item.type == 3);
                  if (idx > -1) {
                    this.designScheme[i][index1].mouldPath = this.designScheme[i][index1].moreUrl[idx].fileUrl; //数模文件
                  }
                  let idx1 = this.designScheme[i][index1].moreUrl.findIndex(item => item.type == 4);
                  if (idx1 > -1) {
                    this.designScheme[i][index1].skinPath = this.designScheme[i][index1].moreUrl[idx1].fileUrl; //皮肤文件
                  }
                  let idx2 = this.designScheme[i][index1].moreUrl.findIndex(item => item.type == 6);
                  if (idx2 > -1) {
                    this.designScheme[i][index1].goodsThumbnail = this.designScheme[i][index1].moreUrl[idx2].fileUrl; //主图
                  }
                }
                this.$set(this.designScheme[i][index1], 'think', e.think);
                this.$set(this.textarea, [this.designScheme[i][index1].sid], e.think);

                console.log('this.designScheme=====---====', this.designScheme);

                // this.designScheme[i][io].imgUrl = vo.miniPackOutDocuments.jpgUrl;
                // this.designScheme[i][io].pdfUrl = vo.miniPackOutDocuments.pdfUrl;
                // this.designScheme[i][io].sid = vo.miniPackOutDocuments.id;
                // if (vo.miniPackOutDocuments.moreUrl.length > 0) {
                //   this.designScheme[i][io].moreUrl = JSON.parse(vo.miniPackOutDocuments.moreUrl);
                // }
                // this.$set(this.designScheme[i][io], 'think', e.think);
                // this.$set(this.textarea, [this.designScheme[i][io].sid], e.think);
              });
            });
          }
          // czj
          // if (_this.taskList.outDrawChidList.length) {
          //   _this.designScheme = _this.taskList.outDrawChidList.map((e, i) => {
          //     console.log('-------',e.think,e.id);
          //     let arr = e.miniPackOutDocumentsList.map((vo, io) => {
          //       this.$set(this.textarea, [this.designScheme[i][io].sid], e.think);
          //       return {
          //         name: vo.miniPackOutGoods.modelName,
          //         id: vo.id,
          //         fileType: _this.taskList.outType,
          //         imgUrl: vo.miniPackOutDocuments.jpgUrl,
          //         pdfUrl: vo.miniPackOutDocuments.pdfUrl,
          //         sid: vo.miniPackOutDocuments.id,
          //         think: e.think,
          //         moreUrl: vo.miniPackOutDocuments.moreUrl ? JSON.parse(vo.miniPackOutDocuments.moreUrl) : []
          //       };
          //     });

          //     return arr;
          //   });
          // }
          // this.designScheme = Object.assign([], this.designScheme);

          // console.log('this.textarea', this.textarea);
          // 提交参数的回显
          this.designScheme.map((el, ie) => {
            this.parmers[ie] = JSON.parse(JSON.stringify(this.parmers[0]));
            // console.log('提交参数的回显', this.parmers[ie]);
            el.map((ol, io) => {
              this.parmers[ie].miniPackOutDocumentsList[io] = JSON.parse(JSON.stringify(this.parmers[0].miniPackOutDocumentsList[0]));
              this.parmers[ie].miniPackOutDocumentsList[io].outGoodsId = ol.id;
              this.parmers[ie].miniPackOutDocumentsList[io].pdfUrl = ol.pdfUrl;
              this.parmers[ie].miniPackOutDocumentsList[io].jpgUrl = ol.imgUrl;
              this.parmers[ie].miniPackOutDocumentsList[io].moreUrl = '';
              // this.parmers[ie].miniPackOutDocumentsList[io].moreUrl =ol.moreUrl.length>0?JSON.stringify(ol.moreUrl):'';
              this.parmers[ie].miniPackOutDocumentsList[io].moreUrlList = ol.moreUrl;
              this.parmers[ie].think = ol.think;
            });
          });

          //czj
          // this.parmers = this.designScheme.map((el, ie) => {
          //   let obj = {
          //     id: this.$route.query.id,
          //     think: null,
          //     miniPackOutDocumentsList: null
          //   };
          //   obj.miniPackOutDocumentsList = el.map((ol, io) => {
          //     obj.think = ol.think;
          //     console.log(22222,ol.id);
          //     return {
          //       outGoodsId: ol.id,
          //       pdfUrl: ol.pdfUrl,
          //       jpgUrl: ol.imgUrl,
          //       psdUrl: null,
          //       moreUrl: '',
          //       moreUrlList: ol.moreUrl,
          //       fileType: _this.taskList.outType
          //     };
          //   });
          //   return obj;
          // });
          // console.log('this.parmers7777777', this.parmers);
          console.log('this.designScheme7777777', this.designScheme);

          this.outDocFlag = this.taskList.outDocumentsLogList.length > 0 ? true : false;
          // 回显驳回数据
          if (this.outDocFlag) {
            if (this.taskList.outDocumentsLogList[0].status == 1) {
              this.results = '审核通过';
            } else if (this.taskList.outDocumentsLogList[0].status == 2) {
              this.results = '审核不通过';
            }
            //  else if (this.taskList.outDocumentsLogList[0].status == 3) {
            //   this.results = '驳回修改';
            // }
            this.dTime = this.taskList.outDocumentsLogList[0].adate;
          }
        }
      });
    },
    // 点击删除按钮
    removeUploadFile(id) {
      let indexList = this.selIndex(this.designScheme, id);
      this.designScheme.splice(indexList[0], 1);
      this.parmers.splice(indexList[0], 1);
      // console.log('移除', this.parmers);
      // console.log(' this.designScheme9999999',delIndex, this.designScheme,);
    },
    // 返回选中的下标
    selIndex(designScheme, id) {
      let delIndex = '';
      let inIndex = '';
      designScheme.map((el, index) => {
        el.map((item, i) => {
          if (item.sid == id) {
            delIndex = index;
            inIndex = i;
          }
        });
      });
      let arr = [delIndex, inIndex];
      return arr;
    },
    // 提交审核按钮
    submitAudit() {
      let _this = this;
      let flag = false;
      let flagArr = [];
      if (this.realStatus != 2) {
        this.showCodeDialog = true;
        return;
      }
      let [{ miniPackOutDocumentsList, think }] = this.parmers;
      if (this.taskList.outType == 2) {
        if (this.masterList.length > 1) {
          this.parmers[0].moreUrl = JSON.stringify(this.masterList);
        } else {
          this.$message.error('请上传组合主图！');
          return;
        }
      }

      // console.log('this.parmers88888888888', this.parmers);
      if (this.taskList.outType == 0) {
        this.parmers.map(item => {
          // 不等于空时返回true
          flag = item.miniPackOutDocumentsList.every(e => {
            return e.jpgUrl != null && e.pdfUrl != null && e.jpgUrl != '' && e.pdfUrl != '' && item.think != '' && item.think != null;
          });
        });
      } else {
        flag = miniPackOutDocumentsList.every(vo => {
          let lsit = vo.moreUrlList;
          vo.moreUrl = JSON.stringify(vo.moreUrlList);
          return lsit.length > 3 && think != '' && think != null;
        });
      }
      flagArr.push(flag);
      let flag1 = flagArr.every(e => e);
      if (flag1) {
        if (this.checked) {
          console.log('this.parmers-------', this.parmers);
          // 删除不需要传的参数
          miniPackOutDocumentsList.map(e => {
            delete e.moreUrlList;
          });

          // console.log('this.checked', this.checked);
          getSubmitAudit(this.parmers)
            .then(res => {
              // console.log('提交数据', res);
              if (res.code == '000000') {
                this.$router.push('/user/myTask');
              }
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          this.$message.error('请勾选同意设计作品条款！');
        }
      } else {
        this.$message.error('请按要求提交完整设计稿件和设计理念！');
      }
    },
    // 新增按钮
    addDesign() {
      // console.log('111111newRemainder:', this.newRemainder, 'uploadTheNumber:', this.taskList.uploadTheNumber);
      this.newRemainder = this.taskList.newRemainder;
      this.addScheme();
    },
    // 数据的添加
    addScheme() {
      let copyList = [];
      let parmersList = JSON.parse(JSON.stringify(this.parmers[0]));
      if (this.newRemainder == 0 || this.designScheme.length == this.newRemainder || this.newRemainder == null) {
        this.$message({
          message: `可提交稿件已满额，您当前最多可提交${this.newRemainder}份，如确实需要也可联系我们沟通`,
          type: 'warning'
        });
      } else {
        // 深拷贝数组对象
        this.designScheme.map((item, index) => {
          if (index == 0) {
            const copyItem = JSON.parse(JSON.stringify(item));
            copyItem.map((e, i) => {
              e.sid += this.copyId;
              e.pdfUrl = null;
              e.imgUrl = null;
              parmersList.miniPackOutDocumentsList[i] = JSON.parse(JSON.stringify(this.parmers[0].miniPackOutDocumentsList[0]));
              parmersList.miniPackOutDocumentsList[i].outGoodsId = e.id;
              parmersList.miniPackOutDocumentsList[i].pdfUrl = null;
              parmersList.miniPackOutDocumentsList[i].psdUrl = null;
              parmersList.miniPackOutDocumentsList[i].jpgUrl = null;
              // parmersList.think = e.think;

              // console.log('卡纸盒', e.id);
            });
            copyList.push(copyItem);
          }
        });
        this.copyId += 5;
        this.designScheme.push(...copyList);
        this.parmers.push(parmersList);
        // console.log('this.designSchemejjjjjj', this.designScheme);
        // console.log('this.parmersjjjjjj', this.parmers);
      }
    },
    //上传文件的判断
    beforeUploadFile(file, type) {
      var fileName = file.name;
      // console.log(file.name);
      let flag = true;
      this.masterList.map(val => {
        if (this.fileName(val.name) == fileName) {
          this.$message.error('上传文件名相同！');
          flag = false;
        }
      });
      // console.log('this.masterList======', this.masterList);

      this.parmers.map(vo => {
        vo.miniPackOutDocumentsList.map(e => {
          // console.log('e60021-----', e);
          if (this.fileName(e.pdfUrl) == fileName || this.fileName(e.imgUrl) == fileName) {
            this.$message.error('上传文件名相同！');
            flag = false;
          }
          e.moreUrlList.map(item => {
            if (item.name == fileName) {
              this.$message.error('上传文件名相同！');
              flag = false;
            }
          });
        });
      });

      if (flag) {
        this.loading = this.$loading({
          lock: true,
          text: 'Loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      }
      return flag;
      // const fileSize = file.size / 1024 / 1024 < 50;
      // console.log('type333', type);
      // if (type == 'pdf') {
      //   const reg = /\.(psd|pdf|cdr)$/;
      //   const extension = reg.test(fileName);
      //   if (!extension) {
      //     this.$message({
      //       message: '上传文件只能是 ai、psd、pdf、cdr格式!',
      //       type: 'warning'
      //     });
      //   }
      //   // if (!fileSize) {
      //   //   this.$message({
      //   //     message: '上传文件大小不能超过 50MB!',
      //   //     type: 'warning'
      //   //   });
      //   // }
      //   return extension;
      // }
      // else {
      //   const reg1 = /\.(jpg|png)$/;
      //   const extension1 = reg1.test(fileName);
      //   if (!extension1) {
      //     this.$message({
      //       message: '上传文件只能是 jpg、png格式!',
      //       type: 'warning'
      //     });
      //   }
      //   return extension1;
      // }

      // return extension && fileSize;
    },

    textareaChange(val, id) {
      let indexText = this.selIndex(this.designScheme, id);
      this.parmers[indexText[0]].think = val;
      // console.log(3333333, val);
    },
    // 获取路径的名字
    fileName(url) {
      if (url) {
        let urlList = url.split('/');
        return urlList[urlList.length - 1];
      }
    },
    //上传成功的方法
    uploadDesignSuccess(response, file, fileList, type, fId) {
      this.loading.close();
      this.moreUrl = [];
      if (response.code === '000000') {
        if (fId == 'z') {
          let index1 = this.masterList.findIndex(e => e.type == type);
          const obj = {
            name: file.name, //文件名
            type, //" 0 3D源文件素材包 1 3D渲染组合主图 2 psd 3 3D素模文件 4 3D皮肤文件5 3D渲染源文件 6 3D渲染主图7 转曲源文件8 未转曲源文件9 缩略图文件 10 刀模图文件",
            fileUrl: response.data //文件路径
          };
          if (index1 == -1) {
            this.masterList.push(obj);
          } else {
            this.masterList[index1] = obj;
          }
          console.log('this.masterList---', this.masterList);
        } else {
          let indexList = this.selIndex(this.designScheme, fId);
          if (this.taskList.outType == 0) {
            // 包装平面设计的传参
            if (type == 'pdf') {
              this.pdfUrl = response.data;
              this.designScheme[indexList[0]][indexList[1]].pdfUrl = this.pdfUrl;
              this.parmers[indexList[0]].miniPackOutDocumentsList[indexList[1]].pdfUrl = this.pdfUrl;
            } else {
              this.imgUrl = response.data;
              this.designScheme[indexList[0]][indexList[1]].imgUrl = this.imgUrl;
              this.parmers[indexList[0]].miniPackOutDocumentsList[indexList[1]].jpgUrl = this.imgUrl;
            }
          } else {
            //平面设计的传参
            // console.log('平面设计和3D设计的传参');
            const moreObj = {
              name: file.name, //文件名
              type, //" 0 3D源文件素材包 1 3D渲染组合主图 2 psd 3 3D素模文件 4 3D皮肤文件5 3D渲染源文件 6 3D渲染主图7 转曲源文件8 未转曲源文件9 缩略图文件 10 刀模图文件",
              fileUrl: response.data //文件路径
            };

            let morerIndex = this.designScheme[indexList[0]][indexList[1]].moreUrl.findIndex(item => item.type == type);
            // console.log('morerIndex-----', morerIndex, indexList[0], indexList[1]);
            // 第一次上传的时候
            if (morerIndex == -1) {
              this.designScheme[indexList[0]][indexList[1]].moreUrl.push(moreObj);
              if (type == 3) {
                this.designScheme[indexList[0]][indexList[1]].mouldPath = moreObj.fileUrl;
              }
              if (type == 4) {
                this.designScheme[indexList[0]][indexList[1]].skinPath = moreObj.fileUrl;
              }
              if (type == 6) {
                this.designScheme[indexList[0]][indexList[1]].goodsThumbnail = moreObj.fileUrl;
              }
              // this.parmers[indexList[0]].miniPackOutDocumentsList[indexList[1]].moreUrlList.push(moreObj);
              // console.log('designScheme---9999--', this.designScheme);
              // console.log('this.parmers-----', this.parmers);
            } else {
              // 驳回再次上传
              this.designScheme[indexList[0]][indexList[1]].moreUrl[morerIndex] = moreObj;
              this.parmers[indexList[0]].miniPackOutDocumentsList[indexList[1]].moreUrlList[morerIndex] = moreObj;
              if (type == 3) {
                this.designScheme[indexList[0]][indexList[1]].mouldPath = moreObj.fileUrl;
              }
              if (type == 4) {
                this.designScheme[indexList[0]][indexList[1]].skinPath = moreObj.fileUrl;
              }
              if (type == 6) {
                this.designScheme[indexList[0]][indexList[1]].goodsThumbnail = moreObj.fileUrl;
              }
            }
          }
        }
        // console.log('this.designScheme=====--77777-====',this.designScheme);

        // 用于视图更新
        this.designScheme = Object.assign([], this.designScheme);
        this.masterList = Object.assign([], this.masterList);
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
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  }
};
</script>
<style>
.code2 .el-dialog--center .el-dialog__body {
  padding: 0px 25px 40px;
}
.closeTask .el-radio__input.is-checked + .el-radio__label {
  color: #d0111b;
}
.closeTask .el-radio__input.is-checked .el-radio__inner {
  border-color: #d0111b;
  background: #d0111b;
}
.closeTask .el-radio__inner:hover {
  border-color: #d0111b;
}
/* 修改选择框颜色 */
.checkbox .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #d0111b;
}
.checkbox .el-checkbox__input.is-checked + .el-checkbox__label a {
  color: #d0111b;
}
.checkbox .el-checkbox__input.is-checked .el-checkbox__inner,
.checkbox .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  border-color: #d0111b !important;
  background-color: #d0111b !important;
}
.checkbox .el-checkbox__inner:hover {
  border-color: #d0111b !important;
}
.checkbox .el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: #d0111b !important;
}
.processList .is-process {
  color: #ed111b;
}
/*等待状态——序号颜色、圆圈边框颜色*/
.processList .el-step__head.is-process {
  border-color: #ed111b;
}

.listFiles .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.listFiles .avatar-uploader .el-upload:hover {
  border-color: #d0111b;
}
.listFiles .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 160px;
  height: 60px;
  line-height: 60px;
  text-align: center;
}
.listFiles .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style scoped>
.positionFixed {
  position: fixed;
  z-index: 10;
}
.positionStatic {
  position: static;
}
.tipsMeagge {
  margin-top: 20px;
  padding: 20px;
  background: #fff;
  font-size: 14px;
  color: #e60021;
  line-height: 22px;
}
.tips {
  color: #aaa;
  margin-top: 30px;
  font-size: 14px;
  background: #fff;
  padding: 40px 30px;
}
.task_head {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  font-size: 20px;
}
.task_head .close {
  display: flex;
  justify-content: space-between;
}
.left_box {
  background: #fff;
  color: #333;
  font-size: 14px;
  padding: 40px 30px;
}
.left_box li {
  margin-bottom: 30px;
}
.cainterBox {
  /* padding: 30px; */
  color: #333;
  font-size: 14px;
}
.cainterBox .processing {
  background: #fff;
  padding: 30px;
}
.shareTask .goto {
  cursor: pointer;
}
.shareTask .goto:hover {
  color: #d0111b;
}
.cainterBox h3 {
  font-size: 18px;
}
.cainterBox .shareTask {
  text-align: right;
  font-size: 12px;
  padding: 4px;
  border-bottom: 1px solid #797979;
}
.cainterBox .process {
  margin-top: 30px;
  margin-bottom: 10px;
}
.cainterBox .processList {
  background: #f9f9f9;
  padding: 30px;
  margin-bottom: 20px;
}
.cainterBox .currents {
  background: #f9f9f9;
  padding: 20px;
  margin-bottom: 40px;
}
.cainterBox .record {
  display: flex;
  margin-bottom: 60px;
}
.cutter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  margin-top: 10px;
  padding: 20px;
}
.cutter li {
  /* height: 50px; */
  /* line-height: 50px; */
}
.cutter .cutMode {
  font-size: 18px;
  font-weight: 700;
  margin-right: 20px;
}
.downloads {
  background: #ff305a;
  color: #fff;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}
.bottomBox {
  display: flex;
  justify-content: space-between;
}
.designFiles {
  background: #fff;
  margin-top: 10px;
  padding: 20px;
  margin-right: 10px;
}

.designFiles .file_head {
  display: flex;
  justify-content: space-between;
}
.designFiles .btn {
  width: 140px;
  height: 40px;
  margin: 20px 0;
  color: #fff;
  border-color: #ff0036;
  background-color: #ff0036;
}
.designFiles .addBtn:active,
.designFiles .addBtn:focus {
  color: #606266;
  border-color: #dcdfe6;
  background-color: #ffffff;
}
.designFiles .btn:focus,
.designFiles .btn:active {
  color: #fff;
  border-color: #ff0036;
  background-color: #ff0036;
  /* color: #606266;
  border-color: #dcdfe6;
  background-color: #ffffff; */
}
.designFiles .btn:hover {
  color: #fff;
  border-color: #ea0032;
  /* border: none; */
  background-color: #ea0032;
}
.cainterBox .details {
  font-size: 18px;
  font-weight: 700;
  /* margin-bottom: 36px; */
}
.designFiles_head {
  display: flex;
  justify-content: space-between;
}
.designFiles .addBtn {
  width: 86px;
  height: 36px;
  line-height: 36px;
  padding: 0;
}

.designFiles .addBtn:hover {
  background: #d0111b;
  color: #fff;
  border: none;
}
.cainterBox .sourceFile {
  margin-bottom: 30px;
  margin-top: 30px;
}
.bottomBox .sourceFile .lookPdf {
  color: #409eff;
}
.bottomBox .sourceFile .lookPdf:hover {
  color: #d0111b;
  cursor: pointer;
}
.cainterBox .deffilent {
  margin-right: 20px;
  cursor: pointer;
  color: #e60021;
}
.cainterBox .deffilent:hover {
  color: #c81623;
}
.cainterBox .payFiles {
  margin-bottom: 20px;
}
.cainterBox .listFiles {
  display: flex;
  flex-wrap: wrap;
}
.cainterBox .listFiles .muchUpFiles {
  /* display: flex;
  flex-direction: column; */
}

.cainterBox .listFiles li {
  margin-left: 30px;
  text-align: center;
  margin-bottom: 10px;
}
.designFiles .selActive {
  border-top: 1px dashed #dcdfe6;
}
.cainterBox .boxs {
  width: 122px;
  height: 70px;
  border: 1px solid #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 10px;
}
.cainterBox .sample {
  color: #e60021;
  width: 162px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}
.requires {
  background: #fff;
  margin-top: 10px;
  padding: 20px;
}
.cainterBox .requirements {
  margin-bottom: 30px;
}
.cainterBox .requirements .require {
  margin-bottom: 20px;
}
.view3d {
  color: #6b9eff;
  cursor: pointer;
  margin-left: 10px;
}
</style>
<style scoped src="@/static/mulindex/css/public.css"></style>
<style scoped src="@/static/mulindex/css/fonts.css"></style>
<style scoped src="@/static/index/user/css/all.css" />
<!--<style scoped src="../../static/index/css/main.css" />-->
<style scoped src="../../../static/login.css" />
<style src="../../../static/index/user/css/reset.css" />
