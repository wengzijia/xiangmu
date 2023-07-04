<template>
  <div v-if="goodsSizeInfo.name" style="display: flex;height: 34px;line-height: 34px;font-size: 14px;color: #606266;margin-bottom:10px">
    <div style="width:130px;text-align: right;padding: 0 12px 0 0;box-sizing: border-box;">
      {{ goodsSizeInfo.name }}
    </div>
    <div>
      <span style="color: #3A3A3A;"> {{ goodsSizeInfo.value }}</span>
      <span style="margin-left: 30px;" v-if="goodsSizeInfo.name != '展开尺寸'">(展开尺寸：{{ goodsSizeInfo.goodSize.goodAl }}X{{ goodsSizeInfo.goodSize.goodAw }}mm)</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    goodsSizeInfo: Object
  }
};
</script>

<style></style>
