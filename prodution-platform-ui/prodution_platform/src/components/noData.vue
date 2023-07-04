<template>
    <div class="NoDataBox" :style="{ height,marginBottom: marginBottom }">
        <div class="main">
            <img src="@/assets/images/emptyFlow.png" alt="">
            <p>{{ text }}</p>
        </div>
    </div>
  </template>
  
  <script name="NoData" setup>

  
  const props = defineProps({
    text: {
      type: String,
      default: "暂无数据",
    },
    height:{
      type: String,
      default: "513px",
    },
    marginBottom:{
      type: String,
      default: "",
    },
  });
  

  
  </script>
  
  <style lang="scss" scoped>
  .NoDataBox{
    width: 100%;
    height: 513px;
    display: flex;
    justify-content: center;
    align-items: center;
    >.main{
        width: 100%;
        text-align: center;
        >img{
            width: 140px;
            height: 140px;
        }
        >p{
            font-size: 14px;
            font-family: Source Han Sans CN-Regular, Source Han Sans CN;
            font-weight: 400;
            color: #666;
        }
    }
  }
  </style>
  