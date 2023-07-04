<template>
  <el-select
    v-model="provinceId"
    placeholder="请选择"
    style="width: 180px"
    @change="selectCity('province', $event)"
  >
    <el-option
      v-for="(sitem, index) in provinceList"
      :key="index"
      :label="sitem"
      :value="index + ''"
    >
    </el-option>
  </el-select>
  <el-select
    v-model="cityId"
    placeholder="请选择"
    style="width: 170px; margin-left: 10px"
    @change="selectCity('city', $event)"
  >
    <el-option
      v-for="(sitem, index) in cityList"
      :key="index"
      :label="sitem"
      :value="provinceId + '_' + index"
    >
    </el-option>
  </el-select>
  <el-select
    v-model="districtId"
    placeholder="请选择"
    style="width: 170px; margin-left: 10px"
    @change="selectCity('district', $event)"
  >
    <el-option
      v-for="(sitem, index) in countyList"
      :key="index"
      :label="sitem"
      :value="cityId + '_' + index"
    >
    </el-option>
  </el-select>

  <!-- <p>s{{ province }}</p>
  <p>s{{ city }}</p>
  <p>s{{ district }}</p> -->
</template>

<script setup>
import { onMounted, onUnmounted, watch } from "vue";
import { getProvince, getCity, getAreaId, getAreaName } from "@/utils/city";
const props = defineProps({
  province: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  district: {
    type: String,
    default: "",
  },
});
// 接收父组件传来的方法
const emits = defineEmits();
const provinceList = ref([]);
const cityList = ref([]);
const countyList = ref([]);

const provinceId = ref("");
const cityId = ref("");
const districtId = ref("");

const selectCity = (type, event) => {
  emits("update:" + type, getAreaName(type, event));
  if (type === "province") {
    emits("update:city", "");
    emits("update:district", "");
    cityId.value = districtId.value = "";
    // cityList.value = getCity(provinceId.value);
    countyList.value = [];
  } else if (type === "city") {
    emits("update:district", "");
    districtId.value = "";
    // countyList.value = getCity(cityId.value);

  }
};

onMounted(() => {
  provinceList.value = getProvince();
  if(props.province){
    provinceId.value=getAreaId('province', props.province)
    cityList.value = getCity(provinceId.value);
    console.log(provinceId.value,cityId.value,districtId.value);
  }
  if(props.city){
    cityId.value=getAreaId('city', props.city, provinceId.value)
    countyList.value = getCity(cityId.value);
  }
  if(props.district){
    districtId.value=getAreaId('county', props.district, cityId.value)
  }
});


watch(
  () => [props.province, props.city, props.district],
  (newValue, oldValue) => {
    if(newValue[0]&&newValue[0]!=oldValue[0]){
      provinceId.value=getAreaId('province', newValue[0])
      cityList.value = getCity(provinceId.value);
      // console.log(newValue[0],cityId.value,districtId.value);
    }
    if(newValue[1]&&newValue[1]!=oldValue[1]){
      cityId.value=getAreaId('city', newValue[1], provinceId.value)
      countyList.value = getCity(cityId.value);
    }
    if(newValue[2]&&newValue[2]!=oldValue[2]){
      districtId.value=getAreaId('county', newValue[2], cityId.value)
    }

  }
);

// defineExpose({

// });
</script>

<style lang="scss" scoped>
</style>
