// components/ywxx/index.js
import { pageEmbossTexture } from "../../api/cartApi";
import { OSSFileUrl } from "../../utils/request";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: String,
      default: "0",
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    OSSFileUrl,
    ambossList: [],
    ambossInfo: {},
    cartList: [],
    cartValue: "",
    container: null,
    boxHeight: 0,
    radioAmbossId:''
  },
  created() {
    this.getEmboss();
  },
  ready() {
    var _this = this;
    //创建节点选择器
    //选择id
    _this
      .createSelectorQuery()
      .select("#cart-box")
      .boundingClientRect(function (res) {
        _this.setData({
          boxHeight: res.height 
        });
      })
      .exec();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    confirmAmboss(){
      let _this = this;
      if(_this.data.radioAmbossId==''){
        wx.showToast({
          title: '请选择纹理信息',
          icon: 'error',
          duration: 2000
        })
      }else{
        this.triggerEvent('radioAmboss',_this.data.radioAmbossId)
      }
    },
    /** 选择压纹 */
    radioAmbossFun(e){
      let _this = this;
      let {id} = e.currentTarget.dataset
      if(id){
        // let amboss = _this.data.ambossList.find(e => e.id ==id)
        _this.setData({
          radioAmbossId:id
        })
      }
    },
    // 选择分类
    radioCart(e){
      console.log('dddd',e)
      let _this = this;
      let {cart} = e.currentTarget.dataset
      _this.setData({
        cartValue:cart,
        radioAmbossId:''
      })
    },
    /** 放大查看图片 */
    expand(e){
      console.log('dddd',e)
      let _this = this;
      let {id} = e.currentTarget.dataset
      if(id||id===0){
        let amboss = _this.data.ambossList.find(e => e.id ==id)
        console.log('amboss',amboss)
        let imgUrl = _this.data.OSSFileUrl+encodeURIComponent(amboss.imageUrl)
        console.log(_this.data.OSSFileUrl+amboss.imageUrl);
        
        _this.previewImage(imgUrl,[imgUrl])
      }
    },
   /**
     * 查看图片
     * @param {*} e 
     */
    previewImage(current,urls){
      wx.previewImage({
        current,
        urls, // 需要预览的图片http链接列表
      })
    },
    /**
     * 关闭组件
     */
    onClose() {
      this.triggerEvent('hidewAmboss')
    },
    /** 获取压纹 */
    getEmboss() {
      let _this = this;
      pageEmbossTexture({
        pageNumber: 1,
        pageSize: 1000,
      }).then((res) => {
        console.log(res);
        let cartList = [];
        let ambossList = res.data.map((e) => {
          let cartArr = e.embossTextureName.split("-");
          if (cartArr.length > 1) {
            let cart = cartArr[0];
            if (cartList.indexOf(cart) == -1) {
              cartList.push(cart);
            }
            e.cart = cart;
            e.embossTextureName2 = cartArr[1];
          }
          return e;
        });
        console.log("arr", ambossList);
        console.log("cartArr", cartList);
        _this.setData({
          cartList,
          ambossList,
          cartValue: cartList[0],
        });
      });
    },
  },
});
