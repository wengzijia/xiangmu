<template>
  <el-scrollbar style="height: 66vh; min-height: 360px">
    <div v-for="(contacts, index) in contactsList">
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <h3>关键联系人{{ index + 1 }}</h3>
        <el-popconfirm title="确认删除该联系人?" @confirm="delContacts(index)">
          <template #reference>
            <el-button v-if="edit" type="info" plain>删除联系人</el-button>
          </template>
        </el-popconfirm>
      </div>
      <div class="customer-form" style="border-top: 1px solid #dcdfe6">
        <div class="customer-label">职位</div>
        <div class="customer-item">
          <el-select
            v-if="edit && !contacts.notEditPositionName"
            v-model="contacts.positionName"
            placeholder="请选择职位"
            clearable
            filterable
          >
            <el-option
              v-for="item in crm_contacts_jobs"
              :key="item.id"
              :label="item.label"
              :value="item.label"
              :disabled="
                index != 0 && (item.label == '公司老板' || item.label == '法人')
              "
            />
          </el-select>
          <span v-else>{{ contacts.positionName }}</span>
        </div>
        <div class="customer-image"></div>
      </div>
      <div class="customer-form">
        <div class="customer-label">
          <span class="red-star">*</span>联系人名称
        </div>
        <div class="customer-item">
          <el-input
            v-if="edit && !contacts.notEditContactsName"
            v-model="contacts.contactsName"
            maxlength="10"
            placeholder="请输入联系人名称"
            show-word-limit
            type="text"
            style="width: 252px; margin-right: 10px"
          />
          <span v-else>{{ contacts.contactsName }}</span>
        </div>
        <div class="customer-image"></div>
      </div>
      <div class="customer-form">
        <div class="customer-label">
          <span class="red-star">*</span>联系人电话
        </div>
        <div class="customer-item">
          <el-input
            v-if="edit"
            v-model="contacts.contactsPhone"
            maxlength="20"
            placeholder="请输入联系人电话"
            show-word-limit
            type="text"
            style="width: 252px; margin-right: 10px"
          />
          <span v-else>{{ contacts.contactsPhone }}</span>
        </div>
        <div class="customer-image">
          <ImageUpload
            v-model="contacts.contactsPhoneFileRichText"
            :disabled="!edit"
          ></ImageUpload>
        </div>
      </div>
      <div class="customer-form">
        <div class="customer-label">联系人备注</div>
        <div class="customer-item">
          <el-input
            v-if="edit"
            v-model="contacts.remark"
            maxlength="200"
            placeholder="请输入联系人备注"
            show-word-limit
            type="text"
            style="width: 252px; margin-right: 10px"
          />
          <span v-else>{{ contacts.remark }}</span>
        </div>
        <div class="customer-image">
          <ImageUpload
            v-model="contacts.remarkFileRichText"
            :disabled="!edit"
          ></ImageUpload>
        </div>
      </div>
    </div>
    <div v-if="edit" style="text-align: center; margin-top: 20px">
      <el-button type="primary" @click="addContacts">新增联系人</el-button>
    </div>
    <div v-if="contactsList.length==0&&!edit" style="text-align: center; margin-top: 20px">
      暂无联系人
    </div>
  </el-scrollbar>
</template>

<script setup>
import { onMounted } from "vue";

const props = defineProps({
  index: {
    type: Number,
    default: 1,
  },
  edit: {
    type: Boolean,
    default: false,
  },
  //客户信息
  customer: {
    type: Object,
    default: {},
  },
});
const emit = defineEmits();
const dialogVisible = ref(false);
const { proxy } = getCurrentInstance();
const { crm_contacts_jobs } = proxy.useDict("crm_contacts_jobs");

const contactsList = ref([]);
contactsList.value = props.customer.contactsList || [];
onMounted(() => {
  watch(
    contactsList,
    (val) => {
      emit("isChange", true);
    },
    { deep: true }
  );
});
//添加联系人
function addContacts() {
  let contactsBaseInfo = {
    contactsName: "",
    contactsPhone: "",
    contactsPhoneFileRichText: "",
    positionName: "",
    remark: "",
    remarkFileRichText: "",
  };
  if (contactsList.value.length === 0) {
    if (props.customer.baseInfo.customerClassify == 2) {
      contactsBaseInfo.contactsName = props.customer.baseInfo.customerName;
      contactsBaseInfo.positionName = "公司老板";
      contactsBaseInfo.notEditContactsName = true;
      contactsBaseInfo.notEditPositionName = true;
    } else {
      contactsBaseInfo.positionName = "法人";
    }
  }
  contactsBaseInfo.sortIndex = contactsList.value.length;
  contactsList.value.push(contactsBaseInfo);
}
//删除联系人
function delContacts(i) {
  contactsList.value.splice(i, 1);
}
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
    width: 380px;
    border-left: 1px solid #dcdfe6;
    border-right: 1px solid #dcdfe6;
  }

  .customer-image {
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
