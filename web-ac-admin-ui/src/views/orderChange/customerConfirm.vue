<template>
  <div v-loading="loading">
    <el-card style="margin: 10px">
      <template #header>
        <div class="card-header">
          <span>审核确认</span>
        </div>
      </template>
      <div style="max-width: 1200px">
        <div>
          <span>变更PO:</span><span class="cor_po mar_30">{{ formParams.poSn }}</span><span>订单状态：{{
            formParams.orderStatusName || '无'}}</span>
        </div>
        <el-form :model="formParams" class="pad" :rules="changeRules" ref="changeRef">
          <div style="overflow: visible !important;" v-if="Object.values(formParams).length>0">
            <editTable :table-val="formParams || {}" :change-object="changeObject" @changeList="getList" ></editTable>
          </div>
          <!-- <div class="title mar_60">补差价</div> -->
          <div v-if="commonVal.length > 0">
            <div v-if="commonVal[0].orderType == 1">
              <div class="title mar_60">补差价</div>
              <el-table :data="commonVal" style="width: 100%" border>
                <el-table-column prop="orderNo" label="差价单号" width="226" />
                <el-table-column prop="diffMoney" label="差价金额" width="100" />
                <el-table-column prop="createTime" label="生成时间">
                  <template #default="scope">
                    <div>{{ parseTime(scope.row.createTime) }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="diffDesc" label="备注" />
                <el-table-column prop="type" label="补差价类别" />
                <el-table-column prop="statusName" label="支付状态" />
              </el-table>
            </div>
            <div v-if="commonVal[0].orderType == 2">
              <div class="title mar_60">退款</div>
              <el-table :data="commonVal" style="width: 100%" border>
                <el-table-column prop="orderNo" label="退款单号" width="226" />
                <el-table-column prop="diffMoney" label="退款金额" width="100" />
                <el-table-column prop="createTime" label="申请时间">
                  <template #default="scope">
                    <div>{{ parseTime(scope.row.createTime) }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="diffDesc" label="备注" />
                <el-table-column prop="type" label="退款类别" />
                <el-table-column prop="statusName" label="状态">
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="mar_60">
            <div class="title ">
              <span class="cor">*</span>审核{{ IsPsssText }}原因
            </div>
            <el-form-item prop="auditInstructions">
              <el-input v-model="formParams.auditInstructions" :autosize="{ minRows: 4, maxRows: 8 }" type="textarea"
                placeholder="请输入" maxlength="240" show-word-limit :disabled="allDisabled()" />
            </el-form-item>
            <el-form-item>
              <div class="btn_mar">
                <el-button class="addCost" size="large" @click="submit(2, '审核通过')"
                v-if="!allDisabled()">审核通过</el-button>
                <el-button size="large" @click="submit(3, '审核不通过')" type="info"
                v-if="!allDisabled()">审核不通过</el-button>
                <el-button size="large" @click="changeCancelClick(formParams.changeNo)">取消</el-button>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup>
// 接受参数
import { useRouter } from "vue-router";
import editTable from "./componentsConfirm/editTable.vue";
import { getById, approve, getOrderDiff } from "@/api/orderChange/detail";
import { ElMessage, ElMessageBox } from "element-plus";
const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const loading = ref(true)
const isOperate = ref(false)
let { id } = route.query;
const IsPsssText = ref();
const changeRef = ref();
const title = ref("结构制作");
const data = reactive({
  tablePrice: [],
  formParams: {
  },
  changeRules: {
    auditInstructions: [{ required: true, message: "请输入意见", trigger: "blur" }],
  },
  changeObject: {
    title: '变更费用',
    describe: '',
    isShow: true
  },
  commonVal: []
});
const {  formParams, changeRules, changeObject, tablePrice, commonVal } = toRefs(data);
const changeCancelClick = (order) => {
  // if (!changeRef.value) return;
  // changeRef.value.resetFields();
  router.push({
    path: "orderChangeDetail",
    query: {
      changeNo:order,
     },
  });
};
const getList = () => {
  let obj = {
    id: id,
  };
  getById(obj)
    .then((res) => {
      if (res.code == 200) {
        console.log('被调用', res.data.produceGroupFileHandler);
        if(allDisabled()){
          formParams.value = res.data
        }else{
          formParams.value.changeCostDetailList = res.data.changeCostDetailList
        }
        formParams.value.orderStatusName = formParams.value.orderStatusName.replace('null','')
        formParams.value.produceGroupFileHandler = formParams.value.produceGroupFileHandler||res.data.produceGroupFileHandler?.toString()
        formParams.value.groupFileHandler = formParams.value.groupFileHandler||res.data.groupFileHandler?.toString()
        formParams.value.pressFileHandler =  formParams.value.pressFileHandler||res.data.pressFileHandler?.toString()
        if (formParams.value.status == 1) {
          isOperate.value = true
        } else {
          isOperate.value = false
          if (formParams.value.status == 2) {
            IsPsssText.value = '通过'
          } else if (formParams.value.status == 3) {
            IsPsssText.value = '不通过'
          }
        }
        OrderDiff(formParams.value.changeNo)
    
      }
    })
    .catch(() => {     loading.value = false})
    .finally(() => {     loading.value = false});
};
getList();
const submit = (type, judgeType) => {
  proxy.$refs.changeRef.validate((valid) => {
    if (valid) {
      ElMessageBox.confirm("确认" + judgeType + "?")
        .then(() => {
          let obj = {
            "groupSn": formParams.value.groupSn,
            "id": formParams.value.id,
            "auditInstructions": formParams.value.auditInstructions,
            "status": type,
          }
          console.log(obj);
          approve(obj)
            .then((res) => {
              if (res.code == 200) {
                ElMessage({
                  type: "success",
                  message: res.data,
                });
                console.log("___153", res);
                getList()
              }
            })
            .catch(() => { })
            .finally(() => { });
        }).catch(() => { });
    }
  });
};
const allDisabled = () => {
  if (isOperate.value) {
    return false
  } else {
    return true
  }
}
const OrderDiff = (orderNo) => {
  let obj = {
    changeNo: orderNo,
  };
  getOrderDiff(obj)
    .then((res) => {
      if (res.code == 200) {
        console.log(res);
        let val = res.data
        console.log("___", val);
        if (val) {
          commonVal.value = [{
            orderNo: val?.orderNo,
            diffMoney: val?.diffMoney,
            createTime: val?.createTime,
            diffDesc: val?.diffDesc,
            type: val?.type,
            statusName: val?.statusName,
            status: val?.status,
            orderType: val?.orderType
          }]
        }

      }
    })
    .catch(() => { })
    .finally(() => { });
}
</script>

<style lang="scss" scoped>
.cor_po {
  color: #02a7f0;
  display: inline-block;
}

.mar_30 {
  margin-right: 30px;
}

.title {
  padding: 10px 0px;
  font-weight: bold;
  font-size: 15px;
}

.mar_60 {
  margin-top: 30px;
}

.bg {
  background-color: rgba(250, 205, 145, 0.168627450980392);
  padding: 20px;
}

.pad {
  padding: 10px 20px;
}

.dis_inl {
  display: inline-block;
  margin-right: 30px;
}

.addCost {
  background-color: $bgColor;
  color: $color;
  border: $borColor;
}

.btn_mar {
  text-align: center;
  margin: 20px auto;
}

.cor {
  color: var(--el-color-danger);
}</style>
