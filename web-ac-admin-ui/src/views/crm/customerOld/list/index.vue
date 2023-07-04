<template>
  <div>
    <el-card style="margin: 10px">
      <el-form
        inline
        :model="formData"
        class="demo-form-inline"
        label-width="120px"
        ref="queryRef"
      >
        <el-form-item label="客户信息:" prop="customerInfo">
          <el-input
            v-model="formData.customerInfo"
            placeholder="请输入客户编号/客户名称"
            clearable
            style="width: 252px"
          />
        </el-form-item>
        <el-form-item label="客户类别:" prop="customerType">
          <el-select
            v-model="formData.customerType"
            placeholder="所有类别"
            clearable
            filterable
            style="width: 252px"
          >
            <el-option
              v-for="item in crm_customercategory"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="已合作服务:" prop="cooperativeServices">
          <el-select
            v-model="formData.cooperativeServices"
            placeholder="所有服务"
            clearable
            filterable
            style="width: 252px"
          >
            <el-option
              v-for="item in crm_order_type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="归属部门:" prop="acDataSepDeptId">
          <el-select v-model="formData.acDataSepDeptId" placeholder="所有部门" clearable :disabled="deptDisabled" @change="changeDept" style="width:252px;">
            <el-option v-for="item in deptList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="业务员:" prop="businessStaffId">
          <el-select
            :disabled="isSaleman"
            v-model="formData.businessStaffId"
            placeholder="所有业务员"
            clearable
            filterable
            style="width: 252px"
          >
            <el-option
              v-for="item in salesmanList"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="客户录入日期:">
          <el-date-picker
            v-model="datePicker"
            type="daterange"
            range-separator="→"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 252px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="客户评级:" prop="customerGrading">
          <el-select
            v-model="formData.customerGrading"
            placeholder="所有级别"
            clearable
            filterable
            style="width: 252px"
          >
            <el-option label="A" value="A" />
            <el-option label="B" value="B" />
            <el-option label="C" value="C" />
            <el-option label="D" value="D" />
          </el-select>
        </el-form-item>
        <el-form-item label="启用状态:" prop="enabled">
          <el-select
            v-model="formData.enabled"
            placeholder="所有状态"
            clearable
            filterable
            style="width: 252px"
          >
            <el-option label="启用" :value="true" />
            <el-option label="未启用" :value="false" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="btnBox">
        <el-button @click="resetQuery">重置</el-button>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
    </el-card>
    <el-card style="margin: 10px">
      <div class="tool-bar">
        <div>客户列表</div>
        <div>
          <el-button @click="exportExcel">导出</el-button>
          <el-button @click="draclick(1)">新增客户</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
        row-key="id"
      >
        <el-table-column label="客户编号" width="180">
          <template #default="scope">
            <span @click="clickCopy(scope.row.customerNumber)">{{ scope.row.customerNumber }}</span>
            <!-- <el-button
              @click="clickCopy(scope.row.customerNumber)"
              type="text"
              size="small">复制</el-button> -->
          </template>
        </el-table-column>

		<el-table-column label="客户名称" width="180">
          <template #default="scope">
            {{ scope.row.customerName }}
          </template>
        </el-table-column>

        <el-table-column label="客户类别" width="140">
          <template #default="scope">
            <DictTag
              v-if="scope.row.customerType"
              style="display: inline-block"
              :value="scope.row.customerType"
              :options="crm_customercategory"
            />
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="客户评级" width="140">
          <template #default="scope">
            <div>{{ scope.row.customerGrading || "-" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="已合作服务" width="160">
          <template #default="scope">
            <!-- {{scope.row.cooperativeServices}} -->
            <template v-if="scope.row.cooperativeServices">
              <DictTag
                v-for="item in scope.row.cooperativeServices"
                :key="item"
                style="display: inline-block"
                :value="item"
                :options="crm_order_type"
              />
            </template>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="累积合作订单数" width="140">
          <template #default="scope">
            <div>{{ scope.row.cumulativeOrderNumber || "-" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="今年合作订单数" width="140">
          <template #default="scope">
            <div>
              {{ scope.row.thisYearCumulativeOrderNumber || "-" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="客户录入日期" width="160">
          <template #default="scope">
            <div>{{ scope.row.customerEntryDate || "-" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="业务员" width="140">
          <template #default="scope">
            <div>{{ scope.row.businessStaffName || "-" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="启用状态" width="140">
          <template #default="scope">
            <el-switch
              v-model="scope.row.enabled"
              @change="handleStatusChange($event, scope.row)"
              :before-change="handleStatusChange2.bind(this, scope.row)"
            ></el-switch>
            <!-- <el-switch v-model="scope.row.enabled" @change="handleStatusChange(scope.row)"></el-switch> -->
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template #default="scope">
            <el-link :underline="false" type="primary">
              <router-link
                :to="'/crm/customerOld/oldCrmCustomerDetail?id=' + scope.row.id"
              >
                详情
              </router-link>
            </el-link>
            <el-link
              :underline="false"
              type="primary"
              @click="editfn(scope.row.id)"
              style="margin-left: 8px"
              >编辑</el-link
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pages" style="position: relative">
        <pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          v-model:page="formData.current"
          @pagination="getList"
          :total="total"
          v-model:limit="formData.size"
          :pageSizes="[20, 30, 50, 100]"
        />
      </div>
    </el-card>
    <el-drawer
      v-model="drawer"
      :title="dranum==1?'新增客户':'编辑客户资料'"
      direction="rtl"
      :before-close="handleClose"
      size="40%"
    >
      <template #default>
        <div>
          <new-order
            ref="newo"
            :dranum="dranum"
            :editdata="editdata"
            @closedre="closedre"
            @crmOrderProcView="getList"
          >
          </new-order>
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="confirmClick(1)">取消</el-button>
          <el-button type="primary" @click="confirmClick(2)">提交</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { reactive, toRefs } from "vue";
import newOrder from "./components/newOrder.vue";
import useUserStore from "@/store/modules/user";
import { roleKey } from "@/api/orderManagement/subOrder";
import {
  changeStatus,
  GetCustomer,
  GetCustomerid,
  setenabled,
  exportCustomer
} from "@/api/orderManagement/customer/index";
import { ElMessage, ElMessageBox } from "element-plus";
import { formatDate, formatDates, LastThreeMonths2 } from "@/utils";
import { useIsCrmSaleman } from "@/hooks/selectCrmSaleman";
import { parseTime } from "@/utils/ruoyi"
import useCrmOption from "@/store/modules/crmSelectOption"
const option = useCrmOption()
const salesmanList = computed(() => option.salesmanList)
const [isSaleman, userId] = useIsCrmSaleman("crmCustomerBusinessStaff");
const deptList = computed(()=> option.deptList)
const deptDisabled = ref(false)
const { proxy } = getCurrentInstance();
const { crm_saleman, crm_order_type, crm_customercategory,crm_acColumn } = proxy.useDict(
  "crm_saleman",
  "crm_order_type",
  "crm_customercategory",
  "crm_acColumn"
);
const roles = computed(() => useUserStore().roles); //获取角色
const data = reactive({
  formData: {
    current: 1,
    size: 20,
    customerInfo: null, //客户信息
    cooperativeServices: null, //已合作服务
    customerType: null, //客户类别
    businessStaffId: isSaleman?userId:'', //业务员id
    enabled: null, //是否启用
    customerGrading: null, //客户评级
    customerEntryStartDate: LastThreeMonths2()[0], //客户录入日期开始日期
    customerEntryDateEndDate: LastThreeMonths2()[1], //客户录入日期结束日期
    acDataSepDeptId:null,//部门
  },
});
const datePicker = ref(LastThreeMonths2());
const { formData } = toRefs(data);
const tableData = ref([]);
const editdata = ref(null);
const loading = ref(false);
const total = ref(0);
const isBusinessStaff = ref(false);
const drawerTitle = ref("新增客户");
const drawer = ref(false);
const newo = ref(null);
const form = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});
// const salesmanList = ref([]);
let dranum = ref(1);
const onSubmit = () => {
  console.log("submit!");
};
const acDataSepDeptId = ref('')
option.setDeptId(formData.value.acDataSepDeptId);
option.getDept().then(res=>{
  if (res?.data) {
    formData.value.acDataSepDeptId = acDataSepDeptId.value = res.data.id
    deptDisabled.value = true
  }
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
/** 重置按钮操作 */
function resetQuery() {
  // proxy.resetForm("formRef");
  data.formData = {
    current: 1,
    size: 20,
    customerInfo: null, //客户信息
    cooperativeServices: null, //已合作服务
    customerType: null, //客户类别
    businessStaffId: isSaleman?userId:'', //业务员id
    enabled: null, //是否启用
    customerGrading: null, //客户评级
    customerEntryStartDate: LastThreeMonths2()[0], //客户录入日期开始日期
    customerEntryDateEndDate: LastThreeMonths2()[1], //客户录入日期结束日期
    acDataSepDeptId:acDataSepDeptId.value
  };
  datePicker.value = LastThreeMonths2();
  getList();
  // search();
}
//搜索
function search() {
  formData.value.current = 1; //页码
  formData.value.size = 20; //分页大小
  if (datePicker.value?.length > 0) {
    formData.value.customerEntryStartDate =
      formatDates(datePicker.value[0]) + " 00:00:00";
    formData.value.customerEntryDateEndDate =
      formatDates(datePicker.value[1]) + " 23:59:59";
  } else {
    formData.value.customerEntryStartDate =
      formData.value.customerEntryDateEndDate = null;
  }
  getList();
  // console.log("fff", formData.value);
}
getList();
function getList() {
  GetCustomer(formData.value)
    .then((res) => {
      tableData.value = res.data.records.map(e=>{
        if(e.cooperativeServices){
          e.cooperativeServices=e?.cooperativeServices.split(',')
        }
        return e
      });
      total.value = res.data.total;
      // console.log('GET分页查询订单', data.tabList)
    })
    .catch((err) => {
      console.log("报错-----", err);
    });
}
function exportExcel(){
  if(!tableData.value?.length){
    ElMessage.error('暂无数据导出')
    return
  }
  exportCustomer(formData.value,`客户列表${parseTime(new Date(),'{y}{m}{d}{h}{i}')}.xlsx`)
}
const handleStatusChange2 = (row) => {
  // console.log("row", row);

  return new Promise((resolve, reject) => {
    setenabled({
      enabled: !row.enabled,
      id: row.id,
    }).then((res) => {
      if (res.code === 200) {
        ElMessage({
          message: "成功",
          type: "success",
        });
        return resolve(true);
      } else {
        ElMessage({
          message: "设置失败",
          type: "error",
        });
        return reject(true);
      }
    });
  });
};

const clickCopy = (text) => {
  	const save = function (evn) {
		evn.clipboardData.setData("text/plain", text);
		evn.preventDefault();
	};
	document.addEventListener("copy", save); 
	document.execCommand("copy"); 
	ElMessage({
		message: "复制成功",
		type: "success",
	});
};
//状态修改

const handleStatusChange = (e, row) => {
  // if(e===row.enabled) return
  console.log("rrr2", e, row);
  // console.log('rrr2',row.enabled);
  // let text = row.status ? "启用" : "停用";
  // proxy.$modal.confirm('确认要"' + text + '""' + row.userName + '"客户吗?').then(function () {
  //   return changeStatus(row.userId, row.status);
  // }).then(() => {
  //   proxy.$modal.msgSuccess(text + "成功");
  // }).catch(function () {
  //   row.status = row.status ? false : true;
  // });
};
const closedre = (is) => {
  if (is === 1) {
    ElMessageBox.confirm("确定取消编辑？", "退出后，已编辑的内容不会被保存。")
      .then(() => {
        drawer.value = false;
      })
      .catch(() => {
        // catch error
      });
  } else {
    drawer.value = false;
  }
};
const handleClose = (done) => {
  ElMessageBox.confirm("确定取消编辑？", "退出后，已编辑的内容不会被保存。")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};
const draclick = (num) => {
  dranum.value = num;
  // newo.value.demofn()
  setTimeout(() => {
    if (num == 1) {
      newo.value.initdata();
    } else {
      newo.value.setdata();
    }
  }, 100);

  drawer.value = true;
};
const editfn = (id) => {
  GetCustomerid({ id: id })
    .then((res) => {
      if (res.code === 200) {
        // console.log(res.data);
        editdata.value = res.data;
        draclick(2);
      }
    })
    .catch((err) => {
      console.log("报错-----", err);
    });
};
function cancelClick() {
  drawer.value = false;
}
function confirmClick(is) {
  // newo.value.confirmClick()
  // console.log('newo.value',newo.value.confirmClick());
  if (is === 2) {
    newo.value.confirmClick();
  } else {
    closedre(1);
  }
}
// const allSalesmanModule = () => {
//   roleKey("crmCustomerBusinessStaff")
//     .then((res) => {
//       salesmanList.value = res.data;
//     })
//     .catch((err) => {
//       // console.log('报错-----', err)
//       ElMessage.error(err.msg);
//     });
// };
// allSalesmanModule();

</script>

<style lang="scss" scoped>
.btnBox {
  text-align: right;
  padding-right: 38px;
}
.tool-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
</style>
