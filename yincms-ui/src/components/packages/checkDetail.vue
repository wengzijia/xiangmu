<template>
  <div>
    <el-dialog class="lookes" :title="dialogTitle" :visible.sync="dialogVisible1" :before-close="handleCloseFn" width="700px">
      <check-detail-2 v-if="detailsList.length > 0" :detailsList="detailsList"></check-detail-2>
    </el-dialog>
  </div>
</template>

<script>
import { replaceAll } from '@/utils/objectUtil';
import { startWith } from '@/utils/strUtil';
import checkDetail2 from './checkDetail2.vue';
export default {
  name: 'checkDetail',
  components: { checkDetail2 },
  props: {
    dialogTitle: String,
    dialogVisible1: {
      type: Boolean,
      default: false
      // required: true
    },
    detailsList: Array
  },
  methods: {
    ...{ replaceAll, startWith },
    handleCloseFn() {
      this.$emit('handleClose1');
    }
  }
};
</script>

<style lang="scss" scoped>
.lookes .el-dialog__body {
  padding: 30px 0px;
}
.details {
  margin: 10px 0;
  color: #101010;
  font-size: 13px;
}
.details .dialogs {
  width: 70%;
  margin: auto;
}
.details .dts {
  display: inline-block;
  /* width: 100px; */
  text-align: right;
  padding-right: 6px;
  color: #555;
}
</style>
