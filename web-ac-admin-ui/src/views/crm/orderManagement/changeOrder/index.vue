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
          <el-form-item label="申请人:">
            <el-select v-model="formData.proposerId" class="m-2" style="width: 252px" placeholder="所有" clearable>
              <el-option v-for="item in applicantList" :key="item.assigneeId" :label="item.assigneeName"
                :value="item.assigneeId" />
            </el-select>
          </el-form-item>
          <el-form-item label="申请时间:">
            <!-- <el-date-picker style="width: 360px" v-model="startTime" type="datetimerange" unlink-panels
              range-separator="→" start-placeholder="开始日期" end-placeholder="结束日期" @change="timeFormat(startTime, '1')" /> -->
            <dateTimePicker ref="dateRef" :dateType="'datetimerange'" v-model:startTime="formData.applyTimeStart"
              v-model:endTime="formData.applyTimeEnd"></dateTimePicker>
          </el-form-item>

          <el-form-item label="申请完成时间:">
            <!-- <el-date-picker style="width: 360px" v-model="endTime" type="datetimerange" unlink-panels range-separator="→"
              start-placeholder="开始日期" end-placeholder="结束日期" @change="timeFormat(endTime, '2')" /> -->
              <dateTimePicker  ref="dateRef1"  :dateType="'datetimerange'" v-model:startTime="formData.finishTimeStart"
            v-model:endTime="formData.finishTimeEnd" :isThreeMonths="false"></dateTimePicker>
          </el-form-item>
          <!-- 订单状态 -->
          <el-form-item label="申请处理人:">
            <el-select v-model="formData.handlerId" class="m-2" style="width: 252px" placeholder="所有" clearable>
              <el-option v-for="items in handlerList" :key="items.assigneeId" :label="items.assigneeName"
                :value="items.assigneeId" />
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
      <!-- 列表文字和导出 -->
      <div class="titleBox">
        <span>变更记录</span>
        <div>
          <el-button @click="exportExcel">导出</el-button>
          <el-button type="primary" @click="newChangeApply('1')">新建变更申请</el-button>
        </div>
      </div>

      <!-- 列表  -->
      <div class="outworkListBox">
        <el-table :data="tabList" style="width: 100%" scrollbar-always-on>
          <el-table-column label="订单编号" width="210" prop="orderBusinessKey"></el-table-column>
          <el-table-column label="客户名称" width="250" prop="customerName"></el-table-column>
          <el-table-column label="订单类型" width="200">
            <template #default="scope">
              <DictTag :value="scope.row.orderType" :options="crm_order_type" />
            </template>
          </el-table-column>
          <el-table-column label="订单状态" width="250">
            <template #default="scope">
              <DictTag :value="scope.row.orderStatus" :options="crm_order_status" />
            </template>
          </el-table-column>
          <el-table-column label="业务员" width="200" prop="businessStaffName"></el-table-column>
          <el-table-column label="申请人" width="200" prop="proposerName"></el-table-column>
          <el-table-column label="申请类型" width="100">
            <template #default="scope">
              <DictTag :value="scope.row.applyType" :options="crm_apply_type" />
            </template>
          </el-table-column>
          <el-table-column label="申请时间" width="200">
            <template #default="scope">
              <span>{{ formatDate(scope.row.applyTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="申请处理人" width="130">
            <template #default="scope">
              {{
                scope.row.handlerName
                ? scope.row.handlerName
                : '-'
              }}
            </template>
          </el-table-column>

          <el-table-column label="申请状态" width="200">
            <template #default="scope">
              <DictTag :value="scope.row.applyStatus" :options="crm_orderChange_status" />
            </template>
          </el-table-column>
          <el-table-column label="申请完成时间" width="200">
            <template #default="scope">
              <span>{{
                scope.row.finishTime
                ? formatDate(scope.row.finishTime)
                : '-'
              }}</span>
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-link type="primary" :underline="false" @click="newChangeApply('2', scope.row)">详情</el-link>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="laypage">
          <el-pagination v-model:currentPage="formData.current" v-model:page-size="formData.size"
            :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="total" />
        </div>
      </div>
    </el-card>
    <newChangeOder ref="taskRef" @orderChangeRecordFn="orderChangeRecordFn"></newChangeOder>
  </div>
</template>

<script setup>
import dateTimePicker from '@/components/datePicker/index.vue'
import {
  orderChangeRecord,
  queryHandler,
  exportChangeOrderList
} from '@/api/orderManagement/changeOrder'
import { parseTime } from '@/utils/ruoyi'
import newChangeOder from './components/newChangeOder.vue'
import useUserStore from '@/store/modules/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate } from '@/utils/index'
import { useRouter } from 'vue-router'
import useCrmOption from "@/store/modules/crmSelectOption"
import { useIsCrmSaleman } from "@/hooks/selectCrmSaleman";
const [isSaleman, userId] = useIsCrmSaleman('crmCustomerBusinessStaff')
const option = useCrmOption()
const salesmanList = computed(() => option.salesmanList)
const deptList = computed(()=> option.deptList)
const deptDisabled = ref(false)
// option.getOptionList('crmCustomerBusinessStaff')
const router = useRouter()
// 获取字典管理--配置的状态
const { proxy } = getCurrentInstance()
const {
  crm_order_type,
  crm_order_status,
  // crm_saleman,
  crm_apply_type,
  crm_orderChange_status,
  crm_acColumn
} = proxy.useDict(
  'crm_order_type',
  'crm_order_status',
  // 'crm_saleman',
  'crm_apply_type',
  'crm_orderChange_status',
  'crm_acColumn'
)
const roles = computed(() => useUserStore().roles) //获取角色
/*
 *开始
 */
const taskRef = ref(null)
const dateRef = ref(null)
const dateRef1 = ref(null)

// 调用子组件的方法来改变子组件变量的状态
const newChangeApply = (type, item) => {
  taskRef.value.taskShow(type, item)
}

const data = reactive({
  formData: {
    size: 10, //单页显示多少条数据
    current: 1, //当前页数
    customerInfo: '', //客户姓名,客户编号
    businessStaffId: isSaleman ? userId : '', //业务员id
    proposerId: '', //申请人id
    applyTimeStart: formatDate(new Date(new Date().toLocaleDateString()).getTime()-60*60*1000*24*90), //申请时间开始时间
    applyTimeEnd: formatDate(new Date(new Date().toLocaleDateString()).getTime()+60*60*1000*24-1000), //申请时间结束时间
    finishTimeStart: '', //申请完成时间开始时间
    finishTimeEnd: '', //申请完成时间结束时间
    handlerId: '', //申请处理人id
    acDataSepDeptId:null,//部门
  },
  total: 0,
  // startTime: [formatDate(new Date().getTime() - 3600 * 1000 * 24 * 90), formatDate(new Date().getTime() + 3600 * 1000 * 24 * 1)], //开始时间
  // endTime: '', //结束时间
  tabList: [],
  isSeach: false,
  applicantList: [],
  handlerList: [],
})
const {
  formData,
  // startTime,
  // endTime,
  tabList,
  total,
  isSeach,
  applicantList,
  handlerList,
} = toRefs(data)
const acDataSepDeptId = ref('')
option.setDeptId(formData.value.acDataSepDeptId);
option.getDept().then(res=>{
  if (res?.data) {
    formData.value.acDataSepDeptId = acDataSepDeptId.value = res.data.id
    deptDisabled.value = true
  }
}).finally(()=>{
  search()
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
// 查询处理人集合
const queryHandlerFn = (type) => {
  queryHandler(type).then((res) => {
    if (type == '1') {
      applicantList.value = res.data
    } else {
      handlerList.value = res.data
    }
  })
}
queryHandlerFn('1') //申请人
queryHandlerFn('2') //申请处理人
/**
 *crm订单流程视图--分页查询订单
 **/
const orderChangeRecordFn = (type) => {
  if (type == 1) {
    dateRef.value.initTime(1)
    dateRef1.value.initTime()
    // startTime.value = [formatDate(new Date().getTime() - 3600 * 1000 * 24 * 90), formatDate(new Date().getTime() + 3600 * 1000 * 24 * 1)] //开始时间
    // endTime.value = '' //结束时间
    // 不能直接使用对像赋值，会是使formData的栈值变化导致触发wacth监听，
    formData.value.size = 10 //单页显示多少条数据
    formData.value.current = 1 //当前页数
    formData.value.customerInfo = '' //客户姓名;客户编号
    formData.value.businessStaffId = isSaleman ? userId : '' //业务员id
    formData.value.proposerId = '' //申请人id
    formData.value.applyTimeStart = formatDate(dateRef.value.start) //申请时间开始时间
    formData.value.applyTimeEnd = formatDate(dateRef.value.end) //申请时间结束时间
    formData.value.finishTimeStart = '' //申请完成时间开始时间
    formData.value.finishTimeEnd = '' //申请完成时间结束时间
    formData.value.handlerId = '' //申请处理人id
    formData.value.acColumn = formData.value.acColumn
  }
  orderChangeRecord(formData.value)
    .then((res) => {
      tabList.value = res.data.records
      total.value = res.data.total
      // console.log('GET分页查询订单', data.tabList)
    })
    .catch((err) => {
      console.log('报错-----', err)
    })
}
function exportExcel(){
	if(!tabList.value?.length){
		ElMessage.error('暂无数据导出')
		return
	}
    formData.value.applyTimeStart = formatDate(dateRef.value.start) //申请时间开始时间
    formData.value.applyTimeEnd = formatDate(dateRef.value.end) //申请时间结束时间
  exportChangeOrderList(formData.value,`订单变更列表${parseTime(new Date(),'{y}{m}{d}{h}{i}')}.xlsx`)
}

/**
 * 处理选着的时间格式
 **/
// const timeFormat = (value, type) => {
//   if (type == '1') {
//     formData.value.applyTimeStart = value ? formatDate(value[0].getTime()) : ''
//     formData.value.applyTimeEnd = value ? formatDate(value[1].getTime()) : ''
//   } else {
//     formData.value.finishTimeStart = value ? formatDate(value[0].getTime()) : ''
//     formData.value.finishTimeEnd = value ? formatDate(value[1].getTime()) : ''
//   }
//   // console.log('formData------111', formData.value)
// }
/**
 * 筛选
 */
const search = () => {
  isSeach.value = true
  orderChangeRecordFn()
}
/**
 * 重置
 */
const reset = () => {
  dateRef.value.initTime(1)
  dateRef1.value.initTime()

  // data.startTime = [formatDate(new Date().getTime() - 3600 * 1000 * 24 * 90), formatDate(new Date().getTime() + 3600 * 1000 * 24 * 1)] //开始时间
  // data.endTime = '' //结束时间
  data.formData = {
    size: 10, //单页显示多少条数据
    current: 1, //当前页数
    customerInfo: '', //客户姓名,客户编号
    businessStaffId: isSaleman ? userId : '', //业务员id
    proposerId: '', //申请人id
    applyTimeStart: formatDate(dateRef.value.start), //申请时间开始时间
    applyTimeEnd: formatDate(dateRef.value.end), //申请时间结束时间
    finishTimeStart: '', //申请完成时间开始时间
    finishTimeEnd: '', //申请完成时间结束时间
    handlerId: '', //申请处理人id
    acDataSepDeptId:acDataSepDeptId.value,
    acColumn : formData.value.acColumn
  }
}
onMounted(() => {
  /**
   * 监听对象数据的变化
   */
  watch(
    [
      () => formData.value.size,
      () => formData.value.current,
    ],
    (val, oval) => {
      // 判断没有点击筛选按钮时，之前填写的参数初始化
      if (!isSeach.value) {
        dateRef.value.initTime(1)
        dateRef1.value.initTime()
        formData.value.customerInfo = '' //客户姓名;客户编号
        formData.value.businessStaffId = isSaleman ? userId : '' //业务员id
        formData.value.proposerId = '' //申请人id
        formData.value.applyTimeStart = formatDate(dateRef.value.start) //申请时间开始时间
        formData.value.applyTimeEnd = formatDate(dateRef.value.end) //申请时间结束时间
        formData.value.finishTimeStart = '' //申请完成时间开始时间
        formData.value.finishTimeEnd = '' //申请完成时间结束时间
        formData.value.handlerId = '' //申请处理人id
      }
      orderChangeRecordFn()
    },
    {
      // immediate: true,
      deep: true, //开启深度监听,能够侦听到对象属性值的变化
    }
  )
})
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
    display: flex;
    justify-content: space-between;
    margin: 20px 0;

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
