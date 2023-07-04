    Component({
      /**
       * 组件的属性列表
       */
      properties: {
        modal: {
          type: Object,
          value: {
            show: false,
           
          }
        },
        myWindowHeight:{
          type:Number,
          value:99999999
        },
        myScreenHeight:{
          type:Number,
          value:99999999
        },
        modalPadding:{
          type:Number,
          value:0
        }
      },
    
      /**
       * 组件的初始数据
       */
      data: {
        modalDefault: {
          show: true,
        },
        h:'',
        
      },
      /**
       * 组件的方法列表
       */
      methods: {
        /**
         * 取消按钮事件
         */
        modalCancel() {
          this.setData({
            'modalDefault.show':false
          })
         wx.showTabBar()
        },
        draw(){
          wx.navigateTo({
            url: '../draw/index'
          })
        }
        
        
      },
      
    })
    