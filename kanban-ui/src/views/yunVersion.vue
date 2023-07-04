<template>
    <div class="yunVersion">
       
    </div>
</template>

<script>

import {get} from '@/utils/request';
  export default {
    data() {
      return {
      
        
      };
    },
    created(){
        const hrefInfo = window.location.href
        console.log(hrefInfo)
        if(hrefInfo.indexOf('?')>-1){
            console.log(hrefInfo.split('?')[1])
            const val = hrefInfo.split('?')[1]
            if(val)this.getProduceMainDetail(val)
        }
    },
    
    methods: {
       //https://kb.aocai.cn/api/consumer/system/mesBwSysConfigManage/updateVersionCode/1/1.0.12
        getProduceMainDetail(version) {
            get({url:'/api/consumer/system/mesBwSysConfigManage/updateVersionCode/1/' + version}).then(res=>{

            })
        }
    }
   
  };
</script>
<style lang="scss" scoped>
</style>