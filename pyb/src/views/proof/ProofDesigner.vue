<template>
  <div class="comBox">
    <div class="daySbox">
      <ul class="daySboxUl">
        <li class="curr">门店详情</li>
      </ul>
      <div class="daySboxCot" v-html="proofDesigner.content">
      </div>
    </div>
  </div>
</template>

<script>
import { getDefaultDesigner } from '@/api/proof/designerExtendApi';

export default {
  name: 'ProofDesigner',
  data() {
    return {
      proofDesigner: {}
    };
  },
  created() {
    getDefaultDesigner().then(res => {
      this.proofDesigner = res.data;
    });
  }
};
</script>

<style scoped src="../../static/mulindex/css/index.css"></style>
