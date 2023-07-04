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
            <el-select v-model="formData.businessStaffId" class="m-2" style="width: 252px" placeholder="所有业务员" clearable
              :disabled="isSaleman">
              <el-option v-for="item in salesmanList" :key="item.userId" :label="item.nickName" :value="item.userId" />
            </el-select>
          </el-form-item>

          <!-- 订单生成时间 -->
          <el-form-item label="申请时间:">
            <!-- <el-date-picker style="width: 360px" v-model="applyTime" type="datetimerange" unlink-panels
              range-separator="→" start-placeholder="开始日期" end-placeholder="结束日期" @change="timeFormat(applyTime, '1')" /> -->

            <dateTimePicker ref="dateRef" :dateType="'datetimerange'"
              v-model:startTime="formData.costStructureApplyTimeStart"
              v-model:endTime="formData.costStructureApplyTimeEnd">
            </dateTimePicker>
          </el-form-item>
          <el-form-item v-show="formData.costStructureStatus == '2'" label="上传时间:">
            <!-- <el-date-picker style="width: 360px" v-model="uploadTime" type="datetimerange" unlink-panels
              range-separator="→" start-placeholder="开始日期" end-placeholder="结束日期" @change="timeFormat(uploadTime, '2')" /> -->
            <dateTimePicker ref="dateRef1" :dateType="'datetimerange'"
              v-model:startTime="formData.costStructureUploadTimeStart"
              v-model:endTime="formData.costStructureUploadTimeEnd" :isThreeMonths="false"></dateTimePicker>
          </el-form-item>
          <el-form-item v-show="formData.costStructureStatus == '2'" label="上传人:">
            <el-select v-model="formData.costStructureUploaderId" class="m-2" style="width: 252px" placeholder="所有"
              clearable>
              <el-option v-for="item in uploaderList" :key="item.assigneeId" :label="item.assigneeName"
                :value="item.assigneeId" />
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
          <el-menu-item :index="item.value" v-for="item in crm_cost_status" :key="item.id">{{ item.label }}</el-menu-item>
        </el-menu>
      </div>
      <!-- 列表  -->
      <div class="outworkListBox">
        <el-table :data="tabList" style="width: 100%" scrollbar-always-on>
          <el-table-column label="订单编号" width="250" prop="orderBusinessKey"></el-table-column>
          <el-table-column label="客户名称" width="258" prop="customerName"></el-table-column>
          <el-table-column label="订单类型" width="250">
            <template #default="scope">
              <DictTag :value="scope.row.parentProcType" :options="crm_order_type" />
            </template>
          </el-table-column>
          <el-table-column label="品类" width="300">
            <template #default="scope">
              <el-tooltip class="box-item" effect="dark" placement="top-end">
                <template #content>{{ scope.row.categoryStr }} </template>
                <div class="hiddenTxt">
                  {{ scope.row.categoryStr }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="业务员" width="200" prop="businessStaffName"></el-table-column>
          <el-table-column label="申请时间" width="200">
            <template #default="scope">
              <span>{{
                scope.row.costStructureApplyTime
                ? formatDate(scope.row.costStructureApplyTime)
                : "-"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="formData.costStructureStatus == '2'" label="上传人" width="200"
            prop="costStructureUploaderName"></el-table-column>

          <el-table-column v-if="formData.costStructureStatus == '2'" label="上传时间" width="200">
            <template #default="scope">
              <span>{{ formatDate(scope.row.costStructureUploadTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200" align="center">
            <template #default="scope">
              <el-link type="primary" :underline="false" @click="uploadAndView(scope.row)">{{
                formData.costStructureStatus == "1" ? "上传" : "查看"
              }}</el-link>
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
    <costDrawer ref="costDrawerRef" @costStructureFn="costStructureFn"></costDrawer>
  </div>
</template>

<script setup>
import dateTimePicker from "@/components/datePicker/index.vue";
import costDrawer from "./components/costDrawer.vue";
import { roleKey } from "@/api/orderManagement/subOrder";
import { costStructure, uploader } from "@/api/orderManagement/costComposition";
import useUserStore from "@/store/modules/user";
import { ElMessage, ElMessageBox } from "element-plus";
import { formatDate } from "@/utils/index";
import useCrmOption from "@/store/modules/crmSelectOption";
import { useIsCrmSaleman } from "@/hooks/selectCrmSaleman";
const [isSaleman, userId] = useIsCrmSaleman("crmCustomerBusinessStaff");
const costDrawerRef = ref();
const router = useRouter();
const option = useCrmOption();
const salesmanList = computed(() => option.salesmanList);
// option.getOptionList('crmCustomerBusinessStaff')
const deptList = computed(()=> option.deptList)
const deptDisabled = ref(false)
// 获取字典管理--配置的状态
const { proxy } = getCurrentInstance()
const { crm_cost_status, crm_order_type,crm_acColumn } = proxy.useDict(
  'crm_cost_status',
  'crm_order_type',
  'crm_acColumn'
)
const roles = computed(() => useUserStore().roles) //获取角色
const dateRef = ref(null)
const dateRef1 = ref(null)
const data = reactive({
  formData: {
    size: 10, //单页显示多少条数据
    current: 1, //当前页数
    customerInfo: "", //客户姓名,客户编号
    businessStaffId: isSaleman ? userId : "", //业务员id
    costStructureApplyTimeStart: formatDate(new Date(new Date().toLocaleDateString()).getTime()-60*60*1000*24*90), //成本构成申请时间开始时间
    costStructureApplyTimeEnd: formatDate(new Date(new Date().toLocaleDateString()).getTime()+60*60*1000*24-1000), //成本构成申请时间结束时间
    costStructureUploadTimeStart: "", //成本构成上传时间开始时间
    costStructureUploadTimeEnd: "", //成本构成上传时间结束时间
    costStructureUploaderId: "", //成本构成上传人id
    costStructureStatus: "1", //	成本构成状态
  },
  total: 0,
  // applyTime: [formatDate(new Date().getTime() - 3600 * 1000 * 24 * 90), formatDate(new Date().getTime() + 3600 * 1000 * 24 * 1)], //s首付款时间
  // uploadTime: '', //上传时间
  tabList: [],
  isSearch: false,
  activeIndex: "1", //打样状态0=全部，1=打样中，2=已完成，3=已中止
  salesValue: "", //业务员的字典值
  uploaderList: [], //上传人
});
const {
  formData,
  // applyTime,
  // uploadTime,
  tabList,
  total,
  isSearch,
  activeIndex,
  salesValue,
  uploaderList,
} = toRefs(data)
const acDataSepDeptId = ref('')
option.setDeptId(formData.value.acDataSepDeptId);
option.getDept().then(res=>{
  if (res?.data) {
    formData.value.acDataSepDeptId = acDataSepDeptId.value = res.data.id
    deptDisabled.value = true
  }
}).finally(()=>{
  costStructureFn()
})
watch(crm_acColumn,(val)=>{
  formData.value.acColumn = val.find(item=>{return item.label=="acColumn"}).value
})
if (crm_acColumn.value.length>0) {
	formData.value.acColumn = crm_acColumn.value.find(item=>{return item.label=="acColumn"}).value
}
function changeDept(val){
  option.setDeptId(val)
  formData.value.businessStaffId = null
}
// tab栏状态
const handleSelect = (key) => {
  formData.value.costStructureStatus = key;
  activeIndex.value = key;
  formData.value.current = 1; //当前页数
  // uploadTime.value = ''
  dateRef1.value.initTime();
  formData.value.costStructureUploadTimeStart = ""; //成本构成上传时间开始时间
  formData.value.costStructureUploadTimeEnd = ""; //成本构成上传时间结束时间
};
const uploaderFn = () => {
  uploader().then((res) => {
    // console.log('res=====', res.data)
    uploaderList.value = res.data;
  });
};
uploaderFn();
/**
 *crm订单流程视图--分页查询订单
 **/
const costStructureFn = (type) => {
  if (type == 1) {
    // 不能直接使用对像赋值，会是使formData的栈值变化导致触发wacth监听，
    formData.value.size = 10;
    formData.value.current = 1;
    formData.value.customerInfo = ""; //客户姓名客户编号
    formData.value.businessStaffId = isSaleman ? userId : ""; //业务员id
    // formData.value.costStructureApplyTimeStart = applyTime.value[0] //成本构成申请时间开始时间
    // formData.value.costStructureApplyTimeEnd = applyTime.value[1] //成本构成申请时间结束时间
    formData.value.costStructureApplyTimeStart = formatDate(
      dateRef.value.start
    ); //成本构成申请时间开始时间
    formData.value.costStructureApplyTimeEnd = formatDate(dateRef.value.end); //成本构成申请时间结束时间
    formData.value.costStructureUploadTimeStart = ""; //成本构成上传时间开始时间
    formData.value.costStructureUploadTimeEnd = ""; //成本构成上传时间结束时间
    formData.value.costStructureUploaderId = ""; //成本构成上传人id
    formData.value.costStructureStatus = "1"; //	成本构成状态
    activeIndex.value = "1";
    dateRef.value.initTime(1);
    dateRef1.value.initTime();
  }
  costStructure(formData.value)
    .then((res) => {
      tabList.value = res.data.records;
      total.value = res.data.total;
      // console.log('GET分页查询订单', data.tabList)
    })
    .catch((err) => {
      console.log("报错-----", err);
    });
};

/**
 * 处理选着的时间格式
 **/
// const timeFormat = (value, type) => {
//   if (type == '1') {
//     formData.value.costStructureApplyTimeStart = value ? formatDate(value[0].getTime()) : ''
//     formData.value.costStructureApplyTimeEnd = value ? formatDate(value[1].getTime()) : ''
//   } else if (type == '2') {
//     formData.value.costStructureUploadTimeStart = value ? formatDate(value[0].getTime()) : ''
//     formData.value.costStructureUploadTimeEnd = value ? formatDate(value[1].getTime()) : ''
//   }
//   // console.log('formData------111', formData.value)
// }
/**
 * 筛选
 */
const search = () => {
  isSearch.value = true;
  costStructureFn();
};
/**
 * 重置
 */
const reset = () => {
  dateRef.value.initTime(1);
  dateRef1.value.initTime();

  // applyTime.value = [formatDate(new Date().getTime() - 3600 * 1000 * 24 * 90), formatDate(new Date().getTime() + 3600 * 1000 * 24 * 1)] //开始时间
  // uploadTime.value = '' //尾款时间
  formData.value = {
    size: 10, //单页显示多少条数据
    current: 1, //当前页数
    customerInfo: "", //客户姓名,客户编号
    businessStaffId: isSaleman ? userId : "", //业务员id
    costStructureApplyTimeStart: formatDate(dateRef.value.start), //成本构成申请时间开始时间
    costStructureApplyTimeEnd: formatDate(dateRef.value.end), //成本构成申请时间结束时间
    // costStructureApplyTimeStart: applyTime.value[0], //成本构成申请时间开始时间
    // costStructureApplyTimeEnd: applyTime.value[1], //成本构成申请时间结束时间
    costStructureUploadTimeStart: "", //成本构成上传时间开始时间
    costStructureUploadTimeEnd: "", //成本构成上传时间结束时间
    costStructureUploaderId: "", //成本构成上传人id
    costStructureStatus: activeIndex.value, //	成本构成状态
    acColumn:crm_acColumn.value.find(item=>{return item.label=="acColumn"}).value,
    acDataSepDeptId:acDataSepDeptId.value
  }
}
/**
 * 上传和查看
 **/
const uploadAndView = (item) => {
  costDrawerRef.value.openCost(item, formData.value.costStructureStatus);
};
onMounted(() => {
  /**
   * 监听对象数据的变化
   */
  watch(
    [
      () => formData.value.size,
      () => formData.value.current,
      () => formData.value.costStructureStatus,
      // () => formData.value.acColumn,
    ],
    (val, oval) => {
      // console.log('id555555555监听对象数据的变化', val, 'ovaloval----', oval)
      // 判断没有点击筛选按钮时，之前填写的参数初始化
      costStructureFn();
    },
    {
      // immediate: true,
      deep: true, //开启深度监听,能够侦听到对象属性值的变化
    }
  );
});
// costStructureFn();

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

.hiddenTxt {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
