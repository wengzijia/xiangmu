<template>
  <el-scrollbar style="height: 66vh; min-height: 360px">
    <div v-for="(address, index) in addressArray" :key="index">
      <h3>收货地址{{ index + 1 }}</h3>
      <el-button @click="modifyAddress(address, index)">取消</el-button>
      <div class="customer-form" style="border-top: 1px solid #dcdfe6">
        <div class="customer-label"><span class="red-star">*</span>联系人</div>
        <div class="customer-item">
          <el-input
            v-if="edit"
            v-model="address.consigneeName"
            maxlength="50"
            placeholder="请选择客户分类"
            show-word-limit
            type="text"
            style="width: 252px; margin-right: 10px"
          />
          <span>{{ address.consigneeName }}</span>
        </div>
      </div>
      <div class="customer-form">
        <div class="customer-label">
          <span class="red-star">*</span>联系人电话
        </div>
        <div class="customer-item">
          <el-input
            v-if="edit"
            v-model="address.consigneePhone"
            maxlength="50"
            placeholder="请选择客户分类"
            show-word-limit
            type="text"
            style="width: 252px; margin-right: 10px"
          />
          <span>{{ address.consigneePhone }}</span>
        </div>
      </div>
      <div class="customer-form">
        <div class="customer-label">省市区</div>
        <div class="customer-item">
          <selectAddress
            v-if="edit"
            v-model:address="customerForm.address"
            ref="addressRef"
          ></selectAddress>
          <span>公司客户</span>
        </div>
      </div>
      <div class="customer-form">
        <div class="customer-label">详细地址</div>
        <div class="customer-item">
          <el-input
            v-if="edit"
            v-model="address.consigneeAddress"
            maxlength="50"
            placeholder="请输入发票收货人详细地址"
            show-word-limit
            type="text"
            style="width: 252px; margin-right: 10px"
          />
          <span>{{ address.consigneeAddress }}</span>
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" title="Tips" width="960px">
      <div>
        <el-form inline :model="formData" label-width="120px" ref="addressRef">
          <el-form-item label="收货人姓名:" prop="customerInfo">
            <el-input
              v-model="formData.consigneeName"
              maxlength="50"
              placeholder="请选择客户分类"
              show-word-limit
              type="text"
              style="width: 252px; margin-right: 10px"
            />
          </el-form-item>
          <el-form-item label="收货人联系电话:" prop="customerInfo">
            <el-input
              v-model="formData.consigneePhone"
              maxlength="50"
              placeholder="请选择客户分类"
              show-word-limit
              type="text"
              style="width: 252px; margin-right: 10px"
            />
          </el-form-item>
          <el-form-item label="省市区:" prop="customerInfo">
            <el-input
              v-model="formData.address"
              maxlength="50"
              placeholder="请选择客户分类"
              show-word-limit
              type="text"
              style="width: 252px; margin-right: 10px"
            />
          </el-form-item>
          <el-form-item label="详细地址:" prop="customerInfo">
            <el-input
              v-model="formData.consigneeAddress"
              maxlength="50"
              placeholder="请选择客户分类"
              show-word-limit
              type="text"
              style="width: 252px; margin-right: 10px"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </el-scrollbar>
</template>

<script setup>
import selectAddress from "@/components/selectAddress/index.vue";
const props = defineProps({
  index: {
    type: Number,
    default: 1,
  },
  edit: {
    type: Boolean,
    default: false,
  },
  addressList: {
    type: Array,
    default: [],
  },
});
const data = reactive({
  formData: {
    city: "", //市
    consigneeAddress: "", //收货详细地址
    consigneeName: "", //收货人姓名
    consigneePhone: "", //收货人联系电话
    district: "", //区
    province: "", //省
    address: {},
  },
});
const { formData } = toRefs(data);
//地址列表
const addressArray = ref([]);
const dialogVisible = ref(false);
const addressIndex = ref(0);
if (props.addressList.length) {
  addressArray.value = props.addressList;
}
function addAddress() {}
function modifyAddress(address, i) {
  formData.value = {
    ...address,
  };
  formData.value.address = {
    province: address.province,
    city: address.city,
    district: address.district,
  };
  addressIndex.value = i;
}
const img = ref("qcxyztTest/filemanage/1/202306/1686032797914/8 (1).jpg");
</script>

<style lang="scss" scoped>
.customer-form {
  width: 100%;
  display: flex;
  border-bottom: 1px solid #dcdfe6;

  div {
    padding: 6px 2px;
  }

  .customer-label {
    width: 160px;
    border-left: 1px solid #dcdfe6;
    padding-left: 10px;
    position: relative;
  }

  .customer-item {
    flex: 1;
    border-right: 1px solid #dcdfe6;
  }
}

.red-star {
  position: absolute;
  left: 3px;
  color: #ff0036;
  line-height: 24px;
  user-select: none;
}
</style>
