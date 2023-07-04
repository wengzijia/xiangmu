<template>
  <div class="query_btn">
    <el-button type="primary" class="search_button"><el-icon :size="16">
        <Search />
      </el-icon>查询</el-button>

  </div>
</template>

<script name="CommonQueryBtn" setup>
</script>

<style lang="scss" scoped>
.query_btn {
  button {
    .el-icon {
      margin-right: 6px;
    }
  }
}
</style>
