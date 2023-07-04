

//获取应用实例
const app = getApp()

Page({

    data: {
        uploade:true,
        webUrl:''
    },

    onLoad: function (option) {
        console.log('webUrl',decodeURIComponent(option.url));
        this.setData({
            webUrl:decodeURIComponent(option.url)
        })
    },
})