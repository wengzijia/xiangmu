<template>
  <div class="is-align-center">
    <el-link :underline="false" @click="isAttrShow = true">

      <div v-if="route.name != 'StructureWorkbench' && route.name != 'PrepressWorkbench'"
        :class="lineFeed ? '' : 'overflow-tooltip'" :style="lineFeed ? 'white-space:pre-wrap;' : '-webkit-line-clamp:' + line + ';'">
        {{ addLineFeed(attr) }}
      </div>
      <div v-else :style="lineFeed ? 'white-space:pre-wrap;' : ''">
        {{ addLineFeed(attr) }}
      </div>
    </el-link>
    <attrDialog v-if="isAttrShow" :pname="pname" :productSize="beautifyData.productSize" :arr="arr" :height="height" :attr="attr"
      :activeName="activeName" @closeDialog="closefn" :hardboundBox="hardboundBox"></attrDialog>
  </div>
</template>

<script setup>
import { parsingAttributes } from "@/api/outworkManage/outworkDetail";
import { strParsingAttributes } from "@/api/structural/structuralList";
import { delParsingAttributes } from "@/api/deliver/index";
import { craParsingAttributes } from '@/api/craftCheck';
import { getParsingAttributes } from '@/api/proofWorkorder/index'
import attrDialog from './attrDialog.vue';
const prop = defineProps({
  attr: {
    type: String,
    default: "",
  },
  line: {
    type: Number,
    default: 6,
  },
  height: {
    type: Number,
    default: 450,
  },
  activityId: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "",
  },
  lineFeed: {
    type: Boolean,
    default: false
  },
  pname:{
    type:String,
    default:''
  }
});
const { attr, line, height, activityId, type, lineFeed } = toRefs(prop);
const isAttrShow = ref(false);
const hardboundBox = ref(false); //是否精装盒
const activeName = ref("Box");
const InterfaceName = ref("")//接口名称
const route = useRoute()
const data = reactive({
  beautifyData: {},
});
const arr = ref([]);
const { beautifyData } = toRefs(data);
watch(isAttrShow, (val) => {
  if (val && activityId.value) {
    getAttr(activityId.value);
  }
});


function getAttr(activityId) {
  switch (type.value) {
    case "artwork":
      InterfaceName.value = parsingAttributes
      break;
    case "structure":
      InterfaceName.value = strParsingAttributes
      break;
    case "proofDeliver":
      InterfaceName.value = delParsingAttributes
      break;
    case "processAudit":
      InterfaceName.value = craParsingAttributes
      break;
    case "proofWorkorder":
      InterfaceName.value = getParsingAttributes
      break;
    default:
      return
      break;
  }
  InterfaceName.value(activityId).then((res) => {
    if (res.code == 200) {
      if (res.data.modules && res.data.modules.length > 0) {
        let array = [];
        activeName.value = "hardboundBox";
        hardboundBox.value = true;
        beautifyData.value = res.data;
        res.data.modules.map((item) => {
          let len = item.components.length;
          item.components.map((a, i) => {
            array.push({
              ...a,
              rowNum: i == 0 && len > 1 ? len : 0, //合并的行数等同于数组长度
              isRow: len > 1, //判断这组数据是否是合并的数据
              modulesName: item.name,
              modulesAttr: textWrap(item.attr),
              properties: textWrap(a.properties)
            });
          });
        });
        arr.value = array;
      } else {
        activeName.value = "Box";
        hardboundBox.value = false;
      }
    }
  });

}

function textWrap(text) {
  return text.replace(/;/g, ';\n')
}
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (columnIndex === 0 || columnIndex === 1) {
    if (arr.value[rowIndex].isRow) {
      let rowNum = arr.value[rowIndex].rowNum;
      if (rowNum) {
        return {
          rowspan: rowNum,
          colspan: 1,
        };
      } else {
        return {
          rowspan: 0,
          colspan: 0,
        };
      }
    }
  }
};
function closefn(){
  isAttrShow.value = false
  arr.value =[];
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
<style lang="scss" scoped>
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
