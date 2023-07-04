<!-- 
  import printColor from '@/components/orderChange/printColor.vue';
<printColor v-model:attrInfo="attrInfo" ></printColor>
let attrInfo = ref( {
        goodsAttr:'`成品尺寸:100.00_100.00_100.00;展开尺寸:415.00_330.00;印刷:双面印刷;正面印刷颜色:单色_黄色;反面印刷颜色:无;表面处理:哑胶;背面处理:无;预折:否;正面专色:3,2,3,45;反面专色:3,1,56,6;正面加印白墨;反面加印白墨;1;粘合:自动粘1处;纸张材质:单铜纸_350;材质标识:4759_22625;包装服务:盒子扎皮筋;外箱套蛇皮袋:否;`',//商品原始属性
        isComplete:true,//判断专色是否填写完整
        oldAttr:'',//商品需要被替换的颜色属性的旧数据
        newAttr:''//更新后的数据
      }) 
  -->
<template>
  <div class="print-color">
    <div v-for="(item, index) in printInfoList" :key="index">
      <div style="font-size: 16px;margin:10px 0 ;">
        请填写{{ item.name }}印刷颜色：
      </div>
      <div style="display: flex; align-items: center">
        <el-radio-group v-model="item.printVal">
          <el-radio label="多色_CMYK" border :disabled='item.printVal == "无"'></el-radio>
          <el-radio label="单色" border :disabled='item.printVal == "无"'></el-radio>
          <el-radio label="无" border :disabled='item.printVal != "无"'></el-radio>
        </el-radio-group>
        <el-checkbox style="margin-left: 32px" v-model="item.chalkVal" label="加印白墨" border />
        <span style="margin-left: 32px">专色数量：</span>
        <el-select v-model="item.spotColorNum" placeholder="Select" popper-class="spotColorSelect"
          @change="zsAmountChange(item, index)">
          <el-option v-for="item in spotColorNumList" :key="item" :label="item" :value="item" />
        </el-select>
      </div>
      <div v-if="item.printVal == '单色'" class="oAtrLayer">
        <el-radio-group v-model="item.singleColor">
          <el-radio label="青色" border>青色(C)</el-radio>
          <el-radio label="品红" border>品红(M)</el-radio>
          <el-radio label="黄色" border>黄色(Y)</el-radio>
          <el-radio label="黑色" border>黑色(K)</el-radio>
        </el-radio-group>
      </div>
      <div style="margin-top: 10px" v-if="item.spotColorNum > 0">
        <span>请填写PANTONE色号:</span>
        <template v-if="item.spotColorNum > 0">
          <el-input style="width: 100px; margin-left: 10px" v-for="(item2, index2) in item.spotColorNum" :key="item2"
            v-model="item.spotColor[index2]" @change="checkPantonColor(item.spotColor)"></el-input>
        </template>
        <div><span style="color:red;">*</span>官方默认以潘通色卡版本“ <span style="color:red;">Pantone LCC, 2019.</span>
          ”为准，若须以您自有色卡为准，请邮寄您的色卡给傲彩。</div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { checkPantone } from "@/api/orderChange/applyfor"
const props = defineProps({
  attrInfo: {
    type: Object,
    default: () => {
      return {
        goodsAttr: '',//商品原始属性
        isComplete: '',//判断专色是否填写完整
        oldAttr: '',//商品需要被替换的颜色属性的旧数据
        newAttr: ''//更新后的数据
      }
    }
  }

})
const emits = defineEmits(['update:attrInfo']);

let spotColorNumList = ref([0, 1, 2, 3, 4]); //专色数量
let printInfoList = ref([]);
watch(printInfoList.value, (newVal) => {
  isComplete = true
  newAttr = ''
  for (let index = 0; index < newVal.length; index++) {
    setGoodsAttr(newVal[index])
  }
  emits("update:attrInfo", {
    goodsAttr,
    isComplete,
    oldAttr,
    newAttr
  });
}, true)
let goodsAttr = props.attrInfo.goodsAttr;
let oldAttr = '';
let newAttr = '';
let isComplete = props.attrInfo.isComplete;
if (goodsAttr) {
  // 获取印刷信息，判断是单面还是正面
  let isSingle = goodsAttr.match(new RegExp(`(?<=;印刷:).*?(?=;)`))
  if (!isSingle || isSingle[0] === '单面印刷') {
    getPrintInfo(goodsAttr);
    console.log('isSingle', isSingle)
  } else {
    getPrintInfo(goodsAttr, "正面");
    getPrintInfo(goodsAttr, "反面");
  }
}

/**
 * 获取goodsAttr的信息用于返现
 */
function getPrintInfo(goodsAttr, face = "") {
  let printInfo = {
    name: face,//印刷名称  正面或者反面，单面的时候是空字符串
    printVal: "",
    singleColor: "青色",
    chalkVal: false,
    spotColorNum: 0,
    // spotColor: ["", "", "", "", "", "", ""],
    spotColor: ["", "", "", ""]
  };
  // 获取印刷颜色的值
  let printVal = goodsAttr.match(new RegExp(`(?<=${face}印刷颜色:).*?(?=;)`))
  if (printVal) {
    if (printVal[0] == "多色_CMYK" || printVal[0] == "无") {
      printInfo.printVal = printVal[0];
    } else {
      let arr = printVal[0].split("_");
      printInfo.printVal = arr[0];
      printInfo.singleColor = arr[1];
    }
    oldAttr = `${oldAttr}${face}印刷颜色:${printVal[0]};`
  }

  // 获取印刷颜色的值
  let chalkVal = goodsAttr.match(new RegExp(`(?<=;)${face}加印白墨(?=;)`))
  if (chalkVal) {
    printInfo.chalkVal = true;
    oldAttr = `${oldAttr}${face}加印白墨;`
  }
  // 获取印刷专色
  let spotColor = goodsAttr.match(new RegExp(`(?<=${face}专色:).*?(?=;)`))
  if (spotColor) {
    let arr = spotColor[0].split(",");
    printInfo.spotColorNum = Number(arr[0]);
    for (let index = 0; index < arr.length; index++) {
      if (index != 0) {
        printInfo.spotColor[index - 1] = arr[index];
      }
    }
    oldAttr = `${oldAttr}${face}专色:${spotColor[0]};`
  }
  // console.log('oldAttr', oldAttr)
  printInfoList.value.push(JSON.parse(JSON.stringify(printInfo)));
}
/**
* 把修改后的数据更新到goodsAttr,每次只更新一个印刷数据的内容
*/
function setGoodsAttr(print) {
  let face = print.name
  let printVal = print.printVal + (print.printVal == '单色' ? ('_' + print.singleColor) : '')
  let reg1 = new RegExp(`(?<=;)${face}加印白墨;`);
  let reg2 = new RegExp(`(?<=${face}专色:).*?(?=;)`);
  if (reg1.test(goodsAttr)) {
    goodsAttr = goodsAttr.replace(new RegExp(`(?<=;)${face}加印白墨;`), print.chalkVal ? `${face}加印白墨;` : '')
  } else if (print.chalkVal) {
    printVal = `${printVal};${face}加印白墨`
  }
  goodsAttr = goodsAttr.replace(new RegExp(`(?<=${face}印刷颜色:).*?(?=;)`), printVal)
  newAttr = `${newAttr}${face}印刷颜色:${printVal};${print.chalkVal && !printVal.includes('加印白墨') ? `${face}加印白墨;` : ''}`
  if (print.spotColorNum != 0) {
    let spotColor = print.spotColorNum + ',';
    for (let index = 0; index < print.spotColorNum; index++) {
      spotColor = spotColor + print.spotColor[index] + ((print.spotColorNum - 1) != index ? ',' : '');
      if (print.spotColor[index] == '') {
        isComplete = false
      }
    }
    if (reg2.test(goodsAttr)) {
      goodsAttr = goodsAttr.replace(reg2, spotColor)
    } else {
      let reg3 = new RegExp(`(?<=${printVal})(?=;)`);
      goodsAttr = goodsAttr.replace(reg3, `${printVal};${face}专色:${spotColor}`)
    }
    newAttr = `${newAttr}${face}专色:${spotColor};`
  } else {
    goodsAttr = goodsAttr.replace(new RegExp(`${face}专色:(.*?);`), '')
  }
}

// 专色数量改变
function zsAmountChange(item, index) {
  printInfoList.value[index].spotColor = ['', '', '', '']
}

// 校验潘通号
function checkPantonColor(spotColor) {
  console.log('spotColor', spotColor);
  let list = Object.values(spotColor).filter(item => item);
  checkPantone({ list }).then(res => {
    console.log('res', res);
  }).catch(error => {
    console.log('报错了', error);
  })
}
</script>
  
<style lang="scss" scoped>
:deep(.el-radio__inner),
:deep(.el-checkbox__inner) {
  display: none;
}

:deep(.el-checkbox-button.is-checked:first-child .el-checkbox-button__inner),
:deep(.el-checkbox.is-bordered.is-checked),
:deep(.el-checkbox__input.is-checked+.el-checkbox__label),
:deep(.el-radio.is-bordered.is-checked),

:deep(.el-radio__input.is-checked+.el-radio__label) {
  background-color: inherit;
  color: #333;
  border-color: #e60021
}

:deep(.el-radio.is-bordered.is-checked:after),
:deep(.el-checkbox.is-bordered.is-checked:after) {
  content: "";
  width: 12px;
  height: 12px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAYElEQVQokWP86iPBQCzg2iL3n4kUxSCaKA0wxURpQFZMUAO6YrwasCnGqQGr4v8nsWsAK4ZKoivG0IBiMkwRjGY0R9WAohgqia4YrgGrm2GKkBSDuf8ZzLCGBlbAwMAAABdyI9WXoiwfAAAAAElFTkSuQmCC) no-repeat 100% 100%;
  display: inline-block;
  position: absolute;
  right: 0;
  bottom: 0
}

.oAtrLayer {
  border: 1px solid #eee;
  padding: 10px 16px 10px;
  width: 676px;
  position: relative;
  // top: -6px;
  // left: -16px;
  margin-top: 20px;
  background-color: #fcfcfc;
}

.oAtrLayer:after,
.oAtrLayer:before {
  position: absolute;
  top: -19px;
  display: block;
  height: 0;
  width: 0;
  font-size: 0;
  line-height: 0;
  border-style: dashed dashed solid dashed;
  content: "";
}

.oAtrLayer:before {
  left: 39px;
  border-color: transparent transparent #fff transparent;
  border-width: 10px;
  cursor: pointer;
  z-index: 1;
}

.oAtrLayer:after {
  left: 40px;
  border-color: transparent transparent #e5e5e5 transparent;
  border-width: 9px;
}</style>
  