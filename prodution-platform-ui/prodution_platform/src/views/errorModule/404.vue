<template>
    <div class="error404Box">
        <img :src="error404" alt="">
        <p>无权限~</p>
    </div>
</template>
<script setup name="404">
import error404 from "@/assets/images/error/404.png";
</script>

<style lang="scss" scoped>
.error404Box {
    width: 100%;
    height: 100%;
    position: relative;

    >img {
        position: absolute;
        width: 280px;
        height: 280px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -75%);

        
    }
    p {
            position: absolute;
            height: 24px;
            line-height: 24px;
            font-size: 16px;
            font-family: Source Han Sans CN-Regular, Source Han Sans CN;
            font-weight: 400;
            color: #333;
            // width: 100%;
            // text-align: center;
            left:50%;
            top:55%;
            transform: translateX(-50%);
            
        }

}
</style>