// 精装盒整体配件iframe页面的js文件
export default {
  data() {
    return {
      iframeId: ''
    };
  },
  watch: {
    'priceFormData.total_price': function(newValue) {
      console.log('total_price', newValue);
      if (this.formData.goodAttr) this.sendOpenMessage('getGoodsInfo');
      if (this.formData.goodAttr && newValue > 0) {
        this.sendOpenMessage('framfunct');
      }
    },
    'formData.goodAttr': function(newValue) {
      // console.log('goodAttr', newValue);
      this.sendOpenMessage('getGoodsInfo');
    },
    // 监听印刷数量，防止原本代码在输入错误时把印刷数量置零
    'priceFormData.yssl': function(newValue) {
      // console.log('yssl', newValue);
      if (newValue == 0) {
        this.$set(this.priceFormData, 'yssl', 500); //给印刷数量添加一个默认值
      }
    },
    'commonFormData.inputValues.5050_5051': function(newValue) {
      // console.log('5050_5051', newValue);
      if (this.formData.goodAttr) this.sendOpenMessage('getGoodsInfo');
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
  methods: {
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
        '*'
      );
    },
    getOpenMessage() {
      //接受父页面发来的消息
      let _this = this;
      window.addEventListener('message', event => {
        // 根据上面制定的结构来解析iframe内部发回来的数据
        const data = event.data;
        // console.log('da22222ta', data);
        let obj = {
          setIframeInfo() {
            _this.iframeId = data.params.iframeId;
          }
        };
      });
    },
    sendOpenMessage(key) {
      //向父页面发消息
      let _this = this;
      let msgObj = {
        getIframeInfo: {
          cmd: 'getIframeInfo',
          params: {}
        },
        getGoodsInfo: {
          cmd: 'getGoodsInfo',
          params: {
            goodsAttr: _this.formData.hxid ? _this.formData.goodAttr + _this.formData.hxid : _this.formData.goodAttr,
            mtsl: _this.commonFormData.inputValues['5050_5051'], //每套数量
            goodsId: _this.formData.goodAttrVo.id,
            totalPrice: _this.priceFormData.total_price,
            cateId: _this.$route.query.cateId,
            subCateId: _this.$route.query.subCateId
          }
        },
        framfunct: {
          cmd: 'framfunct',
          params: {}
        }
      };
      window.parent.postMessage(msgObj[key], '*');
    }
  },
  mounted() {
    this.getOpenMessage();
    // this.sendOpenMessage('getIframeInfo')
    // 重新初始数据，以便精装盒整体配件使用
    let numberObj = this.commonVoList.find(e => e.code == 'YSSL');
    this.$set(this.commonFormData.inputValues, `${numberObj?.attrList[0]?.groupId}_${numberObj?.attrList[0]?.id}`, 500);
    this.$set(this.priceFormData, 'yssl', 500); //给印刷数量添加一个默认值
    this.$set(this.commonFormData.inputValues, '5050_5051', '1');
    let size = this.commonVoList.find(e => e.code === 'SIZE');
    let mtsl = { groupType: 'input', name: '每套数量', code: 'MTSL', id: 5050, attrList: [{ id: 5051, code: 'MTSL', defaultValue: '0', suffix: '个', name: '个', inputTips: '个', groupId: 5050 }] };
    this.commonVoList = [size, mtsl];

    // console.log('commonVoList', JSON.stringify(this.commonVoList));
    // console.log('formData', this.formData);
    // console.log('numberChange', this.commonFormData);
    // console.log('sizesize', size);
  }
};
