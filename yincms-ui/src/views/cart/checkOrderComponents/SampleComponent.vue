<template>
  <div>
    <fieldset class="layui-elem-field layui-field-title" style="margin-top: 20px;">
      <legend>大货寄样</legend>
    </fieldset>
    <div class="yangBox">
      <div class="layui-col-md12">
        <div class="layui-card" v-if="isSample">
          <div class="layui-card-body" v-if="hasSampleAddress">
            <div class="opt layui-form">
              <el-radio-group v-model="isSampleChecked">
                <el-radio :label="sample.id">{{ sample.contacts + '&nbsp;' + sample.mobile + '&nbsp;' + sample.city + '&nbsp;' + sample.address }}</el-radio>
              </el-radio-group>
            </div>
            <div class="layui-card-body">
              <!-- <button class="layui-btn layui-btn-primary layui-btn-sm" id="canceladdress" @click="cancelSampleAddress">取消大货寄样</button> -->
              <button class="layui-btn layui-btn-primary layui-btn-sm" id="sampleaddress" @click="showSample(1)">修改寄样地址</button>
            </div>
          </div>
          <div class="layui-card-body" v-else>
            <button class="layui-btn layui-btn-primary layui-btn-sm" id="sampleaddress" @click="showSample(0)">添加寄样地址</button>
          </div>
          <div class="layui-form-mid layui-word-aux">大货寄样：指成品大货直接发送到您指定的收货地址，同时额外寄送5个同批生产的成品样品给您，方便您及时查看成品大货的质量，<span class="red">配送方式为顺丰到付。</span></div>
        </div>
        <div v-else>
          <div class="layui-form-mid layui-word-aux">数码品类不支持大货寄样。</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SampleComponent',
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped></style>
<style scoped src="../../static/index/css/shopping.css"></style>
<style scoped src="../../static/assets/layui/css/layui.css" media="all"></style>
<style scoped src="../../static/index/css/magic-check.css"></style>
<style scoped src="../../static/index/css/base.css"></style>
<style scoped src="../../static/index/css/common.css"></style>
<style scoped src="../../static/index/user/css/all.css" />
