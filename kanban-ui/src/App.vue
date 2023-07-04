<template>
  <div >
    <router-view></router-view>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
    };
  },
};
</script>
<style lang="scss">
body,html{
  background: white;
}
*{ 
 -webkit-touch-callout:none; /*系统默认菜单被禁用*/
 -webkit-user-select:none; /*webkit浏览器*/
 -khtml-user-select:none; /*早期浏览器*/
 -moz-user-select:none;/*火狐*/
 -ms-user-select:none; /*IE10*/
 user-select:none; 
} 
input{ 
 -webkit-user-select:auto; /*webkit浏览器*/ 
}
textarea{
 -webkit-user-select:auto; /*webkit浏览器*/
}

</style>
<style>
.van-toast{
  min-width: 200px !important;
  min-height: 100px !important;
  font-size: 30px !important;
  line-height: 35px !important;
}
::-webkit-scrollbar{display:none;}
.viewer-title {
    color: #ccc;
    display: inline-block;
    font-size: 36px !important;
    width: 100%;
    margin: 0 !important;
    opacity: 0.8;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: opacity 0.15s;
    white-space: nowrap;
    position: fixed;
    left: 50%;
    top: 10px;
    transform: translateX(-50%);
}


</style>
