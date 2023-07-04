<template>
	<div>
		<el-select style="width: 120px" v-model="area.province" placeholder="请选择省份" filterable @change="selectCity">
			<el-option v-for="(item, index) in provinceList" :key="index" :label="item" :value="item" />
		</el-select>
		<el-select class="address" v-model="area.city" placeholder="请选择市" filterable @change="selectDistrict">
			<el-option v-for="(item, index) in cityList" :key="index" :label="item" :value="item" />
		</el-select>
		<el-select class="address" v-model="area.district" placeholder="请选择区" filterable @change="submitArea">
			<el-option v-for="(item, index) in districtList" :key="index" :label="item" :value="item" />
		</el-select>
	</div>
</template>

<script setup>
import { getCity, getProvince } from '@/utils/city'
const emits = defineEmits()
const props = defineProps({
	address:{
		type:Object||null,
		default:{
			province:'',//省
			city:'',//市
			district:''//区
		}
	}
})
const { address } = toRefs(props)
const provinceList = ref([])//省列表
const cityList = ref([])//市列表
const districtList = ref([])//区列表
const data = reactive({
	area:{
		province:'',//省
		city:'',//市
		district:''//区
	}
})
const { area } = toRefs(data)
const provinceIndex = ref('')//省index下标

watch(address,val=>{
	feedback(val)
})

if (address) {
	feedback(address.value)
}
//地区数据回显
function feedback(val){
	area.value.province = val?.province||''
	area.value.city = val?.city||''
	area.value.district = val?.district||''
	if (val?.province) {
		provinceIndex.value = provinceList.value.indexOf(val.province)
		cityList.value = getCity(provinceIndex.value)
	}
	if (val?.city) {
		districtList.value = getCity(provinceIndex.value+'_'+cityList.value.indexOf(address.value?.city))
	}
}

// 获得省份
provinceList.value = getProvince()
//获取市列表
function selectCity(val) {
	provinceIndex.value = provinceList.value.indexOf(val)
	cityList.value = getCity(provinceIndex.value)
	districtList.value = []
	area.value.city = ''
	area.value.district = ''
	emits('update:address', area.value)
}
//获取区列表
function selectDistrict(val){
	districtList.value = getCity(provinceIndex.value+'_'+cityList.value.indexOf(val))
	area.value.district = ''
	emits('update:address', area.value)
}
//提交地区数据
function submitArea(){
	emits('update:address', area.value)
}
//清空数据
const clearAddress = () => {
	area.value.province = ''
	area.value.city = ''
	area.value.district = ''
	cityList.value = []
	districtList.value = []
	emits('update:address', area.value)
}

defineExpose({
  clearAddress
})
</script>

<style lang="scss" scoped>
.address {
	width: 120px;
	margin-left: 10px;
}
</style>