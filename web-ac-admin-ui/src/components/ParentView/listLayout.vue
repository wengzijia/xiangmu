<!-- 上下布局的el-card组件，内容通过插槽嵌入 -->
<template>
  <div class="list-layout">
    <!-- 头部表单 -->
    <el-card v-if="props.hideHeader" class="header-card">
      <slot name="header"></slot>
    </el-card>
    <!-- 表格内容 -->
    <el-card class="table-card" id="tableCard">
      <!-- 表格上面的名称等信息 -->
      <div class="table-header">
        <slot name="table-header"></slot>
      </div>
      <!-- 表格 -->
      <div class="table-content">
        <slot name="table-content" :tableHeight="tableHeight"></slot>
      </div>
      <!-- 底部展示 -->
      <slot name="footer">
        <div class="pagination">
          <!-- 左侧自定义 -->
          <slot name="footer-left">
            <div></div>
          </slot>
          <!-- 右侧分页组件 -->
          <slot name="pagination"></slot>
        </div>
      </slot>
    </el-card>
  </div>
</template>

<script setup>
const props= defineProps({
  height: {
    type: Number,
    default: 120,
  },
  hideHeader: {
    type: Boolean,
    default: true
  }
});
import { useTableHeight } from "@/hooks/useTableHeight";
let {tableHeight,setHeight} = useTableHeight("tableCard", props.height);
watch(props,()=>{
  setHeight(props.height)
})
</script>

<style lang="scss" scoped>
$card-margin:16px;
.list-layout {
  height: calc(100vh - 50px);
  min-height: 700px;
  display: flex;
  flex-direction: column;
  // overflow: hidden;
  .el-card {
    margin: $card-margin;
  }
  .header-card {
    :deep(.el-card__body){
      padding: 24px 24px 6px!important;
    }
  
  }
  .table-card {
    margin:0 $card-margin $card-margin;
    height: 100%;
    flex: 1;
    overflow: hidden;
    flex-direction: column;
    display: flex;
    &:deep(.el-card__body) {
      padding: 16px 24px 25px 24px !important;
    }
  }
  .table-header {
    margin-bottom: 16px;
  }
  .table-content {
    flex: 1;
  }
  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
