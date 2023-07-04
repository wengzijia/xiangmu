<!-- fengjianbo -->
<template>
  <div>
    <div class="footBottom">
      <div class="comBox">
        <p class="footBottomPt">
          <router-link to="/news/detail?id=96" target="_blank">关于傲彩</router-link>
          <router-link to="/news/detail?id=98" target="_blank">服务协议</router-link>
          <router-link to="/news/detail?id=97" target="_blank">联系我们</router-link>
          <router-link to="/producer/joinProducer" target="_blank">生产商</router-link>
          <router-link to="/news/detail?id=140" target="_blank">人才招聘</router-link>
          <router-link to="/news/detail?id=183" target="_blank">资质证书</router-link>
        </p>
        <p class="footBicp"><a href="//beian.miit.gov.cn" rel="nofollow" target="_blank">粤ICP备17066124号</a><span>|</span>版权所有 深圳市七彩祥云信息技术有限公司</p>
        <!--        <p>傲彩智能报价系统、智能刀模系统、智能拼版系统已经取得国家软件著作权与专利证书，受国家法律保护，<span class="red">未经许可，冒用必究！</span></p>-->
        <div class="footBimgBx">
          <a href="//cn.unionpay.com/" class="footBimg1" target="_blank"></a>
          <a href="//www.alipay.com/" class="footBimg2" target="_blank"></a>
          <a href="//szcert.ebs.org.cn/12d872e3-f165-4c0c-8c62-1b9d9ac92bba" class="footBimg3" target="_blank"></a>
        </div>
      </div>
    </div>
    <CustomerService></CustomerService>
    <!-- <div class="livechat-girl animated" @mousemove="hoverMove(false)" @mouseout="hoverOut(false)">
      <a href="//wpa1.qq.com/cPNJlL1B?_type=wpa&qidian=true" target="_blank" class="im-qq qq-a" title="在线QQ客服">
        <img class="girl" src="@/static/active/images/en_3.png" />
        <div :class="'livechat-hint rd-notice-tooltip rd-notice-type-success rd-notice-position-left single-line ' + (showClass ? 'show_hint' : '')">
          <div class="rd-notice-content">嘿，我来帮您！</div>
        </div>
      </a>
      <div :class="'animated-circles' + (showClass ? ' animated' : '')">
        <div class="circle c-1"></div>
        <div class="circle c-2"></div>
        <div class="circle c-3"></div>
      </div>
    </div> -->
    <!-- git弹出对联 -->
    <!-- <div v-if="couplets">
      <div class="coupletsGif" @click="animations">
        <img src="@/static/mulindex/img/human.gif" alt="" />
      </div>
      <div class="coupletsText" v-show="show3">
        <div>
          <img v-if="show2" src="@/static/mulindex/img/animation.gif" alt="" />
          <img v-else src="@/static/mulindex/img/animation04.gif" alt="" />
        </div>
      </div>
    </div> -->

    <div v-if="imgShow">
      <div v-if="advertisement" class="qwer" style="width: 190px; height: 520px; display: block; position: fixed; bottom: 70px; left: 20px; z-index: 99">
        <a class="close" @click="closeAD" style="font-size:22px;">
          <i class="el-icon-error"></i>
        </a>
        <!-- <a href="/news/detail?id=177" class="active1"></a> -->
        <a @click="activefn('t')" class="active1"></a>
        <a @click="activefn('b')" class="active2">
          <!-- <img src="../../static/ironActivity/index/bjimg.png" alt=""> -->
        </a>
        <!-- <a href="/disposable" class="active3"></a> -->
      </div>
      <!-- <a href="/news/detail?id=177">
        <img src="../../static/mulindex/img/index/bottomActivityimg.png" style="width: 200px; height:350px;display: block; position: fixed;bottom: 150px;right: 32px;cursor: pointer;z-index:99999" />
      </a> -->
    </div>
    <!-- 邮费补贴 -->
    <div v-if="feeShow" style=" height:314px; display: block; position: fixed; bottom: 70px; right: 20px; z-index: 99">
      <span class="close" @click="feeShow = false" style="font-size:22px;position: relative;z-index: 10000;">
        <i class="el-icon-error"></i>
      </span>
      <a href="/news/detail?id=181">
        <img src="../../static/mulindex/img/index/8_9/right.png" style="width: 180px; display: block; position: fixed;bottom: 150px;right: 32px;cursor: pointer;z-index:99999" />
      </a>
    </div>
    <!-- <el-dialog :visible.sync="outerVisible" width="10%" center show-close="flase"> </el-dialog> -->
    <!-- 新年品类开工通知 -->
    <!-- <div v-if="viewShow == 1" class="viewShow"> -->
    <!-- <div class="viewShow" v-if="notice">
      <div class="imgView">
        <div style="position: relative;">
          <a href="/news/detail?id=181"><img src="../../static/mulindex/img/index/8_9/middle.png" style="width:390px;" alt=""/></a>
          <span class="iknow" @click="notice = 0">{{ noticeShowTime }}s关闭</span>
        </div>
      </div>
    </div> -->

    <div class="viewShow" v-if="notice">
      <div class="imgView">
        <div style="position: relative;">
          <!-- <a href="/news/detail?id=178"><img src="../../static/mulindex/img/index/8_9/middle.png" style="width:390px;" alt=""/></a> -->
          <!-- <img src="../../static/mulindex/img/newYearSkin/active2.png" style="max-width:850px;max-height:80vh;" alt="" /> -->
          <img src="../../static/mulindex/img/newYearSkin/dano.png" style="max-width:850px;max-height:80vh;" alt="" />
          <span class="iknow" @click="notice = false">关闭</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reported } from '@/utils/goodsUtil';
import CustomerService from './CustomerService.vue';
export default {
  components: {
    CustomerService
  },
  name: 'FootBottom',
  data() {
    return {
      showClass: false,
      imgShow: false,
      feeShow: false,
      advertisement: true,
      //   newHappy: true,
      // couplets: true,
      show3: false,
      show2: true,
      times: null,
      viewShow: 1,
      pop: false,
      notice: false,
      noticeShowTime: 3,
      hours: '',
      minutes: '',
      seconds: '',
      outerVisible: true
    };
  },
  created() {
    const _this = this;
    setInterval(function() {
      _this.showClass = !_this.showClass;
    }, 3000);

    this.getTime();
    // console.log('$route.path', this.$route.path);
    if (this.$route.path == '/packagingSolution/listsPackes' || this.$route.path == '/packagingSolution/packagingSolution' || this.$route.path == '/packagingSolution/packageDetails' || this.$route.path == '/packagingSolution/packageList') {
      this.imgShow = false;
    }
    // // 判断是否显示左右两边的新年烟花
    // if (this.$route.path == '/login' || this.$route.path == '/register') {
    //   // if (this.$route.path == '/index/index' || this.$route.path == '/login' || this.$route.path == '/register') {
    //   this.couplets = false;
    // }
    // 判断是否有值，用于判断显示24后弹窗
    // if (localStorage.getItem('viewShow')) {
    //   this.viewShow = parseInt(localStorage.getItem('viewShow'));
    //   // console.log(this.viewShow);
    // } else {
    //   localStorage.setItem('viewShow', 1);
    // }
    // this.delayHours();
  },
  mounted() {
    let _this = this;
    _this.noticeShowFun();
    // _this.resize();
    // window.onresize = function() {
    //   _this.resize();
    // };
  },
  methods: {
    /** 显示活动弹窗 */
    getTime() {
      let today = new Date();
      let startDate = new Date('2022-10-06 00:00:00');
      if (today < startDate) {
        if (!sessionStorage.getItem('pop')) {
          this.pop = true;
          // setTimeout(() => {
          //   this.pop=false;
          // }, 3000);
          sessionStorage.setItem('pop', 1);
        }
      }
    },
    noticeShowFun() {
      let _this = this;
      let key = 'noticeShowTime';
      let key2 = 'noticeShowTimeNum';
      let time = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime(); //获取当日23:59:59分的时间戳
      let time2 = new Date().getTime(); //获取当前的时间戳
      // console.log("statge",this.$store.state.user.activitye)
      let oldTime = sessionStorage.getItem(key); //上一次的弹窗时间
      let num = sessionStorage.getItem(key2); //用于判断活动开始时间8月9日是否修改过noticeShowTime
      let maxTime = new Date('2023-06-22 23:59:59').getTime(); //最后的弹窗时间，超过弹窗时间不显示
      // console.log('maxTime', maxTime);
      //判断当日是否弹过或者当前时间是否大于上一次的时间并且不超过最后弹窗时间
      if ((num != 1 && time === 1660060799999) || (!oldTime && time2 < maxTime) || (time > oldTime && time2 < maxTime)) {
        sessionStorage.setItem(key, time);
        sessionStorage.setItem(key2, 1);
        _this.notice = true;
        // let intervalTime = setInterval(() => {
        //   if (_this.noticeShowTime != 0) {
        //     _this.noticeShowTime = _this.noticeShowTime - 1;
        //   } else if (_this.notice) {
        //     _this.notice = false;
        //     clearInterval(intervalTime);
        //   }
        // }, 1000);
      } else {
        _this.notice = false;
      }
      // _this.feeShow = time2 < maxTime; //控制右侧广告是否显示
      // _this.notice = true;
    },

    // 延迟24小时后关闭
    // delayHours() {
    //   // 获取关闭之前的时间
    //   let getTime = parseInt(localStorage.getItem('nowTime'));
    //   let gettimes = Math.ceil(getTime / 1000);
    //   let dateTime = new Date(getTime);
    //   //   console.log('gettimes', gettimes);
    //   let h = dateTime.getHours();
    //   let m = dateTime.getMinutes();
    //   let s = dateTime.getSeconds();
    //   let d = dateTime.getDate();
    //   // console.log('时间戳2', new Date('2022-01-7').getTime());
    //   //   console.log('h-m-s', h, m, s, d);
    //   // 获取当前时间
    //   let currTime = Math.ceil(Date.now() / 1000); //当前时间戳
    //   let nowTimes = new Date();
    //   let hCur = nowTimes.getHours();
    //   let mCur = nowTimes.getMinutes();
    //   let sCur = nowTimes.getSeconds();
    //   let day = nowTimes.getDate();
    //   //   console.log('h-m-s', hCur, mCur, sCur, day);
    //   if (!this.viewShow) {
    //     if (currTime > gettimes) {
    //       if (day > d) {
    //         if (hCur == h || hCur > h) {
    //           localStorage.setItem('viewShow', 1);
    //           this.viewShow = 1;
    //         } else {
    //           if (mCur == m || mCur > m) {
    //             localStorage.setItem('viewShow', 1);
    //             this.viewShow = 1;
    //           } else {
    //             if (sCur == s || sCur > s) {
    //               localStorage.setItem('viewShow', 1);
    //               this.viewShow = 1;
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    // },
    // 获取窗口尺寸
    // resize() {
    //   let wid = document.documentElement.clientWidth;
    //   // console.log('wid',wid);
    //   if (wid < 800) {
    //     this.couplets = false;
    //   } else {
    //     // this.animations()
    //     this.couplets = true;
    //   }
    // },
    animations() {
      this.show3 = !this.show3;
      let _this = this;
      _this.show2 = !_this.show2;
      if (this.show3) {
        // console.log(66666);
        // console.log(`show3show3`, this.show3);
        _this.times = setTimeout(function() {
          _this.show3 = false;
          _this.show2 = !_this.show2;
          // console.log('显示显示', _this.show3);
        }, 4500);
      } else {
        clearTimeout(_this.times);
        _this.show2 = !_this.show2;
      }
    },
    hoverMove(val) {
      const _this = this;
      _this.showClass = true;
    },
    // getpost() {
    //   var postData = {
    //     actionId: 5001,
    //     appId: 1,
    //     channel: 100,
    //     desc: '',
    //     extId: 0,
    //     ip: '8.8.8.8',
    //     param: '',
    //     timestramp: 0,
    //     uid: 30,
    //     version: 0
    //   };
    //   var xhr = new XMLHttpRequest();
    //   xhr.open('POST', '/api/v1/action/reported', true);
    //   xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
    //   xhr.send(JSON.stringify(postData));
    // },
    hoverOut(val) {
      const _this = this;
      _this.showClass = false;
    },
    closeAD() {
      const _this = this;
      _this.advertisement = false;
    },
    activefn(n) {
      if (n == 't') {
        this.$router.push('/price/index?cateId=3&subCateId=127');
        reported(2, 2000);
      } else {
        window.open('//wpa1.qq.com/cPNJlL1B?_type=wpa&qidian=true', '_blank');
        reported(1, 2000);
      }
    }
  }
};
</script>
<style scoped>
.iknow {
  background: transparent;
  position: absolute;
  right: 0;
  top: -35px;
  /* transform: translateX(-50%); */
  z-index: 1000;
  cursor: pointer;
  font-size: 16px;
  color: #ccc;
  display: inline-block;
}
.noticetxt {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 50%;
  height: 200px;
  z-index: 9;
}
.viewShow {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(000, 000, 000, 0.5);
  z-index: 9999;
}
.imgView {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
}
.qwer {
  background: url('../../static/ironActivity/index/activeico.png') no-repeat;
  background-size: 87%;
  text-align: right;
  color: rgba(255, 255, 255, 0.89);
}
.close {
  cursor: pointer;
  font-size: 16px;
  color: #999;
}
.active1 {
  width: 100%;
  height: 371px;
  display: block;
  cursor: pointer;
}
.active2 {
  display: block;
  cursor: pointer;
  width: 75%;
  height: 120px;
  animation-name: likes;
  animation-direction: alternate;
  animation-timing-function: linear;
  animation-delay: 0s;
  animation-iteration-count: infinite;
  animation-duration: 2s;
  background: url('../../static/ironActivity/index/bjimg.png') no-repeat;
  background-size: 88%;
  background-position: 18px 0;
}
@keyframes likes {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(0.85);
  }
  75% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

.active1 {
  margin-top: 35px;
}
</style>
<style scoped src="../../static/index/css/new/public.css" />
<style scoped src="../../static/active/css/css.css" />
<style scoped>
.guanbi {
  position: fixed;
  bottom: 420px;
  right: 0;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
}
</style>
