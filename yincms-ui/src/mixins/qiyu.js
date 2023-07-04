import YSF from '@neysf/qiyu-web-sdk';
export default {
  data() {
    return {
      ysf: ''
    };
  },
  created() {
    const _this = this;
    YSF.init('e95a3b738998ec74addc44a5dde79710', {})
      .then(ysf => {
        _this.ysf = ysf;
      })
      .catch(error => {
        console.log('sdk加载失败---', error);
      });
  },
  methods: {
    qiyu() {
      let _this = this;
      let userInfo = _this.$store.getters.userInfo;
      if (userInfo) {
        _this.ysf('config', {
          uid: userInfo.id,
          name: userInfo.nickname,
          mobile: userInfo.mobile,
          success: function() {
            // 成功回调
            _this.ysf('open');
          },
          error: function() {
            // 错误回调
            // handle error
          }
        });
      } else {
        this.ysf('open');
      }
    },
    consultantService(e) {
      const tagName = e.target.dataset.tagname;
      console.log(e.target.dataset.tagname)
      if (tagName === 'consultantService') {
        this.qiyu()
      } else {
        console.log('未匹配')
      }
    },
    convertRemark(remark) {
      let reg = new RegExp(`<a .*?在线客服</a>`);
      return remark.replace(reg, `<span class='red' style='cursor: pointer;' data-tagname='consultantService'>在线客服</span>`);
    }
  }
};
