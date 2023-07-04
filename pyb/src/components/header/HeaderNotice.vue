<!-- fengjianbo -->
<template>
  <div>
    <div>
      <!-- 移动收藏夹弹窗 -->
      <div class="dialogbox" v-if="flag" :style="'margin-top: ' + top + 'px'">
        <div class="activitesDelete">
          <div @click.stop="activitesDeleteBut()" class="activitesDeleteBut">
            <span type="primary" class="el-icon-close "></span>
            <span class="activitesDeleteCountdown">{{ nub }}s</span>
          </div>
        </div>

        <p style="height: 255px">
          <img src="../../static/mulindex/img/index/activityimg.png" style="height: 300px;width: 100%" />
        </p>
      </div>
      <div class="noticeBox" v-else style="height: 46px">
        <div class="comBox">
          <div id="viewlist" class="scroll_vertical">
            <div class="box">
              <el-carousel direction="vertical" :autoplay="isAutoplay" :interval="5000" :loop="true">
                <el-carousel-item v-for="(item, index) in contentList" :key="index">
                  <li class="flex noticeDv" style="color: #000;font-size: 16px;" @click="newsDetail(item.id)">
                    <span class="icon icon-ad"></span>
                    <span v-html="item.title"></span>
                  </li>
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>

          <!-- <div v-for="(vo, index) in contentList" :key="index">
            <div class="flex noticeDv">
              <span class="icon icon-ad"></span>
              <span v-html="vo.content"></span>
            </div>
          </div> -->
        </div>
      </div>
    </div>
    <div>
      <el-dialog :visible.sync="dialogVisible" width="30%" :append-to-body="true" :modal="true" top="270px" :show-close="false" custom-class="dialog-activityimg">
        <div @click="newsDetails">
          <img src="../../static/mulindex/img/index/active.png" style="width: 100%;display: block" />
          <!--          <img @click="newsDetails" src="@/static/index/img/quotation.png" style="height: 400px;width: 100%;display: block" />-->
          <span @click.stop="deleteBun" style="position: absolute;top: calc(30px + 50px);right: 1px;color: #fff;padding: 20px;cursor: pointer">{{ nub }}s关闭</span>
        </div>
      </el-dialog>
    </div>
    <!--    <div class="ppp" v-show="dialogVisible" @click="deleteBun">-->
    <!--      <div @click.stop="newsDetails">-->
    <!--        <img src="@/static/index/img/quotation.png" class="pppp" style="height: 400px;width: 500px;display: block;border: none" />-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<script>
import { getById, listByIds } from '@/api/news/newsApi';
// import { listByIds } from '@/api/users/userApi';

export default {
  name: 'HeaderUser',
  data: function() {
    return {
      ids: [176, 178],
      // ids: [],
      contentList: [{ content: '尊敬的客户，近期纸价波动频繁，请各位及早安排下单。' }],
      flag: false,
      nub: 5,
      time: '',
      top: 0,
      dialogVisible: false,
      isAutoplay: false
    };
  },
  methods: {
    getDesc() {
      listByIds({ list: this.ids })
        .then(res => {
          if (res.data) {
            console.log('数据数据', res.data);
            if (res.data.length > 1) {
              this.contentList = res.data;
              this.contentList.push(res.data[0]);
              this.contentList.push(res.data[1]);
              this.isAutoplay = true;
            } else {
              if (res.data.length > 0) {
                this.contentList = res.data;
              }
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    activitesDeleteBut() {
      if (this.dialogVisible == true) {
        var date = new Date();
        var getHours = date.getHours();
        var DeleteNumber = localStorage.getItem('activitesDeleteNumber') ? localStorage.getItem('activitesDeleteNumber') * 1 + 1 : 1;
        this.dialogVisible = false;
        localStorage.setItem('activitesDeleteTime', date.getDate());
        localStorage.setItem('activitesDeleteHours', getHours);
        localStorage.setItem('activitesDeleteNumber', DeleteNumber);
      }

      // var closed = setInterval(() => {
      //   this.top--;
      //   if (this.top < -255) {
      //     this.flag = false;
      //     this.dialogVisible = false;
      //     localStorage.setItem('activitesDeleteTime', date.getDate());
      //     clearInterval(closed);
      //   }
      // }, 1);
    },
    CountdownTime() {
      // if (this.flag === true) {
      //   this.time = setInterval(() => {
      //     this.nub--;
      //     if (this.nub == 0) {
      //       clearInterval(this.time);
      //       this.activitesDeleteBut();
      //     }
      //   }, 1000);
      // }
      if (this.dialogVisible === true) {
        this.time = setInterval(() => {
          this.nub--;
          if (this.nub == 0) {
            clearInterval(this.time);
            this.activitesDeleteBut();
          }
        }, 1000);
      }
    },
    newsDetail(id) {
      console.log(id);
      this.$router.push({ path: '/news/detail', query: { id: id } });
    },
    newsDetails() {
      this.dialogVisible = false;
      this.$router.push({ path: '/news/detail', query: { id: '177' } });
    },
    deleteBun() {
      this.activitesDeleteBut();
    }
  },
  created() {
    this.getDesc();
    //弹3次 4小时一次
    var date = new Date();
    // var date = new Date();
    var getHours = date.getHours(); //小时
    // localStorage.removeItem('activitesDeleteTime');
    // localStorage.removeItem('activitesDeleteHours');
    // localStorage.removeItem('activitesDeleteNumber');
    //活动 6.19 - 7.18
    let startDate = new Date(this.$store.state.user.activitys);
    let endDate = new Date(this.$store.state.user.activitye);
    if (startDate <= date && date <= endDate) {
      //判断是否已显示过
      if (!localStorage.getItem('activitesDeleteTime') || localStorage.getItem('activitesDeleteTime') < date.getDate()) {
        // this.flag = true;
        localStorage.setItem('activitesDeleteNumber', 1);
        this.dialogVisible = true;
      } else {
        if (localStorage.getItem('activitesDeleteNumber') <= 3) {
          var DeleteHours = getHours * 1 - localStorage.getItem('activitesDeleteHours') * 1;
          if (DeleteHours > 3) {
            this.dialogVisible = true;
          }
        }
      }
    }
    this.CountdownTime();
  }
};
</script>

<style>
/* #topbar {
  margin-top: 46px;
} */
.activitesDelete {
  position: absolute;
  right: 5px;
  top: 5px;
}
.activitesDeleteCountdown {
  padding: 5px;
}
.activitesDeleteBut {
  padding: 5px 10px;
  border: 1px solid #fff;
  border-radius: 20px;
  cursor: pointer;
}
.dialog-activityimg {
  padding: 0;
  background: none;
  box-shadow: none;
}
.dialog-activityimg > div {
  padding: 0;
  /*background-color: red;*/
  /*background-color: rgba(0, 0, 0, 0.3);*/
  background-color: rgba(0, 0, 0, -1.7);
}
.ppp {
  z-index: 9999;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
}
.pppp {
  position: relative;
  margin: 0 auto 50px;
  margin-top: 50px;
  border-radius: 2px;
  box-sizing: border-box;
}
/* 跑马灯开始 */
.scroll_vertical {
  width: 1200px;
  float: left;
  overflow: hidden;
}
.scroll_vertical .box {
  overflow: hidden;
  position: relative;
  height: 40px;
}
.scroll_vertical .list {
  position: absolute;
  top: 0;
  left: 0;
}
.scroll_vertical .list li {
  height: 20px;
  list-style: none;
  font-size: 12px;
}
.el-carousel__item.is-animating {
  -webkit-transition: -webkit-transform 2s ease-in-out;
  transition: -webkit-transform 2s ease-in-out;
  transition: transform 2s ease-in-out;
  transition: transform 0.8s ease-in-out, -webkit-transform 2s ease-in-out;
}
/* 跑马灯结束 */
</style>
