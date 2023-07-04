const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
     data: {
        uploade:true,
        webUrl:''
    },
    onLoad: function (option) {
        console.log('webUrl',decodeURIComponent(option.url));
        // '?token=1111111111&pageType=exclusive'
        this.setData({
            webUrl:decodeURIComponent(option.url)
        })
    
    },
    getMessage: function(e){
        if (e.detail.data[0]) {
            console.log('app.globalData.pdfPath',e.detail.data[0].data)
            app.globalData.pdfPath = e.detail.data[0].data
        }else{
            wx.showToast({
                title: '文件上传失败',
                icon: 'error',
                duration: 1500
              })
        }
    }
})