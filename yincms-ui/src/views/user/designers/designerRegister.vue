<template>
  <div class="designerRegister">
    <el-container>
      <el-main>
        <div class="local">
          <div class="local_position">
            <div class="local_box">
              <button class="btns addDesigner" @click="moveInto(1)">签约设计师加入</button>
              <button class="btns lookTask" @click="moveInto(2)">查看设计师任务</button>
              <!-- <p class="text">*机构合作可直接点击【签约设计师加入】，加入时选择【机构入驻】</p> -->
            </div>
          </div>
          <img class="img_01" src="@/static/mulindex/img/头图.png" alt="" />
        </div>
        <div>
          <img class="img_01" src="@/static/mulindex/img/内容-01.png" alt="" />
        </div>
        <div class="showTo">
          <div class="bkgRed category">
            <p>热门类型</p>
            <ul class="popularType">
              <li>
                <img src="@/static/mulindex/img/Slice 16.png" alt="" />
                <p style="margin-top: 6px;">化妆品包装</p>
              </li>
              <li>
                <img src="@/static/mulindex/img/Slice 17.png" alt="" />
                <p style="margin-top: 6px;">3C数码包装</p>
              </li>
              <li>
                <img src="@/static/mulindex/img/Slice 18.png" alt="" />
                <p style="margin-top: 6px;">药品包装</p>
              </li>
              <li>
                <img src="@/static/mulindex/img/Slice 19.png" alt="" />
                <p style="margin-top: 6px;">食品包装</p>
              </li>
              <li>
                <img src="@/static/mulindex/img/Slice 20.png" alt="" />
                <p style="margin-top: 6px;">茶酒包装</p>
              </li>
              <li>
                <img src="@/static/mulindex/img/Slice 21.png" alt="" />
                <p style="margin-top: 6px;">母婴用品包装</p>
              </li>
            </ul>
          </div>
          <div class="bkgRed dynamic">
            <p>任务动态</p>
            <div @mouseover="mouseEnter" @mouseout="mouseOut">
              <!-- <el-table :data="tableData" style="width: 100%" height="314" > -->
              <!-- <el-table :data="tableData" height="314" style="width: 100%" :header-cell-style="{ background: '#000', color: '#fff', 'text-align': 'center' }" :cell-style="{ padding: '10px' }"> -->
              <el-table ref="table" :data="tableData" height="314" style="width: 100%" :header-cell-style="{ background: '#000', color: '#fff', 'text-align': 'center' }" :cell-style="{ padding: '10px', background: '#fff' }">
                <el-table-column prop="packName" label="任务信息"> </el-table-column>
                <el-table-column label="金额" align="center" width="100">
                  <template slot-scope="scope"> ￥{{ scope.row.price }} </template>
                </el-table-column>
                <el-table-column align="center" label="时间" width="160">
                  <template slot-scope="scope">{{ minutes(scope.row.addtime) }} </template>
                </el-table-column>
                <el-table-column prop="realname" align="center" width="120" label="设计师"> </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div>
          <img class="img_01" src="@/static/mulindex/img/内容-02.png" alt="" />
          <img class="img_01" src="@/static/mulindex/img/内容-03.png" alt="" />
          <img class="img_01" src="@/static/mulindex/img/内容-04.png" alt="" />
        </div>
        <ul class="code_02">
          <li>
            <img src="@/static/mulindex/img/左二维码.png" alt="" />
            <p class="headTxt">个人设计咨询</p>
            <p>了解多福利及活动入群分享交流</p>
          </li>
          <li>
            <img src="@/static/mulindex/img/右二维码.png" alt="" />
            <p class="headTxt">机构入驻咨询</p>
            <p>机构合作</p>
            <p>申请咨询详情</p>
          </li>
        </ul>
      </el-main>
      <el-footer style="overflow: hidden;">
        <img src="@/static/mulindex/img/Slice 13.png" style="width:100%;" alt="" />
      </el-footer>
    </el-container>
    <login-form :dialogVisible.sync="showLoginDialog"></login-form>
  </div>
</template>

<script>
import LoginForm from '@/components/common/LoginForm';
import { getByUserId, getPackOutDynamicList } from '@/api/users/designer';
import { getCurrentUserInfo } from '@/api/users/userApi';
import { minutes } from '@/utils/timeUtil';

export default {
  name: 'designerRegister',
  // props:['showLoginDialog'],
  components: {
    LoginForm
  },
  data() {
    return {
      uid: '',
      showLoginDialog: false,
      //获取当前网站的网址
      windowUrl: window.location.href,
      tableData: [],
      scrollTimer: null,
      scrollData: 0,
      dataFlag: false,
      nowTime: 40,
      lastTime: 0,
      diffTime: 30,
      stop: null
    };
  },
  created() {
    this.getPackOutDynamicListFn();

    this.animloop();
    // this.MyMar1();
  },

  methods: {
    ...{ minutes },
    // 任务实时动态
    getPackOutDynamicListFn() {
      getPackOutDynamicList().then(res => {
        // console.log('任务实时动态', res);
        this.tableData = res.data;
      });
    },
    mouseEnter() {
      // clearInterval(this.scrollTimer);
      window.cancelAnimationFrame(this.stop); //可以取消该次动画。
    },
    mouseOut() {
      this.animloop();
      // this.MyMar1();
    },
    // 上下滚动
    Marquee() {
      this.$nextTick(() => {
        let g = document.querySelector('.is-scrolling-none');
        this.scrollData = g.scrollHeight - 266;
        // console.log('上下滚动222', g.scrollTop);
        if (this.scrollData == g.scrollTop && this.scrollData > 0) {
          g.scrollTop = 0;
          this.getPackOutDynamicListFn();
        }
        g.scrollTop++;
        // console.log('滚动高度444', g.scrollHeight - 266);
      });
    },
    animloop() {
      // console.log('animloop');
      this.nowTime = Date.now();
      if (this.nowTime - this.lastTime > this.diffTime) {
        this.lastTime = this.nowTime;
        this.Marquee();
      }
      window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
      this.stop = window.requestAnimationFrame(this.animloop);
    },
    // MyMar1() {
    //   clearInterval(this.scrollTimer);
    //   this.scrollTimer = setInterval(() => {
    //     this.Marquee();
    //   }, 40);
    // },
    // 获取用户信息
    getUserInfo() {
      getCurrentUserInfo().then(res => {
        // this.$set(this, 'userInfo', res.data);
        if (res.code == '000000') {
          this.uid = res.data.id;
          // console.log('获取用户信息',this.uid);
          this.getByUserIdFn();
        }
      });
    },
    // 获取入驻用户信息
    getByUserIdFn() {
      getByUserId({ id: this.uid })
        .then(res => {
          // console.log('入驻用户信息22222', res);
          if (res.code == '000000') {
            // this.isCertified = res.data == null ? false : true;
            if (res.data.id == null) {
              this.$router.push('/user/signing');
            } else {
              this.$message.success('您已是入驻用户!');
              this.$router.push('/user/myTask');
            }
          }
        })
        .catch(err => {
          this.$router.push('/user/signing');
        });
    },
    moveInto(type) {
      const token = localStorage.getItem('Access-Token');
      // console.log('token', token);
      if (!token) {
        this.showLoginDialog = true;
      } else {
        // this.$router.push('/user/signing');
        if (type == 1) {
          this.getUserInfo();
        } else {
          this.$router.push('/user/myTask');
        }
      }
    },
    //点击复制的方法兼容ios系统
    copy() {
      var domUrl = document.createElement('input');
      domUrl.value = '加入傲彩，认证设计师兼职做设计任务:' + this.windowUrl;
      domUrl.id = 'creatDom';
      document.body.appendChild(domUrl);
      if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
        window.getSelection().removeAllRanges(); //这段代码必须放在前面否则无效
        var range = document.createRange();
        // 选中需要复制的节点
        range.selectNode(domUrl);
        // 执行选中元素
        window.getSelection().addRange(range);
        // 执行 copy 操作
        document.execCommand('copy');
        // 移除选中的元素
        window.getSelection().removeAllRanges();
      } else {
        domUrl.select(); // 选择对象
        document.execCommand('Copy'); // 执行浏览器复制命令
      }
      let creatDom = document.getElementById('creatDom');
      creatDom.parentNode.removeChild(creatDom);
      this.$message({
        message: '已复制链接，可以粘贴分享到群邀请更多设计师入驻傲彩！',
        type: 'success'
      });
    }
  },
  beforeDestroy() {
    // clearInterval(this.scrollTimer);
    window.cancelAnimationFrame(this.stop); //可以取消该次动画。
  }
};
</script>
<style>
.designerRegister .el-table__body-wrapper::-webkit-scrollbar {
  width: 0;
}
.designerRegister .el-table th.gutter {
  background: #000;
  border-bottom: 1px solid #ebeef5;
  box-sizing: border-box;
}
.designerRegister .el-table--scrollable-y .el-table__body-wrapper {
  overflow: hidden !important;
}

.designerRegister .el-table--scrollable-x .el-table__body-wrapper {
  overflow: hidden !important;
}
</style>
<style scoped>
/* 当屏幕分辨率大于768像素时，应用下面的样式 */
/* @media screen and (max-width: 768px) {
  .local .local_box {
    position: absolute;
    top: 230px;
    left: 50%;
    width: 600px;
    transform: translateX(-45%);
  }
  .local .btns {
    width: 125px;
    height: 40px;
    border-radius: 40px;
    cursor: pointer;
    border: 1px solid #fff;
    font-size: 14px;
}
.text {
  font-size: 12px;
  margin-left: -38px;
}
} */
/* 当屏幕分辨率大于900像素时，应用下面的样式 */
/* @media screen and (min-width: 768px) and (max-width: 900px) {
  .local .local_box {
    position: absolute;
    top: 230px;
    left: 50%;
    width: 600px;
    transform: translateX(-45%);
  }
  .local .btns {
    width: 125px;
    height: 40px;
    border-radius: 40px;
    cursor: pointer;
    border: 1px solid #fff;
    font-size: 14px;
}
.text {
  font-size: 12px;
  margin-left: -38px;
}
} */

.designerRegister {
  background-color: #f5f5f5;
  min-width: 1240px;
}
.designerRegister .el-main {
  background-color: #fff;
  color: #333;
  text-align: center;
  width: 100%;
  /* line-height: 160px; */
  /* width: 1240px; */
  /* margin: 0 auto; */
}
.designerRegister .el-main .img_01 {
  /* width: 1240px; */
  width: 100%;
}
.local {
  /* height: 900px; */
  /* background: url('../../../static/mulindex/img/Slice 1.png'); */
  /* background-size: cover; */
  /* background-repeat: no-repeat; */
  position: relative;
}
.local_position {
  /* position: relative; */
  /* width: 600px;
  margin: auto; */
}

.text {
  color: #fff;
  font-size: 16px;
  margin-top: 30px;
  margin-left: -38px;
}
.local .btns {
  width: 204px;
  height: 64px;
  border-radius: 40px;
  cursor: pointer;
  border: 1px solid #fff;
  font-size: 22px;
}
.local .addDesigner {
  background: #fff;
  color: #ce0014;
  margin-right: 32px;
}
/* .local .addDesigner:hover {
  background: #ffd2d7;
  color: #d41a2d;
  border: 1px solid #ffd2d7;

} */
.local .lookTask {
  background: #ce0014;
  color: #fff;
}
.designerRegister .el-footer {
  background-color: #ce0014;
  color: #333;
  text-align: center;
  height: 116px !important;
}
.showTo {
  display: flex;
  background: #fff;
  justify-content: center;
  /* justify-content: space-between; */
}
.showTo .bkgRed {
  background: #ce0014;
  height: 430px;
}
.showTo .category {
  width: 510px;
  margin-right: 10px;
}
.showTo .dynamic {
  width: 720px;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 30px;
  box-sizing: border-box;
}
.showTo .popularType {
  width: 412px;
  height: 300px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.showTo .bkgRed > p {
  text-align: center;
  color: #fff;
  font-size: 22px;
  height: 90px;
  line-height: 90px;
}
.showTo .popularType li > img {
  height: 86px;
}
.showTo .popularType li {
  height: 120px;
  width: 120px;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  background: #fff;
  font-size: 16px;
  font-weight: 700;
}
.code_02 {
  width: 640px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
}
.code_02 li {
  width: 177px;
  text-align: center;
}
.code_02 p {
  font-size: 20px;
}
.code_02 .headTxt {
  font-size: 26px;
  font-weight: 700;
}
/* 当屏幕分辨率大于1024像素时，应用下面的样式 */
.local_box {
  position: absolute;
  left: 52%;
  top: 45%;
  transform: translate(-50%, -50%);
  width: 30%;
  height: 6%;
  /* border: 1px solid #000; */
  display: flex;
  justify-content: space-between;
}
.text {
  color: #fff;
  font-size: 16px;
  margin-top: 30px;
  margin-left: -38px;
}
.local .btns {
  width: 45%;
  height: 100%;
  border-radius: 40px;
  cursor: pointer;
  border: 1px solid #fff;
  font-size: 1.5em;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
<style src="../../../static/index/user/css/reset.css" />
