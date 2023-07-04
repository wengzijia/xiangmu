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
              <el-option v-for="item in bulkSupplyList" :key="item.userId" :label="item.nickName" :value="item.userId" />
            </el-select>
          </el-form-item>
          <!-- 订单完成时间 -->
          <el-form-item label="大货完成时间:">
            <!-- <el-date-picker style="width: 360px" v-model="endTime" type="datetimerange" unlink-panels range-separator="→"
              start-placeholder="开始日期" end-placeholder="结束日期" @change="timeFormat(endTime, '2')" /> -->
            <dateTimePicker ref="dateRef1" :dateType="'datetimerange'" v-model:startTime="formData.bulkFinishTimeStart"
              v-model:endTime="formData.bulkFinishTimeEnd" :isThreeMonths="false"></dateTimePicker>
          </el-form-item>
          <!-- 订单状态 -->
          <el-form-item label="大货供应商:">
            <el-select v-if="isMounted" v-model="formData.bulkSupplierId" class="m-2" style="width: 252px"
              placeholder="所有大货供应商" clearable>
              <div v-infinite-scroll="load" style="overflow: auto; height: 200px">
                <el-option v-for="items in supplyList" :key="items.id" :label="items.supplierName" :value="items.id"  style="max-width: 252px"/>
              </div>
            </el-select>
          </el-form-item>
          <el-form-item label="订单信息:">
            <el-input style="width: 252px" clearable v-model="formData.orderInfo" placeholder="请输入订单编号/大货工单号" />
          </el-form-item>
          <el-form-item label="大货进度:">
            <el-select v-model="formData.bulkSchedule" class="m-2" style="width: 252px" placeholder="所有" clearable>
              <el-option v-for="item in crm_bulk_progress" :key="item.id" :label="item.label" :value="item.value" />
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
          <el-menu-item :index="item.value" v-for="item in crm_massProduction_status" :key="item.id">{{ item.label
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
          <el-table-column label="订单编号" width="150" prop="orderBusinessKey"></el-table-column>
          <el-table-column label="大货工单号" width="140" prop="bulkBusinessKey"></el-table-column>
          <el-table-column label="客户名称" prop="customerName"></el-table-column>
          <el-table-column label="业务员" prop="businessStaffName"></el-table-column>
          <el-table-column label="供应链专员" width="100" prop="supplyChainSpecialistName"></el-table-column>
          <el-table-column v-if="formData.bulkStatus != '3'" label="大货供应商" width="180">
            <template #default="scope">
              {{
                scope.row.bulkSupplierName ? scope.row.bulkSupplierName : "-"
              }}
            </template>
          </el-table-column>
          <el-table-column v-if="
            formData.bulkStatus != '1' &&
            formData.bulkStatus != '2' &&
            formData.bulkStatus != '3'
          " label="大货状态">
            <template #default="scope">
              <DictText :value="scope.row.bulkStatus" dict="crm_massProduction_status" />
            </template>
          </el-table-column>
          <el-table-column v-if="formData.bulkStatus != '2' && formData.bulkStatus != '3'" label="大货进度">
            <template #default="scope">
              <DictText :value="scope.row.bulkSchedule" dict="crm_bulk_progress" />
            </template>
          </el-table-column>
          <el-table-column label="领取时间" width="160">
            <template #default="scope">
              <span>{{ formatDate(scope.row.receiveTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="formData.bulkStatus == '3'" label="中止人" width="130"
            prop="bulkClosedApplicanterName"></el-table-column>

          <el-table-column v-if="formData.bulkStatus == '3'" label="中止时间" width="160">
            <template #default="scope">
              <span>{{
                scope.row.bulkClosedTime
                ? formatDate(scope.row.bulkClosedTime)
                : "-"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="formData.bulkStatus != '1' && formData.bulkStatus != '3'" label="大货完成时间" width="200">
            <template #default="scope">
              <span>{{
                scope.row.bulkFinishTime
                ? formatDate(scope.row.bulkFinishTime)
                : "-"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template #default="scope">
              <el-link type="primary" :underline="false" @click="gotoDetail(scope.row)">详情</el-link>
              <el-popover placement="bottom" title="" :width="200" trigger="click">
                <template #reference>
                  <el-button style="margin-left: 10px">...</el-button>
                </template>
                <div>
                  <el-button style="margin-left: 10px" @click="bulkQuoteFn(scope.row.id)">下载设计文件</el-button>
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
    <get-task ref="taskRef" @bulkQuoteProcFn="bulkQuoteProcFn"></get-task>
  </div>
</template>

<script setup>
import dateTimePicker from "@/components/datePicker/index.vue";
import {
  bulkQuoteProc,
  bulkQuote,
  exportBlukList,
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
const [isSupply, userId] = useIsCrmSaleman('crmBulkSupplyChainSpecialist')
const bulkSupplyList = computed(() => option.bulkSupplyList)
const salesmanList = computed(() => option.salesmanList)
const deptList = computed(()=> option.deptList)
const deptDisabled = ref(false)
const router = useRouter()
// 获取字典管理--配置的状态
const { proxy } = getCurrentInstance()
const {
  crm_bulk_progress,
  crm_massProduction_status,
  crm_acColumn
} = proxy.useDict(
  'crm_bulk_progress',
  'crm_massProduction_status',
  'crm_acColumn'
)
const roles = computed(() => useUserStore().roles) //获取角色
/*
 *开始
 */
const taskRef = ref(null);
const dateRef1 = ref(null);

// let isRoles = ref(false) //是否是业务员
const data = reactive({
  formData: {
    size: 10, //单页显示多少条数据
    current: 1, //当前页数
    customerInfo: "", //客户姓名,客户编号
    businessStaffId: "", //业务员id
    supplyChainSpecialistId: isSupply ? userId : "", //供应链专员id
    orderInfo: "", //订单信息
    bulkFinishTimeStart: "", //大货完成时间开始时间
    bulkFinishTimeEnd: "", //大货完成时间结束时间
    bulkSupplierId: "", //大货供应商id
    bulkStatus: "", //大货状态
    bulkSchedule: "", //大货进度
  },
  bulkParms: {
    enabled: true,
    cooperativeProc: "2",
    current: 1,
  },
  total: 0,
  // salesmanList: [],
  // endTime: '', //结束时间
  tabList: [],
  isSeach: false,
  supplyList: [], //供应商
  // bulkSupplyList: [], //打样供应链专员
  activeIndex: "", //打样状态0=全部，1=打样中，2=已完成，3=已中止
  fileList: [],
});
const {
  bulkParms,
  sateList,
  // salesmanList,
  formData,
  // endTime,
  tabList,
  total,
  isSeach,
  supplyList,
  // bulkSupplyList,
  activeIndex,
  fileList,
} = toRefs(data);
// tab栏状态
const handleSelect = (key) => {
  formData.value.bulkStatus = key;
  activeIndex.value = key;
  formData.value.current = 1; //当前页数
};
// 调用子组件的方法来改变子组件变量的状态
const getTasks = () => {
  const item = bulkSupplyList.value.find((e) => e.userId == userId);
  taskRef.value.taskShow(item);
};
function changeDept(val) {
  option.setDeptId(val);
  formData.value.businessStaffId = null;
}
watch(crm_acColumn,(val)=>{
  formData.value.acColumn = val.find(item=>{return item.label=="acColumn"}).value
})
if (crm_acColumn.value.length>0) {
	formData.value.acColumn = crm_acColumn.value.find(item=>{return item.label=="acColumn"}).value
}
const acDataSepDeptId = ref('')
option.getDept().then(res=>{
  if (res?.data) {
    formData.value.acDataSepDeptId = acDataSepDeptId.value = res.data.id
    deptDisabled.value = true
  }
}).finally(()=>{
  bulkQuoteProcFn();
})
function exportExcel(){
	if(!tabList.value?.length){
		ElMessage.error('暂无数据导出')
		return
	}
  let status = '全部'
  if (activeIndex.value) {
    status = crm_massProduction_status.value.find(item=>{return activeIndex.value == item.value}).label
  }
  exportBlukList(formData.value,`大货列表-${status+parseTime(new Date(),'{y}{m}{d}{h}{i}')}.xlsx`)
}

/**
 *crm订单流程视图--分页查询订单
 **/
const bulkQuoteProcFn = (type) => {
  if (type == 1) {
    dateRef1.value.initTime();
    // 不能直接使用对像赋值，会是使formData的栈值变化导致触发wacth监听，
    formData.value.size = 10; //单页显示多少条数据
    formData.value.current = 1; //当前页数
    formData.value.customerInfo = ""; //客户姓名;客户编号
    formData.value.businessStaffId = ""; //业务员id
    formData.value.supplyChainSpecialistId = isSupply ? userId : ""; //供应链专员id
    formData.value.bulkFinishTimeStart = ""; //打样完成时间开始时间
    formData.value.bulkFinishTimeEnd = ""; //打样完成时间结束时间
    formData.value.orderInfo = ""; //订单信息
    formData.value.bulkSchedule = ""; //打样进度
    formData.value.bulkSupplierId = ""; //打样供应商id
    formData.value.bulkStatus = ""; //大货状态
    activeIndex.value = "";
    formData.value.acColumn = crm_acColumn.value.find((item) => {
      return item.label == "acColumn";
    }).value;
  }
  bulkQuoteProc(formData.value)
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
const bulkQuoteFn = (id) => {
  bulkQuote(id).then((res) => {
    // console.log('下载文件res-----', res)
    if (!res.data) {
      ElMessage.warning("暂无可下载的文件！");
    } else {
      let list = []
      let categoryList = res.data;
      categoryList.map((item) => {
        let arr = item.bulkDesignFileUrl.split(',')
      list.push(...arr)
        // arr.map(fileUrl=>{
        //   fileList.value.push(fileUrl);
        // })
      });
      zipDownloadFn(list)
    }
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
  bulkParms.value.current += 1;
  crmSupplierFn();
}
/** *获取大货生产供应商**/
const crmSupplierFn = () => {
  crmSupplier(bulkParms.value)
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
 * 选择业务员模块和获取供应链专员
 **/
// const allSalesmanModule = (keys) => {
//   roleKey(keys)
//     .then((res) => {
//       if (keys == "crmCustomerBusinessStaff") {
//         // console.log('crm业务员--545454545454--', res.data)
//         salesmanList.value = res.data;
//       }
//       if (keys == "crmBulkSupplyChainSpecialist") {
//         bulkSupplyList.value = res.data;
//         // console.log('大货供应链专员--545454545454--', res.data)
//       }
//     })
//     .catch((err) => {
//       // console.log('报错-----', err)
//       ElMessage.error(err.msg);
//     });
// };

// // 大客户业务员
// allSalesmanModule("crmCustomerBusinessStaff");

// // 大货供应链专员
// allSalesmanModule("crmBulkSupplyChainSpecialist");

/**
 * 处理选着的时间格式
 **/
// const timeFormat = (value, type) => {
//   formData.value.bulkFinishTimeStart = value ? formatDate(value[0].getTime()) : ''
//   formData.value.bulkFinishTimeEnd = value ? formatDate(value[1].getTime()) : ''
//   // console.log('formData------111', formData.value)
// }
/**
 * 筛选
 */
const search = () => {
  isSeach.value = true;
  bulkQuoteProcFn();
};
/**
 * 重置
 */
const reset = () => {
  // data.endTime = '' //结束时间
  dateRef1.value.initTime();

  data.formData = {
    size: 10, //单页显示多少条数据
    current: 1, //当前页数
    customerInfo: "", //客户姓名,客户编号
    businessStaffId: "", //业务员id
    supplyChainSpecialistId: isSupply ? userId : "", //供应链专员id
    orderInfo: "", //订单信息
    bulkFinishTimeStart: "", //大货完成时间开始时间
    bulkFinishTimeEnd: "", //大货完成时间结束时间
    bulkSupplierId: "", //大货供应商id
    bulkStatus: activeIndex.value, //大货状态
    bulkSchedule: "", //大货进度
    acColumn: crm_acColumn.value.find((item) => {
      return item.label == "acColumn";
    }).value,
    acDataSepDeptId:acDataSepDeptId.value
  };
};
/**
 * 查看详情
 **/
const gotoDetail = (item) => {
  // router.push(`/crm/supplyChain/proofingDetail`,)
  router.push({
    path: "/crm/supplyChain/productionOrderDetail",
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
      () => formData.value.bulkStatus,
    ],
    (val, oval) => {
      bulkQuoteProcFn();
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
/*
 *结束
 */
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
