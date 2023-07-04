<template>
  <div>
    
  </div>
</template>

<script>
import YSF from '@neysf/qiyu-web-sdk';
export default {
  created() {
    const _this = this;
    YSF.init('e95a3b738998ec74addc44a5dde79710', {}).then(ysf => {
      ysf('open');
    });
  }
};
</script>

<style></style>
