<template>
    <div>
      <el-card style="margin: 10px" class="artwork-workbench">
        <div class="top-bar subOrder">
          <el-form inline :model="formData" class="condition" ref="queryRef">
            <!-- 客户信息 -->
            <el-form-item label="申请单编号:">
              <el-input style="width: 252px" clearable v-model="formData.customerInfo" placeholder="请输入申请单编号" />
            </el-form-item>
            <el-form-item label="PO编号:">
              <el-input style="width: 252px" clearable v-model="formData.orderInfo" placeholder="请输入订单PO号" />
            </el-form-item>
            <!-- 订单类型 -->
            <el-form-item label="订单类型:">
              <el-select v-model="formData.procType" class="m-2" style="width: 252px" placeholder="所有类型" clearable>
                <el-option v-for="item in crm_order_type" :key="item.id" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="归属部门:" prop="acDataSepDeptId">
              <el-select v-model="formData.acDataSepDeptId" placeholder="所有部门" clearable :disabled="deptDisabled" @change="changeDept" style="width:252px;">
                <el-option v-for="item in deptList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <!-- 业务员 -->
            <el-form-item label="业务经理:">
              <el-select v-model="formData.businessStaffId" class="m-2" style="width: 252px" placeholder="所有业务经理" clearable
                :disabled="isSaleman">
                <el-option v-for="item in salesmanList" :key="item.userId" :label="item.nickName" :value="item.userId" />
              </el-select>
            </el-form-item>
            <!-- 客户信息 -->
            <el-form-item label="申请单编号:">
              <el-input style="width: 252px" clearable v-model="formData.customerInfo" placeholder="请输入申请单编号" />
            </el-form-item>
            <!-- 订单状态 -->
            <el-form-item label="订单状态:">
              <el-select v-model="formData.procStatus" class="m-2" style="width: 252px" placeholder="所有状态" clearable>
                <el-option v-for="items in crm_order_status" :key="items.id" :label="items.label" :value="items.value" />
              </el-select>
            </el-form-item>
            <!-- 订单生成时间 -->
            <el-form-item label="下单日期:">
              <dateTimePicker ref="dateRef" :dateType="'datetimerange'"
                v-model:startTime="formData.orderGenerationStartTime" v-model:endTime="formData.orderGenerationEndTime">
              </dateTimePicker>
            </el-form-item>
            <!-- 结算方式 -->
            <el-form-item label="结算方式:">
              <el-select v-model="formData.settlementMethod" class="m-2" style="width: 252px" placeholder="所有方式"
                clearable>
                <el-option v-for="items in methodList" :key="items.id" :label="items.optionDesc" :value="items.id" />
              </el-select>
            </el-form-item>
            <!-- 订单信息 -->
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
          <span>订单列表</span>
          <div>
            <!-- <el-button @click="exportExcel">导出</el-button> -->
            <el-button @click="isAttrShow = true"  v-hasPermi="['@newOrder']">新建订单</el-button>
          </div>
        </div>
        <!-- 订单列表  -->
        <div class="outworkListBox">
          <el-table :data="tabList" style="width: 100%" scrollbar-always-on>
            <el-table-column label="申请单编号" width="150" prop="businessKey"></el-table-column>
            <el-table-column label="订单PO号" width="150" prop="businessKey"></el-table-column>
            <el-table-column label="订单类型" width="120">
              <template #default="scope">
                <DictTag :value="scope.row.procType" :options="crm_order_type" />
              </template>
            </el-table-column>
            <el-table-column label="客户名称">
              <template #default="scope">
                <el-tooltip class="box-item" effect="dark" placement="top-end">
                  <template #content>{{ scope.row.customerName }} </template>
                  <div class="hiddenTxt">
                    <router-link :to="
                      '/crm/customer/customerDetail?id=' + scope.row.customerId
                    ">
                      {{ scope.row.customerName }}
                    </router-link>
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="品类" width="160">
              <template #default="scope">
                <el-tooltip class="box-item" effect="dark" placement="top-end">
                  <template #content>{{ scope.row.categoryStr }} </template>
                  <div class="hiddenTxt">
                    {{ scope.row.categoryStr }}
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="订单金额" width="120">
              <template #default="scope">
                <div style="text-align: right; height: 100%; display: block">
                  {{
                    showMoney(
                      scope.row.costTotalPrice ? scope.row.costTotalPrice : "-"
                    )
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" width="160" prop=""></el-table-column>
            <el-table-column label="结算方式">
              <template #default="scope">
                <DictTag :value="scope.row.procStatus" :options="crm_order_status" />
              </template>
            </el-table-column>
            <el-table-column label="订单状态" width="100" prop="businessStaffName"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template #default="scope">
                <el-link type="primary" :underline="false" @click="gotoDetail(scope.row)">查看详情</el-link>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="laypage">
            <pagination background layout="total, sizes, prev, pager, next, jumper" v-model:page="formData.current"
              :total="total" v-model:limit="formData.size" :pageSizes="[10, 20, 30, 50, 100]" />
          </div>
        </div>
        <!-- 选择订单类型 -->
        <div class="is-align-center">
          <el-dialog v-model="isAttrShow" title="选择订单类型" width="600px">
            <div class="btns">
              <el-button class="btn" type="primary" plain @click="showToDialog(1)">方案设计</el-button>
              <el-button class="btn" type="primary" plain @click="showToDialog(2)">大货订单</el-button>
              <el-button class="btn" type="primary" plain @click="showToDialog(3)">大货设计生产订单</el-button>
            </div>
            <template #footer>
              <span>
                <el-button type="primary" @click="isAttrShow = false">取消</el-button>
              </span>
            </template>
          </el-dialog>
        </div>
      </el-card>
      <new-order ref="dialogShow" :salesmanList="salesmanList" :methodList="methodList" :isRoles="isSaleman"
        @crmOrderProcView="crmOrderProcViewFn">
      </new-order>
    </div>
  </template>
  
  <script setup>
  import dateTimePicker from "@/components/datePicker/index.vue";
  import { parseTime } from '@/utils/ruoyi'
  import {
    roleKey,
    gradingCalculate,
    exportOrderList,
  } from "@/api/orderManagement/subOrder";
  import useUserStore from "@/store/modules/user";
  import { ElMessage, ElMessageBox } from "element-plus";
  import { formatDate } from "@/utils/index";
  import { useRouter } from "vue-router";
  import { useIsCrmSaleman } from "@/hooks/selectCrmSaleman";
  import useCrmOption from "@/store/modules/crmSelectOption";
  const option = useCrmOption();
  const salesmanList = computed(() => option.salesmanList);
  // option.getOptionList('crmCustomerBusinessStaff')
  const deptList = computed(()=> option.deptList)
  const deptDisabled = ref(false)
  const [isSaleman, userId] = useIsCrmSaleman('crmCustomerBusinessStaff')
  
  const router = useRouter();
  // 获取字典管理--配置的状态
  const { proxy } = getCurrentInstance();
  const { crm_order_type, crm_order_status, crm_category_type, crm_acColumn } =
    proxy.useDict(
      'crm_order_type',
      'crm_order_status',
      'crm_category_type',
      'crm_acColumn'
    )
  const roles = computed(() => useUserStore().roles) //获取角色
  /*
   *开始
   */
  // 获取右边弹窗的dom
  let isAttrShow = ref(false);
  // let isRoles = ref(false) //是否是业务员
  const dialogShow = ref(null);
  const dateRef = ref(null);
  const dateRef1 = ref(null);
  // 调用子组件的方法来改变子组件变量的状态
  const showToDialog = (order) => {
    const item = salesmanList.value.find((e) => e.userId == userId);
    dialogShow.value.dialogShow(true, order, item);
    isAttrShow.value = false;
  };
  const data = reactive({
    // startTime: [formatDate(new Date().getTime() - 3600 * 1000 * 24 * 90), formatDate(new Date().getTime() + 3600 * 1000 * 24 * 1)], //开始时间
    // endTime: '', //结束时间
    tabList: [],
    methodList: [],
    total: 0,
    isSearch: false,
    salesValue: "", //业务员的字典值
    formData: {
      size: 10, //单页显示多少条数据
      current: 1, //当前页数
      procType: "", //订单类型
      procStatus: "", //流程状态
      businessStaffId: isSaleman ? userId : "", //业务员id
      orderGenerationStartTime: formatDate(new Date(new Date().toLocaleDateString()).getTime()-60*60*1000*24*90), //订单生成时间开始时间
      orderGenerationEndTime: formatDate(new Date(new Date().toLocaleDateString()).getTime()+60*60*1000*24-1000), //订单生成时间结束时间
      orderFinishStartTime: "", //订单完成时间开始时间
      orderFinishEndTime: "", //订单完成时间结束时间
      customerInfo: "", //客户姓名,客户编号
      // settlementMethod: '', //结算方式
      orderInfo: "", //订单信息
      acDataSepDeptId: "", //部门
    },
  });
  const {
    formData,
    // startTime,
    // endTime,
    tabList,
    total,
    isSearch,
    salesValue,
    methodList,
  } = toRefs(data)
  option.setDeptId(formData.value.acDataSepDeptId);
  option.getDept().then(res=>{
    if (res?.data) {
      formData.value.acDataSepDeptId = res.data.id
      deptDisabled.value = true
    }
  }).finally(()=>{
    crmOrderProcViewFn()
  })
  
  watch(crm_acColumn,(val)=>{
    formData.value.acColumn = val.find(item=>{return item.label=="acColumn"}).value
  })
  if (crm_acColumn.value.length>0) {
      formData.value.acColumn = crm_acColumn.value.find(item=>{return item.label=="acColumn"}).value
  }
  
  // 获取结算方式
  const gradingCalculateFn = () => {
    gradingCalculate().then((res) => {
      // console.log('获取结算方式=====', res)
      methodList.value = res.data.more_settlement_method;
    });
  };
  gradingCalculateFn();
  
  function exportExcel() {
      if(!tabList.value?.length){
          ElMessage.error('暂无数据导出')
          return
      }
    formData.value.orderGenerationStartTime = formatDate(dateRef.value.start); //订单生成时间开始时间
    formData.value.orderGenerationEndTime = formatDate(dateRef.value.end); //订单生成时间结束时间
    exportOrderList(formData.value, `订单列表${parseTime(new Date(),'{y}{m}{d}{h}{i}')}.xlsx`);
  }
  /**
   *crm订单流程视图--分页查询订单
   **/
  
  const crmOrderProcViewFn = (type) => {
    if (type == 1) {
      // 不能直接使用对像赋值，会是使formData的栈值变化导致触发wacth监听，
      formData.value.size = 10;
      formData.value.current = 1;
      formData.value.procType = "";
      formData.value.procStatus = "";
      formData.value.businessStaffId = isSaleman ? userId : "";
      formData.value.orderGenerationStartTime = formatDate(dateRef.value.start); //订单生成时间开始时间
      formData.value.orderGenerationEndTime = formatDate(dateRef.value.end); //订单生成时间结束时间
      // formData.value.orderGenerationStartTime = startTime.value[0] //订单生成时间开始时间
      // formData.value.orderGenerationEndTime = startTime.value[1] //订单生成时间结束时间
      formData.value.orderFinishStartTime = ""; //订单完成时间开始时间
      formData.value.orderFinishEndTime = ""; //订单完成时间结束时间
      formData.value.customerInfo = "";
      formData.value.settlementMethod = "";
      formData.value.orderInfo = "";
      dateRef.value.initTime(1);
      dateRef1.value.initTime();
    }
    // console.log('orderGenerationStartTime.value====777777', formData.value.orderGenerationStartTime);
    // console.log('orderGenerationEndTime.value====777777', formData.value.orderGenerationEndTime);
    crmOrderProcView(formData.value)
      .then((res) => {
        tabList.value = res.data.records;
        total.value = res.data.total;
        // console.log('GET分页查询订单', data.tabList)
      })
      .catch((err) => {
        console.log("报错-----", err);
      });
  };
  function saveTwoBit(num) {
    var result = parseFloat(num);
    result = Math.round(num * 100) / 100;
    return result;
  }
  function changeDept(val) {
    option.setDeptId(val);
    formData.value.businessStaffId = null;
  }
  /**
   * 处理选着的时间格式
   **/
  const timeFormat = (value, type) => {
    if (type == "1") {
      formData.value.orderGenerationStartTime = value
        ? formatDate(value[0].getTime())
        : "";
      formData.value.orderGenerationEndTime = value
        ? formatDate(value[1].getTime())
        : "";
    } else {
      formData.value.orderFinishStartTime = value
        ? formatDate(value[0].getTime())
        : "";
      formData.value.orderFinishEndTime = value
        ? formatDate(value[1].getTime())
        : "";
    }
  };
  /**
   * 筛选
   */
  const search = () => {
    isSearch.value = true;
    crmOrderProcViewFn();
  };
  /**
   * 重置
   */
  const reset = () => {
    //开始时间
    // endTime.value = ''
    dateRef.value.initTime(1);
    dateRef1.value.initTime();
    proxy.$refs["addRef"].resetFields()
    // //结束时间
    // formData.value = {
    //   size: 10, //单页显示多少条数据
    //   current: 1, //当前页数
    //   procType: "", //订单类型
    //   procStatus: "", //流程状态
    //   businessStaffId: isSaleman ? userId : "", //业务员id
    //   orderGenerationStartTime: formatDate(dateRef.value.start), //订单生成时间开始时间
    //   orderGenerationEndTime: formatDate(dateRef.value.end), //订单生成时间结束时间
    //   orderFinishStartTime: "", //订单完成时间开始时间
    //   orderFinishEndTime: "", //订单完成时间结束时间
    //   customerInfo: "", //客户姓名,客户编号
    //   // settlementMethod: '', //结算方式
    //   orderInfo: '', //订单信息
    //   acColumn:crm_acColumn.value.find(item=>{return item.label=="acColumn"}).value,
    //   acDataSepDeptId:deptDisabled.value?formData.value.acDataSepDeptId:''
    // }
  }
  /**
   * 查看详情
   **/
  const gotoDetail = (row) => {
    router.push({
      path: "/crm/orderManagement/orderDetail",
      query: { id: row.id, procType: row.procType, customerId: row.customerId },
    });
  };
  // crmOrderProcViewFn();
  
  onMounted(() => {
    /**
     * 监听对象数据的变化
     */
    watch(
      [() => formData.value.size, () => formData.value.current,],
      (val, oval) => {
        crmOrderProcViewFn();
      },
      {
        deep: true, //开启深度监听,能够侦听到对象属性值的变化
      }
    );
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
      display: flex;
      justify-content: space-between;
      margin: 20px 0;
    }
  
    // 分页
    .laypage {
      display: flex;
      justify-content: right;
      margin-top: 20px;
    }
  }
  
  .hiddenTxt {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
  