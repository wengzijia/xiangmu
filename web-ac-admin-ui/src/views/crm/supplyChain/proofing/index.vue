<template>
  <div>
    <el-card style="margin: 10px" class="artwork-workbench">
      <div class="top-bar subOrder">
        <el-form inline :model="formData" class="condition">
          <!-- 客户信息 -->
          <el-form-item label="客户信息:">
            <el-input style="width: 252px" clearable v-model="formData.customerInfo" placeholder="请输入客户编号/客户名称" />
          </el-form-item>
          <el-form-item label="归属部门:" prop="acDataSepDeptId">
					  <el-select v-model="formData.acDataSepDeptId" placeholder="所有部门" clearable :disabled="deptDisabled" @change="changeDept" style="width:252px;">
              <el-option v-for="item in deptList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <!-- 业务员 -->

          <el-form-item label="业务员:">
            <el-select v-model="formData.businessStaffId" class="m-2" style="width: 252px" placeholder="所有业务员"
              clearable>
              <el-option v-for="item in salesmanList" :key="item.userId" :label="item.nickName" :value="item.userId" />
            </el-select>
          </el-form-item>
          <!-- 订单类型 -->
          <el-form-item label="供应链专员:">
            <el-select :disabled="isSupply" v-model="formData.supplyChainSpecialistId" class="m-2" style="width: 252px"
              placeholder="所有" clearable>
              <el-option v-for="item in proofSupplyList" :key="item.userId" :label="item.nickName" :value="item.userId" />
            </el-select>
          </el-form-item>
          <!-- 订单生成时间 -->
          <el-form-item label="领取时间:">
            <!-- <el-date-picker style="width: 360px" v-model="startTime" type="datetimerange" unlink-panels
              range-separator="→" start-placeholder="开始日期" end-placeholder="结束日期" @change="timeFormat(startTime, '1')" /> -->
            <dateTimePicker ref="dateRef" :dateType="'datetimerange'" v-model:startTime="formData.receiveTimeStart"
              v-model:endTime="formData.receiveTimeEnd"></dateTimePicker>
          </el-form-item>
          <!-- 订单完成时间 -->
          <el-form-item label="打样完成时间:">
            <!-- <el-date-picker style="width: 360px" v-model="endTime" type="datetimerange" unlink-panels range-separator="→"
              start-placeholder="开始日期" end-placeholder="结束日期" @change="timeFormat(endTime, '2')" /> -->
            <dateTimePicker ref="dateRef1" :dateType="'datetimerange'" v-model:startTime="formData.endTimeStart"
              v-model:endTime="formData.endTimeEnd" :isThreeMonths="false"></dateTimePicker>
          </el-form-item>
          <!-- 订单状态 -->
          <el-form-item label="供应商:">
            <el-select v-if="isMounted" v-model="formData.proofingSupplierId" class="m-2" style="width: 252px"
              placeholder="所有打样供应商" clearable>
              <div v-infinite-scroll="load" style="overflow: auto; height: 200px">
                <el-option v-for="items in supplyList" :key="items.id" :label="items.supplierName" :value="items.id" style="max-width: 252px"/>
              </div>
            </el-select>
          </el-form-item>
          <el-form-item label="订单信息:">
            <el-input style="width: 252px" clearable v-model="formData.orderInfo" placeholder="请输入订单编号/打样工单号" />
          </el-form-item>
          <el-form-item label="打样进度:">
            <el-select v-model="formData.proofingSchedule" class="m-2" style="width: 252px" placeholder="所有" clearable>
              <el-option v-for="item in crm_proofing_schedule" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="btnBox">
          <el-button @click="reset">重置</el-button>
          <el-button type="primary" @click="search">筛选</el-button>
        </div>
      </div>
    </el-card>
    <el-card style="margin: 10px" class="artwork-workbench">
      <div class="titleBox">
        <el-menu :default-active="activeIndex" class="navMenu" mode="horizontal" :ellipsis="false" @select="handleSelect">
          <el-menu-item :index="''">全部</el-menu-item>
          <el-menu-item :index="item.value" v-for="item in crm_proofing_status" :key="item.id">{{ item.label
          }}</el-menu-item>
        </el-menu>
        <div class="navRinght">
          <el-button @click="exportExcel">导出</el-button>
          <el-button type="primary" @click="getTasks">领取任务</el-button>
        </div>
      </div>
      <!-- 列表  -->
      <div class="outworkListBox">
        <el-table :data="tabList" style="width: 100%" scrollbar-always-on>
          <el-table-column label="订单编号" width="210" prop="orderBusinessKey"></el-table-column>
          <el-table-column label="打样工单号" width="200" prop="businessKey"></el-table-column>
          <el-table-column label="客户名称" width="250" prop="customerName"></el-table-column>
          <el-table-column label="业务员" width="200" prop="businessStaffName"></el-table-column>
          <el-table-column label="供应链专员" width="200" prop="supplyChainSpecialistName"></el-table-column>
          <el-table-column v-if="formData.proofingStatus != '3'" label="打样供应商" width="250">
            <template #default="scope">
              {{
                scope.row.proofingSupplierName
                ? scope.row.proofingSupplierName
                : "-"
              }}
            </template>
          </el-table-column>
          <el-table-column v-if="
            formData.proofingStatus != '1' &&
            formData.proofingStatus != '2' &&
            formData.proofingStatus != '3'
          " label="打样状态" width="150">
            <template #default="scope">
              <DictText :value="scope.row.proofingStatus" dict="crm_proofing_status" />
            </template>
          </el-table-column>
          <el-table-column v-if="
            formData.proofingStatus != '1' &&
            formData.proofingStatus != '2' &&
            formData.proofingStatus != '3'
          " label="打样进度" width="150">
            <template #default="scope">
              <DictText :value="scope.row.proofingSchedule" dict="crm_proofing_schedule" />
            </template>
          </el-table-column>
          <el-table-column label="领取时间" width="200">
            <template #default="scope">
              <span>{{ formatDate(scope.row.receiveTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="formData.proofingStatus == '3'" label="中止申请人" width="130">
            <template #default="scope">
              {{
                scope.row.closedApplicanterName
                ? scope.row.closedApplicanterName
                : "-"
              }}
            </template>
          </el-table-column>

          <el-table-column v-if="formData.proofingStatus == '3'" label="中止时间" width="200">
            <template #default="scope">
              <span>{{
                scope.row.closedTime ? formatDate(scope.row.closedTime) : "-"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="
            formData.proofingStatus != '1' &&
            formData.proofingStatus != '3'
          " label="打样完成时间" width="200">
            <template #default="scope">
              <span>{{
                scope.row.endTime ? formatDate(scope.row.endTime) : "-"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="formData.proofingStatus == '2'" label="物流单号" width="130"
            prop="logisticsNumber"></el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template #default="scope">
              <el-link type="primary" :underline="false" @click="gotoDetail(scope.row)">详情</el-link>
              <!-- <el-button style="margin-left: 10px">...</el-button> -->

              <el-popover placement="bottom" title="" :width="200" trigger="click">
                <template #reference>
                  <el-button style="margin-left: 10px">...</el-button>
                </template>
                <div>
                  <el-button style="margin-left: 10px" @click="proofingProcAllFn(scope.row.id)">下载设计文件</el-button>
                </div>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="laypage">
          <pagination background layout="total, sizes, prev, pager, next, jumper" v-model:page="formData.current"
            :total="total" v-model:limit="formData.size" :pageSizes="[10, 20, 30, 50, 100]" />
        </div>
      </div>
    </el-card>
    <get-task ref="taskRef" @proofingProcFn="proofingProcFn"></get-task>
  </div>
</template>

<script setup>
import dateTimePicker from "@/components/datePicker/index.vue";
import {
  proofingProc,
  proofingProcAll,
  exportProofingList,
} from "@/api/orderManagement/proofing";
import { zipDownload } from "@/api/download";
import { roleKey, crmSupplier } from "@/api/orderManagement/subOrder";
import getTask from "./components/getTask.vue";
import useUserStore from "@/store/modules/user";
import { ElMessage, ElMessageBox } from "element-plus";
import { formatDate } from "@/utils/index";
import { useRouter } from "vue-router";
import { useIsCrmSaleman } from "@/hooks/selectCrmSaleman";
import useCrmOption from "@/store/modules/crmSelectOption";
import { parseTime } from '@/utils/ruoyi'

const option = useCrmOption()
const salesmanList = computed(() => option.salesmanList)
const proofSupplyList = computed(() => option.proofSupplyList)
const deptList = computed(()=> option.deptList)
const deptDisabled = ref(false)
const [isSupply, userId] = useIsCrmSaleman('crmProofingSupplyChainSpecialist')
const router = useRouter()
// 获取字典管理--配置的状态
const { proxy } = getCurrentInstance()
const { crm_proofing_schedule, crm_proofing_status,crm_acColumn } = proxy.useDict(
  'crm_proofing_schedule',
  'crm_proofing_status',
  'crm_acColumn'
)
const roles = computed(() => useUserStore().roles) //获取角色
/*
 *开始
 */
const taskRef = ref(null);
const dateRef = ref(null);
const dateRef1 = ref(null);
// 调用子组件的方法来改变子组件变量的状态
const getTasks = () => {
  const item = proofSupplyList.value.find((e) => e.userId == userId);
  taskRef.value.taskShow(item);
};
function changeDept(val) {
  option.setDeptId(val);
  formData.value.businessStaffId = null;
}
// let isRoles = ref(false) //是否是业务员
const data = reactive({
  formData: {
    size: 10, //单页显示多少条数据
    current: 1, //当前页数
    customerInfo: "", //客户姓名,客户编号
    businessStaffId: "", //业务员id
    supplyChainSpecialistId: isSupply ? userId : "", //供应链专员id
    receiveTimeStart: formatDate(new Date(new Date().toLocaleDateString()).getTime()-60*60*1000*24*90), //领取时间开始时间
    receiveTimeEnd: formatDate(new Date(new Date().toLocaleDateString()).getTime()+60*60*1000*24-1000), //领取时间结束时间
    endTimeStart: "", //打样完成时间开始时间
    endTimeEnd: "", //打样完成时间结束时间
    orderInfo: "", //订单信息
    proofingSchedule: "", //打样进度
    proofingSupplierId: "", //打样供应商id
    proofingStatus: "", //打样状态
  },
  supplyParms: {
    enabled: true,
    cooperativeProc: "1",
    current: 1,
  },
  total: 0,
  // salesmanList: [],
  // startTime: [formatDate(new Date().getTime() - 3600 * 1000 * 24 * 90), formatDate(new Date().getTime() + 3600 * 1000 * 24 * 1)], //开始时间
  // endTime: '', //结束时间
  tabList: [],
  isSeach: false,
  supplyList: [], //供应商
  activeIndex: "", //打样状态0=全部，1=打样中，2=已完成，3=已中止
  fileList: [],
});
const {
  supplyParms,
  sateList,
  // salesmanList,
  formData,
  // startTime,
  // endTime,
  tabList,
  total,
  isSeach,
  supplyList,
  activeIndex,
  fileList,
} = toRefs(data)
const acDataSepDeptId = ref('')
option.getDept().then(res=>{
  if (res?.data) {
    formData.value.acDataSepDeptId = acDataSepDeptId.value = res.data.id
    deptDisabled.value = true
  }
}).finally(()=>{
  proofingProcFn();
})
watch(crm_acColumn,(val)=>{
  formData.value.acColumn = val.find(item=>{return item.label=="acColumn"}).value
})
if (crm_acColumn.value.length>0) {
	formData.value.acColumn = crm_acColumn.value.find(item=>{return item.label=="acColumn"}).value
}
// tab栏状态
const handleSelect = (key) => {
  formData.value.proofingStatus = key;
  activeIndex.value = key;
  formData.value.current = 1; //当前页数
};

function exportExcel() {
	if(!tabList.value?.length){
		ElMessage.error('暂无数据导出')
		return
	}
  let status = '全部'
  if (activeIndex.value) {
    status = crm_proofing_status.value.find(item=>{return activeIndex.value == item.value}).label
  }
  exportProofingList(formData.value, `打样列表-${status+parseTime(new Date(),'{y}{m}{d}{h}{i}')}.xlsx`);
}
/**
 *crm订单流程视图--分页查询订单
 **/
const proofingProcFn = (type) => {
  if (type == 1) {
    // 不能直接使用对像赋值，会是使formData的栈值变化导致触发wacth监听，
    // formData.value.size = 10; //单页显示多少条数据
    formData.value.current = 1; //当前页数
    // formData.value.customerInfo = ""; //客户姓名;客户编号
    // formData.value.businessStaffId = ""; //业务员id
    // formData.value.supplyChainSpecialistId = isSupply ? userId : ""; //供应链专员id
    // formData.value.receiveTimeStart = ""; //领取时间开始时间
    // formData.value.receiveTimeEnd = ""; //领取时间结束时间
    // formData.value.endTimeStart = ""; //打样完成时间开始时间
    // formData.value.endTimeEnd = ""; //打样完成时间结束时间
    // formData.value.orderInfo = ""; //订单信息
    // formData.value.proofingSchedule = ""; //打样进度
    // formData.value.proofingSupplierId = ""; //打样供应商id
    // formData.value.proofingStatus = ""; //打样状态
    // activeIndex.value = "";
  }
  proofingProc(formData.value)
    .then((res) => {
      tabList.value = res.data.records;
      total.value = res.data.total;
      // console.log('GET分页查询订单', data.tabList)
    })
    .catch((err) => {
      console.log("报错-----", err);
    });
};
// 获得打样流程所有数据,包含流程、节点、品类
const proofingProcAllFn = (id) => {
  proofingProcAll(id).then((res) => {
    // console.log('下载文件res-----', res)
    let list = []

    let categoryList = res.data.categoryList;
    categoryList.forEach((item) => {
      let arr = item.designFileUrl.split(',')
      // list = list.concat(arr)
      list.push(...arr)
      // arr.map(fileUrl=>{
      //   fileList.value.push(fileUrl);
      // })
    });
    zipDownloadFn(list)
  });
};
// watch(fileList.value, () => {
//   zipDownloadFn();
// });
// 多个文件下载
const zipDownloadFn = (list) => {
  zipDownload({ fileList: list, name: "设计文件" }, "设计文件.zip");
};
function load() {
  supplyParms.value.current += 1;
  crmSupplierFn();
}
/** *获取打样供应商**/
const crmSupplierFn = () => {
  crmSupplier(supplyParms.value)
    .then((res) => {
      supplyList.value.push(...res.data.records);
      // console.log('res.data.records查询订单',res.data.records)
    })
    .catch((err) => {
      console.log("报错-----", err);
    });
};
crmSupplierFn();

/**
 * 处理选着的时间格式
 **/
// const timeFormat = (value, type) => {
//   if (type == '1') {
//     formData.value.receiveTimeStart = value ? formatDate(value[0].getTime()) : ''
//     formData.value.receiveTimeEnd = value ? formatDate(value[1].getTime()) : ''
//   } else {
//     formData.value.endTimeStart = value ? formatDate(value[0].getTime()) : ''
//     formData.value.endTimeEnd = value ? formatDate(value[1].getTime()) : ''
//   }
//   // console.log('formData------111', formData.value)
// }
/**
 * 筛选
 */
const search = () => {
  isSeach.value = true;
  proofingProcFn();
};
/**
 * 重置
 */
const reset = () => {
  dateRef.value.initTime(1);
  dateRef1.value.initTime();
  // data.startTime = [formatDate(new Date().getTime() - 3600 * 1000 * 24 * 90), formatDate(new Date().getTime() + 3600 * 1000 * 24 * 1)] //开始时间
  // data.endTime = '' //结束时间
  data.formData = {
    size: 10, //单页显示多少条数据
    current: 1, //当前页数
    customerInfo: "", //客户姓名,客户编号
    businessStaffId: "", //业务员id
    supplyChainSpecialistId: isSupply ? userId : "", //供应链专员id
    receiveTimeStart: formatDate(dateRef.value.start), //领取时间开始时间
    receiveTimeEnd: formatDate(dateRef.value.end), //领取时间结束时间
    endTimeStart: "", //打样完成时间开始时间
    endTimeEnd: "", //打样完成时间结束时间
    orderInfo: "", //订单信息
    proofingSchedule: "", //打样进度
    proofingSupplierId: "", //打样供应商id
    proofingStatus: activeIndex.value, //打样状态
    acColumn:crm_acColumn.value.find(item=>{return item.label=="acColumn"}).value,
    acDataSepDeptId:acDataSepDeptId.value
  }
}

/**
 * 查看详情
 **/
const gotoDetail = (item) => {
  // router.push(`/crm/supplyChain/proofingDetail`,)
  router.push({
    path: "/crm/supplyChain/proofingDetail",
    query: {
      procType: item.procType,
      id: item.id,
      orderType: item.orderType,
    },
  });
};
onMounted(() => {
  /**
   * 监听对象数据的变化
   */
  watch(
    [
      () => formData.value.size,
      () => formData.value.current,
      () => formData.value.proofingStatus,
    ],
    (val, oval) => {
      proofingProcFn();
    },
    {
      // immediate: true,
      deep: true, //开启深度监听,能够侦听到对象属性值的变化
    }
  );
});

const isMounted = ref(false);
onMounted(() => {
  isMounted.value = true;
});
</script>

<style lang="scss" scoped>
.icons {
  color: #b3b3b3;
  font-size: 17px;
  vertical-align: sub;
  // margin-left: 10px;
  cursor: pointer;
}

.artwork-workbench {
  .top-bar {
    .btnBox {
      text-align: right;
      padding-right: 38px;
    }
  }

  .titleBox {
    margin: 20px 0;
    user-select: none;
    position: relative;

    .navMenu {
      width: 100%;

      .flex-grow {
        flex-grow: 1;
      }
    }

    .navRinght {
      position: absolute;
      top: 13px;
      right: 0;
    }
  }

  // 分页
  .laypage {
    display: flex;
    justify-content: right;
    margin-top: 20px;
  }
}
</style>
<style lang="scss">
.subOrder .el-form-item__label {
  font-weight: 700;
}

.is-align-center {
  .el-overlay-dialog {
    display: flex;

    .el-dialog {
      margin: auto;
    }
  }

  .btns {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;

    .btn {
      width: 200px;
      margin: 0;
      margin-bottom: 20px;
      height: 40px;
    }
  }
}
</style>
