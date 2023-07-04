<!--  包装方案搜索关键字统计列表 -->
<template>
  <div>
    <listLayout>
      <template #header>
        <div class="header-form">
          <el-form
            :inline="true"
            :model="listParam"
            class="filterForm"
            ref="workOrderFormRef"
            label-width="96px"
            style="flex: 1"
          >
            <el-form-item label="搜索时间" prop="poNo">
              <el-date-picker
                v-model="listParam.createTime"
                type="daterange"
                value-format="YYYY-MM-DD"
              
                start-placeholder="开始日期"
                end-placeholder="最后日期"
              />
            </el-form-item>
          </el-form>
          <div class="btnBox" style="width: 140px; display: flex">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button type="default" @click="reset">重置</el-button>
          </div>
        </div>
      </template>
      <template #table-header>
        <div class="title">
          方案搜索数据列表
          <!-- <div style="float: right">
            <el-switch
              v-model="tableType"
              active-text="表格"
              inactive-text="柱状图"
              active-color="#13ce66"
              inactive-color="#409eff"
            >
            </el-switch>
          </div> -->
        </div>
      </template>
      <template #table-content="scope">
        <div
          v-show="!tableType"
          id="echartsBox"
          :style="'height:' + scope.tableHeight + 'px;'"
        ></div>
        <el-table
          :data="tableData"
          style="width: 100%"
          :height="scope.tableHeight"
          v-show="tableType"
        >
          <el-table-column prop="keyword" label="搜索词" width="180" />
          <el-table-column prop="pccount" label="PC端" />
          <el-table-column prop="wapcount" label="WAP端" />
          <el-table-column prop="count" label="合计" />
        </el-table>
      </template>
    </listLayout>
  </div>
</template>

<script setup>
import listLayout from "@/components/ParentView/listLayout.vue";
import { pageKeywordLogs } from "@/api/consumer/promotion";
import * as echarts from "echarts";
const { proxy } = getCurrentInstance();

var option = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // Use axis to trigger tooltip
      type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
    },
  },
  legend: {},
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "value",
    // max: 'dataMax'
  },
  yAxis: {
    type: "category",
    data: ["PC端", "WAP端", "总计"],
    inverse: true,
    animationDuration: 300,
    animationDurationUpdate: 300,
  },
  series: [],
};
let tableType = ref(true);
let listParam = ref({
  createTimeEnd: "",
  createTimeStart: "",
  createTime: []
});

let tableData = ref([]);
let myChart;

watch(tableType, (val) => {
  if (!val) {
    proxy.$nextTick(() => {
      showEcharts();
    });
  }
});
function showEcharts() {
  console.log("dsadas");
  if (!myChart) myChart = echarts.init(document.getElementById("echartsBox"));
  option.yAxis.data = tableData.value.map((e) => e.keyword);
  option.series = [
    {
      name: "PC端",
      type: "bar",
      stack: "total",
      label: {
        show: true,
      },
      emphasis: {
        focus: "series",
      },
      data: tableData.value.map((e) => e.pccount),
    },
    {
      name: "WAP端",
      type: "bar",
      stack: "total",
      label: {
        show: true,
      },
      emphasis: {
        focus: "series",
      },
      data: tableData.value.map((e) => e.wapcount),
    },
    {
      name: "总计",
      type: "line",
      label: {
        show: true,
        position: "right",
      },
      lineStyle: {
        opacity: 0,
      },
      data: tableData.value.map((e) => e.count),
    },
  ];
  myChart.setOption(option);
}

function search() {
  if (listParam.value.createTime && listParam.value.createTime.length > 0) {
    listParam.value.createTimeStart =
      listParam.value.createTime[0] + " 00:00:00";
    listParam.value.createTimeEnd = listParam.value.createTime[1] + " 23:59:59";
  } else {
    listParam.value.createTimeStart = "";
    listParam.value.createTimeEnd = "";
  }
  let createTimeStart = listParam.value.createTimeStart;
  let createTimeEnd = listParam.value.createTimeEnd;
  tableData.value = [];
  pageKeywordLogs({createTimeStart,createTimeEnd}).then((res) => {
    for (const key in res.data) {
      let count = 0;
      let pccount = 0;
      let wapcount = 0;
      if (res.data[key].pccount) {
        pccount = Number(res.data[key].pccount);
        count += pccount;
      }
      if (res.data[key].wapcount) {
        wapcount = Number(res.data[key].wapcount);
        count += wapcount;
      }
      tableData.value.push({
        keyword: key,
        pccount,
        wapcount,
        count,
      });
    }
    tableData.value.sort((a, b) => {
      return b.count - a.count;
    });
    if(!tableType.value) showEcharts()
  });
}
search();
function reset() {
  listParam.value = {
    client: "",
    createTimeEnd: "",
    createTimeStart: "",
    createTime: [],
    pageNumber: 1,
    pageSize: 10,
    webCateId: "",
  };
}
</script>
<style lang="scss">
.header-form {
  display: flex;
}
.echartsBox {
  position: relative;
  height: 500px;
  overflow: hidden;
}
</style>
