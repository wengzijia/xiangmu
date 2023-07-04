<template>
  <el-row :gutter="20">
    <el-col :span="3"><div>拼一版首页</div></el-col>
    <el-col :span="3"><div>哞，欢迎来做包装</div></el-col>
    <el-col :span="3">
      <div></div>
    </el-col>
    <el-col :span="6" :offset="12">
      <!-- <div class="flex topNav">客户热线：0755-36567904  18820487869</div> -->
      <div class="topCart">
        <el-menu default-active="2" class="cart-nav" mode="horizontal" active-text-color="#fff" text-color="#fff" background-color="#d0514e" style="height:40px;line-height: 40px;">
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-shopping-cart-full"></i>购物车</template>
            <el-menu-item index="2-1"
              >购物车 <span>({{ $store.getters.cartNum }})</span></el-menu-item
            >
            <el-menu-item index="2-2">打样购物车 ({{ $store.getters.proofCartNum }})</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: 'HeaderCart',
  data() {
    return {};
  }
};
</script>
<style></style>
