 
 
Page({
 
  /**
   * 页面的初始数据
   */
 /**
   * 页面的初始数据
   */
  data: {
    fileList: [] //需要上传的图片列表
  },
  uploadFile(uploadFile) {
    console.log('uploadFile',uploadFile);
    const token = wx.getStorageSync('token');
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: 'http://192.168.6.23:9040/api/bw/alibaba/oss/uploadFile', // 上传的服务器接口地址
        filePath: uploadFile, 
        name: 'file', //上传的所需字段，后端提供
        header: {
          token
        },
        formData: {
          file: uploadFile,
          folder: "error/"
        },
        success: (res) => {
          // 上传完成操作
          const data = JSON.parse(res.data)
          console.log('data',data);
          // const url = data.data  
          resolve({
            url: 'https://alifile.xiaocaiyin.com/' + data.data
          })
        },
        fail: (err) => {
          //上传失败：修改pedding为reject
          reject(err)
        }
      });
    })
  },
  afterRead(event) {
    let _this = this;
    wx.showLoading({
      title: '上传中...'
    })
    const { file } = event.detail //获取所需要上传的文件列表
    console.log(file);
    let uploadPromiseTask = [] //定义上传的promise任务栈
    for (let i = 0;i < file.length;i++) {
      uploadPromiseTask.push(_this.uploadFile(file[i].url)) //push进每一张所需要的上传的图片promise栈
    }
    console.log('uploadPromiseTask',uploadPromiseTask);
    Promise.all(uploadPromiseTask).then(res => {
      console.log('res',res);
      //全部上传完毕
      _this.setData({
        fileList: _this.data.fileList.concat(res)
      })
      console.log('fileList',_this.data.fileList);
      wx.hideLoading()
    }).catch(error => {
      //存在有上传失败的文件
      wx.hideLoading()
      wx.showToast({
        title: '上传失败！',
        icon: 'none',
      })
    })
  },
  deleteImg(event) {
    const delIndex = event.detail.index
    const { fileList } = this.data
    fileList.splice(delIndex, 1)
    this.setData({
      fileList
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  // 获取输入账号 
  phone: function (e) {
    let phone = e.detail.value;
    let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!reg.test(phone)) {
      wx.showToast({
        title: '手机号码格式不正确',
        icon:"none",
        duration:2000
      })
      return false;
    }
    this.setData({
      phone: e.detail.value
    })
  },
  //发送验证码
  sendcode(res){
    var phone=this.data.phone;
    var time = 60;
    var that=this;
    // wx.request({
    //   url: 'http://www.easyadmin.com/api/phone',
    //   data:{
    //     phone:phone
    //   },
    //   success:res=>{
    //     if(res.data.code==200){
          wx.showToast({
            title: '验证码已发送.请注意接收',
            icon:"success"
          })  
       
          var timers=setInterval(function () {
            time--;
            if (time>0){
              that.setData({
                codebtn:time,
                disabled:true
              });
            }else{
              that.setData({
                codebtn:'发送验证码',
                disabled:false
              });
              clearInterval(timers)
            }
          },1000)
        // }else{
        //   wx.showToast({
        //     title: res.data.msg,
        //     icon:"none",
        //     duration:2000
        //   })
        // }
        // this.setData({
        //   code:res.data.data,
        
        // })
    //   }
    // })
     
 
   
  },
  // 登录处理
  login(e){
    var phone=this.data.phone
    var code=this.data.code
     wx.request({
       url: 'http://www.easyadmin.com/api/loginDo',
       method:'POST',
       data:{
         phone,
         code
       },
       success:res=>{
         if(res.data.code==200){
            wx.redirectTo({
              url: '/pages/my/my',
            })
         }
         console.log(res.data)
       }
     })
  },
   
  
})