<template>
  <svg aria-hidden="true" class="svg-icon-spin" :style="{ width: w, height: h,color:color }">
    <use :xlink:href="symbolId" :fill="color"  />
  </svg>
</template>
  
<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'SvgIcon',
  props: {
    prefix: {
      type: String,
      default: 'icon'
    },
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: '#333'
    },
    w: {
      type: String,
      default: '22px'
    },
    h: {
      type: String,
      default: '22px'
    },
  },
  setup(props) {
    const symbolId = computed(() => `#${props.prefix}-${props.name}`)
    return { symbolId }
  }
})
</script>
<style lang="scss" scoped>
.svg-icon-spin {
  fill: currentColor;
  vertical-align: middle;
}
</style>