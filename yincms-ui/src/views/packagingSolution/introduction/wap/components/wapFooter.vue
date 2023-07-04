<template>
  <div>
    <div class="i-f-btn">
      <div class="i-f-btn-item">
        <span @click="qiyu" title="客服" style="display: inline-block;width: 100%;height: 100%;">
          在线咨询
        </span>
      </div>
      <div class="i-f-btn-item">
        <span @click="showTelCodeSuccess = true">电话咨询</span>
        <!-- <a href="tel:13924858905" target="_blank" title="在线QQ客服" style="display: inline-block;width: 100%;height: 100%;">
          电话咨询
        </a> -->
      </div>
    </div>
    <div class="pack-share" @click="copyWxCode"><img src="@/static/pack/wap/wx-icon.png" alt="" /><span>微信</span></div>
    <el-dialog class="copy-success-dialog" title="方案参数" :visible.sync="showCopyWxCodeSuccess" width="80%" :show-close="false">
      <img src="@/static/pack/wap/success.png" style="width: 100%;object-fit: contain;" alt="" />
      <div class="copy-success-content">
        <dl>
          <dt>
            复制成功！
          </dt>
          <dd>
            微信号：{{ wxCode }}<br />
            添加微信好友，了解更多详情
          </dd>
        </dl>
        <div>
          <a href="javascript:window.location.href='weixin://'">打开微信</a>
        </div>
      </div>
    </el-dialog>
    <el-dialog class="tel-code-dialog" title="方案参数" :visible.sync="showTelCodeSuccess" width="80%" :show-close="false">
      <img src="@/static/pack/wap/tel-bg.png" style="width: 100%;object-fit: contain;" alt="" />
      <div class="tel-code-content">
        <div>
          咨询电话
        </div>
        <dl>
          <dt>
            咨询电话1号
          </dt>
          <dd>
            <span>139-2485-8905</span>
            <a href="tel:13924858905" target="_blank">
              <img src="@/static/pack/wap/tel-icon.png" alt="" />
            </a>
          </dd>
          <dt>
            咨询电话2号
          </dt>
          <dd>
            <span>133-0298-2430</span>
            <a href="tel:13302982430" target="_blank">
              <img src="@/static/pack/wap/tel-icon.png" alt="" />
            </a>
          </dd>
          <dt>
            咨询电话3号
          </dt>
          <dd>
            <span>180-3804-6032</span>
            <a href="tel:18038046032" target="_blank">
              <img src="@/static/pack/wap/tel-icon.png" alt="" />
            </a>
          </dd>
        </dl>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { copyText } from '@/utils/strUtil';
import qiyu from '@/mixins/qiyu';
export default {
  mixins: [qiyu],
  data() {
    return {
      showCopyWxCodeSuccess: false,
      wxCode: '13302982430',
      showTelCodeSuccess: false
    };
  },
  methods: {
    copyWxCode() {
      copyText(this.wxCode);
      this.showCopyWxCodeSuccess = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.i-f-btn {
  // 固定在页面底部的样式
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 15vw;
  background: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0px 3px 16px 0px #999;
  .i-f-btn-item {
    width: 40%;
    // border: 1px solid red;
    text-align: center;
    height: 11vw;
    line-height: 11vw;
    span,
    a {
      display: block;
      height: 100%;
      border: 1px solid red;
      color: #fff;
      background-color: #e9333f;
      border-radius: 5px;
      font-size: 4.2vw;
    }
  }
}
.pack-share {
  background: #e9333f;
  position: fixed;
  bottom: 30%;
  right: 0;
  width: 17vw;
  height: 12vw;
  display: flex;
  align-items: center;
  padding-left: 1.3vw;
  box-sizing: border-box;
  border-top-left-radius: 44px;
  border-bottom-left-radius: 44px;
  color: #fff;
  img {
    width: 4.2vw;
    height: 4.2vw;
  }
  span {
    flex: 1;
    padding-left: 5px;
    font-weight: 500;
    font-size: 4vw;
  }
}
</style>
<style lang="scss">
.tel-code-dialog,
.copy-success-dialog {
  .el-dialog {
    background: none;
  }
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0;
    position: relative;
  }
}
.copy-success-dialog {
  .el-dialog__body {
    .copy-success-content {
      position: absolute;
      bottom: 0;
      width: 100%;
      text-align: center;
      dl {
        dt {
          font-weight: 500;
          color: #333333;
          font-size: 4.5vw;
          margin: 5vw 0;
        }
        dd {
          font-weight: 400;
          color: #666666;
          font-size: 3.7vw;
        }
      }
      div,
      div a {
        margin: 5vw auto 5vw;
        width: 50%;
        height: 10vw;
        line-height: 10vw;
        font-size: 4.2vw;
        background-color: #e9333f;
        text-align: center;
        border-radius: 1vw;
        color: #fff;
      }
    }
  }
}
.tel-code-dialog {
  .tel-code-content {
    position: absolute;
    top: 0;
    width: 100%;
    text-align: center;
    div {
      color: #333333;
      margin-top: 4.2vw;
      margin-bottom: 8vw;
      font-weight: 500;
      font-size: 4.5vw;
    }
    dl {
      width: 60%;
      margin: 0 auto;
      text-align: left;
      dt {
        font-weight: 500;
        color: #6c6c6c;
        font-size: 4vw;
      }
      dd {
        font-weight: 400;
        color: #333333;
        font-size: 4.5vw;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5.3vw;
        img {
          width: 7vw;
          object-fit: contain;
        }
      }
    }
  }
}
</style>
