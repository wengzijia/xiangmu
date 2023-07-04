<template>
  <div class="noDataBox">
    <van-overlay :show="hasOrderShow" @click.stop="closeHiddenBox('hasOrderShow')" class="has-order-show">
      <div class="wrapper" @click.stop="closeHiddenBox('hasOrderShow')">
        <div class="block">
          <p>目前暂无订单,请去待排产列表选单</p>
          <div class="order-button">
            <button @click="closeHiddenBox('hasOrderShow')">取消</button>
            <button @click="$router.push(`/orderList/waitingList`)">确定</button>
          </div>
          <span @click="closeHiddenBox('hasOrderShow')" class="layer-close"><van-icon name="cross"/></span>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
export default {
  name: "noData",
  props:['nextOrderInfo'],
  data() {
    return {
      hasOrderShow:true
    }
  },
  created() {
  },
 
  methods: {
    //这是打开遮罩层的方法
    openHiddenBox(params) {
      this.$data[params] = true;
      // 处理遮罩层出现后，遮罩层下的页面仍然可以滚动的问题，（遮罩层内的内容仍然可以滚动）
      this.scrollTop = document.scrollingElement.scrollTop;
      document.body.classList.add('dialog-open');
      document.body.style.top = -this.scrollTop + 'px';
      this.$emit('setNoData',false)
    },
    //这是关闭遮罩层的方法
    closeHiddenBox(params) {
      console.log('wo dian ji ')
      this.$data[params] = false;
      // 处理遮罩层出现后，遮罩层下的页面仍然可以滚动的问题，（遮罩层内的内容仍然可以滚动）
      document.body.classList.remove('dialog-open');
      document.scrollingElement.scrollTop = this.scrollTop;
      this.$emit('setNoData',false)
    },
    
  },
  
}
</script>

<style scoped lang="scss">
.noDataBox{
  .has-order-show {
    .wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;

      .block {
        width: 1300px;
        height: 800px;
        border-radius: 20px;
        background: #ffffff;
        position: relative;

        p {
          font-size: 40px;
          color: #262626;
          margin-top: 264px;
          text-align: center;
        }

        .order-button {
          margin: 226px auto 0;
          width: 840px;
          display: flex;
          justify-content: space-between;

          button {
            width: 280px;
            height: 80px;
            font-size: 40px;

            &:nth-child(1) {
              background: #FFFFFF;
              border-radius: 10px 10px 10px 10px;
              opacity: 1;
              border: 2px solid #8C8C8C;
              color: #8C8C8C;
            }

            &:nth-child(2) {
              background: #3D7EFF;
              border-radius: 10px 10px 10px 10px;
              border: none;
              color: white;
            }
          }
        }

        .layer-close {
          position: absolute;
          top: 0;
          right: 0;
          width: 100px;
          line-height: 100px;
          text-align: center;
          font-size: 50px;
          color: #8C8C8C;
        }
      }
    }
  }
}
</style>

