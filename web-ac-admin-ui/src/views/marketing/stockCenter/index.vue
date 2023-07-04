<template>
  <div class="app-container app-container_bg">
    <div style="background-color: #fff;">
      <div style="padding:16px;border-bottom: 1px solid #C1CBDB;">
        业务领券中心
      </div>
      <div style="padding: 20px;">
        <div id="header">
          <!-- 领取优惠券 -->
          <div style="padding-bottom: 24px;border-bottom: 1px solid #E4E7ED;">
            <div>
              领取优惠券
            </div>
            <div style="display: flex;margin-left: 68px;margin-top:20px;align-items: center;">
              <span style="color: #F56C6C;">* </span>
              <span style="margin-right: 12px;">优惠券名称</span>
              <el-select v-model="stockType" @change="changeSelect" style="margin-right: 14px;">
                <el-option v-for="(item, index) in stockTypeArr" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <div>
                <el-button type="primary" :disabled="counponData.status != 1" @click="receiveVisible = true">领取</el-button>
              </div>
            </div>
            <div v-if="counponData.status != 1" style="margin-left: 168px;margin-top: 12px;font-size: 12px;color: #F56C6C;">
              当前你可领取已超过数量额度限制，请下月再领取
            </div>
            <div style="margin-left: 168px;margin-top: 12px;font-size: 12px;color: #F56C6C;">
              当前余量：{{ counponData.residueNumber || 0 }}
            </div>
          </div>
          <!-- 我的优惠券 -->
          <div style="margin-top: 24px;">
            <div style="margin-bottom: 16px;">
              我的优惠券
            </div>
            <div style="margin-bottom: 16px;">
              <el-select v-model="searchData.couponType" placeholder="请选择优惠券类型">
                <el-option
                  v-for="(it,index) in couponType"
                  :key="index"
                  :label="it.label"
                  :value="it.value"
                />
              </el-select>
              <el-select v-model="searchData.useUserId" filterable placeholder="请输入使用用户手机号" remote :remote-method="changePhone" :teleported='false'
                v-el-select-loadmore="loadmore" style="margin-left: 16px;">
                <el-option
                  v-for="(it,index) in mobile"
                  :key="index"
                  :label="it.label"
                  :value="it.value"
                />
              </el-select>
              <el-button @click="search" type="primary" style="margin-left:16px;">查询</el-button>
              <el-button @click="clearData">清空</el-button>
            </div>
            <el-tabs v-model="status" class="demo-tabs" @tab-change="handleClick">
              <el-tab-pane label="全部" name=""></el-tab-pane>
              <el-tab-pane label="已领取待赠送" name="1"></el-tab-pane>
              <el-tab-pane label="未使用" name="2"></el-tab-pane>
              <el-tab-pane label="已使用" name="3"></el-tab-pane>
              <el-tab-pane label="使用中" name="4"></el-tab-pane>
              <el-tab-pane label="已过期" name="5"></el-tab-pane>
              <el-tab-pane label="已作废" name="6"></el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <Table :listArr="listArr" :tableData="tableData.records" :total="tableData.total" @refer="search" :tableHeight="visualHeight">
          <template #couponStatus>
            <el-button @click="detailsExport">导出</el-button>
          </template>
          <template #col-operate="{ row }">
            <el-button v-if="row.status == 1" @click="clickGiving(row)" type="primary" text>赠送</el-button>
          </template>
        </Table>
      </div>
    </div>
    <receiveCouponDialog v-if="receiveVisible" :visible="receiveVisible" :counponData="counponData" :data="stockType" @close="handleClose" />
    <givingCouponDialog v-if="givingVisible" :visible="givingVisible" :couponListItem="couponListItem"  @close="handleClose" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { gainCouponTypeLists, gainCouponPlanCheckWhetherItIsAvailable, myCouponDrawPage, listAllPage,
         miniCouponType } from '@/api/marketing/marketing.js'
import Table from '../components/Table'
import { listArr } from './configure.js'
import receiveCouponDialog from './components/receiveCouponDialog.vue';
import givingCouponDialog from './components/givingCouponDialog.vue';

let couponType = ref([{label: '全部', value: ''}])
// 获取优惠券类型
miniCouponType().then(res => {
  couponType.value = couponType.value.concat(res.data.map(el => {
    return {
      value: el.couponType,
      label: el.couponName
    }
  }))
})

// 赠送优惠券
const couponListItem = ref({})
const clickGiving = (row) => {
  couponListItem.value = row
  givingVisible.value = true
}

const stockType = ref()
const stockTypeArr = ref([])
// 获取可领取的列表
gainCouponTypeLists().then(res => {
  if (res.data.length) {
    stockTypeArr.value = res.data.map(el => { return {...el,value: el.couponType, label: el.couponName} })
  }
})

const counponData = ref({})
// 是否可领取当前优惠券
const changeSelect = (val=stockType.value) => {
  gainCouponPlanCheckWhetherItIsAvailable({couponType: val}).then(res => {
    counponData.value = res.data
  })
}

const receiveVisible = ref(false)
const givingVisible = ref(false)
const handleClose = () => {
  receiveVisible.value = false
  givingVisible.value = false
  getList()
  changeSelect()
}

let searchData = ref({
  couponType: '',
  useUserId: ''
})
const search = (data) => {
  data.status = status.value
  searchData.value = {...searchData.value, ...data}
  getList()
}
const clearData = () => {
  searchData.value.couponType = ''
  searchData.value.useUserId = ''
  getList()
}

// tab 类型
const tableData = ref([])
const status = ref('')
const handleClick = () => {
  searchData.value.current = 1
  searchData.value.status = status.value
  getList()
}

const getList = () => {
  myCouponDrawPage(searchData.value).then(res => {
    tableData.value = res.data
  })
}

// 根据输入查询手机号
const mobile = ref([])
const getMobileData = {
    pageNum: 1,
    pagesize: 10,
    phoneNumber: ''
  }
let time = null
const getMobile = () => {
  if (time) {
    return
  }
  time = setTimeout(() => {
    listAllPage(getMobileData).then(res => {
      res.rows = res.rows.map(e => {
        let obj = { value: e.userId }
        if (e.isMember == 1) {
          obj.label = (e.adminMobile || e.phoneNumber || e.qqMobile)+ ' (后台)'
        } else if (e.phoneNumber) {
          obj.label = e.phoneNumber + '(官网)'
        } else if (e.qqMobile) {
          obj.label = e.qqMobile + '(微信)'
        }
        if (!obj.label) {
          return null
        }
        return obj
      }).filter(e => e)
      if (getMobileData.pageNum == 1) {
        mobile.value = res.rows
      } else {
        mobile.value = mobile.value.concat(res.rows)
      }
    }).finally(() => {
      time = null
    })
  }, 100)
  
}
getMobile()
const loadmore = () => {
  getMobileData.pageNum += 1
  getMobile()
}

const changePhone = (value) => {
  getMobileData.pageNum = 1
  if (value) {
    getMobileData.phoneNumber = value
  }
  getMobile()
}

// 计算高度
const visualHeight = ref(0)
const onSize = () => {
  let clientHeight = document.body.clientHeight
  let headerHeight = document.getElementById('header')?.clientHeight || 0
  // 40 整体的 内边距 56 是整体表格的内外边距之和 56 是分页占据空间 50  是最顶部的标题栏
  visualHeight.value = clientHeight - (headerHeight + 40 + 40 + 56 + 56 + 50 + 20)
}

onBeforeMount(() => {
  window.addEventListener('resize', onSize)
  nextTick(() => {
    onSize()
  })
})
onUnmounted(() => {
  window.removeEventListener('resize', onSize)
})
</script>