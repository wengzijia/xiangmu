<template>
  <div class="ac-service" :style="serviceStyle">
    <img class="a-s-border" :src="borderImg" alt="" :style="'width:'+serviceStyle.width" />
    <ul class="a-s-btn-list">
      <li class="a-s-wx-code">
        <img class="a-s-wx-code-img" src="@/static/service/code_wx.png" alt="" />
      </li>
      <!-- <li class="a-s-qq-btn" @click="$emit('contactQQ')">
        <a href="//wpa1.qq.com/cPNJlL1B?_type=wpa&qidian=true" target="_blank" title="在线QQ客服" style="display: inline-block;width: 100%;height: 100%;">
          <img class="a-s-qq-btn-img" src="@/static/service/qq.png" alt="" />
        </a>
      </li> -->
      <li class="a-s-qq-btn" @click="qiyu">
        <a target="_blank" title="客服" style="display: inline-block;width: 100%;height: 100%;">
          <img class="a-s-qq-btn-img" src="@/static/service/qq.png" alt="" />
        </a>
      </li>
      <li class="a-s-tel-btn">
        <img class="a-s-tel-btn-img" src="@/static/service/tel-2.png" alt="" />
      </li>
      <li @click="backtop" v-if="btnNum==4">
        <!-- <img class="a-s-tel-btn-img" src="@/static/service/tel.png" alt="" /> -->
      </li>
    </ul>
  </div>
</template>

<script>
import qiyu from '@/mixins/qiyu';
export default {
  name: 'CustomerService2',
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
        backgroundImage: `url(${require('@/static/service/btn-list.png')})`,
        height: '290px',
        width: '80px',
      },
      borderImg: require('@/static/service/btn-border.png'),
    };
  },
  created() {
    if (this.btnNum === 4) {
      this.serviceStyle = {
        backgroundImage: `url(${require('@/static/service/4a_2.png')})`,
        height: '388px',
        'background-position': 'center'
      };
      this.borderImg = require('@/static/service/4b-2.png');
    }
  },
  methods: {
    backtop() {
      this.$emit('backtop');
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
  width: 114px;
  height: 290px;
  // background-image: url(../../static/service/btn-list.png);
  background-repeat: no-repeat;
  background-size: contain;
  // background-color: #fff;
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
  width: 114px;
  height: 100%;
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
  height: 60px;
  margin: 5px 0;
  position: relative;
  cursor: pointer;
}

.a-s-wx-code-img {
  width: 165px;
  bottom: 0;
  left: -170px;
  height: 200px;
}
.a-s-btn-list li.a-s-wx-code{
  height: 70px;
}
.a-s-btn-list li.a-s-qq-btn {
  height: 90px;
}
.a-s-btn-list li.a-s-tel-btn {
  height: 75px;
}
.a-s-qq-btn-img {
  width: 165px;
  bottom: 0;
  left: -170px;
  height: 80px;
}

.a-s-tel-btn-img {
  width: 165px;
  bottom: 0;
  left: -170px;
  height: 200px;
}
.a-s-btn-list li img {
  position: absolute;
  object-fit: contain;
  display: none;
}
.a-s-btn-list li:hover img {
  display: block;
}
</style>
