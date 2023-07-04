// 精装盒整体页面的js文件（整体配件所需的js）
import { entiretyList } from '@/utils/json/HardcoverQuotation';
export default {
  data() {
    return {
      entiretyGroup: [], //整体选中配件
      entiretyList: JSON.parse(JSON.stringify(entiretyList.proof)), //整体配件
      frametime: null
    };
  },
  watch: {
    entiretyGroup: {
      deep: true,
      handler: function(newValue) {
        let _this = this;
        _this.$nextTick(() => {
          _this.entiretyList = _this.entiretyList.map(e => {
            let item = e;
            // if (newValue.find(s => s == item.name)) {
            //   item.isShow = true;
            // }else{
            //   item.isShow = false;
            // }
            // item.isShow = newValue.find(s => s == item.name)?true:false
            return item;
          });
        });
      }
    }
  },

  mounted() {
    this.getMessage();
  },
  methods: {
    /**
     *  接受子页面发来的信息
     */
    getMessage() {
      let _this = this;
      // 接受子页面发来的信息
      window.addEventListener('message', function(event) {
        var data = event.data;
        // console.log('_this', _this.$refs.iframe_7_44);
        // console.log('data666999', data);
        let obj = {
          /** 设置iframe高度 */
          windowHeight: function(data) {
            // console.log('`#iframe_${data.cateId}_${data.subCateId}`', `#iframe_${data.params.cateId}_${data.params.subCateId}`);
            let ifr = document.querySelector(`#iframe_${data.params.cateId}_${data.params.subCateId}`);
            // console.log('ifr', ifr);
            if (!ifr) {
              return;
            }
            // let numArr = data.params.height.split('px');
            // ifr.height = Number(numArr[0]) + 100 + 'px';
            ifr.height = data.params.height;
          },
          getGoodsInfo(data) {
            if (_this.entiretyList) {
              _this.entiretyList = _this.entiretyList.map(e => {
                let item = e;
                if (item.subCateId == data.params.subCateId && item.cateId == data.params.cateId && item.isShow) {
                  item.goodsInfo = data.params;
                  item.goodsAttr = `|#|部件:整体配件;配件品类:${item.name};配件id:${data.params.goodsId};配件数量:${data.params.mtsl};配件同款款数数量:1;`;
                }
                return item;
              });
              console.log('this.entiretyList', _this.entiretyList);
              console.log('this.entiretyList', data);
            }
          },
          framfunct(data) {
            if (_this.frametime) {
              clearTimeout(_this.frametime);
              _this.frametime = null;
            }
            _this.frametime = setTimeout(() => {
              console.log('wwwwwwwwwwwwwww');
              _this.getprice();
            }, 500);
          }
        };
        if (!obj[data.cmd]) return;
        obj[data.cmd](data);
      });
    }
  }
};
