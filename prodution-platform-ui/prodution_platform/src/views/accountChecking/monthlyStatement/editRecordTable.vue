<template>
  <div class="layout">
    <div class="content_box">
      <div class="title">修改记录</div>
      <div class="table_box" id="getTableHeight">
        <el-table :data="recordList" border height="100%" style="width: 100%">
          <el-table-column prop="createTime" label="时间" width="180px" align="center">
            <template #default="scope">
              <div style="color: #333333;">{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}') }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="修改人" width="180px" align="center">
            <template #default="scope">
              <div style="color: #333333;">{{ scope.row.userName }}{{
                 (scope.row.roleId != 32 && scope.row.orgCode != 'manufacturer') ?
                  (scope.row.roleName && '-' + scope.row.roleName) : (scope.row.manufacturerName && '-' + scope.row.manufacturerName) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="modifyContent" label="修改内容" align="center">
            <template #default="scope">
              <div v-for="item in scope.row.modifyContent" :key="item">
                {{ item }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="modifyAmount" :label="businessType == 2 ? '应付金额' : '总金额'" width="180px" align="center">
          </el-table-column>
          <el-table-column prop="remark" label="备注" align="center">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <pageIndex @dropDownValueChange="fruitValueChange" v-if="recordList.length" :pageNumber="pageNumber"
        :pageSize="pageData.pageSize" :totalCount="pageData.totalCount" />
    </div>
  </div>
</template>
  
<script name="editRecordTable" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { parseTime } from "@/utils/util"
import { getOperatePage } from "@/api/modules/accountChecking"
import pageIndex from "@/layout/commonLayout/pageIndex.vue";
const route = useRoute();
let { id, businessType } = route.query;
// 列表参数
let listParam = reactive({
  businessId: id, // 账单详情表id
  businessType, // 业务类型：1表示账单 2表示结款单
  language: "zh-cn",
  pageNumber: 1, // 当前页
  pageSize: 15 // 显示条数
})
let pageNumber = ref(1)
let pageData = reactive({
  pageSize: 15,
  pageSizeArr: [15, 30, 50, 100],
  totalCount: 0
})

// 历史版本数据
let recordList = ref([])


// 获取历史版本数据
async function getHistoryVersions() {
  let { code, data, message } = await getOperatePage(listParam);
  if (code == '000000') {
    recordList.value = data.items.map(e => {
      e.modifyContent = e.modifyContent?.split(';')
      return e
    })
    pageData.totalCount = data.totalCount
    pageNumber.value = data.pageNumber
    pageData.pageSize = data.pageSize
  } else {
    ElMessage.error(message)
  }
}
getHistoryVersions()

//分页模块改变的值
const fruitValueChange = (val) => {
  listParam.pageNumber = val.pageNumber
  listParam.pageSize = val.pageSize
  getHistoryVersions()
}

</script>
  
<style lang="scss" scoped>
.layout {
  height: 100%;
  overflow: hidden;
  padding: 16px 24px 24px 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .content_box {
    padding: 20px 40px 100px 40px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 4px;
    position: relative;
    flex: 1;
    overflow: hidden;

    .title {
      color: #333333;
      font-weight: 700;
    }

    .table_box {
      width: 100%;
      height: 100%;
      overflow: hidden;
      margin-top: 16px;

      &:deep(.el-table__header) {
        th {
          background-color: #f2f2f2;
          color: #333333;
        }
      }

      .look {
        color: var(--vt-c-theme-colors);
        background-color: transparent;
        border-color: var(--vt-c-theme-colors);
        width: 44px;
        height: 25px;

        &:hover {
          opacity: 0.5;
        }
      }

    }
  }


  .footer {
    position: fixed;
    right: 56px;
    bottom: 40px;
  }
}
</style>