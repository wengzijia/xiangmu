<template>
  <div>
    <div class="mar_60 dis_flex">
      <div>
        <span class="title">{{ changeObject.title }}</span><span>{{ changeObject.describe }}</span>
      </div>
      <div>
        <el-button @click="dialogFormVisible = true" class="addCost" :disabled="isDisabled()">增加费用</el-button>
      </div>
    </div>
    <el-table :data="tableVal?.changeCostDetailList" border style="width: 100%; margin-top: 20px;overflow: visible !important;">
      <el-table-column prop="costTypeName" label="费用类型"> </el-table-column>
      <el-table-column prop="costProjectName" label="费用项目">
        <!-- <template #default="scope">
          <DictText :value="scope.row.costProject" dict="orderChange_cost_project"></DictText>
        </template> -->
      </el-table-column>
      <el-table-column prop="costMoney" label="补差价/退款">
        <template #default="scope">
          <div>{{ scope.row.costMoney }}</div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button link type="primary" @click="updateRow(scope.row)" :disabled="isDisabled()">编辑</el-button>

          <el-button link type="danger" @click.prevent="deleteRow(scope.row)" :disabled="isDisabled()">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top:20px" v-if="changeObject.isShow && tableVal.totalCost">合计金额：{{ tableVal?.totalCost }}元</div>
    <el-dialog v-model="dialogFormVisible" title="增加费用" style="width: 520px" destroy-on-close>
      <el-form :model="formParams" :rules="addRules" ref="addRef">
        <el-form-item label="费用类型:" :label-width="formLabelWidth">
          <div>变更损耗费用</div>
        </el-form-item>
        <el-form-item label="费用项目:" :label-width="formLabelWidth" prop="item">
          <el-select v-model="formParams.item" placeholder="请选择">
            <el-option v-for="(item, index) in CostList" :key="index" :label="item.desc" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="扣款/退款:" :label-width="formLabelWidth" prop="resource">
          <el-radio-group v-model="formParams.resource">
            <el-radio label="+">补差价(+)</el-radio>
            <el-radio label="-">退款(-)</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="费用金额:" :label-width="formLabelWidth" prop="pay">
          <el-input v-model="formParams.pay" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="addVal()"> 增加 </el-button>
          <el-button @click="cancelClick()">取消</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="editFormVisible" title="编辑费用项金额" style="width: 400px" destroy-on-close>
      <el-form :model="costParams" :rules="editRules" ref="editRef">
        <el-form-item label="费用金额:" label-width="120" prop="pay">
          <el-input v-model="costParams.pay" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="editVal()"> 提交 </el-button>
          <el-button @click="costCancelClick">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
const { proxy } = getCurrentInstance();
import { ElMessage } from "element-plus";
import { update, deleteVal, save, getCostProjectList } from "@/api/orderChange/detail";
const props = defineProps({
  tableVal: {
    type: Object,
    default: {},
  },
  changeObject: {
    type: Object,
    default: {
      title: "",
      describe: '',
      isShow: false
    }
  }
});
const validateNumber = (rule, value, callback) => {
  let reg2 = /^([0-9][0-9]*)$/; //正整数
  if (value === "" || value === null) {
    callback(new Error("请输入费用金额"));
  } else {
    if (!reg2.test(value)) {
      callback(new Error("请输入正整数"));
     
    } else {
      if(value>1000000){
        callback(new Error("超出最大金额限制"));
      }else{
        callback();
      }
     
    }
  }
};
const dialogFormVisible = ref(false);
const editFormVisible = ref(false);
const { tableVal } = toRefs(props);
const { changeTitle } = toRefs(props);
const addRef = ref();
const editRef = ref();
const formLabelWidth = "140px";
const emits = defineEmits();
const SumVal = ref();
const data = reactive({
  formParams: {
    item: "",
    resource: "",
    pay: "",
  },
  CostList: [],
  addRules: {
    item: [{ required: true, message: "请选择费用项目:", trigger: "change" }],
    resource: [
      { required: true, message: "请选择扣款/退款:", trigger: "change" },
    ],
    pay: [
      {
        required: true,
        validator: validateNumber,
        trigger: "blur",
      },
    ],
  },
  editRules: {
    pay: [
      // { required: true, message: "请输入费用金额:", trigger: "blur" }
      {
        required: true,
        validator: validateNumber,
        trigger: "blur",
      },
    ],
  },
  costParams: {
    pay: "",
  },
  editParams: {

  }
});
const { formParams, editRules, costParams, addRules, CostList, editParams } = toRefs(data);
const addVal = () => {
  let sign = "";
  proxy.$refs.addRef.validate((valid) => {
    if (valid) {
      saveRow(formParams.value)
    }
  });
};



// const handleClick = (row) => {
//   costParams.value.pay = Math.abs(tableVal.value[row].pay);
//   editFormVisible.value = true;
// };
const cancelClick = () => {
  if (!addRef.value) return;
  addRef.value.resetFields();
  dialogFormVisible.value = false;
};
const costCancelClick = () => {
  if (!editRef.value) return;
  editRef.value.resetFields();
  editFormVisible.value = false;
};
const saveRow = (val) => {
  let obj = {
    changeInfoId: tableVal.value?.id,
    costMoney: val.resource + val.pay,
    costProject: val.item,
    costType: 2
  }
  save(obj)
    .then((res) => {
      if (res.code == 200) {
        console.log(res);
        ElMessage({
          type: "success",
          message: "添加成功",
        });
   
        cancelClick();
        emits("changeList");
      }
    })
    .catch(() => { })
    .finally(() => { });
};
const deleteRow = (val) => {

  let obj = {
    changeInfoId: val.changeInfoId,
    costDetailId: val.costDetailId,
    costInfoId: val.costInfoId,
    costMoney: val.costMoney,
    costProject: val.costProject,
    costType: val.costType
  }

  deleteVal(obj)
    .then((res) => {
      if (res.code == 200) {
        ElMessage({
          type: "success",
          message: "删除成功",
        });
        emits("changeList");
      }
    })
    .catch(() => { })
    .finally(() => { });

};
const updateRow = (val) => {
  let str = val.costMoney.toString()
  let judge = str.indexOf("-") != -1;
  costParams.value.pay = Math.abs(val.costMoney)
  editParams.value = {
    changeInfoId: val.changeInfoId,
    costDetailId: val.costDetailId,
    costInfoId: val.costInfoId,
    costProject: val.costProject,
    costType: val.costType,
    mark: judge ? '-' : ''
  }
  editFormVisible.value = true;
};
const editVal = () => {
  editParams.value.costMoney = editParams.value.mark + costParams.value.pay
  proxy.$refs.editRef.validate((valid) => {
    if (valid) {
      update(editParams.value)
        .then((res) => {
          if (res.code == 200) {
            ElMessage({
              type: "success",
              message: "修改成功",
            });
            costCancelClick();
            emits("changeList")
          }
        })
        .catch(() => { })
        .finally(() => { });

    }
  });
};
const CostProjectList = () => {
  console.log("----", tableVal.value);

  let obj = {
    deptId: tableVal.value.changeDepartmentId,
    changeCategoryId:tableVal.value?.changeCategoryId 
  };

  getCostProjectList(obj)
    .then((res) => {
      if (res.code == 200) {
        console.log(res);
        CostList.value = res.data
      }
    })
    .catch(() => { })
    .finally(() => { });
}
CostProjectList()
const isDisabled = () => {
  if (tableVal.value.status == 1) {
    return false
  } else {
    return true
  }
}

</script>

<style lang="scss" scoped>
.title {
  font-weight: bold;
  font-size: 15px;
  display: inline-block;
  padding-right: 30px;
}

.mar_60 {
  margin-top: 30px;
}

.dis_flex {
  display: flex;
  justify-content: space-between;
}

.addCost {
  background-color: $bgColor;
  color: $color;
  border: $borColor;
}
</style>
