<template>
  <div class="ac-service" :style="serviceStyle">
    <img class="a-s-border" :src="borderImg" alt="" />
    <ul class="a-s-btn-list">
      <li class="a-s-wx-code"> 
        <!--  @mousemove="moveAll('showCode')" @mouseleave="leaveAll('showCode')" -->
        <!-- <Transition name="slide-fade"> -->
        <img class="a-s-wx-code-img" src="@/static/service/code_wx.png" alt="" />
        <!-- </Transition> -->
      </li>
      <li class="a-s-qq-btn" @click="qiyu">
        <a target="_blank" title="客服" style="display: inline-block;width: 100%;height: 100%;">
          <!-- <Transition name="slide-fade"> -->
          <img src="@/static/service/qq.png" alt="" :class="'a-s-qq-btn-img '" />
          <!-- </Transition> -->
        </a>
      </li>
      
      <!-- <li class="a-s-qq-btn" @click="$report({ channel: 101005, actionId: 2 })">
         @mousemove="moveAll('showClass')" @mouseleave="leaveAll('showClass')"
        <a href="//wpa1.qq.com/cPNJlL1B?_type=wpa&qidian=true" target="_blank" title="在线QQ客服" style="display: inline-block;width: 100%;height: 100%;">
          <Transition name="slide-fade">
          <img src="@/static/service/qq.png" alt="" :class="'a-s-qq-btn-img '" />
          </Transition>
        </a>
      </li> -->
      <li class="a-s-tel-btn" >
        <!-- @mousemove="moveAll('showTel')" @mouseleave="leaveAll('showTel')" -->
        <!-- <Transition name="slide-fade"> -->
        <img class="a-s-tel-btn-img" src="@/static/service/tel-2.png" alt="" />
        <!-- </Transition> -->
      </li>
      <li @click="backtop" v-if="btnNum == 4">
        <!-- <img class="a-s-tel-btn-img" src="@/static/service/tel.png" alt="" /> -->
      </li>
    </ul>
  </div>
</template>

<script>
import qiyu from '@/mixins/qiyu';
export default {
  name: 'CustomerService',
  mixins: [qiyu],
  props: {
    btnNum: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      serviceStyle: {
        backgroundImage: `url(${require('@/static/service/btn_list.png')})`,
        height: '290px'
      },
      borderImg: require('@/static/service/btn-border.png'),
      showClass: false,
      Inter: null,
      showCode: false,
      showTel: false,
      ysf: null
    };
  },
  created() {
    const _this = this;
    _this.leaveAll('showClass');
    // if (this.btnNum === 4) {
    //   this.serviceStyle = {
    //     backgroundImage: `url(${require('@/static/service/4a.png')})`,
    //     height: '365px'
    //   };
    //   this.borderImg = require('@/static/service/4b.png');
    // }
    
  },
  // beforeDestroy() {
  //   clearInterval(this.Inter);
  // },
  methods: {
    backtop() {
      this.$emit('backtop');
    },
    moveAll(key = 'showCode') {
      let _this = this;
      _this[key] = true;
      if (key == 'showClass') {
        clearInterval(_this.Inter);
      }
    },
    leaveAll(key = 'showCode') {
      let _this = this;
      _this[key] = false;
      if (key == 'showClass') {
        _this.Inter = setInterval(() => {
          _this.showClass = !_this.showClass;
          // 要执行的函数
        }, 3000);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.ac-service {
  position: fixed;
  z-index: 99;
  bottom: 20px;
  right: 30px;
  width: 80px;
  height: 290px;
  // background-image: url(../../static/service/btn-list.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-color: #fff;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  /* border: 1px red solid; */
}

/* 元素闪烁动画 */
@keyframes dom-opacity {
  0% {
    opacity: 1;
  }
  20% {
    opacity: 0.6;
  }
  40% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.2;
  }
  60% {
    opacity: 0.6;
  }
  80% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}
.a-s-border {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 80px;
  height: auto;
  object-fit: contain;
  animation: dom-opacity 1s infinite;
}
.a-s-btn-list {
  position: absolute;
  width: 100%;
  bottom: 0;
}
.a-s-btn-list li {
  width: 100%;
  height: 75px;
  margin: 5px 0;
  position: relative;
  cursor: pointer;
}

.a-s-wx-code-img {
  width: 165px;
  bottom: 0;
  left: -170px;
  height: 200px;
  // display: block !important;
}

.a-s-qq-btn-img {
  width: 165px;
  bottom: 0;
  left: -170px;
  height: 80px;
  // display: block !important;
  // transform: translateX(100px);
  // opacity: 0;
  // transition: all 1s;
}

.a-s-tel-btn-img {
  width: 165px;
  bottom: 0;
  left: -170px;
  height: 200px;
  // display: block !important;
}
.a-s-btn-list li img {
  position: absolute;
  object-fit: contain;
  display: none;
}
.a-s-btn-list li:hover img {
  display: block;
  // transition: all .5s ease;
  opacity: 1;
}
.show_hint {
  opacity: 1;
  transition: all 0.3s ease-out;
}
/*
  进入和离开动画可以使用不同
  持续时间和速度曲线。
*/
.slide-fade-enter-active {
  transition: all 0.4s ease;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

// .slide-fade-enter-from{
//   transform: translateX(100px);
//   opacity: 0;
// }
.slide-fade-enter,
.slide-fade-leave-to {
  left: -150px;
  opacity: 0;
}
</style>
