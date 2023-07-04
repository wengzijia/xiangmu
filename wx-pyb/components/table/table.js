Component({
  properties: {
    list: {
      type: Object,
      value: ()=> []
    }
  },
  data: {
    listData:[
      
      ]
  },

  methods: {
   s(){
     var str= "纸张材质:金银卡纸_420;开纸尺寸:555.00*555.00mm;放损:0;印刷:双面印刷;正面印刷颜色:多色(CMYK);正面专色:2,22;正面加印白墨;反面印刷颜色:多色(CMYK);反面专色:2,666,666;反面加印白墨;"
     var arr1 = str.split(';').map(e =>{
      return e.split(':')
     })
     
   }

    
  }


})