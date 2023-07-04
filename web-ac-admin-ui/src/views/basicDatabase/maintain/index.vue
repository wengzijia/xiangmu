<template>
  <div class="maintain">
    <el-card style="margin: 10px">
      <div>
        <div>基础信息库维护</div>
        <el-tabs v-model="tableIndex" class="demo-tabs" @tab-change="tableIndexChange">
          <el-tab-pane v-for="(item,index) in basic_database" :key="item.value" :label="item.label" :name="index+''">
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 表格组件 -->
      <component v-if="tableListShow" :is="tableList[tableIndex]" :currentPage="currentPage" :pageSize="pageSize" @setTotal="setTotal"
        @showDrawer="showDrawer" @ChangeOption="currentPage=1"></component>
      <div class="pages" style="position: relative;">
        <pagination background layout="total, sizes, prev, pager, next, jumper" v-model:page="currentPage"
          @pagination="handleSizeChange" :total="total" v-model:limit="pageSize" :pageSizes="[20, 30, 50, 100]" />
      </div>
    </el-card>
    <el-drawer destroy-on-close v-model="drawer" direction="rtl" :title="drawerTitle" :before-close="handleClose" size="660px">
      <el-scrollbar>
        <!-- 弹窗抽屉组件 -->
        <div style="padding-right:15px;">
          <component :is="dialogList[tableIndex]" :drawerType="drawerType" :drawerData="drawerData"
            @closeDrawer="closeDrawer"></component>
        </div>
      </el-scrollbar>
    </el-drawer>
  </div>
</template>

<script setup>
import { defineAsyncComponent, computed, watch, reactive, toRefs, nextTick } from 'vue'
import checkAppNewVersion from '@/utils/checkAppNewVersion.js'
import { ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router';
const { proxy } = getCurrentInstance();
const { basic_database } = proxy.useDict("basic_database");
const router = useRouter()
const route = useRoute()
//动态加载表格组件
const tableList = computed(() => {
  checkAppNewVersion()
  return basic_database.value.map(m => {
    return defineAsyncComponent(() => import(`./components/${m.value}/table.vue`))
  })
})
//动态加载弹窗组件
const dialogList = computed(() => {
  checkAppNewVersion()
  return basic_database.value.map(m => {
    return defineAsyncComponent(() => import(`./components/${m.value}/dialog.vue`))
  })
})
//select绑定的值
var tableIndex = ref('0')
function tableIndexChange() {
  currentPage.value = 1;
  pageSize.value = 20;
  router.replace({
    path: '/basicDatabase/maintain',
    query: {
      tabs: tableIndex.value
    }
  })
}
if (route.query.tabs) {
  tableIndex.value = route.query.tabs || '0'
}
//弹窗
var drawer = ref(false)
var drawerTitle = ref('新建材质')
const data = reactive({
  drawerData: {}
})
const { drawerData } = toRefs(data)
var drawerType = ref('add')
function showDrawer({ data, type }) {
  let tableName = basic_database.value.map(m => {
    return m.label
  })
  drawerType.value = type
  switch (type) {
    case 'edit'://编辑
      drawerTitle.value = '编辑' + tableName[tableIndex.value].replace('表', '').replace('信息', '')
      break;
    case 'view'://查看更多
      drawerTitle.value = tableName[tableIndex.value].replace('表', '').replace('信息', '') + '详情'
      break;
    case 'add':
      drawerTitle.value = '添加' + tableName[tableIndex.value].replace('表', '').replace('信息', '')
      break;
    case 'copy'://复制
      drawerTitle.value = '新建' + tableName[tableIndex.value].replace('表', '').replace('信息', '')
      break;
    case 'subedit'://规格管理
      drawerTitle.value = '规格管理'
      break;
    default:
      break;
  }
  drawer.value = true
  drawerData.value = data
}
let tableListShow = ref(true)
function closeDrawer() {
  drawer.value = false
  tableListShow.value = false
  nextTick(()=>{
    tableListShow.value = true
  })
}
//关闭dialog前的回调
const handleClose = (done) => {
  ElMessageBox.confirm('确认关闭弹窗?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
var currentPage = ref(1)
var pageSize = ref(20)
var total = ref(0)
function handleSizeChange(val) {
  // getList()
}
const setTotal = (val) => {
  total.value = Number(val)
}
</script>

<style lang="scss" scoped>
:deep(.el-drawer__body) {
  padding-right: 2px;
  padding-top: 0px;
}

:deep(.el-drawer__header) {
  margin-bottom: 10px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--el-border-color);
}
.el-form-item--default .el-form-item__label {

    font-weight: 700;
}
</style>