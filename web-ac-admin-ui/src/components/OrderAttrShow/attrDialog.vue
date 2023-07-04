<template>
    <el-dialog v-model="isAttrShow" title="参数详情" width="1100px" append-to-body>
      <el-tabs v-if="hardboundBox" v-model="activeName">
        <el-tab-pane label="参数显示美化" name="hardboundBox"></el-tab-pane>
        <el-tab-pane label="原参数" name="Box"></el-tab-pane>
      </el-tabs>
      <el-scrollbar :style="'margin-right: 20px;height:'+height+'px;'">
        <div v-show="activeName=='Box'" style="line-height: 2;">{{ attr }}</div>
        <div v-show="activeName=='hardboundBox'">
          <!-- <div class="product">{{beautifyData.productAttr}}</div> -->
          <!-- <div class="product" style="margin:12px 0;">{{productSize}}</div> -->
          <div style="border:4px solid #E4E5EB;margin-top: 20px;">
            <!-- <h3 class="tabtitle" style="margin: 10px 0 -5px 25px;">
              主体品类：{{ pname }}
            </h3> -->
            <div class="divsn2" v-if="productSize" style="padding: 10px;">
              <span class="span" style="width:77px;">成品外尺寸:</span>{{productSize.replace('成品外尺寸:','')}}
            </div>
          </div>
          <div v-if="partList?.length" class="tabborder">
            <h3 class="tabtitle">零部件信息</h3>
            <el-table
              :data="partList"
              :span-method="objectSpanMethod"
              :border="true"
              style="width: 100%; margin-top: 2px"
            >
              <el-table-column prop="poNo" label="零件子PO号" />
              <el-table-column prop="name" label="零件名称"  width="120" />
              <el-table-column prop="properties" label="零件工艺参数" >
                <template #default="scope">
                  <div style="white-space:pre;word-break: ;">{{ scope.row.properties }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="modulesAttr" label="其他工艺参数" width="">
                <template #default="scope">
                  <div style="white-space:pre;">{{ scope.row.modulesAttr }}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-if="accessoryList.length" class="tabborder" style="margin-top: 20px;">
            <h3 class="tabtitle">配件信息</h3>
            <el-table
              :data="accessoryList"
              :border="true"
              style="width: 100%; margin-top: 2px"
            >
              <el-table-column prop="poNo" label="配件子PO号" />
              <el-table-column prop="name" label="配件名称"  width="120" />
              <el-table-column prop="properties" label="配件工艺参数" >
                <template #default="scope">
                  <div style="white-space:pre;word-break: ;">{{ scope.row.properties }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="modulesAttr" label="其他工艺参数" width="">
                <template #default="scope">
                  <div style="white-space:pre;">{{ scope.row.modulesAttr }}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-if="suiteList.length" class="tabborder" style="margin-top: 20px;">
            <h3 class="tabtitle">套件信息</h3>
            <el-table
              :data="suiteList"
              :border="true"
              style="width: 100%; margin-top: 2px"
            >
              <el-table-column prop="poNo" label="套件子PO号" />
              <el-table-column prop="name" label="套件名称"  width="120" />
              <el-table-column prop="properties" label="套件工艺参数" >
                <template #default="scope">
                  <div style="white-space:pre;word-break: ;">{{ scope.row.properties }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="modulesAttr" label="其他工艺参数" width="">
                <template #default="scope">
                  <div style="white-space:pre;">{{ scope.row.modulesAttr }}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-if="packagingPlan.length" style="margin-top: 20px;">
            <div>打包方案</div>
            <el-table
              :data="packagingPlan"
              :border="true"
              style="width: 100%; margin-top: 2px"
            >
              <el-table-column prop="poNo" label="子PO号" />
              <el-table-column prop="name" label="名称"  width="120" />
              <el-table-column prop="properties" label="工艺参数" >
                <template #default="scope">
                  <div style="white-space:pre;word-break: ;">{{ scope.row.properties }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="modulesAttr" label="其他工艺参数" width="">
                <template #default="scope">
                  <div style="white-space:pre;">{{ scope.row.modulesAttr }}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-scrollbar>
      <template #footer>
        <span>
          <el-button type="primary" @click="isAttrShow = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
</template>

<script setup>
const props = defineProps({
    //table上面展示尺寸
    productSize:{
        type:String,
        default:''
    },
    //是否精装盒
    hardboundBox:{
        type:Boolean,
        default:false
    },
    //列表信息
    arr:{
        type:Array,
        default:[]
    },
    
    height: {
        type: Number,
        default:450
    },
    attr:{
        type:String,
        default:''
    },
    activeName:{
        type:String,
        default:''
    },
    pname:{
      type:String,
      default:''
    }
})
const {arr} = toRefs(props)
const partList = ref([])//零件列表
const accessoryList = ref([])//配件列表
const suiteList = ref([])//套件列表
const packagingPlan = ref([])//打包方案
const isAttrShow = ref(true)
const emit = defineEmits()
watch(isAttrShow,val=>{
    if (!val) {
        emit('closeDialog')
    }
})

const part = ['面料','芯板','内衬']

if (arr.value.length) {
  setAllList()
}
watch(arr,val=>{
  if (val.length) {
    setAllList()
  }
})

function setAllList(){
  arr.value.forEach((item)=>{
    if (item.modulesName.indexOf('打包')!=-1) {
      packagingPlan.value.push(item)
    }else if (item.modulesName.indexOf('整体配件')!=-1) {
      suiteList.value.push(item)
    }else if(part.includes(item.name)){
      item.name = item.modulesName+item.name
      partList.value.push(item)
    }else{
      accessoryList.value.push(item)
    }
  })
}

const objectSpanMethod = ({
  row,
  column,
  rowIndex,
  columnIndex,
}) => {
   if (columnIndex === 3) {
    if(arr.value[rowIndex].isRow){
      let rowNum = arr.value[rowIndex].rowNum
      if(rowNum){
        return  {
          rowspan: rowNum,
          colspan: 1,
        }
      }else{
        return  {
          rowspan: 0,
          colspan: 0,
        }
      }
    }
  }
}

</script>

<style lang="scss" scoped>

</style>