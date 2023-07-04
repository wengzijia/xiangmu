<template>
  <div class="artwork-workbench">
    <listLayout>
    <template #header>
    <div class="top-bar">
      <el-form inline :model="formParams" class="condition filterForm" ref="queryRef" label-width="100px">
        <!-- <el-form-item label="打样编号:" prop="proofNo">
          <el-input
            v-model.trim="formParams.proofNo"
            placeholder="请输入打样编号"
            clearable
          />
        </el-form-item> -->
        <!-- 客户名称 -->
        <el-form-item label="PO号:" prop="poNo">
          <el-input class="headerinp" v-model.trim="formParams.poNo" placeholder="请输入PO号" clearable />
        </el-form-item>
        <!-- <el-form-item label="客户名称:" prop="customerName">
          <el-input v-model.trim="formParams.customerName" placeholder="请输入客户名称" clearable />
        </el-form-item> -->
        <el-form-item label="收货人名称:" prop="consignee">
          <el-input class="headerinp" v-model.trim="formParams.consignee" placeholder="请输入收货人名称" clearable />
        </el-form-item>
        <el-form-item label="业务员名称:" prop="salesMan">
          <el-input class="headerinp" v-model.trim="formParams.salesMan" placeholder="请输入业务员名称" clearable />
        </el-form-item>
        <el-form-item label="发货状态:" prop="status">
          <el-select v-model="formParams.status" class="headerinp" placeholder="全部状态" clearable>
            <el-option v-for="item in ac_deliver_status" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="大货货期:">
          <template #label>
            <span>大货货期</span>
          </template>
          <el-date-picker class="headerinp" v-model="donetime" type="daterange" unlink-panels range-separator="→" start-placeholder="开始日期"
            end-placeholder="结束日期" @change="setTime" />
        </el-form-item>
        <!-- <el-form-item>
          <el-button @click="resetQuery">重置</el-button>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item> -->
      </el-form>
      <div class="btnBox">
        <el-button @click="resetQuery">重置</el-button>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
    </div>
    </template>
    <!-- <div class="titleBox">
      <div class="listText">打样发货列表</div>
    </div> -->
    <template #table-header>
      <div class="top-bar">
        <div class="titleBox">
          <div class="listText">
            打样发货列表
            <el-badge :value="revokeMsgCount||0" :max="99" class="msgbtn" @click="revokeMsgCount">
              <el-button type="warning">撤单消息</el-button>
            </el-badge>
          </div>
          <div class="disposeBox">
            <Counter :processing="processing" :toBeProcessed="toBeProcessed"/>
          </div>
        </div>
      </div>
    </template>
        <!-- <div class="top-bar"> -->
        <!-- <el-link :underline="false" @click="showDialog" style="font-size:16px;">撤单消息<span>({{revokeMsgCount}})</span><span v-if="revokeMsgCount" class="red-dot"></span></el-link> -->
        <!-- <el-button type="primary" @click="Task">领取任务</el-button> -->
        <!-- </div> -->
      <!-- </template> -->
      <!-- 撤单消息弹窗 -->
      <div class="revokeMessage">
        <el-dialog v-model="isRevokeShow" title="撤单消息" width="1200px">
          <!-- 撤单消息列表 -->
          <cancelOrder
            :revokeData="revokeData"
            @getRevoke="getRevoke"
          ></cancelOrder>
          <div>
            <pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              v-model:page="revokeParams.current"
              @pagination="getRevokeListData"
              :total="revokeTotal"
              v-model:limit="revokeParams.size"
              :pageSizes="[10, 20, 50, 100]"
            />
          </div>
          <div class="alignRight" style="padding-top: 20px">
            <el-button type="primary" @click="isRevokeShow = false"
              >关闭</el-button
            >
          </div>
        </el-dialog>
      </div>
    <template #table-content='tableHeight'>
    <!-- 结构文件任务列表  -->
    <div class="outworkListBox">
      <el-table :data="tableData" :height='tableHeight.tableHeight' row-key="id" ref="multipleTable">
        <el-table-column label="PO号" width="200">
          <template #default="scope">
            <div>
              <poView :po-no="scope.row.poNo"></poView>
                <!-- <span>{{ scope.row.poNo || "-" }}</span>
                <el-icon v-copyText="scope.row.poNo" v-copyText:callback="copyTextSuccess" v-if="scope.row.poNo"
                  class="gesture">
                  <CopyDocument />
                </el-icon> -->
              <div style="display: flex;">
                <div v-for="(item, index) in ac_proof_type" :key="index">
                  <el-tag class="mx-1" hit v-if="item.value == scope.row.proofingType"> {{ item.label }} </el-tag>
                </div>
                <el-tag effect="dark" style="margin-left:5px;cursor: pointer;"
                  @click="seeNote(scope.row.combinationInformation)">组合信息</el-tag>
              </div>
                <div style="margin-top: 5px">
                  <el-tag hit>{{scope.row.productName}}</el-tag>
                </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="工单参数" width="310">
          <template #default="scope">
            <!-- <div>
              <el-link
                @click="seeAll(scope.row.productAttr)"
                :underline="false"
              >
                <span class="property">{{ scope.row.productAttr || "-" }}</span>
              </el-link>
            </div> -->
            <OrderAttrShow :attr="scope.row.productAttr" :activityId="scope.row.id" type="proofDeliver" :lineFeed="(scope.row.productName&&!(scope.row.productName.indexOf('精装盒')!=-1||scope.row.productName.indexOf('双驳盒')!=-1))"></OrderAttrShow>
          </template>
        </el-table-column>
        <!-- <el-table-column label="大货货期" width="120">
          <template #default="scope">
            <div>
              <span>{{ scope.row.deliveryDay || "-" }}</span>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column label="业务员" width="100">
          <template #default="scope">
            <p v-show="scope.row.salesman">
              <span class="TimeTitle">业务员:</span><br/>
              <span class="TimeCon">{{ scope.row.salesman || "-" }}</span>
            </p>
            <p v-show="scope.row.pushTime">
              <span class="TimeTitle">文件推送人:</span>
              <br/>
              <span class="TimeCon">{{ scope.row.fileSender || "-" }}</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="发货状态" width="100">
          <template #default="scope">
            <template v-for="item in ac_deliver_status" :key="item">
              <el-tag v-if="scope.row.status == item.value">{{
                  item.label
              }}</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="100" :show-overflow-tooltip="true">
          <template #default="scope">
            <div>
              <RemarkDialog :order="scope.row" type="proofDeliver" :proxyType="ac_remark_type" @getList="getList"/>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="计划发货" width="120">
          <template #default="scope">
            <p>
              配送方式：
              <template v-for="item in ac_delivery_type" :key="item">
                <el-tag v-if="scope.row.deliveryType == item.value">{{
                    item.label
                }}</el-tag>
              
              </template>
            </p>
            <div>
              <span>{{ scope.row.plannedDeliveryTime || "-" }}</span>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="打样编号" width="200">
          <template #default="scope">
            <div>
              <span>{{ scope.row.proofNo || "-" }}</span>
              <el-icon
                v-copyText="scope.row.proofNo"
                v-copyText:callback="copyTextSuccess"
                v-if="scope.row.proofNo"
                class="gesture"
                ><CopyDocument
              /></el-icon>
            </div>
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="品类" width="200">
          <template #default="scope">
            <div>
              <span>{{ scope.row.productName || "-" }}</span>
            </div>
          </template>
        </el-table-column> -->

        <!-- <el-table-column label="组合信息" width="200" >
            <template #default="scope">
              <div v-if="scope.row.combinationInformation">
                <el-link
                  @click="seeNote(scope.row.combinationInformation)"
                  :underline="false"
                  type="primary"
                >
                查看
                </el-link>
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column> -->
        <!-- <el-table-column label="数量">
          <template #default="scope">
            <div>
              <span>{{ scope.row.productNumber || "-" }}</span>
            </div>
          </template>
        </el-table-column> -->

        

        <!-- <el-table-column label="配送方式" width="100">
          <template #default="scope">
            <template v-for="item in ac_delivery_type" :key="item">
              <el-tag v-if="scope.row.deliveryType == item.value">{{
                  item.label
              }}</el-tag>
             
            </template>
           
          </template>
        </el-table-column> -->
        <el-table-column label="实际发货" width="210">
          <template #default="scope">
            <p v-show="scope.row.deliveryTime">
              <span class="TimeTitle">实际发货时间:</span>
              <br/>
              <span class="TimeCon">{{ scope.row.deliveryTime || "-" }}</span>
            </p>
            <p v-show="scope.row.expressNumber">
              <span class="TimeTitle">快递单号:</span>
              <br/>
              <span class="TimeCon">{{ scope.row.expressNumber || "-" }}</span>
            </p>
            <div v-show="scope.row.salesman">
              <span class="TimeTitle">运费:</span>
              <span class="TimeCon">{{ showMoney(scope.row.expressage) || '0.00' }}</span>
              <div v-if="scope.row.expressage" style="margin-top: 5px;">
                <el-tag>{{scope.row.expressType}}</el-tag>
              </div>
            </div>

            <p v-show="scope.row.productNumber">
              <span class="TimeTitle">发货数量:</span>
              <span class="TimeCon">{{ scope.row.productNumber || "-" }}</span>
            </p>
            
            

            <!-- <div>{{ scope.row.expressage }}</div>
            <div v-if="scope.row.expressage" style="margin-top: 5px;">
              <el-tag>{{scope.row.expressType}}</el-tag>
            </div> -->
          </template>
        </el-table-column>
        
        <!-- <el-table-column label="文件推送人" width="100">
          <template #default="scope">
            <div>
              {{ scope.row.fileSender || "-" }}
            </div>
          </template>
        </el-table-column> -->
        <el-table-column label="收货信息">
          <template #default="scope">
            <div v-if="
              scope.row.receivingInformation
            ">
              <div>
                收货人:{{ scope.row.receivingInformation.receiver }}
              </div>
              <div>
                手机号:{{
                    scope.row.receivingInformation.phoneNumber
                }}
              </div>
              <div>
                收货地址:{{ scope.row.receivingInformation.address }}
              </div>
               <p>
              <el-link type="primary" :underline="false" class="mar_10"
                v-copyText="output(scope.row.receivingInformation)" v-copyText:callback="copyTextSuccess"
                :disabled="!scope.row.receivingInformation">
                复制收货信息</el-link>
              </p>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        
        <!-- <el-table-column label="实际发货时间" width="160">
          <template #default="scope">
            <div>{{ scope.row.deliveryTime || "-" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="快递单号" width="200">
          <template #default="scope">
            <div>{{ scope.row.expressNumber || "-" }}</div>
          </template>
        </el-table-column> -->
        <el-table-column fixed="right" label="操作" width="90">
          <template #default="scope">
            <div class="operate">
              <p>
              <el-link type="primary" :underline="false" class="mar_10" :disabled="scope.row.status != 0"
                >
                <!-- @click="reject(scope.row.id)" -->
                <rejectDialog :activityId="scope.row.activityId" @callBack="refusalAffirm" :scope="scope.row" :img="false"/>
              </el-link>
              </p>
              <p>
              <el-link type="primary" :underline="false" class="mar_10" :disabled="scope.row.status != 0"
                @click="diverSheet(scope.row.id, scope.row.deliveryType)">登记发货</el-link>
              </p>
              <!-- <p>
              <el-link type="primary" :underline="false" class="mar_10"
                v-copyText="output(scope.row.receivingInformation)" v-copyText:callback="copyTextSuccess"
                :disabled="!scope.row.receivingInformation">
                复制收货信息</el-link>
              </p> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    </template>
    <template #pagination>
    <!-- 分页 -->
    <div class="prooflaypage">
      <pagination background layout="total, sizes, prev, pager, next, jumper" v-model:page="formParams.current"
        @pagination="handleSizeChange()" :total="total" v-model:limit="formParams.size"
        :pageSizes="[10, 20, 50, 100]" />
    </div>
    </template>
    </listLayout>
    <!-- 信息组合弹框 -->
    <div class="is-align-center">
      <el-dialog v-model="isNoteShow" title="信息组合" width="600px">
        <div style="line-height: 2">{{ NoteContent }}</div>
        <template #footer>
          <span>
            <el-button type="primary" @click="isNoteShow = false">关闭</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <!-- 属性弹框 -->
    <div class="is-align-center">
      <el-dialog v-model="isAttrShow" title="参数详情" width="600px">
        <el-scrollbar style="margin-right: 20px;height: 450px;">
          <div style="line-height: 2">{{ attrContent }}</div>
        </el-scrollbar>
        <template #footer>
          <span>
            <el-button type="primary" @click="isAttrShow = false">关闭</el-button>
          </span>
        </template>
      </el-dialog>
    </div>

    <!-- 驳回弹窗 -->
    <div class="is-align-center">
      <el-dialog v-model="isRefusalShow" title="驳回" width="600px" :before-close="cancel">
        <el-form ref="formRefusal" :rules="refusalRules" :model="refusalParams" label-width="100px"
          class="demo-ruleForm">
          <el-form-item label="驳回原因:" prop="remark">
            <el-input v-model.trim="refusalParams.remark" type="textarea" placeholder="请填写驳回原因" autocomplete="off"
              show-word-limit maxlength="500" resize="none" rows="6" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="refusalAffirm()">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <div class="is-align-center">
      <el-dialog v-model="isDeliverShow" :title="diverTitle" width="500px" :before-close="diverCancel">
        <el-form ref="formDeliver" :model="deliverParam" label-width="100px" class="demo-ruleForm" :rules="deliverRules">
          <template v-if="diverStatus == 3">
            <div>操作立即生效，是否继续</div>
          </template>
          <template v-else>
            <el-form-item label="配送方式:" prop="expressType">
              <el-radio-group v-model="deliverParam.expressType">
                <el-radio  v-for="item in expressTypeList" :key="item" :label="item">{{item}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="快递单号:" prop="expressNumber">
              <el-input v-model.trim="deliverParam.expressNumber" placeholder="请填写快递单号" clearable maxlength='50' />
            </el-form-item>
            <el-form-item label="快递运费:" prop="freight" v-show="deliverParam.expressType!=='顺丰到付'"  >
              <el-input  v-model.trim="deliverParam.freight" placeholder="请填写快递运费"  maxlength='5' clearable>
                <template #append>元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="快递运费:" v-show="deliverParam.expressType==='顺丰到付'">
              <label  >无</label>
            </el-form-item>
          </template>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="diverCancel">取消</el-button>
            <el-button type="primary" @click="deliverAffirm()">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import cancelOrder from "@/components/cancelOrder";
import { getPage, getReject, getDeliver, getMsgCount, getCancelMsg, submitMsgOps,getTaskCount } from "@/api/deliver/index";
import RemarkDialog from "@/components/RemarkDialog/remark.vue";
import OrderAttrShow from "@/components/OrderAttrShow/order.vue";
import { formatDates } from "@/utils/index";
import { ElMessage } from "element-plus";
import { nextTick, watch } from 'vue';
import poView from "./components/poView.vue"
import { showMoney } from "@/utils/index";
import rejectDialog from "./components/rejectDialog.vue";
import Counter from "@/components/proof/Counter.vue"
const { proxy } = getCurrentInstance();

const { ac_delivery_type, ac_deliver_status, ac_proof_type, ac_remark_type } = proxy.useDict(
  "ac_delivery_type",
  "ac_deliver_status",
  "ac_proof_type",
  "ac_remark_type"
);
const router = useRouter();
// 总条数
let total = ref(0);
const diverTitle = ref("确认已发货?");
const diverStatus = ref("");
// 表格数据
const tableData = ref([]);
let isRefusalShow = ref(false);
let isDeliverShow = ref(false);
// 是否显示属性弹框
let isAttrShow = ref(false);
// 属性内容
let attrContent = ref("");
let isNoteShow = ref(false);
let NoteContent = ref("")
let donetime = ref([]);

const processing = ref(0)//处理中
const toBeProcessed = ref(0)//待处理

const data = reactive({
  formParams: {
    proofNo: "", //打样编号
    status: "",
    current: 1, // 页数
    size: 10, // 每页条数
    // customerName: "",//客户名称
    consignee:'',//收货人
    salesMan:'',//收货人
    startDay: '', // 开始时间
    endDay: '', // 结束时间
    poNo: ''
  },
  deliverParam: {
    expressNumber: "",
    id: "",
    freight:'',
    expressType:''
  },
  // 驳回参数
  refusalParams: {
    id: "", // id
    remark: "", // 备注
  },
  refusalRules: {
    remark: [{ required: true, message: "请填写驳回原因", trigger: "blur" }],
  },
  deliverRules: {
    expressType: [
      { required: true, message: "请选择配送方式", trigger: "blur" },
    ],
    expressNumber: [
      { required: true, message: "请填写快递单号", trigger: "blur" },
    ],
    freight: [
      { required: true, trigger: "change" ,validator:(rule, value, callback)=>{
        if(deliverParam.value.expressType==='顺丰到付'){
          callback()
        }else{
          console.log('value',value)
          if(value==''){
            callback(new Error('请填写快递运费'))
          }else if(value>0){
            callback()
          }else{
            callback(new Error('请填写正确的运费信息'))
          }
          
        }
      },
    },
    {  trigger: "blur" ,validator:(rule, value, callback)=>{
        if(deliverParam.value.expressType==='顺丰到付'){
          callback()
        }else{
          console.log('value',value)
          if(value==''){
            callback(new Error('请填写快递运费'))
          }else if(value>0){
            callback()
          }else{
            callback(new Error('请填写正确的运费信息'))
          }
          
        }
      },
    },
    ],
  },
  revokeParams: {
    current: 1, // 页数
    size: 20, // 每页条数
  },
});
const { formParams, refusalParams, refusalRules, deliverParam, deliverRules, revokeParams} = toRefs(data);
const revokeData = ref([]);// 撤单数据
const revokeTotal = ref(0)//撤单消息总数
const revokeMsgCount = ref(0)//撤单消息数量
const isRevokeShow = ref(false)



const multipleTable = ref(null)
watch(tableData, () => {
  nextTick(() => {
    multipleTable.value.setScrollTop(0)
    multipleTable.value.setScrollLeft(0)
  })
})
// 获取结构列表数据
function getList() {
  getPage({
    ...formParams.value,
  }).then((res) => {
    if (res.code === 200) {
      res.data.records.map((item) => {
        if (item.receivingInformation) {
          item.receivingInformation = JSON.parse(item.receivingInformation);
        }
      });
      tableData.value = res.data.records.map(item => {
        let reg = new RegExp("<.+?>", "g")
        item.salesmanNote = item.salesmanNote.replace(reg, '')
        // item.salesmanNote = item.salesmanNote.replace(/\s*/g,"")
        return item
      })
      total.value = res.data.total;
    }
  });
  getRevokeMsgCount()
}
/** 重置按钮操作 */
function resetQuery() {
  donetime.value = ['', '']
  formParams.value.startDay = '';
  formParams.value.endDay = ''
  proxy.resetForm("queryRef");
  search();
}
// 搜索
function search() {
  formParams.value.current = 1;
  getList();
  getCount();
}
// 处理数据
function getCount(){
  getTaskCount(formParams.value).then(res=>{
    if (res.code==200) {
      processing.value = res.data.processingCount
      toBeProcessed.value = res.data.waitingCount
    }
  })
}
getCount()

/** 复制代码成功 */
function copyTextSuccess() {
  proxy.$modal.msgSuccess("复制成功");
}
// 设置时间
function setTime() {
  formParams.value.startDay = formatDates(new Date(donetime.value[0]).getTime()); // 开始时间
  formParams.value.endDay = formatDates(new Date(donetime.value[1]).getTime()); // 结束时间
}
// 查看全部
function seeAll(value) {
  if (value) {
    isAttrShow.value = true;
    attrContent.value = value;
  }
}
//驳回
function reject(id) {
  refusalParams.value.id = id;
  isRefusalShow.value = true;
}

let expressTypeList = ref(['快递邮寄','顺丰到付','顺丰寄付','京东月结'])

// 快递单号
const diverSheet = (id, status) => {
  isDeliverShow.value = true;
  deliverParam.value.id = id;
  diverStatus.value = status;
  if (status == 3) {
    diverTitle.value = "确认客户已自提?";
  } else {
    diverTitle.value = "确认已发货?";
  }
};

function handleSizeChange() {
  getList();
}
getList();
// 驳回确认
const refusalAffirm = (data) => {
  let params = {
    id:data.id,
    remark:data.remark,
    preNodeIndex:data.preNodeIndex
  }
  proxy.$modal.loading('数据提交中，请稍候...')
  getReject(params).then(res=>{
    if(res.code == 200){
      ElMessage.success('驳回成功')
      getAllList()
    }
  }).finally(()=>{
    proxy.$modal.closeLoading()
  })
};

const deliverAffirm = () => {
 
  proxy.$refs["formDeliver"].validate(async (valid) => {
    if (valid) {
      try {
        if(deliverParam.value.expressType=='顺丰到付'){
          deliverParam.value.freight = ''
        }
        let {expressNumber,id,freight,expressType} = deliverParam.value
        let { code, msg } = await getDeliver({
          expressNumber,
          id,
          freight:showMoney(freight),
          expressType
        });
        if (code == 200) {
          getList();
          ElMessage.success('成功');
        } else {
          // ElMessage.error(msg);
        }
        proxy.resetForm("formDeliver");
        isDeliverShow.value = false;
      } catch (err) {
        proxy.resetForm("formDeliver");
        isDeliverShow.value = false;
      }
    } else {
    }
  });
};
function cancel() {
  proxy.resetForm("formRefusal");
  isRefusalShow.value = false;
}
function diverCancel() {
  proxy.resetForm("formDeliver");
  isDeliverShow.value = false;
}
function output(val) {
  if (val) {
    let showVal = `收货人:${val.receiver};\n手机号:${val.phoneNumber};\n收货地址:${val.address};`;
    return showVal;
  } else {
    return "";
  }
}
function seeNote(value) {
  if (value) {
    isNoteShow.value = true
    NoteContent.value = value;
  }
}
//显示撤单消息dialog
function showDialog(){
  if (revokeData.value.length == 0) {
    return
  }else{
    isRevokeShow.value = true
    getRevokeListData()
  }
}
watch(isRevokeShow,(val)=>{
  if (!val) {
    revokeParams.value.current = 1
    revokeParams.value.size = 20
    getRevokeListData()
    getList()
  }
})
// 获取撤单消息数据
function getRevokeListData() {
  getCancelMsg(revokeParams.value).then((res) => {
    if (res.code == 200) {
      if (res.data) {
        revokeData.value = res.data.records;
        revokeTotal.value = res.data.total;
      }
    } else {
    }
  });
}
//获取撤单消息数量
function getRevokeMsgCount() {
  getMsgCount({ type: 1 }).then((res) => {
    if (res.code == 200) {
      revokeMsgCount.value = res.data;
    } else {
      ElMessage.error(res.msg);
    }
  });
}
// 是否同意撤单
function getRevoke(val) {
  let { data, type } = val;
  let { id, structuralId } = data;
  let params = {
    msgId:id,
    structuralId:structuralId,
    result:type
  }
  proxy.$modal.loading('数据提交中，请稍候...')
  submitMsgOps(params).finally(()=>{
    proxy.$modal.closeLoading()
    isRevokeShow.value = false;
    getRevokeListData()
    getList()
  })
}
</script>

<style lang="scss" scoped>
.disposeBox{
  display: flex;
}

.artwork-workbench {
  .top-bar {
    .btnBox {
      text-align: right;
      padding-right: 38px;
      margin-bottom: 10px;
    }
  }

  .msgbtn{
    margin-left: 10px;
  }
  .listText{
    font-weight: 600;
  }
  .titleBox {
    display: flex;
    justify-content: space-between;
  }
  .red{
    color: #F56C6C;
  }

  // 列表
  .outworkListBox {
    .operate {
      .public {
        margin-left: 20px;
      }

      .downBoX {
        text-align: center;

        .downBtn {
          margin-left: 0;
          margin-top: 10px;
        }
      }
    }

    .property {
      display: -webkit-box;
      -webkit-line-clamp: 6;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      word-break: break-all;
    }
  }

  // 分页
  .laypage {
    display: flex;
    justify-content: right;
    margin-top: 20px;
  }

  // 撤回弹窗
  .revokeOutwork {
    .btnBox {
      display: flex;
      justify-content: right;
      margin-top: 20px;
    }
  }
}

// 公共类
/* 单行文字溢出时出现省略号，需设定宽度 */
.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.el-popper) {
  max-width: 400px;
  word-break: break-all;
}
</style>
<style lang="scss">
.is-align-center {
  .el-overlay-dialog {
    display: flex;

    .el-dialog {
      margin: auto;
    }
  }
}

.mar_10 {
  margin-right: 10px;
}

.gesture {
  cursor: pointer;
}
.el-form-item__label{
  font-weight: 700
  ;
}
</style>

