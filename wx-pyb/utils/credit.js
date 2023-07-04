import { getUserCreditPurchaseDetail  } from "../api/userApi"
import { getDbUserInfo } from "../api/userApi.js";
import { DiffOrderPayUrl } from "../api/orderApi.js";
import { creditPurchasePay, togetherCreditPurchasePay,editionCreditPurchasePay,editionMergeCreditPurchasePay
         ,togetherBalancePay, balancePay, togetherEditionBalancePay, editionBalancePay, creditPurchasePayDiff
         ,balancePayDiff } from "../api/credit"
import { subscribeNews } from './baseUtil'
const app = getApp()
export const data = {
    creditShow: false,
    amount: null,
    creditActions: [
      {
        name: '信用支付',
        subname: '',
        disabled:true,
        loading:true,
        status: 0,
        img:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAAXNSR0IArs4c6QAAA7hJREFUWEftmUtoE1EUhv8zmWmnkIi4kIJFEBQRxFWltasUXKh0fKCoRUQXLly4UFAs6MKdii4U3AruFB+oGLWikC5KorjRlUIVRVsQFR8k2KmZ5MidZkpaZ+bemU6tYgNZ5Ty+++fcc2fOJfxjH/rHePFHgDmfNZ2WzGWAMTxa7l3SPWDHFWrGgX/k17cZpn4NQGcdctCxK7tbuvvfxoGeMWDOZ/Vqc2YPA2dBmD8JjtnWQAe1sdJF6h5wooAnDuyCmvN21cDHCVgaBsPMzzSNTrwfLT1QLRMp8Md8Nr2we6AclvhNPmu2NWc6oGEzGDsBtEZRDeAPYLoCcO7rWPlJWD4pcKVgVRj8koCXRPjAwDcw6UScZkYrA0sJtBIEPRpkgDXDCcsnBy5anAhIQkHmgBMSMjDMnMJzCk9RYK4k/p+SaFkMjL6TrvevKAla0IXUsiOojVxFbfhyKPSsA3uwoJQLKoDDoGcVeCqsAGauovr8AGCP+Co9a8CBsENngC+Fv+ukiwsrVpGswuaiwL/Sk2w6sGrABasEQlrWb7S2XmiLtqM6dAYc8JdOFxaMslThn0VrSPaq48K29Y6vSWwaH+hpw7obEq+kwJViz0OA1gYq3LIY+qrz8NqSH3QSsONxOScHLlgnQegLKwk/IE9p4ScOhcYFua1L0g188zHOSoGdx9YmZtyS1XAQtOtXPxQm+mwcWBGGqpulwF/z2fnp5swnlZdMX+iGlcZWdnyltt5kt0qBhW2laN0B0CNT2RWz/lwwqaa9EyymsuP1i36j6856JWDnsbWVGddVgP2gp6VsPakoB73z3m0lYDHNqZiZF7L21rggT2kxI4i1wRpLCXg7YpdWiOmQErDwdYob9zD4kqrKntLuUCPk2UAlHnNtX1PX3YtuTBUHt4TyWd1pzhRBaFf1ScJOzN+MsfJqb2ioDOxCFzd0OJwaVOkYScCKzsApdDZ15J578SIB1zvGUQCnEgGSBqn1GWvunp60N6Q+PgaVQs81EG2L46vuwzljTc6aah9Z4Xo9m46ZuQlgnTpAJMv+Ybu0xW9mHAt4hqEDYSN1CT996pctJ8E4GEm/AGMCX0jZ5UNh1wixFW7M6RR7djBwDqCIk/eJKJ+Jqvv1zns3ZAtPBFgkKec3tJqmdowZ+0BkyhK7vzM7TLhkGPZhan/0XcUnMWAvGT/duNyp8H4Ae3+7PZowwjcmvm4Y1VPUfv+1CmjsPqwaXNR31UxvBXgtg8RXXG8NauBcyrD7VRWdmu8Xw3zbgzvvqe4AAAAASUVORK5CYII='
      },
      {
        name: '微信支付',
        status: 1,
        img:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAAXNSR0IArs4c6QAABPRJREFUWEftWU1oXFUU/s69kxpsIyl0kUXASqsWjFiaGSxYaAJKF2ah4EasOIuqTWcCKXVvxIIRA6Y0mUQNNIsWXHTRIkILhaRQaSEvreJPWqhUQaGi0NjEGsy8+8mdSexk5r15901+SsDZvnPO/e53zz3nO3cE6+wn6wwv/ge82ie2Igynx1Bf/wj2aqo9hLSA3A5Bk1AaIUgAnCVwG5DvAF43Ysbn7uLiaDvm4m5wWYA7r2Kv+PqACDsAaYy3uN2EnFb0RwZS+MrVtybAFqgyugdAm+tC1exIfi2QnsGUfzYqXizA6TE0bmzQHwNIRwWu5TuJ0//4/uGR3fglzN8ZcOckWpVRZyDSXAsYVx+St41S6eHW/PkgHyfA2cnEPmN4RgT1rgsvy47IQ7F7sNUMlseJBLzmYEsQEuzOJc2xUtBVAXddxTO+r6+sGbNldJKc02Jajifx4+KnUMC2tj7coKYEsnVZx1uLM5mn4KSGOVoK1oYKBZyd1MdJZGtZr3YfToMY9etM3/BO/Op86bIedhjqa2uXCpymoD9P0/9pEn+WAj1wBc0PJfT7eeX3f7IL3wQyfMjTQwIcrJ0pN09bwqAwHAS0bQyJlgaVIdBT7KIcGUyaNysAHxrDJmzSv68muwRvgqb33ixOBemJjIdnQT0AQfL+1jn914x5rBLwpH5NiJMRrfS2iDS58ViyJHhTYI5+P4NT4+3Il/svdNKPQKSLomnpT5T/SgXgjKc/A3CgGph5+Ns3CJKkGgFkkwPwcQO/byiJL8NsM55+g2CfQLaE2RAcrmTYU9+KlYhVKfZfGkzhbOYqHoXRo2EiiDTnqNk7tAsXw8LZC04USNoTuXHCqwQ8of4WkaotmOTJXMq8vrjAoUn1thC9hcuxUENJ0zuUwo0wEIW70qDeFUp30PEH+RH8Iygl6LDTfKLebz72NH5btLWNZuNmbOMd/Jxrx2y1GF2eftEHB2ppSkEpccslEIU9uVbzXuTmSgwOXsZWXaePA+iI41dqGwBYXxZgd1RAgj/9MGMeD7rt5b62pj7VoI6Q0rOccmnrdhDDJwTiJNAN/I5qN98CL04nahiQHVEkRH4PunSZSZUBZSDSGQCJC7mU/0KQrW2pG7T+QAT7XWK52ASWtc4JPKlEX3cJACKvxN9RrqhsTQXYH38wrb4qxd8fqCUynppyPkKyfzBlDtulrH42RtvTia6pTozcN7LaOC+mKUT8qCMC6XOKaccZ4DQAO+Y/71pTnWKXGBHmTC7JlwMBF3t6geXYeiEuEFf7vPJ3hspLG6SYh7Bt94H/DPn5UMq8aoFUnekynv5iOUV+JXZqa29dvdm52FWrAn7Lw5YE1IRL51sJcBUxyLyvTMdwK/57o4gc87s8bDNQlx5IPguz5W8TkYAL5crDNh/qwpoxXVR875S/SUTmcOkRLWhfO4mseI1dmgqcNjD7w1q+E8OLAbPX8Bx9fWlV8nWh1Zs6Px024sdiuFDqYuiMOJsqDKVienKtOBXlF4vhjKdPVD61ctZxrluCxbZaCM8RHJmawXkXmRqf4Qk9UTp6ExzNw3SreWxWCbVPgDYK7DzYVD5M2vEGkOtCeoAZnxeMlz+aRLEbH7Cn7lgFZsU7YbLVtLAV7U80YKNdpBZgYeCdU2JhaLwFwcC9u+bDWv5QcWEwysYZcFSgtfq+7gD/C5zj/iT03evPAAAAAElFTkSuQmCC'
      },
      {
        name: '余额支付',
        subname: '',
        disabled:false,
        loading:true,
        status: 0,
        img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAAXNSR0IArs4c6QAABJJJREFUWEftmX1MlVUYwH/n8jGb/YFhijqbjmI1XYSimJKAcC3X2Litzb9aZrEh4Vgsw9F0d7Yc4qqBFCQWOFet5bSi5lRQSDLN0mS0mtoq+yKqYRbh4N77tPO+3C7g/Wy8F9g8f973uef9vc/XeZ7nKCbZUpOMlxvAVlssbA1LTv4CYmNLBMkD5oGKtQZOXMB3gmqz2ahVhw+eH/6ekMCSnT3FE5dQp1DrrAEMvqvAHttg70bV1nZNSwYF1rASn9CMKK3V8VtKWtTAlXwNHRTYbXc0KHhi/Eh9bxakKebou48FBJb7Hani4YuJAOtlUC7XwsDAdkeDTBDteoFFqA8I7LEXXAR1u18N22yQkwnpaXDTlLExQv81OHMO2jrA4wmwp1wKBjzoN3XFxYFzM2pJ2tiAjtpFNPSW5wNAiysIsEP8Ej2QhyorRrp74OUG+P2PsQGfnghPFqKSZiA7a+Bom999IweuKENlZyLbqqDjVGSwdyTDiqWgzX+oBa7+NfL/2ZmoijKktR12VI8RsLMctTwDeXoLdH4ZGnh2EuRmoXJXwuxZ/8nLt5dhQ9lI0y9finJuRk6eBueOKAJPS4DsTMhdiUrxxa1cuGQGlX0Vav5tiPbV05/7wKIKrINRQ2qzLrobYmIMEMPXNeTXF2BgEM53wZo8VEkh0tIOVcNMHzXgGBtUOlGpC03IP6+C9sOuryBppukOyfNNTXb3IFu3o+peMGUffhT6/jGfRQ04JRlVuxP56RfY9zbcPNXU9F0pPk1f/tEA07/JO+/BLQmo3Cykuh4+PBJl4LlzUK/tgoEBE3C4O5z4xHSJi9/AvLmo3dWmm9S/bgaY9uuSZ6IInJ5mpCJDq9rEf/fBiZPQ+pHpEqNPrdoqIxDFWQlF6828W1gK3/8QHZdQbzTArYnI8Q441m4er17Iqdo1VpjB+HM3vPQKPLgaVVpkyvf0oNY+ZLpIw94oAR/YZ9QTsq4Yfv0NNOSyxZCVaR7fXvfQ2WHTVuO52t9kWsNZiXruWZ9bWBp05U441wlPFaPW5CFHjhlwKiM9tHuUlxoB511yoBnqGy3WcOOb8NZ+uDMFVVPpe7kOvI8/vd49hp9bGYsNzeJ2Ix8cht17YXAQ1jpQjz9izUlnvOzUZ9DXh1q9ysTp70fOdhq/BV3aEkMaNuoGt9t0lWXphpUsOZqNFBYfH7qWiERCg1sFbNQBuuoaSmeRcPmV1elw5gzUpo3WaDjsai2SL7E0S4RbXt4ADqABjz1AixRpAT/uGh5K+v+rRQoF722RdLG0/UW/0pH3dPYcI5KNurbmVejtDYUR3vPpiaii9TBnFlLbAO8fihS4wH+br4v1bRWoJYvCA4lQSs6cNfs5ffJdt4K2+UEGKboduu9e0MXNRBmkiN1RJ1AUoYIsFRcPewLP1nLyF0hsbJelBBFurlzcE2LcWtA4XoPs0d+itRvTerAw9EA7NqEZNc4DbZEW5QpjoK2/0rwymLZrvAbb4pEmm/vKhrCuDIabRXIcqdgoEZtkR+lSpsXmctWq480j5mEhL2UijAvLxScd8L+MOIWyBEspiQAAAABJRU5ErkJggg=='
      },
    ],
    creditType:'',
    creditEvent:null,
    creditOrderSn:'',
    creditCallBlack:"",
    wxPayCallBlack:"",
    isDiffOrder: false

}

export const methods = {
  inspectionPay() {
    let status = 0 // 统计不可用
    for (let i = 0; i < this.data.creditActions.length; i++) {
      const el = this.data.creditActions[i];
      // 判断当前是否可用
      if (el?.disabled) {
        status++
      }
    }
    wx.hideLoading()
    // 当仅剩微信支付可用时 直接跳转为 微信支付
    if (status == this.data.creditActions.length - 1) {
      this[this.data.wxPayCallBlack](this.data.payParams)
    } else {
      this.setData({
        creditShow: true
      })
    }
  },
  //查询用户每种支付方式的额度
  getUserCreditPurchase(e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    this.setData({
        wxPayCallBlack :e.wxPayCallBlack,
        payParams:e,
        creditOrderSn: this.data.payRse?.data || e.sn,
        isMergePay:e.isMergePay,
        isDiffOrder: e.currentTarget.dataset?.type == 'diff' ? true : false
    })
    // 查询信用额度
    let getUserCredit = getUserCreditPurchaseDetail().then((res) => {
      if (res.success) {
        if (res.data && Object.keys(res.data).length > 0) {
          this.setData({
            ["creditActions[0].subname"]:
              "剩余额度：" + Number(res.data.surplusAmount).toFixed(2),
            ["creditActions[0].disabled"]:
            Number(res.data.surplusAmount) < Number(e.currentTarget.dataset.amount) || res.data.status != 1,
            ["creditActions[0].loading"]: false,
          });
        }
      }
    })
    // 查询余额额度
    let getDbUser = getDbUserInfo().then((res) => {
      if (res.success) {
        if (res.data && Object.keys(res.data).length > 0) { 
          this.setData({
            ["creditActions[2].subname"]:
              "剩余额度：" + Number(res.data.userMoney).toFixed(2),
            ["creditActions[2].status"]: Number(res.data.userMoney) < Number(e.currentTarget.dataset.amount) ? 0 : 1,
            ["creditActions[2].loading"]: false,
          });
        }
      }
    })

    Promise.all([getUserCredit, getDbUser]).then(res => {
      this.inspectionPay()
    })
  },
/**选择支付方式 */
paySelect(e) {
  let _this = this
  console.log('paySelect',e, this.data.isDiffOrder);
  if (e.detail.name == "信用支付") {
    if (this.data.creditType=='supplier') {// 拼版
      if(this.data.isMergePay){//合并支付
        togetherCreditPurchasePay({orderNo:this.data.creditOrderSn}).then(res=>{
          // console.log('this.data.creditOrderSn',res)
          if (res.success) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 1500,
              complete(){
                setTimeout(()=>{_this[_this.data.creditCallBlack]()},1000)
              }
            })
            // subscribeNews(_this.data.creditOrderSn)
          }
        })
        }else{
          let fun = this.data.isDiffOrder ? creditPurchasePayDiff : creditPurchasePay
          //单订单支付
          fun({orderNo:this.data.creditOrderSn}).then(res=>{
            if (res.success) {
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 1500,
                complete(){
                  console.log('kaishi');
                  // subscribeNews(1, _this[_this.data.creditCallBlack])
                  setTimeout(()=>{_this[_this.data.creditCallBlack]()},1000)
                }
              })
              // subscribeNews(_this.data.creditOrderSn)
            } else {
              wx.showToast({
                title: res.message,
                icon: 'none',
                duration: 1500
              })
            }
          })
        }
      }else{
        if(this.data.isMergePay){//合并支付
          editionMergeCreditPurchasePay({orderNo:this.data.creditOrderSn}).then(res=>{
            // console.log('this.data.creditOrderSn',res)
            if (res.success) {
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 1500,
                complete(){
                  setTimeout(()=>{_this[_this.data.creditCallBlack]()},1000)
                }
              })
              // subscribeNews(_this.data.creditOrderSn)
            }else {
              wx.showToast({
                title: res.message,
                icon: 'none',
                duration: 1500
              })
            }
          })
        }else{
        //单订单支付
          let fun = this.data.isDiffOrder ? creditPurchasePayDiff : editionCreditPurchasePay
          fun({orderNo:this.data.creditOrderSn}).then(res=>{
            if (res.success) {
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 1500,
                complete(){
                  setTimeout(()=>{_this[_this.data.creditCallBlack]()},1000)
                }
              })
              // subscribeNews(_this.data.creditOrderSn)
            } else {
              wx.showToast({
                title: res.message,
                icon: 'none',
                duration: 1500
              })
            }
          })
        }
      }
    } else if (e.detail.name == "余额支付") {
      if (this.data.creditType=='supplier') {// 拼版
        if(this.data.isMergePay){//合并支付
          togetherBalancePay({orderNo:this.data.creditOrderSn}).then(res=>{
            // console.log('this.data.creditOrderSn',res)
            if (res.success) {
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 1500,
                complete(){
                  setTimeout(()=>{_this[_this.data.creditCallBlack]()},1000)
                }
              })
              // subscribeNews(_this.data.creditOrderSn)
            }
          })
          }else{
          let fun = this.data.isDiffOrder ? balancePayDiff : balancePay
          //单订单支付
          fun({orderNo:this.data.creditOrderSn}).then(res=>{
            if (res.success) {
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 1500,
                complete(){
                  setTimeout(()=>{_this[_this.data.creditCallBlack]()},1000)
                }
              })

              // subscribeNews(_this.data.creditOrderSn)
            } else {
              wx.showToast({
                title: res.message,
                icon: 'none',
                duration: 1500
              })
            }
          })
        }
      }else{
        if(this.data.isMergePay){//合并支付
          togetherEditionBalancePay({orderNo:this.data.creditOrderSn}).then(res=>{
            // console.log('this.data.creditOrderSn',res)
            if (res.success) {
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 1500,
                complete(){
                  setTimeout(()=>{_this[_this.data.creditCallBlack]()},1000)
                }
              })
              // subscribeNews(_this.data.creditOrderSn)
            }else {
              wx.showToast({
                title: res.message,
                icon: 'none',
                duration: 1500
              })
            }
          })
        }else{
          let fun = this.data.isDiffOrder ? balancePayDiff : editionBalancePay
        //单订单支付
        fun({orderNo:this.data.creditOrderSn}).then(res=>{
          if (res.success) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 1500,
              complete(){
                setTimeout(()=>{_this[_this.data.creditCallBlack]()},1000)
              }
            })
            // subscribeNews(_this.data.creditOrderSn)
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none',
              duration: 1500
            })
          }
        })
        }
      }
    } else{
      // this.WXpay(this.data.creditEvent)
      // this.WXpay?this.WXpay(e):
      // 补差-微信价支付
      if (this.data.isDiffOrder) {
        DiffOrderPayUrl({orderNo:this.data.creditOrderSn,payType: app.globalData.payType}).then(res => {
            var payBean = JSON.parse(res.data)
            wx.hideLoading();
            wx.requestPayment({
              // 'appId':payBean.appid,
              'timeStamp': payBean.timeStamp,//时间戳
              'nonceStr': payBean.nonceStr,//随机字符串
              'package': payBean.package,//统一下单接口返回的 prepay_id 参数，提交格式如：prepay_id=***
              'signType': payBean.signType,//非必要——签名算法
              'paySign': payBean.paySign,//签名
              'success': function (res) {
                _this.getAllOrder()
              },
              'fail': function (res) {
                wx.hideLoading()
                wx.showModal({
                  title: "提示",
                  content: "支付失败",
                  showCancel: false,
                  success: function () { }
                })
              }
            })
          })
      } else { // 微信支付
        this[this.data.wxPayCallBlack](this.data.payParams)
      }
      //   this.triggerEvent('callBlack','wxpay')
    }
    this.setData({
        creditShow:false
    })
  },
  creditHideFun(){
    let _this = this
      this.setData({
          creditShow:false
      })
      _this[_this.data.creditCallBlack]()
  },
  onSelect(event){
    let { index } = event.currentTarget.dataset; // 原本逻辑
    if (typeof index != "number") { // 封装成组件后的逻辑
      index = event.detail.currentTarget.dataset.index
    }
    const item = this.data.creditActions[index];
    let e = {
      detail:item
    }
    this.paySelect(e)
  }
    /** 信用支付 */
    // selectCredit(e){
    //   e.sn =  e.currentTarget.dataset.sn
    //   e.wxPayCallBlack = this.data.wxPayCallBlack
    //   console.log('e',e)
    //   this.getUserCreditPurchase(e)
    // },
}

 