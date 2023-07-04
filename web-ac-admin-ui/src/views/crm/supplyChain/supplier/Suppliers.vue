<template>
  <div>
    <el-card style="margin: 10px" class="artwork-workbench">
      <div class="top-bar subOrder">
        <el-form inline :model="formData" class="condition">
          <el-form-item label="供应商信息:">
            <el-input style="width: 252px" clearable v-model="formData.supplierInfo" placeholder="请输入供应商编号/名称" />
          </el-form-item>
          <el-form-item label="联系人:">
            <el-input style="width: 252px" clearable v-model="formData.contactsInfo" placeholder="请输入联系人名称/联系电话" />
          </el-form-item>
          <el-form-item label="可合作品类:">
            <div class="selectOption">
              <el-select style="width: 120px" v-model="firstGoodsName" placeholder="包装类型" clearable filterable>
                <el-option v-for="emo in oneCategoryList" :key="emo.data.id" :label="emo.data.name" :value="emo.data.name"
                  @click="oneCategoryClick(emo.children)" />
              </el-select>
              <el-select style="width: 120px" v-model="secondGoodsName" placeholder="盒型" clearable filterable>
                <el-option v-for="e in twoCategoryList" :key="e.data.id" :label="e.data.name" :value="e.data.name"
                  @click="twoCategoryClick(e.children)" />
              </el-select>
              <el-select style="width: 120px" v-model="thirdGoodsName" placeholder="盒型" clearable filterable>
                <el-option v-for="emo in threeCategoryList" :key="emo.data.id" :label="emo.data.name"
                  :value="emo.data.name" @click="threeCategoryClick(emo.data)" />
              </el-select>
            </div>
          </el-form-item>
          <!-- 订单生成时间 -->
          <el-form-item label="录入日期:">
            <el-date-picker style="width: 360px" v-model="entryTime" type="daterange" unlink-panels range-separator="→"
              start-placeholder="开始日期" end-placeholder="结束日期" @change="timeFormat(entryTime)" />
          </el-form-item>
          <el-form-item label="启用状态:">
            <el-select v-model="formData.enabled" class="m-2" style="width: 252px" placeholder="所有状态" clearable>
              <el-option :label="'启用'" :value="true" />
              <el-option :label="'未启用'" :value="false" />
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
        <span>供应商列表</span>
        <div>
          <el-button @click="exportExcel">导出</el-button>
          <el-button @click="showToDialog(1)">新增供应商</el-button>
        </div>
      </div>
      <!-- 订单列表  -->
      <div class="outworkListBox">
        <el-table :data="tabList" style="width: 100%" scrollbar-always-on>
          <el-table-column label="供应商编号" width="208" prop="supplierNumber"></el-table-column>
          <el-table-column label="供应商名称" width="250" prop="supplierName"></el-table-column>
          <el-table-column label="供应商联系人" width="200" prop="contactsName"></el-table-column>
          <el-table-column label="联系电话" width="200">
            <template #default="scope">
              {{
                scope.row.isEye ? scope.row?.allPhone : scope.row.contactsPhone
              }}
              <el-icon class="contactsPhone" v-show="scope.row.isEye" @click="eyesPhone(false, scope.row.id)">
                <View />
              </el-icon>
              <el-icon class="contactsPhone" v-show="!scope.row.isEye" @click="eyesPhone(true, scope.row.id)">
                <Hide />
              </el-icon>
            </template>
          </el-table-column>
          <el-table-column label="合作项" width="230">
            <template #default="scope">
              <div class="cooper cooperItem">
                <span v-for="(e, i) in getStr(scope.row.cooperativeProc, ',')" :key="i">
                  {{ i > 0 ? " 、" : "" }}
                  <DictTag :value="e" :options="crm_cooperativeProc" />
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="可合作品类" width="200">
            <template #default="scope">
              <!-- :content="index > 0 ?'、'+item.categoryName:item.categoryName" -->
              <el-tooltip class="box-item" effect="dark" placement="top">
                <div class="cooper">
                  <span v-for="(item, index) in scope.row.categoryList" :key="item.id">
                    {{ index > 0 ? " 、" : "" }}
                    {{ item.goodsName }}
                  </span>
                </div>
                <template #content>
                  <span v-for="(emo, idx) in scope.row.categoryList" :key="emo.id + 's'">
                    {{ idx > 0 ? "、" : "" }}
                    {{ emo.goodsName }}
                  </span>
                </template>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="录入时间" width="150" prop="entryDate">
          </el-table-column>
          <el-table-column label="启用状态" width="100">
            <template #default="scope">
              <el-switch v-model="scope.row.enabled" @click="changeEnabledFn(scope.row.id, scope.row.enabled)" />
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template #default="scope">
              <el-link type="primary" :underline="false" @click="showToDialog(2, scope.row.id)">编辑</el-link>
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
    <new-suppliers ref="supplierShow" :oneCategoryList="oneCategoryList" @crmSupplierFn="crmSupplierFn"></new-suppliers>
  </div>
</template>

<script setup>
import { getAllVoList } from "@/api/orderManagement/category";
import newSuppliers from "./components/newSuppliers.vue";
import {
  crmSupplier,
  baseCategory,
  supplierDetail,
  crmEnabled,
  exportSupplierList,
} from "@/api/orderManagement/subOrder";
import { formatDates } from "@/utils/index";
import { parseTime } from '@/utils/ruoyi'
import { ElMessage, ElMessageBox } from 'element-plus'
// 获取字典管理--配置的状态
const { proxy } = getCurrentInstance();
const { crm_cooperativeProc } = proxy.useDict("crm_cooperativeProc");
const supplierShow = ref(null);
// // 调用子组件的方法来改变子组件变量的状态
const showToDialog = (order, editId) => {
  supplierShow.value.dialogShow(true, order, editId);
};
const data = reactive({
  tabList: [],
  baseCategoryList: [], //可合作品类
  total: 0,
  isSeach: false,
  entryTime: [
    formatDates(new Date().getTime() - 3600 * 1000 * 24 * 90),
    formatDates(new Date().getTime() + 3600 * 1000 * 24 * 1),
  ],
  oneCategoryList: [],
  twoCategoryList: [],
  threeCategoryList: [],
  firstGoodsName: "",
  secondGoodsName: "",
  thirdGoodsName: "",
  editData: null,
  formData: {
    size: 10, //单页显示多少条数据
    current: 1, //当前页数
    enabled: null, //是否启动
    supplierInfo: "", //供应商信息
    contactsInfo: "", //联系人信息
    goodsId: null, //品类id
    entryStartDate: formatDates(new Date().getTime() - 3600 * 1000 * 24 * 90), //录入日期开始日期
    entryEndDate: formatDates(new Date().getTime() + 3600 * 1000 * 24 * 1), //录入日期结束日期
  },
});
const {
  entryTime,
  formData,
  tabList,
  baseCategoryList,
  total,
  isSeach,
  editData,
  oneCategoryList,
  twoCategoryList,
  threeCategoryList,
  firstGoodsName,
  secondGoodsName,
  thirdGoodsName,
} = toRefs(data);
// 处理字符串的格式
const getStr = (str, cut) => {
  return str.split(cut);
};
// 控制手机号的显示余额隐藏
const eyesPhone = (type, id) => {
  const index = tabList.value.findIndex((e) => e.id == id);
  tabList.value[index].isEye = type;
  supplierDetailFn(id, index);
  // console.log(' tabList.value---', tabList.value)
};

const getAllVoListFn = () => {
  getAllVoList({ status: 1 }).then((res) => {
    oneCategoryList.value = res.data;
    // console.log('getAllVoList-22--777----', oneCategoryList.value)
  });
};
getAllVoListFn();
// 选择品类
const oneCategoryClick = (list) => {
  if (twoCategoryList.value == list) {
    return
  }
  twoCategoryList.value = list;
  secondGoodsName.value = null
  thirdGoodsName.value = null
  formData.value.goodsId = null
};
// 选择品类
const twoCategoryClick = (list) => {
  if (threeCategoryList.value == list) {
    return
  }
  threeCategoryList.value = list;
  thirdGoodsName.value = null
  formData.value.goodsId = null
};
// 选择品类
const threeCategoryClick = (e, index) => {
  formData.value.goodsId = e.goodsId; //品类id
};
function exportExcel() {
	if(!tabList.value?.length){
		ElMessage.error('暂无数据导出')
		return
	}
  formData.value.entryStartDate = entryTime.value[0]; //录入日期开始日期
  formData.value.entryEndDate = entryTime.value[1]; //录入日期结束日期
  exportSupplierList(formData.value, `供应商列表${parseTime(new Date(),'{y}{m}{d}{h}{i}')}.xlsx`);
}
/** *分页查询供应商信息**/
const crmSupplierFn = (type) => {
  if (!formData.value.goodsId) {
    firstGoodsName.value = null
    secondGoodsName.value = null
    thirdGoodsName.value = null
  }
  if (type == 1) {
    // 不能直接使用对像赋值，会是使formData的栈值变化导致触发wacth监听，
    formData.value.size = 10;
    formData.value.current = 1;
    formData.value.enabled = null; //是否启动
    formData.value.supplierInfo = ""; //供应商信息
    formData.value.contactsInfo = ""; //联系人信息
    formData.value.goodsId = null; //品类id
    formData.value.entryStartDate = entryTime.value[0]; //录入日期开始日期
    formData.value.entryEndDate = entryTime.value[1]; //录入日期结束日期
  }
  crmSupplier(formData.value)
    .then((res) => {
      tabList.value = res.data.records;
      total.value = res.data.total;
      tabList.value.map((item) => {
        item.isEye = false;
      });
      // console.log('tabList.value查询订单', tabList.value)
    })
    .catch((err) => {
      console.log("报错-----", err);
    });
};
// // 查询品类
// const baseCategoryFn = () => {
// 	baseCategory().then((res) => {
// 		// console.log('查询品类', res)
// 		baseCategoryList.value = res.data
// 	})
// }
// baseCategoryFn()
// 查询供应商详情数据
const supplierDetailFn = (id, index) => {
  if (!tabList.value[index].allPhone) {
    supplierDetail(id).then((res) => {
      editData.value = res.data;
      tabList.value[index].allPhone = editData.value.contactsPhone;
      // console.log('查询供应商详情数据',editData.value);
    });
  }
};
const changeEnabledFn = (id, enabled) => {
  const parms = {
    enabled: enabled,
    id,
  };
  crmEnabled(parms).then((res) => {
    // console.log('修改供应商启动状态', res)
    if (res.code == 200) {
      crmSupplierFn();
    }
  });
};

/**
 * 处理选着的时间格式
 **/
const timeFormat = (value) => {
  formData.value.entryStartDate = value
    ? formatDates(value[0].getTime())
    : "";
  formData.value.entryEndDate = value ? formatDates(value[1].getTime()) : "";
};
/**
 * 筛选
 */
const search = () => {
  isSeach.value = true;
  crmSupplierFn();
};
/**
 * 重置
 */
const reset = () => {
  entryTime.value = [
    formatDates(new Date().getTime() - 3600 * 1000 * 24 * 90),
    formatDates(new Date().getTime() + 3600 * 1000 * 24 * 1),
  ];
  firstGoodsName.value = "";
  secondGoodsName.value = "";
  thirdGoodsName.value = "";
  formData.value = {
    size: 10, //单页显示多少条数据
    current: 1, //当前页数
    enabled: null, //是否启动
    supplierInfo: "", //供应商信息
    contactsInfo: "", //联系人信息
    goodsId: null, //品类id
    entryStartDate: entryTime.value[0], //录入日期开始日期
    entryEndDate: entryTime.value[1], //录入日期结束日期
  };
};
/**
 * 监听对象数据的变化
 */
watch(
  [() => formData.value.size, () => formData.value.current],
  (val, oval) => {
    crmSupplierFn();
  },
  {
    // immediate: true,
    deep: true, //开启深度监听,能够侦听到对象属性值的变化
  }
);
crmSupplierFn();

/*
 *结束
 */
</script>

<style lang="scss" scoped>
.outworkListBox {
  user-select: none;
}

.cooper {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.cooperItem {
  display: flex;
}

.cooperItem span {
  display: flex;
}

.contactsPhone svg {
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
</style>
<style lang="scss">
.subOrder .el-form-item__label {
  font-weight: 700;
}

.subOrder .el-form--inline .el-form-item {
  margin-right: 28px;
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
