import { checkToken } from '@/api/users/userApi';
import { getSessionToken, setSessionToken } from '../../../utils/auth';
import { iframeUrl, isReceive } from './url';
export default {
  data() {
    return {
      iframeId: '',
      url: ''
    };
  },
  beforeMount() {
    this.url = iframeUrl();
    // 后台管理系统访问时
    if (this.$route.query.isCms) {
      setSessionToken(this.$route.query.token);
      checkToken().then(res => {
        if (res.code === '970007') {
          window.parent.postMessage({ cmd: 'getToken', params: {} }, this.url);
          return;
        }
      });
      window.addEventListener('message', e => {
        // console.log('接收父级回参', e.data);
        if (!isReceive(e.origin)) {
          return;
        }
        if (e.data.type === 'isCmsPrice' && e.data.index === this.$route.query.index) {
          setTimeout(() => {
            this.testData(e.data.commonFormDatainputValue, e.data.formDatainputValue);
          }, 1000);
        }
      });
    }
  },
  watch: {
    'priceFormData.total_price': function(newValue) {
      if (this.jzattr) {
        this.sendOpenMessage('getGoodsInfo');
        if (this.$route.query.isCms) {
          // console.log('urlllllllllllll', this.url);
          this.sendIsCmsMessage(this.jzattr);
        }
      }
      if (this.jzattr && newValue > 0) {
        this.sendOpenMessage('framfunct');
      }
    },
    jzattr: function(newValue) {
      this.sendOpenMessage('getGoodsInfo');
      if (this.$route.query.isCms) {
        this.sendIsCmsMessage(newValue);
      }
    },
    'priceFormData.num': function(newValue) {
      if (this.jzattr) this.sendOpenMessage('getGoodsInfo');
    }
  },
  directives: {
    resize: {
      // 指令的名称
      bind(el, binding) {
        // el为绑定的元素，binding为绑定给指令的对象
        // console.log(el, '绑定', binding);
        let width = '',
          height = '';
        function isReize() {
          const style = document.defaultView.getComputedStyle(el);
          if (width !== style.width || height !== style.height) {
            binding.value({ width: style.width, height: style.height }); // 关键(这传入的是函数,所以执行此函数)
          }
          width = style.width;
          height = style.height;
          // console.log('isReize',width)
        }
        el.__vueSetInterval__ = setInterval(isReize, 300);
      },
      unbind(el) {
        // console.log(el, '解绑');
        clearInterval(el.__vueSetInterval__);
      }
    }
  },
  mounted() {
    this.getOpenMessage();
    this.sendOpenMessage('getToken');
  },
  methods: {
    getOpenMessage() {
      //接受父页面发来的消息
      let _this = this;
      window.addEventListener('message', event => {
        // 根据上面制定的结构来解析iframe内部发回来的数据
        // console.log('接受父页面发来的消息event',event.origin)
        if (!isReceive(event.origin)) {
          return;
        }
        const data = event.data;
        // console.log('da22222ta', data);
        let obj = {
          setIframeInfo() {
            _this.iframeId = data.params.iframeId;
          },
          setToken() {
            let token = getSessionToken();
            if (token === data.params.token) {
              checkToken().then(res => {
                if (res.code === '970007') {
                  window.parent.postMessage({ cmd: 'tokenFailure', params: {} }, this.url);
                }
              });
            } else {
              if (data.params.token) setSessionToken(data.params.token);
              checkToken().then(res => {
                if (res.code === '970007') {
                  window.parent.postMessage({ cmd: 'getToken', params: {} }, this.url);
                  return;
                }
              });
            }
          }
        };
        if (!obj[data.cmd]) return;
        obj[data.cmd]();
      });
    },
    monResize(data) {
      let { width, height } = data;
      let _this = this;
      // console.log('width:', width, 'height:', height, '   dom尺寸方式改变');
      // console.log('_this.$route', _this.$route);
      window.parent.postMessage(
        {
          cmd: 'windowHeight',
          params: {
            height: height,
            cateId: _this.$route.query.cateId,
            subCateId: _this.$route.query.subCateId
          }
        },
        this.url
      );
    },
    sendOpenMessage(key) {
      //向父页面发消息
      console.log('dsadadasdas');
      let _this = this;
      let msgObj = {
        getIframeInfo: {
          cmd: 'getIframeInfo',
          params: {}
        },
        getGoodsInfo: {
          cmd: 'getGoodsInfo',
          params: {
            goodsAttr: _this.jzattr,
            mtsl: _this.priceFormData.num, //每套数量
            goodsId: _this.goodsId,
            totalPrice: _this.priceFormData.total_price,
            cateId: _this.$route.query.cateId,
            subCateId: _this.$route.query.subCateId
          }
        },
        framfunct: {
          cmd: 'framfunct',
          params: {}
        },
        getToken: {
          cmd: 'getToken',
          params: {}
        }
      };
      console.log('msgObj[key]', key, this.url);
      window.parent.postMessage(msgObj[key], this.url);
    },
    sendIsCmsMessage(strVal) {
      let _this = this;

      if (_this.$route.query.isCms) {
        // let checkdata = {}
        // let radiodata = {}
        // let selectdata = {}
        // for (const item in _this.checkdata) {
        //   if (_this.checkdata[item].length > 0) {
        //     checkdata[item] = this.checkdata[item]
        //   }
        // }

        // for (const item in _this.radiodata) {
        //   if (_this.radiodata[item] != '') {
        //     radiodata[item] = this.radiodata[item]
        //   }
        // }

        // for (const item in _this.selectdata) {
        //   if (_this.selectdata[item] != '') {
        //     selectdata[item] = this.selectdata[item]
        //   }
        // }

        let formDatainputValue = {
          data: _this.data,
          data2: _this.data2,
          parentdata: _this.parentdata,
          inputdata: _this.inputdata,
          radiodata: _this.radiodata,
          checkdata: _this.checkdata,
          selectdata: _this.selectdata,

          spotis: _this.spotis,
          copyp: _this.copyp,
          dew: _this.dew,
          dewinp: _this.dewinp,
          hole: _this.hole,
          group: _this.group,
          entiretyGroup: _this.entiretyGroup,
          printing: _this.printing,
          spot: _this.spot,
          jybm: _this.jybm,
          fnumber: _this.fnumber
        };
        window.parent.postMessage(
          {
            goodsId: _this.goodsId,
            goodsAttr: strVal,
            index: _this.$route.query.index,
            subCateId: _this.$route.query.subCateId,
            totalPrice: _this.priceFormData.total_price,
            formDatainputValue: formDatainputValue,
            commonFormDatainputValue: _this.priceFormData
          },
          this.url
        );
      }
    },
    // 回显数据
    testData(commonFormDatainputValue, formDatainputValue) {
      let _this = this;
      if (!commonFormDatainputValue || !formDatainputValue) {
        return;
      }
      // console.log('commonFormDatainputValue', commonFormDatainputValue);
      (commonFormDatainputValue.inputValues || commonFormDatainputValue.long) && _this.$set(_this, 'priceFormData', commonFormDatainputValue);
      _this.$set(_this, 'inputdata', formDatainputValue.inputdata); // 子集输入框
      _this.$set(_this, 'radiodata', formDatainputValue.radiodata);
      _this.$set(_this, 'checkdata', formDatainputValue.checkdata);
      _this.$set(_this, 'selectdata', formDatainputValue.selectdata);
      _this.$set(_this, 'data2', formDatainputValue.data2);
      _this.$set(_this, 'data', formDatainputValue.data);
      _this.$set(_this, 'parentdata', formDatainputValue.parentdata);
      formDatainputValue.spotis && _this.$set(_this, 'spotis', formDatainputValue.spotis);
      formDatainputValue.copyp && _this.$set(_this, 'copyp', formDatainputValue.copyp);
      formDatainputValue.dew && _this.$set(_this, 'dew', formDatainputValue.dew);
      formDatainputValue.dewinp && _this.$set(_this, 'dewinp', formDatainputValue.dewinp);
      formDatainputValue.hole && _this.$set(_this, 'hole', formDatainputValue.hole);
      formDatainputValue.group && _this.$set(_this, 'group', formDatainputValue.group);
      formDatainputValue.entiretyGroup && _this.$set(_this, 'entiretyGroup', formDatainputValue.entiretyGroup);
      formDatainputValue.printing && _this.$set(_this, 'printing', formDatainputValue.printing);
      formDatainputValue.spot && _this.$set(_this, 'spot', formDatainputValue.spot);
      formDatainputValue.jybm && _this.$set(_this, 'jybm', formDatainputValue.jybm);
      formDatainputValue.fnumber && _this.$set(_this, 'fnumber', formDatainputValue.fnumber);
      this.$nextTick(() => {
        _this.getprice();
      });
    }
  }
};
