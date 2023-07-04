<template>
  <div class="industrialParkList">
    <CommonBreadCrumb :first="'产业园管理'" :marginBottom="'16px'" />
    <div class="headBox">
      <div class="nameContainer">
        <div class="nameBox">
          <div class="name">产业园名称</div>
          <!-- <el-input v-model="input" placeholder="请输入" class="nameInput" /> -->
          <el-select v-model="listParam.parkName" filterable placeholder="请输入" class="nameInput">
            <el-option v-for="item in nameList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="btnBox">
          <div class="queryBox" @click="query">
            <img class="queryImg" src="../../../assets/images/query_btn_icon.png" alt="" />
            <div class="query">查询</div>
          </div>
          <div class="resetBox" @click="reset">
            <img class="resetImg" src="../../../assets/images/reset_btn_icon.png" alt="" />
            <div class="reset">重置</div>
          </div>
        </div>
      </div>
      <div class="typeBox">
        <div class="type">产业园类型</div>
        <el-select v-model="listParam.parkType" class="typeSelect" placeholder="全部">
          <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
    </div>
    <div class="tableContainer">
      <div class="addBox" @click="toPage">
        <img class="addImg" src="../../../assets/images/add.png" alt="" />
        <div class="add">添加产业园</div>
      </div>
      <el-table :data="tableData" border class="tableBox" @sort-change="test" style="width: 100%"
        @row-click="row => $router.push('/industrialParkManage/industrialParkEdit?id=' + row.id)">
        <el-table-column label="产业园名称" width="280px" sortable="custom" align="center">
          <template #default="scope">
            <div>PO2022081798032877</div>
          </template>
        </el-table-column>
        <el-table-column label="负责人" align="center">
          <template #default="scope">
            <div>孙梦月</div>
          </template>
        </el-table-column>
        <el-table-column label="手机号" width="280px" align="center">
          <template #default="scope">
            <div>
              成品尺寸:99_99_99;展开尺寸:411.00_327.00;表面处理:哑胶;印刷颜色:多色_CMYK;印刷:单面印刷;1;粘合:自动粘1处;纸张材质:单铜纸_325;包装服务:盒子扎皮筋;外箱套蛇皮袋:否;涂胶水位置:粘左边;
            </div>
          </template>
        </el-table-column>
        <el-table-column label="产业园类型" width="280px" align="center">
          <div>2022-08-17 09:09:28</div>
        </el-table-column>
        <el-table-column label="状态" width="140px" align="center">
          <template #default="scope">
            <div>下载</div>
          </template>
        </el-table-column>
        <el-table-column label="创建人" width="140px" align="center">
          <template #default="scope">
            <div>下载</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" sortable="custom" width="140px" align="center">
          <template #default="scope">
            <div>即可关键是给大家</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140px" align="center">
          <template #default="scope">
            <div class="editBtn">编辑</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script name="IndustrialParkList" setup>
import { ElMessage } from 'element-plus'
import { useRouter } from "vue-router";
import { getIndustrialParkMap,getIndustrialParkPage } from "@/api/modules/lndustrialParkManagement"
const router = useRouter();
const type = reactive([
  {
    label: "自有", value: "1"
  },
  {
    label: "加盟", value: "2"
  }
])

// 产业园名称列表
const nameList = reactive([])

// 产业园列表参数
let listParam = reactive({
  parkName:"", // 产业园名称
  parkType:"", // 产业园类型 1:自有 2：加盟
  sortAsc:"", // true 正序，false 倒顺序
  pageNumber:1, // 当前页
  pageSize:15, // 显示条数
})

// 重置
const reset = ()=>{
  listParam.parkName = "",
  listParam.parkType = ""
}

async function getName(){
  let param = {
    industrialParkIds:[]
  }
  let {code,data,message} = await getIndustrialParkMap(param);
  if(code == '000000'){
    nameList = data
  }else{
    ElMessage.error(message)
  }
}

getName()

// 获取产业园列表
async function getList(){
  let {code,data,message} = await getIndustrialParkPage(listParam);
  if(code == '000000'){

  }else{
    ElMessage.error(message)
  }
}

// getList()

const tableData = [
  {
    date: "2016-05-03",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
    tag: "Home",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
    tag: "Office",
  },
  {
    date: "2016-05-04",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
    tag: "Home",
  },
  {
    date: "2016-05-01",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
    tag: "Office",
  },
  {
    date: "2016-05-03",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
    tag: "Home",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
    tag: "Office",
  },
];
const toPage = () => {
  router.push("/industrialParkManage/industrialParkAdd")
}
const test = ({ column, prop, order })=>{
  console.log('{ column, prop, order }',{column, prop, order });
}
</script>

<style lang="scss" scoped>
.industrialParkList {
  padding: 16px 24px 16px;

  .headBox {
    width: 1664px;
    height: 138px;
    background-color: #ffffff;
    border-radius: 4px;
    padding: 20px;
    box-sizing: border-box;

    .nameContainer {
      display: flex;
      justify-content: space-between;
      padding-bottom: 20px;
      border-bottom: 1px solid #f2f2f2;

      .nameBox {
        display: flex;
        align-items: center;

        .name {
          color: #333333;
          font-size: 14px;
        }

        .nameInput {
          width: 240px;
          margin-left: 8px;
        }
      }

      .btnBox {
        display: flex;

        .queryBox {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 86px;
          height: 28px;
          background-color: #38a28a;
          border-radius: 4px;

          .queryImg {
            width: 18px;
            height: 18px;
          }

          .query {
            width: 32px;
            height: 24px;
            font-size: 16px;
            color: #ffffff;
            margin-left: 4px;
          }
        }

        .resetBox {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 86px;
          height: 28px;
          background-color: #ffffff;
          border-radius: 4px;
          border: 1px solid #38a28a;
          margin-left: 20px;

          .resetImg {
            width: 18px;
            height: 18px;
          }

          .reset {
            font-size: 16px;
            color: #38a28a;
            margin-left: 6px;
          }
        }
      }
    }

    .typeBox {
      display: flex;
      align-items: center;
      margin-top: 20px;

      .type {
        font-size: 14px;
        color: #333333;
      }

      .typeSelect {
        width: 240px;
        height: 29px;
        background-color: #ffffff;
        margin-left: 8px;
      }
    }
  }

  .tableContainer {
    width: 1664px;
    min-height: 680px;
    background-color: #ffffff;
    border-radius: 4px;
    margin-top: 16px;
    box-sizing: border-box;
    padding: 8px 20px 20px;

    .addBox {
      display: flex;
      justify-content: right;
      align-items: center;

      .addImg {
        width: 16px;
        height: 16px;
      }

      .add {
        font-size: 16px;
        color: #38a28a;
        margin-left: 4px;
      }
    }

    .tableBox {
      margin-top: 8px;

      &:deep(.el-table__header) {
        th {
          background-color: #f2f2f2;
        }
      }

      .editBtn {
        width: 44px;
        height: 25px;
        font-size: 14px;
        color: #38a28a;
        border-radius: 4px;
        border: 1px solid #38a28a;
        margin: auto;
      }
    }
  }
}

// .industrial_park_list_page {
//   height: 100%;
//   box-sizing: border-box;
//   padding: 16px 24px 16px;

//   .select_box {
//     margin-bottom: 16px;
//     padding: 24px 20px;
//     background-color: #fff;
//     border-radius: 4px;

//     .select_top {
//       margin-bottom: 16px;
//       padding-bottom: 16px;
//       border-bottom: 1px solid #f2f2f2;
//       display: flex;
//       justify-content: space-between;
//     }

//     .select_group {
//       display: flex;

//       .select_buttom {
//         margin-right: 20px;

//         &:last-child {
//           margin-right: 0;
//         }
//       }

//       .select_item {
//         margin-right: 40px;
//         display: flex;
//         align-items: center;

//         &:last-child {
//           margin-right: 0;
//         }

//         .select_item_label {
//           margin-right: 8px;
//           font-size: 14px;
//           font-family: Source Han Sans CN-Regular, Source Han Sans CN;
//           font-weight: 400;
//           color: #333333;
//         }

//         .select_item_content {
//           width: 272px;
//         }
//       }
//     }
//   }

//   .content_box {
//     min-height: calc(100% - 210px);
//     margin-bottom: 16px;
//     padding: 24px 20px;
//     background-color: #fff;
//     border-radius: 4px;

//     .content_top {
//       margin-bottom: 16px;
//       display: flex;
//       justify-content: flex-end;
//     }

//     .table_box {
//       width: 100%;
//       margin-bottom: 16px;
//       // height: 200px;
//       // background-color: red;

//       &:deep(.el-table__header) {
//         th {
//           background-color: #f2f2f2;
//         }
//       }
//       .edit_buttom {
//         color: var(--default-main-color);
//         background-color: transparent;

//         &:hover {
//           opacity: 0.5;
//         }
//       }
//     }

//     .page_box {
//       display: flex;
//       justify-content: flex-end;
//       align-items: center;

//       .page_total_box {
//         margin-right: 8px;
//         font-size: 12px;
//         font-family: Source Han Sans CN-Regular, Source Han Sans CN;
//         font-weight: 400;
//         color: #3f4757;
//       }

//       .page_size_box {
//         margin-right: 12px;
//         display: flex;
//         align-items: center;
//         font-size: 12px;
//         font-family: Source Han Sans CN-Regular, Source Han Sans CN;
//         font-weight: 400;
//         color: #3f4757;

//         .page_size_selecter {
//           width: 60px;
//           margin: 0 3px;
//         }
//       }

//       .page_jump_box {
//         width: 60px;
//         margin-left: 8px;
//       }
//     }
//   }
// }
</style>
