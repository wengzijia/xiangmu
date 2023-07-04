<template>
  <div class="is-align-center">
    <el-link :underline="false" @click="isAttrShow = true">
      <div :class="lineFeed ? '' : 'overflow-tooltip'"
        :style="lineFeed ? 'white-space:pre-wrap;' : '-webkit-line-clamp:' + line + ';'"
        v-if="route.name != 'StructureWorkbench' && route.name != 'PrepressWorkbench'">{{ addLineFeed(attr) }}</div>
      <div v-else :style="lineFeed ? 'white-space:pre-wrap;' : ''">
        {{ addLineFeed(attr) }}
      </div>
    </el-link>
    <attrDialog v-if="isAttrShow" :productSize="beautifyData.productSize" :arr="arr" :height="height" :attr="attr"
      :activeName="activeName" @closeDialog="isAttrShow = false" :hardboundBox="hardboundBox"></attrDialog>
  </div>
</template>

<script setup>
import { getParsingAttributes } from '@/api/prepress';
import { reactive, toRefs, watch } from 'vue';
import attrDialog from './attrDialog.vue';


const prop = defineProps({
  attr: {
    type: String,
    default: '',
  },
  line: {
    type: Number,
    default: 6
  },
  height: {
    type: Number,
    default: 450
  },
  activityId: {
    type: String,
    default: ''
  },
  lineFeed: {
    type: Boolean,
    default: false
  }
})
const { attr, line, height, activityId, lineFeed } = toRefs(prop)
const isAttrShow = ref(false)
const hardboundBox = ref(false)//是否精装盒
const activeName = ref('Box')
const data = reactive({
  beautifyData: {}
})
const arr = ref([])
const { beautifyData } = toRefs(data)
watch(isAttrShow, (val) => {
  if (val && activityId.value) {
    getAttr(activityId.value)
  }
})
const route = useRoute()

function getAttr(activityId) {
  getParsingAttributes(activityId).then(res => {
    if (res.code == 200) {
      if (res.data.modules && res.data.modules.length > 0) {
        let array = []
        activeName.value = 'hardboundBox'
        hardboundBox.value = true
        beautifyData.value = res.data
        res.data.modules.map(item => {
          let len = item.components.length
          item.components.map((a, i) => {
            array.push({
              ...a,
              rowNum: i == 0 && len > 1 ? len : 0,//合并的行数等同于数组长度
              isRow: len > 1,//判断这组数据是否是合并的数据
              modulesName: item.name,
              modulesAttr: textWrap(item.attr),
              properties: textWrap(a.properties)
            })
          })
        })
        arr.value = array
      } else {
        activeName.value = 'Box'
        hardboundBox.value = false
      }
    }
  })
}
function textWrap(text) {
  return text.replace(/;/g, ';\n')
}
const objectSpanMethod = ({
  row,
  column,
  rowIndex,
  columnIndex,
}) => {
  if (columnIndex === 0 || columnIndex === 1) {
    if (arr.value[rowIndex].isRow) {
      let rowNum = arr.value[rowIndex].rowNum
      if (rowNum) {
        return {
          rowspan: rowNum,
          colspan: 1,
        }
      } else {
        return {
          rowspan: 0,
          colspan: 0,
        }
      }
    }
  }
}
function addLineFeed(str) {
  let newStr = ''
  if (lineFeed.value) {
    newStr = str.replace(/;/g, '\n')
  } else {
    newStr = str
  }
  return newStr
}
</script>

<style lang="scss">
.is-align-center {
  .el-overlay-dialog {
    display: flex;

    .el-dialog {
      margin: auto;
    }
  }
}

.el-dialog__body {
  padding-top: 4px;
}
</style>
<style  lang="scss" scoped>
.overflow-tooltip {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
}

:deep(.el-popper) {
  max-width: 3400px;
  word-break: break-all;
}

:deep(.el-dialog__body) {
  padding-top: 4px;
}

.product {
  font-weight: bold;
  line-height: 2;
}</style>