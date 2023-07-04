<template>
  <div   v-loading="loading">
    <el-card style="margin: 10px">
      <template #header>
        <div class="card-header">
          <span>审核确认</span>
        </div>
      </template>
      <div style="max-width: 1200px">
        <div>
          <span>变更PO:</span><span class="cor_po mar_30">{{ formParams.poSn }}</span><span>订单状态：订料（暂停中）</span>
        </div>
        <div class="title mar_60">大版文件处理</div>
        <div class="bg">
          <span>变更PO号为:</span><span class="cor_po mar_30">{{ formParams.poSn }}</span><span>有关联大版号:</span><span
            class="cor_po">{{ formParams.groupSn }}</span>({{ orderChange_makeUp_status[formParams.makeUpType]?.label }})
        </div>
        <el-form :model="formParams" class="pad" :rules="changeRules" ref="changeRef">
          <el-form-item>
            <el-form-item>
              <span class="mar_30 dis_inl"><span class="cor">*</span>本次变更</span>
            </el-form-item>
            <el-form-item prop="groupFileHandler">
              <el-radio-group v-model="formParams.groupFileHandler" class="ml-4">
                <el-radio :label="item.value" size="large" v-for="item in orderChange_groupFile_type"
                  :disabled="isDisabled(item.value) || allDisabled()">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form-item>
          <div style="overflow: visible !important;" v-if="Object.values(formParams).length>0">
            <editTable :table-val="formParams || {}" :change-object="changeObject" @changeList="getList" ></editTable>
          </div>

          <div class="title mar_60">变更货期影响</div>
          <el-form-item>
            当前系统计算,变更前:{{ formParams.updateInfo?.oldDeliveryDay }}天,交货日期({{ formParams.updateInfo?.oldOutTime }}),
            <span v-if="formParams.updateInfo?.deliveryDay"> 变更后:{{ formParams.updateInfo?.deliveryDay
            }}天,交货日期({{ formParams.updateInfo?.outTime }})</span>
           
          </el-form-item>
          <el-form-item>
            <el-form-item prop="time">
              <!-- <span class="cor">*</span> -->
              <el-checkbox v-model="formParams.time" label="需要额外再调整" size="large" @change="changeCheckbox" :disabled="allDisabled()"/>
            </el-form-item>
            <el-form-item style="margin: 0px 10px 0 30px" prop="day">
              <el-input v-model="formParams.day" placeholder="请输入天数" :disabled="deliveryObject.dayIsShow"
                @blur="getAdd" />
            </el-form-item>
            天
          </el-form-item>
          <el-form-item v-if="isShow">
            变更后,本单货期:{{ deliveryObject.deliveryDay }}天,交货日期({{ deliveryObject.outTime }})
          </el-form-item>
          <div>
            <div class="title mar_60">
              <span class="cor">*</span>审核{{IsPsssText}}原因
            </div>
            <el-form-item prop="auditInstructions">
              <el-input v-model="formParams.auditInstructions" :autosize="{ minRows: 4, maxRows: 8 }" type="textarea"
                placeholder="请输入" maxlength="240" show-word-limit :disabled=" allDisabled()"/>
            </el-form-item>
            <el-form-item>
              <div class="btn_mar">
                <el-button class="addCost" size="large" @click="submit(2, '审核通过')" v-if="!allDisabled()">审核通过</el-button>
                <el-button size="large" @click="submit(3, '审核不通过')" type="info" v-if="!allDisabled()">审核不通过</el-button>
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
const route = useRoute();
const router = useRouter();
const loading = ref(true)
let { id, isCheck } = route.query;
const { proxy } = getCurrentInstance();
import editTable from "./componentsConfirm/editTable.vue";
import { ElMessage,ElMessageBox } from "element-plus";
const { orderChange_makeUp_status, orderChange_groupFile_type } = proxy.useDict("orderChange_makeUp_status", "orderChange_groupFile_type");
import { getById, calculateOutTime, approve } from "@/api/orderChange/detail";
const validateNumber = (rule, value, callback) => {
  let reg2 = /^([0-9][0-9]*)$/; //正整数
  if (deliveryObject.value.isChecked) {
    if (value === "" || value === null) {
      callback(new Error("请输入天数"));
    } else {
      if (!reg2.test(value)) {
        callback(new Error("请输入正整数"));
      } else {
        callback();
      }
    }
  } else {
    callback();
  }
};
const changeRef = ref();
const IsPsssText = ref();
const isShow = ref(false)
const isOperate = ref(false)
const data = reactive({
  tableData: [{ type: "变更损耗费用", item: "1", pay: "120" }],
  formParams: {
  },
  changeRules: {
    groupFileHandler: [{ required: true, message: "请选择本次变更", trigger: "blur" }],
    day: [
      { validator: validateNumber, trigger: "blur" },
    ],
    auditInstructions: [{ required: true, message: "请输入意见", trigger: "blur" }],
  },
  changeObject: {
    title: '变更损耗费用',
    describe: '填报生产环节变更带来的损耗费用'
  },
  deliveryObject: {
    deliveryDay: 5,
    outTime: 5,
    isChecked: false,
    dayIsShow: true
  },
  changeRadio: [{ name: '需拆除大版重拼大版文件', val: 1 }, { name: '不拆大版需要替换大版文件', val: 2 }, { name: '不拆大版按原大版文件', val: 3 }]
});
const { tableData, formParams, changeRules, changeObject, deliveryObject, changeRadio } = toRefs(data);
const submit = (type, judgeType) => {
  proxy.$refs.changeRef.validate((valid) => {
    if (valid) {
      ElMessageBox.confirm("确认" + judgeType + "?")
        .then(() => {

          let obj = {
            "deliveryDayAdd": formParams.value.day,
            "groupFileHandler": formParams.value.groupFileHandler,
            "groupSn": formParams.value.groupSn,
            "id": formParams.value.id,
            "auditInstructions": formParams.value.auditInstructions,
            "status": type,
          }
          approve(obj)
            .then((res) => {
              if (res.code == 200) {
                ElMessage({
          type: "success",
          message: res.data,
        });
                console.log("___153",res);
                getList()
              }
            })
            .catch(() => { })
            .finally(() => { });
        }).catch(() => { });
    }
  });


};
const changeCancelClick = (order) => {
  router.push({
    path: "orderChangeDetail",
    query: {
      changeNo:order,
     },
  });
  // proxy.$router.go(-1);
  // if (!changeRef.value) return;
  // changeRef.value.resetFields();
};
const changeCheckbox = (val) => {
  deliveryObject.value.isChecked = val
  deliveryObject.value.dayIsShow = !val
  if (deliveryObject.value.isChecked) {
    formParams.value.groupFileHandler = ''
  }else{
    isShow.value = false
    formParams.value.day = ''
  }
}
const isDisabled = (row) => {
  if (deliveryObject.value.isChecked) {
    if (row != 1) {
      return true
    }
  }
}
const allDisabled = () =>{
  if (isOperate.value) {
    return false
  }else{
    return true
  }
}
const getList = () => {
  let obj = {
    id: id,
  };
  getById(obj)
    .then((res) => {
      if (res.code == 200) {
        console.log('被调用', res.data.groupFileHandler);
        if(allDisabled()){
          formParams.value = res.data
        }else{
          formParams.value.changeCostDetailList = res.data.changeCostDetailList
        }
        formParams.value.groupFileHandler =  formParams.value.groupFileHandler || res.data.groupFileHandler?.toString()
        deliveryObject.value.deliveryDay =deliveryObject.value.deliveryDay|| res.data.updateInfo?.deliveryDay
        deliveryObject.value.outTime = deliveryObject.value.outTime||res.data.outTime
       if(res.data.updateInfo?.deliveryDayAdd){
        formParams.value.time = true;
        formParams.value.day = res.data.updateInfo?.deliveryDayAdd
        isShow.value = true
        calculateOut()
       }
       if(formParams.value.status==1){
        isOperate.value = true
       }else{
        isOperate.value = false
        if(formParams.value.status ==2){
        IsPsssText.value = '通过'
       }else if(formParams.value.status ==3){
        IsPsssText.value = '不通过'
       }
       }
     
      }
    })
    .catch(() => {  loading.value = false })
    .finally(() => {  loading.value = false });
};
getList();
const getAdd = () => {
 
  calculateOut()
}
const calculateOut = () => {
  deliveryObject.value.deliveryDay = Number(formParams.value.day) + Number(formParams.value.updateInfo?.deliveryDay)
  let obj = {
    changeNo:formParams.value.changeNo,
    deliveryDay:deliveryObject.value.deliveryDay,
    poSn:formParams.value.poSn
  }
  calculateOutTime(obj).then(res => {
    if(res.code == 200){
      deliveryObject.value.outTime = res.data
      isShow.value = true
    }
  }).catch(() => { })
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
}
</style>
