<template>
  <div>
    <div class="UP_right_List">兑换优惠券</div>
    <div class="Down_right_List">
      <div class="clear"></div>
      <div class="topDistance Name_Part">
					<span class="leftList_font">
						<em style="color:#C00;">*</em>
						优惠券编码：
					</span>
        <div class="manOr_women">
          <input type="text" class="" id="code" v-model="bonusSn" placeholder="请输入优惠券编码" style="border: 1px solid #ddd;padding: 6px 8px;">
        </div>
      </div>
      <div class="clear"></div>
      <div class="sureButton">
        <button style="padding: 6px 12px;background: #e60021;border: 0;color: #fff;cursor: pointer;" @click="handlerSubmit">兑换优惠券</button>
      </div>
    </div>
  </div>
</template>

<script>
import { receiveUserBonus } from '@/api/users/userBonusApi';
export default {
  name: 'UserBonusExchange',
  data() {
    return {
      bonusSn: ''
    };
  },
  methods: {
    handlerSubmit() {
      if (!this.bonusSn) {
        this.$message({ type: 'error', message: '请输入优惠券编码' });
        return false;
      }
      receiveUserBonus({bonusSn: this.bonusSn}).then(() => {
        this.$message({ type: 'success', message: '领取优惠券成功' });
      });
    },
  }
}
</script>
<style scoped src="../../static/index/user/css/all.css" />
