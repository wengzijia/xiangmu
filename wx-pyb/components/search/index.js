/**
 * 组件调用
 *  <search bindeventP='getSearchValue' list='{{categoryList}}' inputVal='{{inputVal}}'></search>
 * 传入参数
 * list：选择列表
 * inputVal:输入框value
 * 回调事件
 * eventP
 * 回调事件参数
 * inputVal
 * 
 */
Component({
     /**
       * 组件的属性列表
       */
      properties: {
        list: {
          type: Array,
          value: ()=> []
        },
        inputVal: String,
        placeholder:String,
        isTop:Boolean
      },
      data: {
        isShow:false
       
      },
      methods:{
        inputFocus(){
          this.setData({
            isShow:true
          })
          
        },
        inputFun(e){
          let val = e.detail.value
          // if(val!=this.data.inputVal){
            this.setData({
              inputVal:e.detail.value,
              isAlert:true
            })
            //this.triggerEvent('eventP',e.detail.value)
          // }else{
          //   this.setData({
          //     isAlert:true
          //   })
          // } 
        },
        inputBlur(e){
          this.triggerEvent('eventP',e.detail.value)
          if(this.data.list.length>0){
            let _this = this;
            setTimeout(()=>{
              if(_this.data.isShow){
                _this.setData({
                  isShow:false
                })
              }
            },100)
          }
        },
        selectVal(e){
          let val = e.detail.value? e.detail.value:e.currentTarget.dataset.val
          console.log('val',val);
          if(val){
            this.setData({
              inputVal:val,
              isShow:false,
              isAlert:false
            })
            this.triggerEvent('eventP',val)
          }else{
            this.setData({
              isShow:false
            })
          }
        }
      },
      created(){
     
      }
})