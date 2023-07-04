<template>
  <div class="industrialParkEdit">
    <CommonBreadCrumb :first="'产业园管理'" :marginBottom="'16px'" />
    <div class="infoContainer">
      <div class="container">
        <!-- 产业园基本信息 -->
        <div class="informationBox">
          <div class="title">产业园基本信息</div>
          <el-form :inline="true" ref="ruleFormRef" :model="formParam" :rules="rules" label-width="93px"
            class="infoFormBox">
            <el-form-item label="产业园名称" prop="parkName" style="width: 40%;">
              <el-input class="fromPublic" placeholder="最多可输入10个字" clearable maxlength="10" v-model="formParam.parkName"
                @input="formParam.parkName = formParam.parkName.replace(/\s+/g, '')" />
            </el-form-item>
            <el-form-item label="法人" prop="principalName" style="width: 40%">
              <el-input class="fromPublic" placeholder="最多可输入10个字" clearable maxlength="10"
                v-model="formParam.principalName"
                @input="formParam.principalName = formParam.principalName.replace(/\s+/g, '')" />
            </el-form-item>
            <el-form-item label="类型" prop="parkType" style="width: 40%">
              <el-select class="fromPublic" v-model="formParam.parkType" placeholder="请选择类型">
                <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>

            <el-form-item label="电话" prop="principalMobile" style="width: 40%">
              <el-input class="fromPublic" placeholder="最多可输入15位数字" clearable maxlength="15"
                v-model="formParam.principalMobile" @input="inputChange" />
            </el-form-item>
            <el-form-item label="联系地址" style="width: 40%">
              <el-cascader v-model="address" ref="elCascaderRef" @change="handleChange" placeholder="请选择省 市 区"
                :props="cascaderProps" />
              <el-input v-model="formParam.address" maxlength="100" placeholder="详细地址" resize="none" show-word-limit
                type="textarea" class="detailAddress"
                @input="formParam.address = formParam.address.replace(/\s+/g, '')" />
            </el-form-item>
          </el-form>
        </div>
        <!-- 加工商信息 -->
        <div class="fabricatorsInfoBox">
          <div class="title">加工商信息</div>
          <div class="infoTable" id="getTableHeight">
            <el-table :data="processorData" border :height="tableHeight"  style="width: 100%">
              <el-table-column label="加工商名称" width="280px" align="center">
                <template #default="scope">
                  <div style="color: #333333;">{{ scope.row.manufacturerName }}</div>
                </template>
              </el-table-column>
              <el-table-column label="工序" align="center">
                <template #default="scope">
                  <span v-for="( item, index ) in scope.row.manufacturerAttributes" :key="index"
                    style="margin-right: 12px;color: #333333;">{{
                      item.attributeName
                    }}</span>
                </template>
              </el-table-column>
              <el-table-column label="手机号" width="280px" align="center">
                <template #default="scope">
                  <div style="color: #333333;">
                    {{ scope.row.userMobile }}
                  </div>
                </template>
              </el-table-column>
              <!-- <el-table-column label="加工商类型" width="280px" align="center">
            <template #default="scope">
              <span v-for="item in scope.row.manufacturerTypeNames" :key="index" style="margin-right: 12px;">{{ item }}</span>
            </template>
          </el-table-column> -->
              <el-table-column label="是否配置机长看板" width="140px" align="center">
                <template #default="scope">
                  <div style="color: #333333;">{{ boardStatus[scope.row.manufacturerTypes[0].isBw + ''] }}</div>
                </template>
              </el-table-column>
              <el-table-column label="状态" width="140px" align="center">
                <template #default="scope">
                  <div style="color: #333333;">{{ statusMap[scope.row.enableStatus] }}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="footer">
          <el-form-item class="submitBox">
            <el-button type="primary" class="search_button" @click="save(ruleFormRef)">保存</el-button>
            <!-- <el-button class="reset_button" @click="back">返回</el-button> -->
          </el-form-item>
        </div>
      </div>
    </div>
  </div>
</template>

<script name="IndustrialParkDetails" setup>
import { ElMessage } from "element-plus";
import { onMounted } from 'vue'
import { getRegionListByPid } from "@/api/modules/processor";
import { getParkDetail, updateIndustrialPark } from "@/api/modules/lndustrialParkManagement"
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();
let { id } = route.query;
const ruleFormRef = ref();
// 加工商数据
let processorData = ref([]);
let address = ref([]);
// 类型列表
const typeList = reactive([
  {
    label: "自有", value: "1"
  },
  // {
  //   label: "加盟", value: "2"
  // }
])

// 状态处理成中文
const statusMap = {
  1: "启用",
  2: "禁用"
}

// 机长看板状态
const boardStatus = {
  "-1": "无关",
  "1": "是",
  "2": "否"
}

var tableHeight = ref()
//设置表格高度，当屏幕高度发生变化时，表格高度随之变化
onMounted(() => {
  tableHeight.value = document.getElementById('getTableHeight').clientHeight
  window.onresize = () => {    //写在mounted中,onresize事件会在页面大小被调整时触发
    return (() => {
      tableHeight.value = document.getElementById('getTableHeight').clientHeight
    })();
  };
});

// 获取编辑信息
async function getEditInfo() {
  let { code, data, message } = await getParkDetail({ id });
  if (code == '000000') {
    processorData.value = data.manufacturers
    formParam.id = data.id
    formParam.principalUid = data.principalUid
    formParam.parkName = data.parkName
    formParam.principalName = data.principalName
    formParam.parkType = data.parkType + ''
    formParam.principalMobile = data.principalMobile
    formParam.provinceId = data.provinceId
    formParam.provinceName = data.provinceName
    formParam.cityId = data.cityId
    formParam.cityName = data.cityName
    formParam.countyId = data.countyId
    formParam.countyName = data.countyName
    formParam.address = data.address
    address.value = [data.provinceId, data.cityId, data.countyId]
  } else {
    ElMessage.error(message)
  }
}

if (id) {
  getEditInfo()
}

// 输入框改变
const inputChange = (value) => {
  // formParam.principalMobile = value.replace(/[^\d]/g, '')  // 限制只能输入数字
}
// 电话号码校验
const validatePhone = (rule, value, callback) => {
  console.log('value', value);
  // 手机号正则
  let phoneReg = /^1[3-9]\d{9}$/;
  if (value == '') {
    callback(new Error('请输入联系电话'))
  } 
  // else if (!phoneReg.test(value)) {
  //   callback(new Error('请输入正确的号码'))
  // } 
  else {
    callback()
  }
}
// 规则
const rules = reactive({
  parkName: { required: true, message: "请输入产业园名称", trigger: "blur" },
  principalName: { required: true, message: "请输入法人", trigger: "blur" },
  parkType: { required: true, message: "请选择类型", trigger: "change" },
  principalMobile: {
    required: true,
    validator: validatePhone,
    trigger: "blur",
  },
});
// 表单参数
let formParam = reactive({
  id: "",
  principalUid: "", // 负责人id
  parkName: "", // 产业园名称
  principalName: "", // 负责人名称
  parkType: "1", // 产业园类型 1:自有 2：加盟
  principalMobile: "", // 负责人电话
  provinceId: "", // 省id
  provinceName: "", // 省名称
  cityId: "", // 市id
  cityName: "", // 市名称
  countyId: "", // 区id
  countyName: "", // 区名称
  address: "", // 	详细地址
})
// 频道事件
const channelEvent = () => {
  let channel = new BroadcastChannel("channel-ProcessorList");
  channel.postMessage({ refreshData: true })
  setTimeout(() => {
    channel.close()
    window.close()
  }, 1000)
}
// 保存
const save = (formEl) => {
  if (!formEl) return;
  formEl.validate(async (valid, fields) => {
    if (valid) {
      let { code, data, message } = await updateIndustrialPark(formParam);
      if (code == '000000') {
        ElMessage.success('保存成功')
        channelEvent()
        // router.replace("/industrialParkManage/industrialParkList")
      } else {
        ElMessage.error(message)
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

// 返回
const back = () => {
  router.replace("/industrialParkManage/industrialParkList")
}

//省市区数据，获取选中的省市区名称数据
const elCascaderRef = ref()
const handleChange = (e) => {
  // console.log(elCascaderRef._rawValue.getCheckedNodes()[0])
  const { pathValues, pathLabels } = elCascaderRef._rawValue.getCheckedNodes()[0];
  console.log('pathValues', pathValues);
  console.log('pathLabels', pathLabels);
  const keys = ['province', 'city', 'county']
  keys.forEach((item, index) => {
    formParam[item + 'Id'] = pathValues[index]
    formParam[item + 'Name'] = pathLabels[index]
  })
  console.log('formParam', formParam);
}
//获取省市区数据
const getRegionList = (pid = -1) => {
  return new Promise((resolve, reject) => {
    getRegionListByPid(pid).then(res => {
      if (res.code != '000000') return ElMessage({
        showClose: true,
        message: res.message || '服务错误',
        type: 'error',
      })
      resolve(res.data)
    }).catch(err => {
      reject([])
    })
  })

}
const cascaderProps = ref({
  lazy: true,
  lazyLoad(node, resolve) {
    const { level } = node
    const { value, label } = node.data
    getRegionList(value || -1).then(res => {
      if (!res || res.length == 0) return resolve(res)
      const nodes = res.map((item) => ({
        value: item.id,
        label: item.regionName,
        leaf: level >= 2,
      }))
      resolve(nodes)
    }).catch(err => {
      resolve([])
    })

  },
})

</script>

<style lang="scss" scoped>
.industrialParkEdit {
  padding: 16px 24px 16px;
  background-color: #F7F7F7;
  height: 100%;
  overflow: hidden;
  width: 100%;
  padding: 16px 0 40px 24px;
  box-sizing: border-box;
  
  .infoContainer {
    width: 100%;
    box-sizing: border-box;
    height: calc(100% - 40px);
    background-color: #F7F7F7;
    overflow: hidden;
    .container {
      width: calc(100% - 24px);
      background-color: #fff;
      padding: 20px 32px 0 32px;
      box-sizing: border-box;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .informationBox {
      width: calc(100% - 18px);
      background-color: #fff;
      box-sizing: border-box;
      .title {
        font-size: 16px;
        color: #333333;
      }

      .infoFormBox {
        margin-top: 20px;
        .fromPublic {
          width: 272px;
          height: 32px;
        }

        .detailAddress {
          margin-top: 12px;

          &:deep(.el-textarea__inner) {
            width: 400px !important;
            height: 80px !important;
            background-color: #ffffff;
            color: #333333;
          }

          &:deep(.el-input__count) {
            width: 60px;
            left: 408px !important;
          }
        }
      }
    }

    .fabricatorsInfoBox {
      flex: 1;
      overflow: hidden; 
      .title {
        font-size: 16px;
        color: #333333;
        height: 48px;
        line-height: 48px;
      }

      .infoTable {
        width: 100%;
        height: calc(100% - 48px);
        overflow: hidden;

        &:deep(.el-table__header) {
          th {
            background-color: #f2f2f2;
            color: #333333;
            font-weight: 400;
          }
        }
      }
    }
    .footer {
      background-color: #fff;
      position: relative;
      height: 72px;
      z-index: 99;

      .submitBox {
        position: absolute;
        left: 50%;
        bottom: 2px;
        transform: translateX(-50%);

        :deep(.el-form-item__content) {
          margin: 0 !important;

          button {
            margin: 0 40px;
          }
        }
      }

    }
  }
}</style>
