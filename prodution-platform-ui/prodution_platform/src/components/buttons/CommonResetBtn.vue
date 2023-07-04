<template>
  <div class="reset_btn">
    <el-button class="reset_button"><el-icon :size="16">
        <Refresh />
      </el-icon>重置</el-button>
  </div>
</template>

<script name="CommonResetBtn" setup></script>

<style lang="scss" scoped>
.reset_btn {
  button {
    .el-icon {
      margin-right: 6px;
    }
  }
}
</style>
