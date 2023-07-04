<template>
  <el-image
    :src="`${BASE_FILE_URL+realSrc}`"
    fit="cover"
    :style="`width:${realWidth};height:${realHeight};display:inline-block;`"
    :preview-src-list="realSrcList"
    append-to-body="true"
  >
    <template #error>
      <div class="image-slot">
        <el-icon><picture-filled /></el-icon>
      </div>
    </template>
  </el-image>
</template>

<script setup>
import {BASE_FILE_URL,BASE_UPLOAD_FILE_URL} from "@/store/global-constant";
const props = defineProps({
  src: {
    type: String,
    default: ""
  },
  width: {
    type: [Number, String],
    default: "300"
  },
  height: {
    type: [Number, String],
    default: "200"
  }
});

const realSrc = computed(() => {
  if (!props.src) {
    return;
  }
  let real_src = props.src.split(",")[0];
  return real_src;
});

const realSrcList = computed(() => {
  if (!props.src) {
    return;
  }
  let real_src_list = props.src.split(",");
  let srcList = [];
  real_src_list.forEach(item => {
    return srcList.push(BASE_FILE_URL+item);
  });
  return srcList;
});

const realWidth = computed(() =>
  typeof props.width == "string" ? props.width : `${props.width}px`
);

const realHeight = computed(() =>
  typeof props.height == "string" ? props.height : `${props.height}px`
);
function fileUrl(url) {
	if (url.indexOf('http')!=-1) {
		return url
	}else{
		return BASE_FILE_URL+url
	}
}
</script>

<style lang="scss" scoped>
.el-image {
  border-radius: 5px;
  background-color: #ebeef5;
  box-shadow: 0 0 5px 1px #ccc;
  :deep(.el-image__inner) {
    transition: all 0.3s;
    cursor: pointer;
    &:hover {
      transform: scale(1.2);
    }
  }
  :deep(.image-slot) {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: #909399;
    font-size: 30px;
  }
}
</style>
