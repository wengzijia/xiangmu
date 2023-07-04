<template>
  <div class="relation-main">
    <el-card class="box-card">
      <div style="display: flex;justify-content:space-between;margin-bottom: 10px;">
        <div style="font-weight: 700;flex:1;"> 已关联品类属性</div>
        <div style="display: flex;">
         
          <el-button @click="dowJSON" type="primary">导出数据文件</el-button>
          <el-button @click="editAttr({})" type="primary">新增关联属性</el-button>
          <el-upload
            class="upload-demo"
            style="display:inline-block;margin-left: 12px;"
            action=""
            :auto-upload='false'
            :on-change="fileListChange"
            :show-file-list="false"
          >
            <el-button type="primary">导入文件更新数据</el-button>
          </el-upload>
        </div>
      
      </div>
      <div v-if="fileAddInfo.dataList.length>0" >
      <el-table :data="[fileAddInfo.dataList[fileAddInfo.current-1]]" style="width: 100%;margin-bottom: 20px;" border>
      
        <el-table-column prop="cartPathValues" label="盒型/属性" width="350px">
          <template #default="scope">
            <template v-for="item in bindType" :key="item.value">
              <div v-if="item.value === scope.row.bindType">下单类型：<span class="attr-key">{{ item.label }}</span ></div>
            </template>
            <template v-for="item in dataType" :key="item.value">
              <div v-if="item.value === scope.row.type">属性类型：<span class="attr-key">{{ item.label }}</span ></div>
            </template>
            <span>
              盒型ID：<span class="attr-key">{{ scope.row.cartPathValues }}</span > <br />
              盒型名称：<span class="attr-key">{{ scope.row.cartPathLabels }}</span >
              
            </span>
            <span> <br />
              属性ID：<span class="attr-key">{{ scope.row.attrPathValues }} </span ><br />
              名称：<span class="attr-key">{{ scope.row.attrPathLabels }}</span >
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="cartPathValues" label="属性选择" width="350px">
          <template #default="scope">
          
          </template>
        </el-table-column> -->
        <el-table-column label="绑定的keys" width="250px">
          <template #default="scope">
            <div v-for="item in scope.row.typeKeys" :key="item.key">
              属性：<span class="attr-key">{{ item.key }}</span
              ><br />替换值：<span class="attr-value">{{ item.value }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="关联信息">
          <template #default="scope">
            <div v-for="item in scope.row.attrKeys" :key="item.key">
              属性：<span class="attr-key">{{ item.key }}</span
              ><br />替换值：<span class="attr-value">{{ item.value }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <!-- <el-popconfirm title="你确定删除吗？" @confirm='delAttr(scope.row)'>
              <template #reference>
                <el-button type="danger" >删除</el-button>
              </template>
            </el-popconfirm> -->
            <el-select v-model="fileAddInfo.newAttr">
              <el-option
                v-for="item in fileAddInfo.newAttrList"
                :key="item.id"
                :label="item.label+'('+item.id+')'"
                :value="item.id"
              />
            </el-select>
            <el-button type="primary" @click="saveAttr(scope.row)">保存</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:right;">
        {{fileAddInfo.current}}/{{fileAddInfo.dataList.length}} <el-button type="primary" @click="currentChange(-1)">上一条</el-button>
            <el-button type="primary" @click="currentChange(1)">下一条</el-button>
      </div>
      </div>

      
      <el-table :data="tableDataList" style="width: 100%" border>
        <!-- <el-table-column label="下单类型" width="100">
          <template #default="scope">
            <template v-for="item in bindType" :key="item.value">
              <span v-if="item.value === scope.row.bindType">{{ item.label }}</span>
            </template>
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="类型" width="120">
          <template #default="scope">
            <template v-for="item in bindType" :key="item.value">
              <span v-if="item.value === scope.row.bindType">{{ item.label }}</span>
            </template>
            <template v-for="item in dataType" :key="item.value">
              <span v-if="item.value === scope.row.type">{{ item.label }}</span>
            </template>
          </template>
        </el-table-column> -->
        <el-table-column prop="cartPathValues" label="盒型/属性" width="350px">
          <template #default="scope">
            <template v-for="item in bindType" :key="item.value">
              <div v-if="item.value === scope.row.bindType">下单类型：<span class="attr-key">{{ item.label }}</span ></div>
            </template>
            <template v-for="item in dataType" :key="item.value">
              <div v-if="item.value === scope.row.type">属性类型：<span class="attr-key">{{ item.label }}</span ></div>
            </template>
            <span>
              盒型ID：<span class="attr-key">{{ scope.row.cartPathValues }}</span > <br />
              盒型名称：<span class="attr-key">{{ scope.row.cartPathLabels }}</span >
              
            </span>
            <span> <br />
              属性ID：<span class="attr-key">{{ scope.row.attrPathValues }} </span ><br />
              名称：<span class="attr-key">{{ scope.row.attrPathLabels }}</span >
            </span>
          </template>
        </el-table-column>
        <el-table-column label="绑定的keys" width="250px">
          <template #default="scope">
            <div v-for="item in scope.row.typeKeys" :key="item.key">
              属性：<span class="attr-key">{{ item.key }}</span
              ><br />替换值：<span class="attr-value">{{ item.value }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="关联信息">
          <template #default="scope">
            <div v-for="item in scope.row.attrKeys" :key="item.key">
              属性：<span class="attr-key">{{ item.key }}</span
              ><br />替换值：<span class="attr-value">{{ item.value }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-popconfirm title="你确定删除吗？" @confirm='delAttr(scope.row)'>
              <template #reference>
                <el-button type="danger" >删除</el-button>
              </template>
            </el-popconfirm>
            <!-- <el-button type="primary" @click="editAttr(scope.row)">编辑</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- direction="ltr"  -->
    <el-drawer v-model="isShwoAttr" size="600px" title='添加数据'>
      <el-scrollbar style="padding-right: 15px;">
        <el-form
        class="demo-form-inline"
        label-width="100px"
        label-position="top"
      >
        <el-form-item label="下单类型:">
          <el-select v-model="editInfo.bindType">
            <el-option
              v-for="item in bindType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型:">
          <el-select v-model="editInfo.type">
            <el-option
              v-for="item in dataType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择品类:">
          <el-cascader
            style="width: 400px;margin-right: 10px;"
            :options="allNavs"
            v-model="cartIds"
            ref="cartRef"
            :props="{ value: 'id', label: 'name', checkStrictly: true }"
          />
          <el-button @click="queryAttr(0)" type='primary' 
            ><el-icon><Search /></el-icon>查询属性</el-button
          >
        </el-form-item>
        <el-form-item label="选择属性:" v-if="attrList.length>0">
          <el-cascader
            style="width: 500px"
            :options="attrList"
            v-model="attrIds"
            ref="attrRef"
            :props="{ value: 'id', label: 'name' }"
            @change="changeAttr"
          >
            <template #default="{ node, data }">
              <span>{{(data.parentAttrName? data.parentAttrName+'-':'')+data.label }}({{ data.id }})</span>
            </template>
          </el-cascader>
        </el-form-item>

        <el-form-item label="替换数据配置:" v-if="attrIds.length>0">
          <el-form
            label-position="right"
            label-width="160px"
            style="width: 100%; padding-left: 20px"
          >
            <el-form-item
              v-for="(item, index) in editInfo.typeKeys"
              :label="item.name + '替换值：'"
              :key="item.key"
            >
              <el-input v-model="editInfo.typeKeys[index].value"></el-input>
            </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item label="属性替换配置:" v-if="attrIds.length>0">
          <!-- <div v-for="(item,index) in editInfo.attrKeys" :key="item.key">
            {{item.name}}:<el-input v-model="editInfo.attrKeys[index].vlaue"></el-input>
          </div> -->
          <el-form
            label-position="right"
            style="width: 100%; padding-left: 20px"
          >
            <el-form-item
              v-for="(item, index) in editInfo.attrKeys"
              :key="item.key"
            >
              <slot name="label">
                {{ item.name + "替换值："
                }}{{ editInfo.attrKeys[index].example() }}
              </slot>
              <el-input
                type="textarea"
                v-model="editInfo.attrKeys[index].value"
              ></el-input>
            </el-form-item>
          </el-form>
          
        </el-form-item>
       
      </el-form>
      </el-scrollbar>
      <div style="position: absolute;bottom: 0;left: 0;width: 100%;background-color: #fff;height: 50px;text-align: center;">
        <el-button @click="isShwoAttr = false">取消</el-button>
        <el-button type='primary' @click="saveInfo">{{editInfo.id?'保存修改':'确认添加'}}</el-button>
        
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { getAllNavs, getTreeVoList } from "@/api/consumer/attr";
import { translateRelation } from "@/api/basicDatabase/translate";
import { ElMessage } from "element-plus";
let allNavs = ref([]);
function getAllNavsList() {
  getAllNavs().then((res) => {
    console.log("56666", res);
    function getData(newArr, oldArr) {
      for (let index = 0; index < oldArr.length; index++) {
        let newObj = {
          ...oldArr[index].data,
          children: [],
        };
        newArr.push(newObj);
        if (oldArr[index].children) {
          getData(newObj.children, oldArr[index].children);
        }
      }
    }
    getData(allNavs.value, res.data.priceCateNavs);
    console.log("allNavs.value", allNavs.value);
    // allNavs.value = res.data.priceCateNavs
  });
}
getAllNavsList();

let cartIds = ref([]);
let attrIds = ref([]);
let attrList = ref([]);
function queryAttr(pid=0) {
  console.log(cartIds);
  let arr = cartIds.value;
  console.log("cartIds", arr);
  getTreeVoList({ bindType: editInfo.value.bindType, bindId: arr[arr.length - 1], pid}).then(
    (res) => {
      console.log(res);
      if(pid==0){
        attrList.value = res.data;
      }else{
        fileAddInfo.value.newAttrList =  res.data[0].children;
      }
      
      
    }
  );
}
let isShwoAttr = ref(false);
function editAttr(item = {}) {
  cartIds.value = item.cartPathValues?item.cartPathValues.split('-').map(e => Number(e)):cartIds.value
  attrIds.value = item.attrPathValues?item.attrPathValues.split('-').map(e => Number(e)):attrIds.value
  if(cartIds.value.length>0){
    queryAttr()
  }else{
    // attrList.value = [];
  }
  console.log('item',item)
  console.log('cartIds',cartIds.value)
  console.log('cartIds',attrIds.value)
  let typeKeys = [
      {
        key: "embossTextureNo", //纹理名称的key
        value: "$1", //用来替换的字符串
        name: "纹理编号",
      },
      {
        key: "embossTextureName", //纹理名称的key
        value: "$2", //用来替换的字符串
        name: "纹理名称",
      },
      {
        key: "imageUrl",
        value: "$3",
        name: "纹理示例图",
      }
    ]
  if(item.typeKeys){
    typeKeys = item.typeKeys
  }
  let attrKeys = [
      {
        key: "name",
        name: "显示名称",
        value: "$2",
        example: exampleReplace,
      },
      {
        key: "actualValue",
        name: "实际值",
        value: "$1",
        example: exampleReplace,
      },
      {
        key: "code", //attr的key
        name: "编码",
        value: "$1", //attr的值，把$1替换成新数据的值
        example: exampleReplace,
      },
      {
        key: "remark",
        name: "备注",
        value: `<div><img style="height:100px;" src="/api/consumer/certifyFree/alibaba/oss/viewFile?fileName=$3"/></div>`,
        example: exampleReplace,
      }
    ]
    if(item.attrKeys){
      attrKeys = item.attrKeys.map(({key,name,value}) =>{
        let obj = {key,name,value,example:exampleReplace}
        return obj
      })
    }
  editInfo.value = {
    cartPathValues: "", //分类层级id
    cartPathLabels: "", //分类层级名称
    cartId: "", //分类Ids
    attrPathValues: "", //属性组层级id
    attrPathLabels: "", //属性组层级id
    groupId: "", //属性组Id
    type:item.type||"emboss", //工艺类型  emboss-压纹
    typeKeys,
    attrKeys,
    bindType:'cate',
    id:item.id||null
  }
  console.log('editInfo.value',editInfo.value)
  isShwoAttr.value = true;
}

function delAttr(item) {
  translateRelation.del(item.id).then(res=>{
    console.log('res',res)
    if(res.code==200){
      ElMessage.success('成功删除')
      getList()
      
    }else{
      ElMessage.error('删除失败'+res.msg)
    }
  })
}

function changeAttr(e) {
  console.log(Object.values(e).join('-'));
}

let attrRef = ref(null);
let cartRef = ref(null);
let selectArr = ref([]);
// 压纹数据示例
let example ={
                "id":"2210131620364701111",
                "createBy":"6649",
                "createTime":"2022-10-13T16:20:36",
                "updateBy":"6649",
                "updateTime":"2022-10-13T16:20:36",
                "deleted":false,
                "auditing":false,
                "imageUrl":"basicdatabase26小格子纹.png",
                "embossTextureName":"小格子纹",
                "suitedCraftStr":"满版压纹/折光",
                "embossTextureNo":"11500054"
            };
// 数据示例替换函数
let exampleReplace = function () {
  let _this = this;
  let str = _this.value;
  let kyes = editInfo.value.typeKeys;

  for (let index = 0; index < kyes.length; index++) {
    str = str.replace(kyes[index].value, example[kyes[index].key]);
    if (_this.key === "remark" && !example[kyes[index].key]&& !example[kyes[index].key].length) str = "";
  }

  return str;
};
let editInfo = ref({});

async function saveInfo(){
  let attr = attrRef.value.getCheckedNodes();
  let cart = cartRef.value.getCheckedNodes();
  let formdata = {
    cartPathValues: cart[0].pathValues.join("-"), //分类层级id
    cartPathLabels: cart[0].pathLabels.join("-"), //分类层级名称
    cartId: cart[0].pathValues[cart[0].pathValues.length-1], //分类Ids
    attrPathValues: attr[0].pathValues.join("-"), //属性组层级id
    attrPathLabels: attr[0].pathLabels.join("-"), //属性组层级id
    groupId: attr[0].pathValues[attr[0].pathValues.length-1],//属性组Id
    type: editInfo.value.type, //工艺类型和下单类型  emboss_cart   压纹_报价下单
    bindType:editInfo.value.bindType,
    typeKeys:JSON.stringify( editInfo.value.typeKeys),
    attrKeys:JSON.stringify( editInfo.value.attrKeys.map(({key,value,name}) =>{
      return {key,value,name}
    })),
    id : editInfo.value.id||null
  }
  console.log('formdata',formdata)
  let list = await translateRelation.list({ cartId: "",size:200,current:1 ,groupId:formdata.groupId})
    if(list.data.total>0){
      ElMessage.error('该属性组已配置，无法保存')
    }else{
      if( formdata.id){
        translateRelation.edit(formdata).then(res=>{
          if(res.code==200){
            ElMessage.success('编辑成功')
            getList()
            isShwoAttr.value = false
          }else{
            ElMessage.error('编辑失败'+res.msg)
            console.log(res)
          }
          
        })
      }else{
        translateRelation.add(formdata).then(res=>{
          if(res.code==200){
            ElMessage.success('添加成功')
            getList()
            isShwoAttr.value = false
          }else{
            ElMessage.error('添加成功'+res.msg)
            console.log(res)
          }
        })
      }
    }
}


let dataType = [
  {
    value: "emboss",
    label: "压纹",
  },
];
let bindType = [
  {
    value: "cate",
    label: "傲彩报价下单",
  },
  {
    value:'proof',
    label:'傲彩打样下单'
  },
  {
    value:'pinyiban',
    label:'拼一版PC端'
  },
  
];
let tableDataList = ref([
  // {
  //   cartPathValues: "97-3-128", //分类层级id
  //   cartPathLabels: "纸质包装-精装盒-书型盒", //分类层级名称
  //   cartId: "128", //分类Ids
  //   attrPathValues: "0-17361-17362-17383-18734-18735", //属性组层级id
  //   attrPathLabels: "根目录-部件信息-面料-压纹-压纹编号-纹理信息", //属性组层级id
  //   groupId: "18735", //属性组Id
  //   type: "emboss", //工艺类型  emboss-压纹
  //   typeKeys: [
  //     {
  //       key: "embossTextureName", //纹理名称的key
  //       name: "",
  //       value: "$1", //用来替换的字符串
  //     },
  //     {
  //       key: "imageUrl",
  //       value: "$2",
  //     },
  //   ],
  //   attrKeys: [
  //     {
  //       key: "code", //attr的key
  //       value: "ML_btn_NPZL_YW_MBYW_YWBH_1-10_WLXX_$1", //attr的值，把$1替换成新数据的值
  //     },
  //     {
  //       key: "actualValue",
  //       value: "压纹:$1",
  //     },
  //     {
  //       key: "remark",
  //       value: `<div><img style="height:100px;" src="/api/consumer/certifyFree/alibaba/oss/viewFile?fileName=$2"/></div>`,
  //     },
  //     {
  //       key: "name",
  //       value: "$1",
  //     },
  //   ],
  // },
]);
const getList = function () {
  translateRelation.list({ cartId: "",size:200,current:1 }).then((res) => {
    if(res.code===200){
      try {
        tableDataList.value = res.data.records.map(e => {
          if(e.typeKeys&&e.typeKeys.length>0){
            e.typeKeys = JSON.parse(e.typeKeys)
          }else{
            e.typeKeys = []
          }
          if(e.attrKeys&&e.attrKeys.length>0){
            e.attrKeys = JSON.parse(e.attrKeys)
          }else{
            e.attrKeys = []
          }
          // e.bindType = 'cate'
          // console.log('e.type',e.type)
          // let typeArr = e.type.split('_')
          // if(typeArr.length>1){
          //   e.bindType = typeArr[1]
          // }
          // e.type = typeArr[0]
          return e
        })
      } catch (error) {
        console.error('数据错误',error)
      }
    }
    console.log("getList", tableDataList);
  });
};
getList();
function createJSON(data, filename){//参数1：json数据；参数2：自定义导出的文件名
        if(!data) {
          ElMessage.error('无数据', {icon: 7})
          return;
        }
        if(!filename) filename = '未定义.json' //如果没有文件名，设置默认文件名
        if (typeof data === "object") data = JSON.stringify(data)
        let blob = new Blob([data], {type: 'text/json'})
        let e = document.createEvent('MouseEvents')
        let a = document.createElement('a')
        a.download = filename
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        a.dispatchEvent(e)
    }
function dowJSON(){
  createJSON(tableDataList.value,new Date().getTime()+'.json')
}
function fileListChange(file){
  console.log('file',file)
  let reader = new FileReader(); //新建一个FileReader
  reader.readAsText(file.raw, "UTF-8"); //读取文件
  reader.onload = (evt) => {
    //读取文件完毕执行此函数
    const dataJson = JSON.parse(evt.target.result);
    fileAddInfo.value.dataList = dataJson.map(e =>{
      return {
        attrKeys:e.attrKeys,
        attrPathLabels:e.attrPathLabels,
        attrPathValues:e.attrPathValues,
        bindType:e.bindType||'cate',
        cartId:e.cartId,
        cartPathLabels:e.cartPathLabels,
        cartPathValues:e.cartPathValues,
        groupId:e.groupId,
        type:e.type,
        typeKeys:e.typeKeys
      }
    })
    console.log('dataJson',dataJson)
    let num = fileAddInfo.value.dataList.length-1
    fileAddInfo.value.current =  num
    let newPid = dataJson[num].attrPathValues.split('-')
    cartIds.value = dataJson[num].cartPathValues.split('-')
    editInfo.value.bindType = dataJson[num].bindType||'cate'

    queryAttr(newPid[newPid.length-2])
    // dataJson 就是读取的文件内容
  
  };
}

let fileAddInfo = ref({
  current:1,
  dataList:[],
  newAttrList:[],
  newAttr:''
})

/** 修改导入的数据的页码 */
function currentChange(num){
  let current = fileAddInfo.value.current + num;
  if(current != 0 && current!= (fileAddInfo.value.dataList.length+1)){
    fileAddInfo.value.current = current;
    let newPid = fileAddInfo.value.dataList[current-1].attrPathValues.split('-')
    cartIds.value = fileAddInfo.value.dataList[current-1].cartPathValues.split('-')
    editInfo.value.bindType = fileAddInfo.value.dataList[current-1].bindType||'cate'
    fileAddInfo.value.newAttr = ''
    queryAttr(newPid[newPid.length-2])
  }
}
/** 保存数据 */
async function saveAttr(){
  if(fileAddInfo.value.newAttr==''){
    ElMessage.error('请选择属性组')
  }else{
    let list = await translateRelation.list({ cartId: "",size:200,current:1 ,groupId:fileAddInfo.value.newAttr})
    if(list.data.total>0){
      ElMessage.error('该属性组已配置，无法保存')
    }else{
      let formdata = JSON.parse(JSON.stringify(fileAddInfo.value.dataList[fileAddInfo.value.current-1]));
      let attrPathValues = formdata.attrPathValues.split('-')
      let attrPathLabels = formdata.attrPathLabels.split('-')
      let newAttr = fileAddInfo.value.newAttrList.find(e => e.id===fileAddInfo.value.newAttr)
      attrPathValues[attrPathValues.length-1] = newAttr.name
      attrPathValues[attrPathValues.length-1] = newAttr.id
      formdata.groupId = newAttr.id;
      formdata.attrPathValues = attrPathValues.join('-')
      formdata.attrPathLabels = attrPathLabels.join('-')
      formdata.typeKeys = JSON.stringify( formdata.typeKeys)
      formdata.attrKeys = JSON.stringify( formdata.attrKeys)
      console.log('formdata',formdata)
      translateRelation.add(formdata).then(res=>{
        if(res.code==200){
          ElMessage.success('添加成功')
          getList()
          isShwoAttr.value = false
        }else{
          ElMessage.error('添加成功'+res.msg)
          console.log(res)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.relation-main {
  padding: 10px;
  .attr-key {
    color: #000;
    margin-right: 10px;
  }
  .attr-value {
    color: red;
  }
  :deep(.el-form-item__label) {
    font-weight: 700;
  }

  :deep(.el-drawer__body){
    padding-bottom: 50px;
  }
  :deep(.el-drawer__header){
    margin-bottom: 0;
  }
}
</style>
