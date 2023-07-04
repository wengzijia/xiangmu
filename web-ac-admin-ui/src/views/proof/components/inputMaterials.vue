<template>
    <div style="display: inline-block;">
        <el-link
            type="primary"
            :underline="false"
            class="mar_10"
            :disabled="disabled"
            @click="openMaterialsDialog"
            >
            <span>录入用料</span>
        </el-link>
        <el-dialog
          v-model="dialogVisible"
          title="用料明细"
          width="800px"
          destroy-on-close
          append-to-body
          :before-close="handleClose"
        >
            <div>
                <div class="materials-head">
                    <span>单号：{{ material.poSn }}</span>
                    <span>出库时间：{{ material.deliveryTime }}</span>
                    <span>负责人：{{ material.principal }}</span>
                </div>
                <el-table :data="materialsList">
                  <el-table-column label="名称">
                    <template #default="scope">
                        <span v-if="scope.row.state=='view'">{{ scope.row.name }}</span>
                        <el-input v-else v-model="scope.row.name" placeholder="请输入名称" maxlength="10" show-word-limit type="text"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="规格">
                    <template #default="scope">
                        <span v-if="scope.row.state=='view'">{{ scope.row.specification }}</span>
                        <div v-else style="display: flex;">
                            <el-input-number 
                            v-model="scope.row.spec1" 
                            @keydown="clearInput" 
                            :precision="0" 
                            :min="1" 
                            :max="9999" 
                            :controls="false" 
                            placeholder="请输入规格" 
                            style="margin-right: 10px;"></el-input-number>
                            <el-input-number 
                            v-model="scope.row.spec2" 
                            @keydown="clearInput" 
                            :precision="0" 
                            :min="1" 
                            :max="9999" 
                            :controls="false" 
                            placeholder="请输入规格" 
                            style="margin-right: 10px;"></el-input-number>
                        </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="出库数量">
                    <template #default="scope">
                        <span v-if="scope.row.state=='view'">{{ scope.row.outboundQuantity }}</span>
                        <el-input-number 
                            v-else
                            v-model="scope.row.outboundQuantity" 
                            @keydown="clearInput" 
                            :precision="0" 
                            :min="1" 
                            :max="99" 
                            :controls="false" 
                            placeholder="请输入出库数量" 
                            style="margin-right: 10px;"></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="110px">
                    <template #default="scope">
                        <span v-if="scope.row.state=='view'">
                            <el-link type="primary" :underline="false" class="mar_10" @click="change(scope.$index)">修改</el-link>
                            <el-popconfirm v-if="materialsList.length>1&&materialsList[materialsList.length-1].state!='add'" title="确定删除该行?" confirm-button-text="确认" cancel-button-text="取消" confirm-button-type="danger" @confirm="del(scope.$index)">
                                <template #reference>
                                    <el-link type="primary" :underline="false" class="mar_10">删除</el-link>
                                </template>
                            </el-popconfirm>
                        </span>
                        <span v-else>
                            <el-link type="primary" :underline="false" class="mar_10" @click="save(scope.$index)">保存</el-link>
                            <el-link type="primary" :underline="false" class="mar_10" @click="cancel(scope.$index)">取消</el-link>
                        </span>
                    </template>
                  </el-table-column>
                </el-table>
                <div style="text-align: center;margin-top: 10px;">
                    <el-button v-if="!materialsList.length||materialsList[materialsList.length-1]?.state!='add'" type="primary" @click="add">新增用料</el-button>
                </div>
            </div>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogCancel">取消</el-button>
              <el-button type="primary" @click="dialogConfirm">
                确认
              </el-button>
            </span>
          </template>
        </el-dialog>
    </div>
</template>
<script setup>
import {getMaterials,inputMaterials} from "@/api/proofDigital/index";
import { ElMessage } from "element-plus";
const emit = defineEmits()
const props = defineProps({
  activityId:{
    type:String,
    default:''
  },
  disabled:{
    type:Boolean,
    default:true
  }
})
const { activityId } = toRefs(props)
const data = reactive({
    material:{},
})
const { material } = toRefs(data)
const materialsList = ref([])
const dialogVisible = ref(false)


//打开弹窗
function openMaterialsDialog(){
  dialogVisible.value = true
getMaterialDetails()
}
//根据activityId获取用料明细
function getMaterialDetails(){
    if (!activityId.value) {
        return
    }
    getMaterials(activityId.value).then(res=>{
        if (res.code==200) {
            material.value = res.data.data
            materialsList.value = res.data.data.materials.map(item=>{
                return {...item,state:'view'}
            })
        }
    })
}
//修改用料
function change(index){
    let oldData = {...materialsList.value[index]}
    materialsList.value[index].oldData = oldData
    let spec = materialsList.value[index].specification.split('*')
    materialsList.value[index].spec2 = Number(spec[1])
    materialsList.value[index].spec1 = Number(spec[0])
    materialsList.value[index].state = 'edit'
}
//保存用料
function save(index){
    if (!materialsList.value[index].name||!materialsList.value[index].spec1||!materialsList.value[index].spec2||!materialsList.value[index].outboundQuantity) {
        ElMessage.error('请填写完全部信息')
        return
    }
    materialsList.value[index].specification = materialsList.value[index].spec1+'*'+materialsList.value[index].spec2
    delete materialsList.value[index].spec1
    delete materialsList.value[index].spec2
    materialsList.value[index].state = 'view'
}
//删除用料
function del(index){
    materialsList.value.splice(index,1)
}
//取消编辑
function cancel(index){
    if (materialsList.value[index].state == 'edit') {
        const oldData = {...materialsList.value[index].oldData}
        materialsList.value[index] = {...oldData}
        materialsList.value[index].state = 'view'
    }else{
        del(index)
    }
}
//新增用料
function add(){
    materialsList.value.push({
        name:null,
        spec1:889,
        spec2:1194,
        specification:'',
        state:'add',
        outboundQuantity:null
    })
}
//弹窗确认
function dialogConfirm(){
    checkList().then(()=>{
        let params = {...material.value,materials:materialsList.value}
        inputMaterials(params).then(res=>{
            if (res.data.code==200) {
                ElMessage.success('录入成功！')
                dialogVisible.value = false
                emit('callBack')
            }else{
                ElMessage.error(res.data.msg)
            }
        })
    })
}
//弹窗取消
function dialogCancel(){
    checkList().then(()=>{
        dialogVisible.value = false
    })
}
//dialog关闭前检查是否全部已经保存
const handleClose = (done=>{
    checkList().then(()=>{
        done()
    })
})
//检查是否有未保存的
function checkList(){
    return new Promise((resolve, reject) => {
        if (materialsList.value.find(item=>{return item.state!='view'})) {
            ElMessage.error('有未保存的用料!')
            reject()
        }else{
            resolve()
        }
    })
}
</script>
<style lang="scss" scoped>
.materials-head{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    margin-bottom: 10px;
}
.mar_10 {
  margin-right: 10px;
}
</style>