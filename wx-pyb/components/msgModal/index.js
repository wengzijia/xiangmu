// components/modal/component.js
/**
 =====================================================================
 * 调用模板 
  
 <modal modal="{{modal}}"></modal>


 *  
 * 调用模板说明：modal为弹框属性集合，如下  需要手动去关闭消息框
 * 在组件里面添加这个方法，在需要的地方调用该方法，进行传参
   modalFun({contentText,icon,iconSize,image,imageSize,time}){
    var than = this;
    this.setData({
      modal: {
        show: false,
        contentText,icon,iconSize,image,imageSize
      }
    })
    setTimeout(() => {
      than.setData({
        modal: {
          show: false,//modal是否显示，默认false
        }
      }) }, time?time:2000);
  },
 
 =====================================================================
 * modal属性使用对象集合进行处理
 * 调用方式如下：
 *  modal: {
        show: true,//modal是否显示，默认false
        contentText:'',//文本内容
        icon:'ac-icon-set',//字体图标类名
        iconSize:'200rpx',//字体图片大小
        image:'../../image/kefu.png',//图片，字体图标与图片只会存在一种，图片的权重大于字体图标
        imageSize:''//图片的大小
    }

 */
    Component({
      /**
       * 组件的属性列表
       */
      properties: {
        modal: {
          type: Object,
          value: {
            show: false,
            contentText:'',
            icon:undefined,
            iconSize:undefined,
            image:undefined,
            imageSize:undefined
          }
        }
      },
    
      /**
       * 组件的初始数据
       */
      data: {
        modalDefault: {
          show: false,
          contentText:'',
          icon:'',//字体图标类名
          iconSize:'',//字体图片大小
          image:'',//图片，字体图标与图片只会存在一种，图片的权重大于字体图标
          imageSize:''//图片的大小
        }
      },
    
      /**
       * 组件的方法列表
       */
      methods: {
      },
      ready(){
      }
    })
    