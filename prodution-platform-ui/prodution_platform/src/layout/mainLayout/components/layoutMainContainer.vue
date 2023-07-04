<template>
  <div
    ref="layoutMainContainer"
    class="layout_main_container"
    :style="{ width: getWidth }"
  >
    <!-- <Transition name="fade" mode="out-in">
      <RouterView />
    </Transition> -->

    <router-view v-slot="{ Component }">
      <transition>
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script name="LayoutMainContainer" setup>
import { computed } from "vue";

const props = defineProps({
  menuWidth: {
    type: Number,
    required: true,
  },
});

const getWidth = computed(() => {
  console.log("test", props.menuWidth);
  return `calc(100vh - ${props.menuWidth}px)`;
});
</script>

<style lang="scss" scoped>
.layout_main_container {
  height: 100%;
  flex-grow: 1;
  overflow: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
