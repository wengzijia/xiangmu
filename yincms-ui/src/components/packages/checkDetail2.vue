<template>
  <div>
    <!-- <el-dialog class="lookes" :title="dialogTitle" :visible.sync="dialogVisible1" :before-close="handleCloseFn" width="700px"> -->
    <div class="dialogs">
      <div class="details" v-for="(key, index) in detailsList" :key="index" v-show="key.length > 1">
        <div v-if="startWith(key[0], '|#|')" style="background: #eeeeee;padding: 13px;">
          <span v-if="key[0] != ''" class="dts"> {{ replaceAll(key[0], '|#|', '') }}:</span>
          <!-- <span v-if="key[0] != ''" class="dts"> {{ key[0] }}:</span> -->
          <span v-if="key[0] != ''">{{ key[0] == '成品尺寸' || key[0] == '展开尺寸' ? replaceAll(key[1], '_', ' x ') + 'mm' : key[1] }}</span>
        </div>
        <div v-else style="margin-left: 50px;">
          <span v-if="key[0] != '' && key.length > 1" class="dts"> {{ key[0] }}:</span>
          <span v-if="key[0] != ''">{{ key[0] == '成品尺寸' || key[0] == '展开尺寸' ? replaceAll(key[1], '_', ' x ') + 'mm' : key[1] }}</span>
        </div>
      </div>
    </div>
    <!-- </el-dialog> -->
  </div>
</template>

<script>
import { replaceAll } from '@/utils/objectUtil';
import { startWith } from '@/utils/strUtil';

export default {
  name: 'checkDetail',
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
  font-size: 14px;
}
.details .dialogs {
  width: 70%;
  margin: auto;
}
.details .dts {
  display: inline-block;
  // width: 100px;
  text-align: right;
  padding-right: 10px;
  color: #555;
}
</style>
