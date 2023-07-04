<template>
  <div class="Sure_btn">确定</div>
</template>

<script name="CommonSureBtn" setup></script>

<style lang="scss" scoped>
.Sure_btn {
  min-width: 86px;
  height: 32px;
  box-sizing: border-box;
  padding: 0 16px;
  background-color: var(--default-main-color);
  border: 1px solid var(--default-main-color);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  font-size: 16px;
  font-family: Source Han Sans CN-Regular, Source Han Sans CN;
  font-weight: 400;
  color: #ffffff;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }

  .icon_img {
    width: 18px;
    height: 18px;
    margin-right: 4px;
  }
}
</style>
