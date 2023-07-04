<template>
  <div style="font-size: 14px">
    <div class="headInfo">
      <img class="imgbox"  :src="BASE_FILE_URL + baseInfo.licenseImageUrl" alt="" />
      <div class="infoBox">
        <p class="marginBottom">
          {{ baseInfo.customerName }}
          <el-icon class="copyTxt" v-if="baseInfo.customerName" v-copyText="baseInfo.customerName"
            v-copyText:callback="copyTextSuccess">
            <CopyDocument />
          </el-icon>
        </p>
        <div class="info">
          <p class="generalInfo marginBottom">
            <span style="border-right: 1px solid #ddd">ID：{{ customerInfo.customerNumber }}</span>
            <span>客户联系人：{{ firstName }}</span>
            <span>联系电话：{{ firstPhone }}</span>
            <span>客户评级：{{ statisticsInfo.customerGrading ? statisticsInfo.customerGrading + '级' : '-' }}</span>
            <span>业务员：{{ customerInfo.businessStaffName }}</span>
            <span>客户录入日期：{{ customerInfo.customerEntryDate }}</span>
          </p>
          <p class="generalInfo marginBottom" style="display: flex">
            <span>累积合作订单数：{{
              statisticsInfo.cumulativeOrderNumber
            }}</span>
            <span>今年合作订单数：{{
              statisticsInfoBase
              ? statisticsInfoBase.thisYearCumulativeOrderNumber
              : '-'
            }}</span>
            <span style="display: flex">
              <span>结算方式：</span>
              <span v-if="!baseInfo.moreSettlementMethodId">立结</span>
              <settlementMethod  v-if="baseInfo.moreSettlementMethodId" :methodId="baseInfo.moreSettlementMethodId" :methodList="methodList" />
            </span>
          </p>
        </div>
        <el-menu :default-active="activeIndex" class="navMenu" mode="horizontal" :ellipsis="false" @select="handleSelect">
          <el-menu-item :index="item.id" v-for="item in infoList" :key="item.id">{{ item.name }}</el-menu-item>
        </el-menu>
      </div>
    </div>
    <main-content :tabType="tabType" :contactsList="contactsList" :baseInfo="baseInfo" :invoiceList="invoiceList"
      :addressList="addressList" :management="management" :statisticsInfo="statisticsInfo" :methodList="methodList"
      :lawsuitList="lawsuitList" :establishedList="establishedList" :rankingList="rankingList"
      :registeredList="registeredList" :staffSizeList="staffSizeList"
      :managementSoldTypeList="managementSoldTypeList"></main-content>
  </div>
</template>

<script setup>
// 域名
import { BASE_FILE_URL } from '@/store/global-constant'
import mainContent from './components/mainContent'
import settlementMethod from '@/components/settlementMethod/index.vue'
import { customerDetail } from '@/api/orderManagement/customer/index'
import { gradingCalculate } from '@/api/orderManagement/subOrder'
// 获取字典管理--配置的状态
const { proxy } = getCurrentInstance()
const route = useRoute()
const data = reactive({
  infoList: [
    {
      name: '基本信息',
      id: '1',
    },
    {
      name: '客户经营信息',
      id: '2',
    },
    {
      name: '风险信息',
      id: '3',
    },
    {
      name: '客户交易记录',
      id: '4',
    },
  ],
  tabType: '1',
  activeIndex: '1',
  customerInfo: '',
  baseInfo: {}, //基础信息
  statisticsInfo: {}, //客户统计数据
  statisticsInfoBase: '', //客户统计今年数据
  contactsList: [], //联系人
  invoiceList: [], //开票信息
  addressList: [], //收货地址
  methodList: [],
  lawsuitList: [],
  establishedList: [],
  rankingList: [],
  registeredList: [],
  staffSizeList: [],
  managementSoldTypeList: [],
  firstName: '',
  firstPhone: '',
  management: {}, //客户经营信息
})
const {
  infoList,
  activeIndex,
  tabType,
  customerInfo,
  baseInfo,
  contactsList,
  invoiceList,
  addressList,
  statisticsInfo,
  statisticsInfoBase,
  firstName,
  firstPhone,
  management,
  methodList,
  lawsuitList,
  rankingList,
  registeredList,
  establishedList,
  staffSizeList,
  managementSoldTypeList,
} = toRefs(data)

// 获取结算方式
const gradingCalculateFn = () => {
  gradingCalculate().then((res) => {
    // console.log('获取结算方式=====', res)
    methodList.value = res.data.more_settlement_method
    // 成立时间
    establishedList.value = res.data.established_time
    // 是否有诉讼
    lawsuitList.value = res.data.exist_lawsuit
    // 行业排名
    rankingList.value = res.data.industry_ranking
    // 注册资金
    registeredList.value = res.data.registered_capital
    // 人员规模
    staffSizeList.value = res.data.staff_size

  })
}
gradingCalculateFn()
const customerDetailFn = (id) => {
  customerDetail(id).then(async (res) => {
    if (res.code == 200) {
      customerInfo.value = res.data
      baseInfo.value = res.data.baseInfo
      contactsList.value = res.data.contactsList
      statisticsInfo.value = res.data.statisticsInfo
      statisticsInfoBase.value = res.data.statisticsInfoBase
      firstName.value = res.data.contactsList[0].contactsName
      firstPhone.value = res.data.contactsList[0].contactsPhone
      invoiceList.value = res.data.invoiceList
      addressList.value = res.data.addressList
      management.value = res.data.management
      managementSoldTypeList.value = res.data.managementSoldTypeList

    }
  })
}
customerDetailFn(route.query.id)
// customerDetailFn('2212011708279411622')
// tab栏
const handleSelect = (key, keyPath) => {
  tabType.value = key
  // console.log(key, keyPath)
}
/** 复制代码成功 */
function copyTextSuccess () {
  proxy.$modal.msgSuccess('复制成功')
}
</script>

<style scoped>
ul,
li {
  list-style: none;
}

p {
  margin: 0;
  padding: 0;
}

.headInfo {
  background: #fff;
  padding: 20px;
  display: flex;
  box-shadow: var(--el-box-shadow-light);
  /* border-bottom: solid 1px var(--el-menu-border-color); */
  font-size: 14px;
  padding-bottom: 0;
  box-sizing: border-box;
}

.marginBottom {
  margin-bottom: 22px;
}

.navMenu {
  user-select: none;
  margin-left: -20px;
}

.imgbox {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  /* background: red; */
  margin-right: 10px;
}

.infoBox {
  width: 100%;
}

.info {
  width: 100%;
  color: #5a5a5a;
  font-size: 12px;
}

.generalInfo>span {
  padding: 4px 26px;
}

.generalInfo>span:first-child {
  padding-left: 0;
}

.copyTxt {
  margin-left: 10px;
  color: #ccc;
  font-size: 16px;
  cursor: pointer;
}
</style>
