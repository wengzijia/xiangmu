import { gainActivities, createAccountTopupOrder, createPayQrCode, gainAccount, getDbUserInfo } from "../../../api/userApi.js";
import { uploadWebURL } from '../../../utils/request.js';

import Toast from '@vant/weapp/toast/toast';
import { togetherEditionBalancePay } from "../../../api/credit.js";
import { debounce } from "../../../utils/util.js";

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    activity: {
      prompt: '', // 备注
      cumulativeGiftLimit: 0, // 累计限额
      givingInterval: [], // 满赠区间
      givingProportion: 0, // 赠送比例
      givingType: 0, // 赠送类型
      status: 0, // 是否生效
    },
    userMoney: 0, // 用户余额
    money: '',
    moneyText: '',
		orderId: '',
		cardNo: '',
		cardNoText: '',
    payType: '2',
    give_full_amount : '',
    currentDate: new Date().getTime(),
    maxDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      } else if (type === 'day') {
        return `${value}日`;
      } else if (type === 'hour') {
        return `${value}时`;
      } else if (type === 'minute') {
        return `${value}分`;
      }
      return value;
    },
    xhToken: wx.getStorageSync('token'),
    xh: false,
    uploadWebURL,
		uploadStatus: false,
		show: false,
		account: {},
		fileList: [],
		activityId: 0,
    showHint: false,
    norm: false,
    photoList:[],
    photoListMax:3,
    dropDown: [],
    showDropDown: false,
    dropDownIndex: null,
    rule: ''
  },
  TimeID: -1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    gainActivities().then(res => {
      if(!res.success) {
        Toast(res.message)
        return
      }
      if (!res.data) {
        return
      }
      if (res.data.givingType == 1) { // 区间
        res.data.givingInterval = JSON.parse(res.data.givingInterval)
        res.data.givingInterval = res.data.givingInterval.splice(0,3)
      } else if (res.data.givingType == 2) { // 按比例
        
      }

      console.log('res', res.data);
      let givingInterval = [
        {
          given_amoun: '1000',
          give_full_amount: "10,000"
        },
        {
          given_amoun: '3000',
          give_full_amount: "30,000"
        },
        {
          given_amoun: '5000',
          give_full_amount: "50,000"
        },
      ]
      
      this.setData({
        activity: {...res.data, givingInterval},
        activityId: res.data.id,
        rule: res.data.rule
      })
    })
    getDbUserInfo().then(res => {
      if(!res.success) {
        Toast(res.message)
        return
      }
      
      res.data.userMoney = this.formatMoney(res.data.userMoney, 2)
      this.setData({
        userMoney: res.data.userMoney
      })
    })
    // 获取预存账号信息
		gainAccount().then(res => {		
      if(!res.success) {
        Toast(res.message)
        return
      }	
			// for (const key in res.data) {
			// 	this.data.account.zfb = res.data[key]
			// }
      if (res.data && res.data[1]) {
        res.data[1][0].bankCardNumber = res.data[1][0]?.bankCardNumber.replace(/(.{4})/g, "$1 ").trim()
      }
			this.setData({
				account: res.data
			})
		})
  },

  jumpBill() {
    wx.navigateTo({ url: './accountBill/index' })
  },
  topUp:debounce(function() {
    if (!this.data.norm) {
      return
    }
		let req = {
      accountId: 0,
      activityId: this.data.activityId || null, // 充值优惠活动表id
      eftNo: '',
      eftTime: '',
      memo: '',
      payPoints: '',
      payProof: '',
      source: 2,
      sysType: '',
      topUpWay: 2
    }
		let _this = this
    
		if (!_this.data.money) {
			return Toast('请输入充值金额')
		}
		if (_this.data.payType == 1) {
			if (_this.data.orderId=='') {
				return Toast('请输入转账订单号')
			}
      if (!_this.data.account[2]) {
        return Toast('暂时不提供支付宝转账，请联系客服！')
      }
			req.eftNo = _this.data.orderId.trim()
			req.accountId = _this.data.account[2][0].id
		}
		if (_this.data.payType == 4) {
			if (_this.data.cardNo=='') {
				return Toast('请输入转账银行卡号')
			} else if (_this.data.cardNo.length < 16) {
        return Toast('请确认卡号是否填写正确')
      }
      
      if (!_this.data.account[1]) {
        return Toast('暂时不提供银行卡转账，请联系客服！')
      }

      if (this.data.dropDownIndex != null && this.data.dropDown[this.data.dropDownIndex].label == _this.data.cardNo) {
        req.eftNo = this.data.dropDown[this.data.dropDownIndex].value
      } else {
        console.log('ss', _this.data.cardNo);
        req.eftNo = _this.data.cardNo.replace(/\s/g, '')
        let start = req.eftNo.slice(0,4)
        let end = req.eftNo.slice(-4)
        let body = ' ****'
        body = body.repeat(3)
        body += ' '

        let dropDown = wx.getStorageSync('dropDown')
        if (!dropDown) {
          dropDown = []
        }
        if (dropDown&&dropDown.findIndex(e => e.value == req.eftNo) == -1) {
          dropDown.push({label: start+body+end, value: req.eftNo})
          if (dropDown.length > 3) {
            dropDown.splice(0,1)
          }

          wx.setStorageSync('dropDown', dropDown)
        }
      }

			req.accountId = _this.data.account[1][0].id
      
      

		}

    let money = (_this.data.money+'').replaceAll(',','')
    req.eftTime = new Date(_this.data.startTimeStr).getTime()/1000
    req.payPoints = Number(money)
    req.topUpWay = _this.data.payType

		if (_this.data.payType != 2) {
      if (_this.data.photoList.length == 0) {
				return Toast('请上传转账凭证')
      }
      _this.uploadImgs().then(imgs =>{
        console.log('imgs',imgs)
        req.payProof = JSON.stringify(imgs.map(e => e.data))
        wx.showLoading({
          title: '加载中...',
        })
        _this.createAccountTopupOrderFun(req)
      })	
		} else {
      _this.createAccountTopupOrderFun(req)
    }
  },1000),
  createAccountTopupOrderFun(req){
    let _this = this;
    app.saveReport({"actionId": 3,"channel":701000})
    createAccountTopupOrder(req).then(res => {
      if (this.data.payType == 2) {
        createPayQrCode({orderNo: res.data.dealNo,payType: app.globalData.payType4}).then(resp => {
          var payBean = JSON.parse(resp.data)
          wx.requestPayment({
            'timeStamp': payBean.timeStamp,//时间戳
            'nonceStr': payBean.nonceStr,//随机字符串
            'package': payBean.package,//统一下单接口返回的 prepay_id 参数，提交格式如：prepay_id=***
            'signType': payBean.signType,//非必要——签名算法
            'paySign': payBean.paySign,//签名
            'success': function (res) {
              Toast.success('充值成功')
							_this.reset()
            },
            'fail': function (res) {
              console.log('error');
              Toast.success('取消支付')
							wx.hideLoading()
            }
          })
        })
      }
			if (!res.success) {
				Toast('创建订单失败')
				wx.hideLoading()
			} else if (this.data.payType != 2) {
				Toast.success('提交成功')
        wx.navigateTo({ url: './result/index?type=' + this.data.payType+'&dealNo=' + res.data.dealNo })
				_this.reset()
			}
    })
  },
	reset(){
		wx.hideLoading()
		this.setData({
			orderId: '',
			cardNo: '',
			fileList: [],
      photoList: [],
			startTimeStr: '',
			money: '',
      unit: ''
		})
    getDbUserInfo().then(res => {
      let str = toString(res.data.userMoney).indexOf('.')
      
      this.setData({
        userMoney: res.data.userMoney
      })
    })
	},
  copyBtn: function (e) {
    wx.setClipboardData({
      //准备复制的数据
      data: e.currentTarget.dataset.sn,
      success: function () {
        wx.hideLoading()
				Toast.success({message:'复制成功',zIndex:1000});
      }
    })
  },
  clickRadio(e) {
    let _data = e.currentTarget.dataset

		if (_data.key == 'give_full_amount') {
			let unit = '万'
			// switch (_data.val.length) {
			// 	case 3: unit = '百'; break;
			// 	case 4: unit = '千'; break;
			// 	case 5: unit = '万'; break;
			// 	case 6: unit = '十万'; break;
			// }

      // _data.val = this.formatMoney(Number(_data.val),0)

			this.setData({
				money: _data.val,
				unit: unit,
        norm: true,
        give_full_amount: _data.val
			})
		}

    this.setData({
      [_data.key]: _data.val
    })
  },
  inputVal(e) {
    var key = e.currentTarget.dataset.key
    var value = e.detail.value;
    let unsignedInt = /^[1-9]\d*$/

    if (value.indexOf('.') != -1) {
      this.setData({
        [key]: this.data[key] || ''
      })
      return
    }

    value = (value+'').replaceAll(',','')

    if (!unsignedInt.test(value)) {
      this.setData({
        [key]: '',
        unit: ''
      })
      return
    }

    if (value.length == 7) {
      Toast('最大支持充值 999 990')
      this.setData({
        [key]: this.data[key]
      })
      return
    }
    let unit = ''
    console.log(value.length)
    switch (value.length) {
      case 3: unit = '百'; break;
      case 4: unit = '千';  break;
      case 5: unit = '万'; break;
      case 6: unit = '十万'; break;
    }

    let norm = (value %10)==0;
    value =  this.formatMoney(Number(value),0)

    this.setData({
      [key]: value,
      unit: unit,
			give_full_amount: '',
      norm: norm
    })
  },
  formatMoney(money, precision = 2, splitDesc = ',') {
    precision = +precision // 这里为了处理precision传入null  +null=0
    const str = money.toFixed(precision)
    const reg = str.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
    return str.replace(reg, '$1' + splitDesc)
  },
  inputBlur(e) {
    var key = e.currentTarget.dataset.key
    var value = e.detail.value;
    this.setData({
      showDropDown: false
    })
  },
  inputFun(e) {
    var key = e.currentTarget.dataset.key
    var value = e.detail.value;
    let unsignedInt = /^[0-9]\d*$/
    
    if (key == 'cardNo') {
      value = value.replace(/\s/g, '')
      if (!unsignedInt.test(value)) {
        this.setData({
          [key]: value == '' ? '': this.data[key]
        })
        return
      }

      if (value.length > 4) {
        this.setData({
          showDropDown: false
        })
        value = value.replace(/(.{4})/g, "$1 ").trim();
      } else {
        let dropDown = wx.getStorageSync('dropDown') || []
        this.setData({
          dropDown: dropDown,
          showDropDown: dropDown.length ? true : false
        })
      }
    }

    this.setData({
      [key]: value
    })
  },
  theCache(e) {
    console.log('this.theCache', this.data.cardNo);
    var _data = e.currentTarget.dataset;
    this.data.dropDownIndex = _data.index
    this.setData({
      cardNo: _data.val,
      showDropDown: false
    })
  },
  confirm(event) {
    let time = new Date(event.detail)
    let year = time.getFullYear()
    let month = time.getMonth()+1
    let date = time.getDate()
    let hours = time.getHours()
    let mintes = time.getMinutes()
    let seconds = time.getSeconds()
    time = `${year}-${month<10?'0':''}${month}-${date<10?'0':''}${date} ${hours<10?'0':''}${hours}:${mintes<10?'0':''}${mintes}:${seconds<10?'0':''}${seconds}`
		this.cancel()
    this.setData({
			startTimeStr: time
		})
  },
	cancel() {
    if (this.data.startTimeStr) {
      this.selectComponent('#dropdownItem').toggle();
    } else {
      this.selectComponent('#dropdownItem2').toggle();
    }
    
	},
	showPopup() {
    this.setData({ show: true });
  },
  showHintPopup() {
    this.setData({ showHint: true });
  },
	openDropdown(){
		console.log('openDropdown');
		this.setData({
			maxDate: new Date().getTime(),
		})
	},
  onClose() {
    this.setData({ show: false,showHint: false });
  },
  /**
   * 拍照上传图片
   */
  photograph(){
    let _this = this;
    let len = _this.data.photoList.length
    if(len== _this.data.photoListMax) return
    wx.chooseMedia({
        count: _this.data.photoListMax-len,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        camera: 'back',
        success(res) {
          console.log(res)
          let photoList = _this.data.photoList
          photoList.push(...res.tempFiles)
          console.log('photoList',photoList)
          _this.setData({
            photoList
          })
        }
      })
   },
   /**
    * 删除图片
    * @param {*} e 
    */
   delPhotographImg(e){
    console.log('e',e)
    let _this = this;
    let photoList = _this.data.photoList
    photoList.splice(e.currentTarget.dataset.index,1)
    _this.setData({
        photoList
    })
   },
    /**
    * 查看图片
    * @param {*} e 
    */
     checkImgs(e){
      let _this = this;
      let photoList = _this.data.photoList.map(e => e.tempFilePath)
      _this.previewImage(photoList[e.currentTarget.dataset.index],photoList)
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
  /**上传多张图片 */
  uploadImgs(){
    let _this = this; 
    console.log('_this.data.photoList',_this.data.photoList)
    const token = wx.getStorageSync('token');
    let list = _this.data.photoList.slice(0,5)
    let photoList = list.map(e => {
      return new Promise((resolve,reject)=>{
            if(e.isOss){
              let arr = e.tempFilePath.split(imageBaseUrl)
              resolve({data:arr[arr.length-1]})
            }else{
              wx.uploadFile({
                url: app.globalData.requestUrl + '/api/consumer/user/miniUserAccountTopup/uploadFile', //图片上传api
                filePath: e.tempFilePath,
                name: 'file',
                header:{token},
                success (res){
                  resolve(JSON.parse(res.data))
                },
                fail(err){
                  reject(err)
                }
              })
            }
      
      })
    })
    return Promise.all(photoList)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})