//index.js
//获取应用实例
const app = getApp();
import {debounce,daomoUrlJing,deepGet,replaceAddress} from '../../../../utils/util'
import {IMG_BASE_URL} from '../../../../utils/request.js'
import {
  listColorPaper,
  getPriceSpecial,
  checkPantone,
  uploadAutoCuttingByList,
  pinBanFilmMulchingName,
  computeSize
} from "../../../../api/orderDetailsApi.js";
import {
  add,
  countCart,
  singUpdateCheck
} from "../../../../api/cartApi.js";
import {
  pinban,
  getPinBanParams,
  signByBehavior,
  pinban_jing
} from "../../../../api/pinban.js";
import { areaList } from '@vant/area-data'
import {goodsListTitle, _surfaceHandle, inputValidate, _data, _printList, designFormula} from './model.js'

/**
 * 拼版计价 = 先将尺寸等信息传递给刀模，获取每个部件的刀模展开图
 *            再将刀模展开图传递给算法，携带拼版前提 参数
 *            最后将返回的 多种拼版方案 传递给后台 计算出最优 方案 返回至前端展示
 * formData.type = (basis => 基础信息) (fabric => 面料数据) (coreBoard => 芯板数据) (neto => 内托)
 * formData._name = (hebing => 天地盒数据合并) (tian => 天盖/皮壳) (di => 地盒/内盒) (nei => 内围框)
 */

Page({
  data: {
    boxTypeName:'精装盒',
    ..._data,
    areaList,
    formData: [
      { // 基础信息
        type: 'basis',
        sizeLength: '', // 外尺寸-长度
        sizeWidth: '', // 外尺寸-宽度
        sizeHeight: '', // 外尺寸-高度
        tianHeight: 15, // 天盖高度
        diHeight: 15, // 地盒高度
        number: 1000, // 数量
        otherNumber: '', // 自定义数量
        tissue: 'same', // 面料是否相同
        innerBoxDiff: '相同', // 内围框 是否相同
        innerBoxDiffList: ['相同','不同'], // 内框选择列表
        coreBoardDiff: 'same', // 天地盒芯板
      },
      { // 面料表单
        type: 'fabric',
        _name: 'hebing',
        title: '测试',
        show: true, // 是否展示
        cutting: null, // 常规分切
        specialLong: '', // 特殊规格-长度
        specialWidth: '', // 特殊规格-宽度
        materialTypeList: [], // 材质列表
        materialType: '', // 材质
        paperSurface: '', // 自定义纸价-材质
        paperGram: '', // 自定义纸价-克重
        paperPrice: '', // 自定义纸价-单价
        unit: '吨', // 自定义纸价-单位
        unitIndex: 0, // 自定义纸价-单位选中值
        thicknessList: [], // 克重列表
        printsize: 'four', // 印刷
        white: '', // 白墨
        pantoneColorList: [''], // 专色列表
        spot: '', // 专色
        // colorIndex: 0, // 专色选中值
        pantoneNumber: '1', // 专色数量
        surfaceTreatmentList: [], // 表面处理列表
        surface: '', // 表面处理
        postTreatmentList: [], // 其他工艺列表
        gold: false, // 是否显示 烫金列表
        tips: false, // 是否显示 提示语
        tips2: false, // 是否显示 提示语
        colorList: [], // 烫金列表
        camList: [], // 击凸列表
        concaveList: [] // 击凹列表
      },
      {
        type: 'coreBoard', // 芯板数据
        _name: 'hebing',
        show: true, // 是否展示
        title: '测试',
        materialTypeList: [], // 材质列表
        materialType: '', // 材质
        wrapper: 'side', // 包边
        foldingSize: 20, // 包边尺寸
        sizing: 'v', // 定型
      },
      {
        type: 'neto',
        show: true,
        assembly: 'no',
        assemblyList: [{lable: '粘内托（单层）+ 垫底纸',value: '配件品类:吸塑内托1;配件数量:1'},
          {lable: '粘内托（双层）+ 垫底纸',value: '配件品类:吸塑内托1;配件数量:2'}, {lable: '粘内托（三层）+ 垫底纸',value: '配件品类:吸塑内托1;配件数量:3'},
        ],
        netoType: '配件品类:吸塑内托1;配件数量:1'
      }
    ],
    paperList: ['吨','平方','张'], // 自定义纸价-单位列表
    defaultIndex: 0, // 默认选中项
    index: 0, // 当前部件
    unit:false, // 单位下拉
    pantoneNumber:false, // 专色下拉
    againStone: ['sizeLength', 'sizeWidth', 'sizeHeight', 'tianHeight', 'diHeight', 'otherNumber', 'number', 'tissue', 'innerBoxDiff', 'coreBoardDiff'
            , 'cutting', 'specialLong', 'specialWidth', 'materialType', 'paperSurface', 'paperGram', 'paperPrice', 'wrapper', 'foldingSize'
            , 'sizing', 'thickness'], // 重新拼版的key值
    compute: false,
    _daomoUrl: {}, // 精装盒 刀模保存
    showLoading: false,
    loadingImg: '',
    loadingIndex: 0,
    region:['', '',''],//位置
  },
  onLoad: function (option) {
    this.data.printList.ev.push({value:'hemi',lable:'半穿'})
    this.setData({
      'printList.ev': this.data.printList.ev
    })
    getPinBanParams({"data":"1"}).then(res=>{
      if (res.success) {
        let obj ={
          fenqie_w : JSON.parse(res.data.paperSlit).map(item=>{return item.v}).join(','),//273,298.5,364,398,546, 597, 635, 660, 700, 711, 740, 787
          safe_distance : res.data.horizontal+','+res.data.vertical,//'3,3'
          place_holder : res.data.left+','+res.data.right+','+res.data.biteOpposite+','+res.data.bite,//'3, 3, 3, 10',
        }

        let arr = this.data.cuttingList
        arr[0].value = obj.fenqie_w
        arr[1].value = res.data.positiveDegreeNumber
        arr[2].value = res.data.bigDegreeNumber

        this.setData({
          PinBanParams:obj,
          cuttingList: arr,
          trowel_fenqie_w: JSON.parse(res.data.paperSlitGrayPlate).map(e => e.v).join(),
        })
        this.init()
      }
    })
    this.getListPaper();
    // this.getPostProcessing()
    // this.getListSurface()
    this.setData({
      auto:!Number(option.type)
    })

    if (!Number(option.type)) {
      let dm = JSON.parse(wx.getStorageSync('daomo'))
      this.setData({
        daomo:dm,
        img:JSON.parse(wx.getStorageSync('img')),
        goodsId:wx.getStorageSync('goodsId'),
        boxTypeName: goodsListTitle[wx.getStorageSync('goodsId')].name
      })
    }else{
      this.setData({
        daomo:{longMax:500,longMin:20,widthMin:15,widthMax:500,heightMin:20,heightMax:500},
        knifeUrl:wx.getStorageSync('knifeUrl'),
      })
    }

    wx.setNavigationBarTitle({
      title: this.data.boxTypeName + '自动专版'
    })

    console.log('当前盒型:', goodsListTitle[this.data.goodsId]);

  },
  onShow(){
    this.getCartCount()
  },

  init() {
    let parts = goodsListTitle[this.data.goodsId].parts
    let titleList = goodsListTitle[this.data.goodsId].title

    this.data.formData[1].title = titleList.title1
    this.data.formData[1].cutting = this.data.cuttingList[0].value
    this.data.formData[2].title = titleList.title2

    let fabricObj = this.data.formData.find(e => e.type == 'fabric')
    fabricObj._name = 'hebing'
    fabricObj = JSON.parse(JSON.stringify(fabricObj))

    if (parts.fabric >= 2) {
      fabricObj.show = false
      fabricObj.title = titleList.title4
      fabricObj._name = 'di'
      this.data.formData.push({...fabricObj})
    }
    if (parts.fabric == 3) {
      fabricObj = JSON.parse(JSON.stringify(fabricObj))
      fabricObj.show = false
      fabricObj._name = 'nei'
      fabricObj.title = titleList.title5
      this.data.formData.push({...fabricObj})
    }

    let coreBoardObj = this.data.formData.find(e => e.type == 'coreBoard')
    coreBoardObj._name = 'hebing'
    if (this.data.goodsId == '1616') { // 皮壳芯板 默认全部 内盒芯板默认包边
      coreBoardObj._name = 'tian'
    }
    coreBoardObj = JSON.parse(JSON.stringify(coreBoardObj))
    if (parts.coreBoard >= 2) {
      coreBoardObj.show = false
      coreBoardObj.title = titleList.title4
      coreBoardObj._name = 'di'
      this.data.formData.push({...coreBoardObj})
    }
    if (parts.coreBoard == 3) {
      coreBoardObj = JSON.parse(JSON.stringify(coreBoardObj))
      coreBoardObj.show = true
      coreBoardObj._name = 'nei'
      coreBoardObj.wrapper = 'all'
      coreBoardObj.sizing = 'hemi'
      coreBoardObj.title = titleList.title5
      this.data.formData.push({...coreBoardObj})
    }

    if (this.data.goodsId == '1616') {
      let pi = true
      this.data.formData.forEach(e => {
        if (e.type == 'coreBoard') {
          e.show = true
          if (pi) {
            e.wrapper = 'all'
            pi = false
            e.title = titleList.title3
          }
        }
      })
    }

    this.setData({
      boxTypeList: goodsListTitle[this.data.goodsId].title,
      formData: this.data.formData
    })
  },
  /**判断自动拼版还是自定义拼版 */
  startPinBan:debounce(function(e){
    // wx.showLoading({
    //   title:'拼版中~',
    //   mask:true,
    // })
    this.setData({
      loadingImg: IMG_BASE_URL + '/static/pybupload/picture/img/0-90.gif?' + this.data.loadingIndex,
      loadingIndex: this.data.loadingIndex + 1,
      flag2:true,
      showLoading: true
    })
    //判断是自动拼版还是自定义拼版
    this.pinBanUrl()
  }, 500),
  pinBanUrl() {
    let formData = this.data.formData
    let goodsId = this.data.goodsId
    let obj = {
      knifeUrl:'',
      datastr:'',
      module: '',
    }
    let tian = {
      name: 'sky'
    }
    let di = {
      name: 'land'
    }
    let nei = {
      name: 'fence'
    }
    let data = []

    if (goodsId == '1616') {
      tian.name = 'shell'
      di.name = 'inner'
    }

    formData.forEach(e => {
      if (e.type == 'coreBoard' && e.show) {  
        if (e._name=='tian') {
          tian ={...tian,...e}
        } else if (e._name=='di') {
          di ={...di,...e}
        } else if (e._name == 'nei') {
          nei = {...nei,...e}
        } else {
          tian ={...tian,...e}
          di = {...di,...e}
        }
      }
    })

    obj.knifeUrl += 'make_long=' + formData[0].sizeLength + '&make_width=' + formData[0].sizeWidth + '&make_height=' + formData[0].sizeHeight
    obj.knifeUrl += `&${tian.name}_paper=${tian.wrapper == 'side' ? 'hemming' : 'wrap_up'}`
    obj.knifeUrl += `&${tian.name}_material=${tian.materialType == '双灰纸板' ? 'double_gray' : 'monochrome'}`
    obj.knifeUrl += `&${tian.name}_crafts=${tian.sizing == 'v' ? 'v_slot' : 'half_wear'}`
    obj.knifeUrl += `&${tian.name}_weight=${tian.thickness == 700 ? 800 : tian.thickness}`
    obj.knifeUrl += `&${di.name}_paper=${di.wrapper == 'side' ? 'hemming' : 'wrap_up'}`
    obj.knifeUrl += `&${di.name}_weight=${di.thickness == 700 ? 800 : di.thickness}`
    obj.knifeUrl += `&${di.name}_material=${di.materialType == '双灰纸板' ? 'double_gray' : 'monochrome'}`
    obj.knifeUrl += `&${di.name}_crafts=${di.sizing == 'v' ? 'v_slot' : 'half_wear'}`

    if (goodsId == '1620') {
      obj.knifeUrl += `&${nei.name}_paper=${nei.wrapper == 'side' ? 'hemming' : 'wrap_up'}`
      obj.knifeUrl += `&${nei.name}_weight=${nei.thickness}`
      obj.knifeUrl += `&${nei.name}_material=${nei.materialType == '双灰纸板' ? 'double_gray' : 'monochrome'}`
      obj.knifeUrl += `&${nei.name}_crafts=${nei.sizing == 'v' ? 'v_slot' : 'half_wear'}`
      obj.knifeUrl += `&heaven_cover=${tian.thickness}`
      obj.knifeUrl += `&sky_height=${formData[0].tianHeight}`
      console.log('formData[0].tianHeight', obj.knifeUrl);
      obj.knifeUrl += `&fence=mounting`
      obj.knifeUrl += `&waistless=${formData[0].sizeHeight - formData[0].tianHeight - formData[0].diHeight}`
      obj.knifeUrl += `&paper_jam=''`
    }

    let pinBanUrl =  goodsListTitle[goodsId].pinBanUrl
    let titleList =  goodsListTitle[goodsId].title

    if (goodsId == '1619') {
      obj.knifeUrl += '&lack=0&type=boxType'
    } else if (goodsId == '1616') {
      obj.knifeUrl += '&type=box1&forming=forward&flutter=3'
    }

    if (tian.wrapper == 'side') { // 包边
      obj.datastr += `&sky_slot=${tian.foldingSize}`
      data.push({name: titleList.title3 + '灰板', url: pinBanUrl['tian_hui'] + obj.knifeUrl + obj.datastr})
      console.log(pinBanUrl['tian_hui'] + obj.knifeUrl + obj.datastr);
      data.push({name: titleList.title3 + '面纸', url: pinBanUrl['tian_mian'] + obj.knifeUrl + obj.datastr})
      console.log(pinBanUrl['tian_mian'] + obj.knifeUrl + obj.datastr);

    } else { // 全包
      obj.datastr += `&sky_slot=0`
      data.push({name: titleList.title3 + '面纸', url: pinBanUrl['tian_mian'] + obj.knifeUrl + obj.datastr})
      console.log(pinBanUrl['tian_mian'] + obj.knifeUrl + obj.datastr);
      data.push({name: titleList.title3 + '灰板', url: pinBanUrl['tian_hui'] + obj.knifeUrl + obj.datastr})
      console.log(pinBanUrl['tian_hui'] + obj.knifeUrl + obj.datastr);
      data.push({name: titleList.title3 + '内贴面纸',url: pinBanUrl['tian_nei'] + obj.knifeUrl + obj.datastr})
      console.log(pinBanUrl['tian_nei'] + obj.knifeUrl + obj.datastr);
    }

    if (di.wrapper == 'side') { // 包边
      obj.datastr += `&sky_slot=${di.foldingSize}`
      data.push({name: titleList.title4 + '灰板', url: pinBanUrl['di_hui'] + obj.knifeUrl + obj.datastr})
      console.log(pinBanUrl['di_hui'] + obj.knifeUrl + obj.datastr);
      data.push({name: titleList.title4 + '面纸', url: pinBanUrl['di_mian'] + obj.knifeUrl + obj.datastr})
      console.log(pinBanUrl['di_mian'] + obj.knifeUrl + obj.datastr);

    } else { // 全包
      obj.datastr += `&sky_slot=0`
      data.push({name: titleList.title4 + '面纸', url: pinBanUrl['di_mian'] + obj.knifeUrl + obj.datastr})
      console.log(pinBanUrl['di_mian'] + obj.knifeUrl + obj.datastr);
      data.push({name: titleList.title4 + '灰板', url: pinBanUrl['di_hui'] + obj.knifeUrl + obj.datastr})
      console.log(pinBanUrl['di_hui'] + obj.knifeUrl + obj.datastr);
      data.push({name: titleList.title4 + '内贴面纸',url: pinBanUrl['di_nei'] + obj.knifeUrl + obj.datastr})
      console.log(pinBanUrl['di_nei'] + obj.knifeUrl + obj.datastr);
    }

    // 内围框 双驳情况判断
    if (goodsId == '1620') {
      data = data.concat(this.netoDouble(obj))
      console.log('concat,', data);
    }
    data.forEach(e => {
      this.data._daomoUrl['精装盒'+e.name] = e.url
    })
    this.uploadUrl(data)
  },
  netoDouble(obj) { // 判断 是否 为双驳
    let biaoZhi = {}
    let otherMap = this.data.otherMap
    let pinBanUrl =  goodsListTitle[this.data.goodsId].pinBanUrl.nei
    let formData = this.data.formData

    formData.forEach(e => {
      if (e.type == 'coreBoard' && e._name == 'di') {
        if (!biaoZhi.di) {
          biaoZhi.di = {...e}
        }
      } else if (e.type == 'coreBoard' && e._name == 'nei') {
        biaoZhi.nei = {...e}
      } else if (e.type == 'coreBoard' && e._name == 'hebing') {
        biaoZhi.di = {...e}
      }
    })
    
    console.log(biaoZhi);
    let VTC = designFormula.VTC(biaoZhi.nei.materialType)
    let VTX = designFormula.VTX(VTC)
    let VTG = designFormula.VTG(Number(biaoZhi.nei.thickness))
    let VTN = designFormula.VTN(VTG, VTX)
    let VTY = designFormula.VTY(biaoZhi.nei.sizing)
    let VTM = designFormula.VTM(VTY, VTN)
    let AC = designFormula.AC(1)
    let CBB = designFormula.CBB(biaoZhi.di.materialType)
    let GB = designFormula.GB(CBB)
    let CFG = designFormula.CFG(Number(biaoZhi.di.thickness))
    let GD = designFormula.GD(CFG, GB)
    let CAB = designFormula.CAB(biaoZhi.di.sizing)
    let TD = designFormula.TD(CAB, GD)
    let L2 = designFormula.L2(formData[0].sizeLength, TD)
    let W2 = designFormula.W2(formData[0].sizeWidth, TD)
 
    console.log('VTC:', VTC, ';VTX:', VTX, ';VTG:', VTG, ';VTN:', VTN);
    console.log('VTY:', VTY, ';VTM:', VTM, ';AC:', AC, ';CBB:', CBB);
    console.log('GB:', GB, ';CFG:', CFG, ';GD:', GD, ';CAB:', CAB);
    console.log('TD:', TD, ';L2:', L2, ';W2:', W2);

    // (卡纸-双驳公式)
    let L9=L2-GD*2-AC // 内围框长：L9：
    let W9=W2-GD*2-AC // 内围框寬：W9

    // 纸板-双驳公式) 
    let L7=L2-((GD*1000)*2)/1000-AC-VTM*2 // 内围框长：L7
    let W7=W2-((GD*1000)*2)/1000-AC-VTM*2 // 内围框宽：W7
 
    console.log('L9:', L9, ';W9:', W9, ';L7:', L7, ';W7:', W7);
    let arr = []

    if (L7*2+W7*2>800) {
      arr.push({name: '内围框面纸1',url: pinBanUrl + 'shroudCover1.php?' + obj.knifeUrl  + obj.datastr})
      console.log(pinBanUrl + 'shroudCover1.php?' + obj.knifeUrl  + obj.datastr);
      arr.push({name: '内围框面纸2',url: pinBanUrl + 'shroudCover2.php?' + obj.knifeUrl + obj.datastr})
      console.log(pinBanUrl + 'shroudCover2.php?' + obj.knifeUrl  + obj.datastr);
      arr.push({name: '内围框灰板1',url: pinBanUrl + 'shroudCardboard1.php?' + obj.knifeUrl + obj.datastr})
      console.log(pinBanUrl + 'shroudCardboard1.php?' + obj.knifeUrl  + obj.datastr);
      arr.push({name: '内围框灰板2',url: pinBanUrl + 'shroudCardboard2.php?' + obj.knifeUrl + obj.datastr})
      console.log(pinBanUrl + 'shroudCardboard2.php?' + obj.knifeUrl  + obj.datastr);
    } else {
      arr.push({name: '内围框面纸',url: pinBanUrl + 'shroudCover.php?' + obj.knifeUrl + obj.datastr})
      console.log(pinBanUrl + 'shroudCover.php?' + obj.knifeUrl  + obj.datastr);
      arr.push({name: '内围框灰板',url: pinBanUrl + 'shroudCardboard.php?' + obj.knifeUrl + obj.datastr})
      console.log(pinBanUrl + 'shroudCardboard.php?' + obj.knifeUrl  + obj.datastr);
    }
    console.log('arr', arr);

    return arr

  },
  // 刀模下载
  uploadUrl(data) {
    uploadAutoCuttingByList({list: data}).then(res => {
      if (!res.success) {
        this.modalFun({contentText: res.message})
        this.setData({
          showLoading: false
        })
        return
      }
      console.log('upload', res.data);
      res.data = res.data.map(item => {return{name: item.name, url: item.ossUrl}})
      this.pinBan({num: this.data.formData[0].number == 'other' ? Number(this.data.formData[0].otherNumber) : this.data.formData[0].number, po_pool: this.cutting(res)})
      this.setData({
        pdfUrl: JSON.stringify(res.data)
      })
    })
  },
  cutting(res) {
    let formData = this.data.formData
    let huiBan = []
    let goodsId = this.data.goodsId
    let arr = []
    let mianLiao = []
    let titleList =  goodsListTitle[goodsId].title

    let nameList = []
    // 面纸计算
    formData.forEach(e => {
      if (e.type == 'fabric' && e.show) { // 面料
        mianLiao.push({...e})
        let name = ''
        if (e.materialType == '其他') {
          name = e.paperSurface + '-' + e.paperGram
        } else {
          name = e.materialType + '-' + e.thickness
        }
        nameList.push(name)
      }
    })
    
    if (mianLiao.length == 1) {
      if (goodsId == '1620') {
        arr.push({name: nameList[0] + '-面纸', fenqie_w: this.tissue_fen(mianLiao[0]), cutmodel: res.data.filter(item => item.name == titleList.title3 + '面纸' || item.name == titleList.title3 + '内贴面纸' || item.name == titleList.title4 + '面纸' || item.name == titleList.title4 + '内贴面纸'|| item.name == '内围框面纸' || item.name == '内围框面纸1'|| item.name == '内围框面纸2')})
      } else {
        arr.push({name: nameList[0] + '-面纸', fenqie_w: this.tissue_fen(mianLiao[0]), cutmodel: res.data.filter(item => item.name == titleList.title3 + '面纸' || item.name == titleList.title3 + '内贴面纸' || item.name == titleList.title4 + '面纸' || item.name == titleList.title4 + '内贴面纸')})
      }
    } else if (mianLiao.length == 2) {
      if (goodsId == '1620') {
        if (formData[0].tissue == 'same') { // 天地盖相同 内围框不同
          arr.push({name:  nameList[0] + '-面纸', fenqie_w: this.tissue_fen(mianLiao[0]), cutmodel: res.data.filter(item => item.name == titleList.title3 + '面纸' || item.name == titleList.title3 + '内贴面纸' || item.name == titleList.title4 + '面纸' || item.name == titleList.title4 + '内贴面纸')})
          arr.push({name:  nameList[1] + '-面纸', fenqie_w: this.tissue_fen(mianLiao[1]), cutmodel: res.data.filter(item => item.name == '内围框面纸' || item.name == '内围框面纸1'|| item.name == '内围框面纸2')})
        } else if (formData[0].tissue == 'diff' && formData[0].innerBoxDiff == '同天盖') { // 天地盖不同 内围框 同 天盖
          arr.push({name:  nameList[0] + '-面纸', fenqie_w: this.tissue_fen(mianLiao[0]), cutmodel: res.data.filter(item => item.name == titleList.title3 + '面纸' || item.name == titleList.title3 + '内贴面纸' || item.name == '内围框面纸' || item.name == '内围框面纸1'|| item.name == '内围框面纸2')})
          arr.push({name:  nameList[1] + '-面纸', fenqie_w: this.tissue_fen(mianLiao[1]), cutmodel: res.data.filter(item => item.name == titleList.title4 + '面纸' || item.name == titleList.title4 + '内贴面纸')})
        } else if (formData[0].tissue == 'diff' && formData[0].innerBoxDiff == '同地盖') { // 天地盖不同 内围框 同 地盖
          arr.push({name:  nameList[0] + '-面纸', fenqie_w: this.tissue_fen(mianLiao[0]), cutmodel: res.data.filter(item => item.name == titleList.title3 + '面纸' || item.name == titleList.title3 + '内贴面纸')})
          arr.push({name:  nameList[1] + '-面纸', fenqie_w: this.tissue_fen(mianLiao[1]), cutmodel: res.data.filter(item => item.name == titleList.title4 + '面纸' || item.name == titleList.title4 + '内贴面纸' || item.name == '内围框面纸' || item.name == '内围框面纸1'|| item.name == '内围框面纸2')})
        }
      } else {
        arr.push({name:  nameList[0] + '-面纸', fenqie_w: this.tissue_fen(mianLiao[0]), cutmodel: res.data.filter(item => item.name == titleList.title3 + '面纸' || item.name == titleList.title3 + '内贴面纸')})
        arr.push({name:  nameList[1] + '-面纸', fenqie_w: this.tissue_fen(mianLiao[1]), cutmodel: res.data.filter(item =>item.name == titleList.title4 + '面纸' || item.name == titleList.title4 + '内贴面纸')})
      }
    } else if (mianLiao.length == 3) {
      arr.push({name:  nameList[0] + '-面纸', fenqie_w: this.tissue_fen(mianLiao[0]), cutmodel: res.data.filter(item => item.name == titleList.title3 + '面纸' || item.name == titleList.title3 + '内贴面纸')})
      arr.push({name:  nameList[1] + '-面纸', fenqie_w: this.tissue_fen(mianLiao[1]), cutmodel: res.data.filter(item =>item.name == titleList.title4 + '面纸' || item.name == titleList.title4 + '内贴面纸')})
      arr.push({name:  nameList[2] + '-面纸', fenqie_w: this.tissue_fen(mianLiao[2]), cutmodel: res.data.filter(item => item.name == titleList.title5 + '面纸' || item.name == titleList.title5 + '内贴面纸')})
    }

    // 芯板计算
    nameList = null
    nameList = []
    formData.forEach(e => {
      if (e.type == 'coreBoard' && e.show) { // 芯板
        huiBan.push({...e})
        let name = ''
        if (e.materialType == '其他') {
          name = e.paperSurface + '-' + e.paperGram
        } else {
          name = e.materialType + '-' + e.thickness
        }
        nameList.push(name)
      }
    })

    console.log('huiBan.length', huiBan.length);

    if (huiBan.length == 1) { // 芯板数量
      arr.push({name:  nameList[0]  + '-灰板', fenqie_w: this.coreBand_fen(huiBan[0].thickness, 2), cutmodel: res.data.filter(item => item.name.indexOf('灰板') != -1)})
    } else if (huiBan.length == 2) {
      if (huiBan[0].materialType == huiBan[1].materialType && huiBan[0].thickness == huiBan[1].thickness){
        if (goodsId == '1620') {
          arr.push({name:  nameList[0] + '-灰板', fenqie_w: this.coreBand_fen(huiBan[0].thickness, 3), cutmodel: res.data.filter(item => item.name.indexOf('灰板') != -1)})
        } else {
          arr.push({name:  nameList[0] + '-灰板', fenqie_w: this.coreBand_fen(huiBan[0].thickness, 2), cutmodel: res.data.filter(item => item.name.indexOf('灰板') != -1)})
        }
      } else if (goodsId == '1620') {
        arr.push({name:  nameList[0] + '-灰板', fenqie_w: this.coreBand_fen(huiBan[0].thickness, 2, 'tian_di'), cutmodel: res.data.filter(item => item.name == titleList.title3 + '灰板' || item.name == titleList.title4 + '灰板')})
        arr.push({name:  nameList[1] + '-灰板', fenqie_w: this.coreBand_fen(huiBan[1].thickness, 1, 'lei'), cutmodel: res.data.filter(item => item.name.indexOf('内围框灰板') != -1)})
      } else {
        arr.push({name:  nameList[0] + '-灰板', fenqie_w: this.coreBand_fen(huiBan[0].thickness, 2), cutmodel: res.data.filter(item => item.name == titleList.title3 + '灰板')})
        arr.push({name:  nameList[1] + '-灰板', fenqie_w: this.coreBand_fen(huiBan[1].thickness, 1), cutmodel: res.data.filter(item => item.name == titleList.title4 + '灰板')})
      }
    } else if (huiBan.length == 3) {
      if (huiBan[0].materialType == huiBan[2].materialType && huiBan[0].thickness == huiBan[2].thickness) {
        arr.push({name:  nameList[0] + '-灰板', fenqie_w: this.coreBand_fen(huiBan[0].thickness, 2,'lei_tian'), cutmodel: res.data.filter(item => item.name == titleList.title3 + '灰板' || item.name.indexOf('内围框灰板') != -1)})
        arr.push({name:  nameList[1] + '-灰板', fenqie_w: this.coreBand_fen(huiBan[1].thickness, 1), cutmodel: res.data.filter(item => item.name == titleList.title4 + '灰板')})
      } else if (huiBan[1].materialType == huiBan[2].materialType && huiBan[1].thickness == huiBan[2].thickness) {
        arr.push({name:  nameList[1] + '-灰板', fenqie_w: this.coreBand_fen(huiBan[1].thickness, 2,'lei_di'), cutmodel: res.data.filter(item => item.name == titleList.title4 + '灰板' || item.name.indexOf('内围框灰板') != -1)})
        arr.push({name:  nameList[0] + '-灰板', fenqie_w: this.coreBand_fen(huiBan[0].thickness, 1), cutmodel: res.data.filter(item => item.name == titleList.title3 + '灰板')})
      } else {
        arr.push({name:  nameList[0] + '-灰板', fenqie_w: this.coreBand_fen(huiBan[0].thickness, 1, 'tian'), cutmodel: res.data.filter(item => item.name == titleList.title3 + '灰板')})
        arr.push({name:  nameList[1] + '-灰板', fenqie_w: this.coreBand_fen(huiBan[1].thickness, 1, 'di'), cutmodel: res.data.filter(item => item.name == titleList.title4 + '灰板')})
        arr.push({name:  nameList[2] + '-灰板', fenqie_w: this.coreBand_fen(huiBan[2].thickness, 1,'lei'), cutmodel: res.data.filter(item =>  item.name.indexOf('内围框灰板') != -1)})
      }
    }
    console.log('arr', arr);
    // 验证是否有名称相同的
    let sameArr = []
    let sameObj = {}
    for (let i = 0; i < arr.length; i++) {
      const e = arr[i];
      let obj = arr.find((el,ii) => el.name == e.name && el.fenqie_w == e.fenqie_w && ii != i)
      if (obj != -1 && obj) {
        sameArr.push({...e})
        console.log('objlll', e);
      }
    }

    if (sameArr.length == 0) {
      return arr
    }

    sameObj = {...sameArr[0], cutmodel: []}
    for (let i = 0; i < sameArr.length; i++) {
      const e = sameArr[i];
      let el = arr.findIndex(el => el.name == e.name)
      if(el && el != -1) {
        arr.splice(el,1)
      }

      sameObj.cutmodel = sameObj.cutmodel.concat(e.cutmodel) 
    }

    arr.push({...sameObj})
    
    console.log('r', arr);

    return arr
  },
  // 面纸分切计算
  tissue_fen(off) {
    let fenqie = ''
    if (off.cutting=="special") {
      fenqie = off.specialLong + '*' + off.specialWidth
    } else {
      fenqie = off.cutting
    }
    return fenqie
  },
  // 灰板分切计算
  coreBand_fen(thickness, num, type='') {
    let off = this.data.formData[0]
    off.sizeLength = Number(off.sizeLength)
    off.sizeHeight = Number(off.sizeHeight)
    off.sizeWidth = Number(off.sizeWidth)
    let size = ((off.sizeLength + (off.sizeHeight * 2)) * (off.sizeWidth + (off.sizeHeight * 2)) / 1000000)
    let otherMap = this.data.otherMap
    let number = this.data.formData[0].number == 'other' ? this.data.formData[0].otherNumber : this.data.formData[0].number
    let fenqie = ''
    let kg = size * thickness / 1000 * number * num
    if (this.data.goodsId == '1616') { // 书型盒
      kg = size * thickness / 1000 * number
      size = (off.sizeLength * ((off.sizeWidth * 2) + (off.sizeHeight * 2)) / 1000000)
      kg += size * thickness / 1000 * number
    } else if (this.data.goodsId == '1620') { // 平口天地盒
      let tianHeight =  this.data.formData[0].tianHeight
      let diHeight = this.data.formData[0].diHeight
      if (type.indexOf('lei') != -1 || num == 3) {
        otherMap.CC_FOUR[0] = Number(otherMap.CC_FOUR[0])
        otherMap.CC_FOUR[1] = Number(otherMap.CC_FOUR[1])
        size = otherMap.CC_FOUR[0] * otherMap.CC_FOUR[1] / 1000000
        kg = size * thickness / 1000 * number
        console.log('sizeLei', otherMap.CC_FOUR[0], otherMap.CC_FOUR[1]);
        console.log('sizeLei', otherMap.CC_FOUR[0] * otherMap.CC_FOUR[1] * 2 / 1000000);
      } 
      if(type.indexOf('tian') != -1 || num == 3) {
        size = ((off.sizeLength + (tianHeight * 2)) * (off.sizeWidth + (tianHeight * 2))) / 1000000
        kg += size * thickness / 1000 * number 
        console.log('sizetian', off.sizeLength, off.sizeWidth,tianHeight);
        console.log('sizetian', ((off.sizeLength + (tianHeight * 2)) * (off.sizeWidth + (tianHeight * 2))) / 1000000);
      }
      if(type.indexOf('di') != -1 || num == 3) {
        size = ((off.sizeLength + (diHeight * 2)) * (off.sizeWidth + (diHeight * 2))) / 1000000
        kg += size * thickness / 1000 * number
        console.log('sizedi', off.sizeLength, off.sizeWidth,diHeight);
        console.log('sizedi', ((off.sizeLength + (diHeight * 2)) * (off.sizeWidth + (diHeight * 2))) / 1000000);
      }
    }
    if (kg < 1000) {
      fenqie = this.data.cuttingList[1].value + ',' + this.data.cuttingList[2].value
    } else {
      fenqie = this.data.trowel_fenqie_w
    }
    console.log('size->', size,'kg->', kg,'num->', num);
    return fenqie
  },

  // 拼版轮训
  pinbanLoop(value) {
    setTimeout(() => {
      pinban_jing({...this.data.pinbanData,root:value}).then(res => {
        console.log('pinban..', res);
        // 重复发送 两分钟后 停止
        if (this.data.pinbanCount > 90 || res.code == 0) {
          this.setData({
            flag2:false
          })
          this.setData({
            showLoading: false
          })
          if (this.data.pinbanCount > 90) {
            this.modalFun({contentText:'拼版超时，请重试!',time:1000})
          } else {
            this.modalFun({contentText:'该尺寸无法拼版,请重新填写',time:1000})
          }
          return
        }

        if (res.code == 404) {
          this.setData({
            showLoading: false
          })
          wx.showToast({title: res.msg,icon: 'none',duration: 2000})
          if (!res.msg) {
            wx.showToast({title: '无法拼版,请确认规格!',icon: 'none',duration: 2000})
          }
          return
        }
        
        if (res.code == 2) {
          this.setData({
            pinbanCount: this.data.pinbanCount+1
          })
          this.pinbanLoop(res.data)
        } else {
          this.setData({
            flag2:false
          })
          this.setData({
            pinBanStr:(res.data),
            pinBanPlans: res.data,
            showReset:false,
            showLoading: false
          })
          this.countPrice(res.data)
        }
      })
    }, 2000)
  },
  /**拼版 */
  async pinBan(data){
    
    let _this = this
    let number = _this.data.formData[0].number == 'other' ? _this.data.formData[0].otherNumber : _this.data.formData[0].number
    var attrStr = _this.jointStr();
    signByBehavior({moduleName:"pinban",desc:JSON.stringify({pinban_single_web:{goodsId:_this.data.auto?_this.data.goodsId:640,goodsAttr: attrStr,number: number,}})}).then()
    
    let formData = _this.data.formData
    
    let obj = {
      fenqie_w: '635,660 ,700 ,711 ,740 ,787 ,840 ,889 ,960 ,965 ,1000 ,1092 ,1194',
      safe_distance: this.data.PinBanParams.safe_distance||'3,3',
      place_holder: this.data.PinBanParams.place_holder||'3, 3, 3, 10',
      pdf_path: '',//.split('qcxyztTest/')[1]
      pdf_jing: JSON.stringify(data),
      goodsId:_this.data.auto?_this.data.goodsId:640,//盒型，小程序没有盒型，暂时写死双插盒id-938,自定义盒型640
      fnumber: 1,
      goodsAttr: attrStr,
      number: formData[0].number == 'other' ? Number(formData[0].otherNumber) : formData[0].number,
      cextends:1,
      type: 0,
      city:(_this.data.region[0]!=''?_this.data.region[0]:'')+' '+(_this.data.region[1]!=''?_this.data.region[1]:'')+' '+(_this.data.region[2]!=''?_this.data.region[2]:''),
    }
    
    await pinban(obj).then(res=>{
      if (res.code == 2) {
        this.setData({
          pinbanData: obj,
          pinbanCount: 0
        })
        this.pinbanLoop(res.data)
        return
      }
      this.setData({
        flag2:false
      })
      if (res.code==0) {
          this.setData({
            showLoading: false
          })
          wx.showToast({
            title: '无法拼版,请重试',
            icon: 'none',
            duration: 2000
          })
          return
      }
      if (res.code == 404) {
        this.setData({
          showLoading: false
        })
        wx.showToast({title: '拼版尺寸过大，无法拼版',icon: 'none',duration: 2000})
        return
      }
    })
  },
  /**获取购物车数量 */
  getCartCount(){
    countCart().then(res=>{
      this.setData({
        cartCount:res.data.cartCount
      })
    })
  },
    //确认选择地区
    confirmArea:function(e){
      console.log(e);
      this.setData({
        "region[0]":replaceAddress(e.detail.values[0].name),
        "region[1]":replaceAddress(e.detail.values[1].name),
        "region[2]":replaceAddress(e.detail.values[2].name),
        show:false,
        pin:true
      })
      this.countPrice(1)
    },
  /**
   * 消息提示
   * @param {Object} 
   */
  modalFun({contentText,icon,iconSize,image,imageSize,time}){
    var _this = this;
    this.setData({
      modal: {
        show: true,
        contentText,icon,iconSize,image,imageSize
      }
    })
    setTimeout(() => {
      _this.setData({
        modal: {
          show: false,//modal是否显示，默认false
        }
    }) }, time?time:2000);
  },
  /**
   * 获取纸张信息
   */
  getListPaper() {
    // 面料材质
    listColorPaper({
      orderType: 8
    }).then((res) => {
      if (res.success) {
        let material = res.data.map((e) => {
          return { ...e, value: e.data.name, lable: e.data.keyvalueFront || e.data.name };
        })
        this.data.formData.forEach(e => {
          if (e.type == 'fabric') {
            e.materialTypeList = material 
          }
        })
        this.setData({
          formData: this.data.formData 
        });
      }
    });
    // 面芯材质
    listColorPaper({
      orderType: 9
    }).then((res) => {
      if (res.success) {
        let material = res.data.map((e) => {
          return { ...e, value: e.data.name, lable: e.data.name };
        })
        this.data.formData.forEach(e => {
          if (e.type == 'coreBoard') {
            e.materialTypeList = material 
          }
        })
        this.setData({
          formData: this.data.formData 
        });
      }
    });
  },
    /**
   * 获取表面处理
   */
  // getListSurface() {
  //   // listPaper({
  //     pinBanFilmMulchingName({
  //   }).then((res) => {
  //     if (res.success) {
  //       this.setData({
  //         "formData[1].surfaceTreatmentList": res.data.map(e => e.value||e)
  //       })
  //     }
  //   });
  // },
  /**
   * 验证正整数
   */

  setVal(_data, formData) {
    if (formData) {
      this.data.formData[_data.index] = formData
    } else {
      this.data.formData[_data.index][_data.key] = _data.val
    }

    this.setData({
      formData: this.data.formData
    })

    // 是否重新拼版
    if (this.data.pinBanStr && this.data.againStone.findIndex(e => e == _data.key) != -1) {
      this.again()
      return
    }

    this._computeSize(_data)

    this.countPrice()
    console.log(this.data.formData);
  },
  inputValidate(formData,key) {
    let float =/^[1-9]\d*(\.\d{1,2})?$|^0+(\.\d{1,2})?$/
    let unsignedInt = /^[1-9]\d*$/
  
    let verify = {
      basis: {
        sizeLength: {
          name: '外尺寸长度',
          min: 45,
          max: 300,
          reg: unsignedInt
        },
        sizeWidth: {
          name: '外尺寸宽度',
          min: 45,
          max: 300,
          reg: unsignedInt
        },
        sizeHeight: {
          name: '外尺寸高度',
          min: 20,
          max: 90,
          reg: unsignedInt
        },
        tianHeight: {
          name: '天盖高度',
          min: 0,
          max: this.data.formData[0].sizeHeight-1,
          reg: unsignedInt
        },
        diHeight: {
          name: '地盒高度',
          min: 0,
          max: this.data.formData[0].sizeHeight-this.data.formData[0].tianHeight,
          reg: unsignedInt
        },
        otherNumber: {
          name: '外尺寸自定义数量',
          min: 5001,
          reg: unsignedInt
        }
      },
      fabric: {
        specialLong: {
          name: `${formData.title}面料特殊规格长度`,
          max: 1194,
          min: 270,
          reg: unsignedInt
        },
        specialWidth: {
          name: `${formData.title}面料特殊规格宽度`,
          max: 889,
          min: 190,
          reg: unsignedInt
        },
        paperGram: {
          name: `${formData.title}面料克重`,
          min: 0,
          reg: unsignedInt
        },
        paperPrice: {
          name: `${formData.title}面料单价`,
          min: 1,
          reg: float
        }
      },
      coreBoard:{
        foldingSize: {
          name: `${formData.title}包边尺寸`,
          min: 20,
          max: this.data.formData[0].sizeHeight,
          reg: unsignedInt
        },
      }
    }

    if (this.data.goodsId == '1616') {
      verify.basis.sizeLength.min = 75
      verify.basis.sizeHeight.min = 25
    } else if (this.data.goodsId == '1620') {
      verify.basis.sizeHeight.min = 35
    }
  
    return verify[formData.type][key]
  },
  again() {
    this.setData({
      showReset:true,
      pinbanObj:null,
      loseMap:{}
    })
  },
  inputVal(e) {
    let _data = e.currentTarget.dataset
    let loseMap = this.data.loseMap
    let val = e.detail.value

    if (val == loseMap[_data.key]) {
      return
    }
    loseMap[_data.key] = val
    this.data.compute = true
    this.modalFun({contentText:'修改放损数,会影响交货数量',time: 2000})
    this.countPrice()
  },
  inputFunc(e) {
    let _data = e.currentTarget.dataset
    let formData = this.data.formData[_data.index]

    _data.val = e.detail.value
    
    let obj = this.inputValidate(formData, _data.key)
    console.log('obj', obj, _data.key);
    if (_data.val == formData[_data.key]) {
      return
    }
    if (obj && ((obj.max && _data.val > obj.max) || (obj.min && _data.val < obj.min) || !obj.reg.test(_data.val))) {
      this.modalFun({contentText: '请确认' + obj.name, time:2000})
      if (obj.min == 0) {
        _data.val = ''
      } else {
        _data.val = obj.min
      }
      this.setVal(_data)
      return
    } 

    if (_data.key == 'paperGram' || _data.key == 'paperSurface') {
      formData[_data.key] = _data.val
      if (this.isNot(formData, _data.index)) {
        _data.val = ''
        formData.paperGram = ''
        formData.paperSurface = ''
        this.setVal(_data, formData)
        this.modalFun({contentText:'材质克重不可相同',time:1000})
        return
      }
    }

    this.setVal(_data)
  },
  _computeSize(_data) {
    let formData = this.data.formData[0]
    if(_data.key=='sizeLength'||_data.key=='sizeHeight'||_data.key=='sizeWidth'){
      // 计算尺寸
      if (formData.sizeLength && formData.sizeHeight && formData.sizeWidth) {
        let obj = {
          goodAl: formData.sizeLength,
          goodAw: formData.sizeWidth,    
          goodAd: formData.sizeHeight,
          goodAh: 0,
          goodAt: 0,
          goodAx: 0,
          goodBottom: 0,
          goodWaist: 0,
          zipval: 0,
          id: this.data.goodsId
        }
        computeSize(obj).then(res => {
          if (res.code === '999999') {
            this.modalFun({contentText: res.message, time:1000})
            return
          }
          this.setData({
            otherMap: res.data.otherMap,
            formData: this.data.formData
          })
          console.log('内存',  res.data.otherMap);
        })
      }
    }
  },
  clickRadio(e) {
    let _data = e.currentTarget.dataset
    let formData = this.data.formData[_data.index]
    let titleList = this.data.boxTypeList
    let goodsId = this.data.goodsId

    console.log(e);
    if (goodsId == '1620' & this.data.formData[0].coreBoardDiff == 'diff' & _data.key == 'materialType' & formData.type == 'coreBoard') {
      if (formData._name == 'tian') {
        let obj = this.data.formData.find(e => e.type == 'coreBoard' && e._name == 'di')
        if (obj.materialType == _data.val) {
          this.modalFun({contentText: '天盖,地盒材质不可一致'})
          return
        }
      } else if (formData._name == 'di') {
        let obj = this.data.formData.find(e => e.type == 'coreBoard' && e._name == 'tian')
        if (obj.materialType == _data.val) {
          this.modalFun({contentText: '天盖,地盒材质不可一致'})
          return
        }
      }
    }
    // 选中材质,赋值 克重 与 其他工艺
    if (_data.key == 'materialType') {
      let children = formData.materialTypeList.find(e => e.value == _data.val)
      console.log('children', children);
      formData.thicknessList = children.children.map(e => {
        return {
          ...e,
          value: e.kg,
          lable: e.name
        }
      })
      formData.camList = []
      formData.materialType = _data.val
      formData.thickness = formData.thicknessList[0].kg
      formData.gold = false
      if (this.isNot(formData, _data.index)) {
        if (!formData.thicknessList[1]) {
          formData.materialType = ''
          formData.thickness = ''
          this.setVal(_data, formData)
          this.modalFun({contentText:'材质克重不可相同',time:1000})
        } else {
          formData.thickness = formData.thicknessList[1].kg
        } 
      }
      if (formData.type == 'fabric') {
        formData.surfaceTreatmentList = _surfaceHandle[_data.val]
        formData.surface = formData.surfaceTreatmentList[0]
        formData.postTreatmentList = children.childrenThree[0].craftList.map(e => {
          return {
            ...e,
            checked: false
          }
        })
      }

      this.setVal(_data, formData)

      return
    } else if (_data.key == 'thickness') {
      let newForm = JSON.parse(JSON.stringify(formData))
      newForm.thickness = _data.val
      if (this.isNot(newForm, _data.index)) {
        this.modalFun({contentText:'材质克重不可相同',time:1000})
        return
      }
    } else if (_data.key == 'surface') {
      // if (_data.val == formData.surface) {
      //   _data.val = ''
      // }
    }

    if (_data.key == 'number') {
      if ((_data.val == 'other' && formData.number != 'other') || (_data.val != 'other' && formData.number == 'other')) {
        this.data.formData[0].innerBoxDiffList = ['相同', '不同']
        this.data.formData[0].innerBoxDiff = '相同'
        this.data.formData[0].tissue = 'same'
        this.data.formData[0].coreBoardDiff = 'same'
        this.data.formData.forEach(e => {
          if (e.type == 'fabric' && (e._name == 'tian' || e._name == 'hebing')) {
            e._name = 'hebing'
            e.title = titleList.title1
          } else if (e.type == 'fabric') {
            e.show = false
          } else if (goodsId == '1616' && e.type == 'coreBoard') {
            e.show = true
          } else if (e.type == 'coreBoard' && (e._name == 'tian' || e._name == 'hebing')) {
            e._name = 'hebing'
            e.title = titleList.title2
          } else if (e.type == 'coreBoard' && goodsId == '1620' && e._name == 'nei') {
            e.show = true
          } else if (e.type == 'coreBoard') {
            e.show = false
          }
        })
      }
    }

    // 选择部件材质是否相同
    if (_data.key == 'tissue') {
      if (_data.val == 'same') {
        this.data.formData[0].innerBoxDiffList = ['相同', '不同']
        this.data.formData[0].innerBoxDiff = '相同'
        this.data.formData.forEach(e => {
          if (e.type == 'fabric' && e._name == 'tian') {
            e._name = 'hebing'
            e.title = titleList.title1
          } else if (e.type == 'fabric') {
            e.show = false
            e.materialType = ''
          }
        })
      } else {
        this.data.formData[0].innerBoxDiffList = ['同天盖', '同地盖', '均不同']
        this.data.formData[0].innerBoxDiff = '同天盖'
        this.data.formData.forEach(e => {
          if (e.type == 'fabric' && e._name == 'hebing') {
            e._name = 'tian'
            e.title = titleList.title3
            if (goodsId == '1620') {
              e.title += '/内围框'
            }
          } else if (e.type == 'fabric' && e._name == 'di') {
            e.show = true
            e.title = titleList.title4
          } else if (e.type == 'fabric' && e._name == 'nei') {
            e.show = false
          }
        })
      }
    } else if (_data.key == 'innerBoxDiff') {
      if (_data.val == '相同') {
        this.data.formData.forEach(e => {
          if (e.type == 'fabric' && e._name == 'hebing') {
            e.title = titleList.title1
          } else if (e.type == 'fabric' && e._name == 'nei') {
            e.show = false
            e.materialType = ''
          }
        })
      } else if (_data.val == '不同') {
        this.data.formData.forEach(e => {
          if (e.type == 'fabric') {
            if (e._name == 'nei') {
              e.show = true
            } else if (e._name == 'hebing') {
              e.title = titleList.title2
            }
          }
        })
      } else if (_data.val == '同天盖') {
        this.data.formData.forEach(e => {
          if (e.type == 'fabric' && e._name == 'tian') {
            e.title = titleList.title3 + '/内围框'
          } else if (e.type == 'fabric' && e._name == 'nei') {
            e.show = false
            e.materialType = ''
          } else if (e.type == 'fabric' && e._name == 'di') {
            e.title = titleList.title4
          }
        })
      } else if (_data.val == '同地盖') {
        this.data.formData.forEach(e => {
          if (e.type == 'fabric' && e._name == 'di') {
            e.title = titleList.title4 +  '/内围框'
          } else if (e.type == 'fabric' && e._name == 'nei') {
            e.show = false
            e.materialType = ''
          } else if (e.type == 'fabric' && e._name == 'tian') {
            e.title = titleList.title3
          }
        })
      } else {
        this.data.formData.forEach(e => {
          if (e.type == 'fabric'&& e._name == 'nei') {
            e.title = titleList.title5
            e.show = true
          } else if (e.type == 'fabric' && e._name == 'di') {
            e.title = titleList.title4
          } else if (e.type == 'fabric' && e._name == 'tian') {
            e.title = titleList.title3
          }
        })
      }
      this.setData({
        formData: this.data.formData
      })
    } else if (_data.key == 'coreBoardDiff') {
      if (_data.val == 'same') {
        this.data.formData.forEach(e => {
          if (e.type == 'coreBoard' && e._name == 'tian') {
            e._name = 'hebing'
            e.title = titleList.title2
          } else if (e.type == 'coreBoard' && e._name == 'di') {
            e.show = false
            e.materialType = ''
          }
        })
      } else {
        this.data.formData.forEach(e => {
          if (e.type == 'coreBoard' && e._name == 'hebing') {
            e._name = 'tian'
            e.title = titleList.title3
          } else if (e.type == 'coreBoard' && e._name == 'di') {
            e.show = true
            e.materialType = ''
          }
        })
      }
    }
    
    this.setVal(_data)
  },
  isNot(data,index) {
    let goodsId = this.data.goodsId
    if (data.type == 'coreBoard' && goodsId == '1616') {
      return false
    }
    if (data.type == 'coreBoard' && goodsId == '1620' && data._name == 'nei') {
      return false
    }

    if (!data.materialType || (data.materialType == '其他' && (!data.paperSurface || !data.paperGram)) || (data.materialType != '其他' && !data.thickness)) {
      console.log('数据补全',!data.materialType, (data.materialType == '其他' && (!data.paperSurface || !data.paperGram)), (data.materialType != '其他' && !data.thickness));
      return false
    }

    let formData = JSON.parse(JSON.stringify(this.data.formData))
    data = JSON.parse(JSON.stringify(data))
    formData.splice(index, 1)
    let coreBoard = []
    let fabric = []

    formData.forEach(e => {
      if (e.type == 'coreBoard' && e.show) {
        if (!(goodsId == '1620' && e._name == 'nei')) {
          console.log('eee', e);
          coreBoard.push({...e})
        }
      } else if (e.type == 'fabric' && e.show) {
        fabric.push({...e})
      }
    })

    if (coreBoard.length == 0 && fabric.length == 0) {
      return false
    }

    let array = []

    if (data.type == 'coreBoard') {
      array = coreBoard  
    } else {
      array = fabric
    }

    for (let i = 0; i < array.length; i++) {
      const el = array[i];
      if(el.materialType == '其他') {
        console.log('????22');
        el.materialType = el.paperSurface
        el.thickness = el.paperGram
      }
    }

    if(data.materialType == '其他') {
      console.log('????');
      data.materialType = data.paperSurface
      data.thickness = data.paperGram
    }

    if (array.findIndex(e => e.materialType == data.materialType && e.thickness == data.thickness) != -1) {
      return true
    }

    return false
  },
  checkBox(e) {
    let _data = e.currentTarget.dataset
    let formData = this.data.formData[_data.index]

    if (_data.key == 'postTreatmentList') {
      let val = formData.postTreatmentList[_data.i]
      let tipsList = ['烫金','击凸','击凹']
      let _index = 0
      let arr = []
      if (val.checked) {
        val.checked = false
        if (_data.val == '烫金') {
          formData.gold = false
        } else if (_data.val == '击凸') {
          formData.camList = []
        }
      } else {
        val.checked = true
        if (_data.val == '烫金') {
          formData.gold = true
          formData.colorList = [{
            chiled: val.colorList.map(e => {
              return {
                ...e,
                checked: false
              }
            }),
            showSize: false,
            length: '',
            width: ''
          }]
        }else if (_data.val == '击凸') {
          formData.camList.push({sizeLength:'',sizeWidth:''})
        }
      }
      
      formData.postTreatmentList.map(item => {
        if (item.checked&&tipsList.findIndex(e => e == item.craftName)!=-1) {
          arr.push(item.craftName)
        }

        if (item.checked&&item.craftName != '粘盒') {
          _index += 1
        }
      })
      if (_index > 1) {
        formData.tips2 = true
      }else{
        formData.tips2 = false
      }
      if (arr.length>0) {
        formData.tips = true
      }else{
        formData.tips = false
      }
    } else if(_data.key == 'colorList') {
      // let checkedNum = 0
      let val = formData.colorList[_data.i]

      // formData.colorList.forEach(e => {
      //   if (e.checked) {
      //     checkedNum += 1
      //   }
      // })

      // if (val.checked) {
      //   val.checked = false
      // } else if (checkedNum == 2) {
      //   return
      // } else {
        if (val.name == "其它金料") {
          this.modalFun({contentText: '其他金料请联系客服登记,谢谢合作!'})
        }
        val.checked = true
      // }

    } else if (formData[_data.key] != '') {
      formData[_data.key] = ''
    } else {
      formData[_data.key] = _data.val
    }
    
    this.setVal(_data, formData)
  },
  /**
   * 点击颜色
   */
  clickColor(e) {
    let el = e.currentTarget.dataset
    let data = this.data.formData[el.i]
    if (el.type == 'checked') { // 点击烫金颜色
      let bool = !data.colorList[el.ii].chiled[el.index].checked
      data.colorList[el.ii].chiled = data.colorList[el.ii].chiled.map(e => {
        e.checked = false
        return e
      })
      data.colorList[el.ii].chiled[el.index].checked = bool
      data.colorList[el.ii].showSize = bool

      // this.setData({
      //   ["colorList[" + el.ii + "].chiled"]: data.colorList[el.ii].chiled,
      //   ["colorList[" + el.ii + "].showSize"]: bool
      // })
    } else if (el.type == 'add') { // 增加事件
      if (el.key == 'checked') { // 烫金颜色
        let obj = JSON.parse(JSON.stringify(data.colorList[0]))
        obj.chiled = obj.chiled.map(e =>{
          e.checked = false
          return e
        })
        obj.showSize = false
        obj.length = ''
        obj.width = ''
        data.colorList.push(obj)
        // this.setData({
        //   colorList: data.colorList
        // })
      } else if (el.key == 'camList') { // 击凸
        data.camList.push({sizeLength:'',sizeWidth:''})
        // this.setData({
        //   camList: this.data.camList
        // })
      } else if (el.key == 'concaveList') { // 击凹
        data.concaveList.push({sizeLength:'',sizeWidth:''})
        // this.setData({
        //   concaveList: data.concaveList
        // })
      }
    } else if (el.type == 'minus') { // 删除事件
      if (el.key == 'checked') { // 烫金颜色
        if (data.colorList.length < 2) {
          data.colorList[0].length = ''
          data.colorList[0].width = ''
        } else {
          data.colorList.splice(el.ii, 1)
        }
        // this.setData({
        //   colorList: data.colorList
        // })
      } else if (el.key == 'camList') { // 击凸
        if (data.camList.length < 2) {
          data.camList[0].sizeLength = ''
          data.camList[0].sizeWidth = ''
        } else {
          data.camList.splice(el.ii, 1)
        }
        // this.setData({
        //   camList: data.camList
        // })
      } else if (el.key == 'concaveList') { // 击凹
        if (data.concaveList.length < 2) {
          data.concaveList[0].sizeLength = ''
          data.concaveList[0].sizeWidth = ''
        } else {
          data.concaveList.splice(el.ii, 1)
        }
        // this.setData({
        //   concaveList: data.concaveList
        // })
      }
    } else if (el.type == 'digit') { // 输入尺寸事假
      data[el.arr][el.ii][el.key] = e.detail.value
      // this.setData({
      //   [el.arr +"[" + el.ii + "]." + el.key]:  e.detail.value
      // })
    }
    this.data.formData[el.i] = data
    this.setData({
      formData: this.data.formData
    })
    this.countPrice();
  },
  showPopup: function (e) {
    let _data = e.currentTarget.dataset
    let formData = this.data.formData[_data.index]

    this.setData({
      defaultIndex: formData.pantoneColorList.length-1,
      [_data.key]: true,
      index: _data.index
    })
  },
    //打开/关闭省市区选择器弹窗
    showPopup1:function(e){
      if (!this.data.show) {
        for (const key in this.data.areaList.county_list) {
          if (this.data.areaList.county_list[key] === this.data.region[2]) {
            this.setData({
              areaListId:key
            })
          }
        }
      }
      this.setData({
        show:!this.data.show
      })
    },
  onClose(e) {
    let _data = e.currentTarget.dataset
    
    this.setData({
      [_data.key]: false
    })
  },
  colorVal(e) {
    let _data = e.currentTarget.dataset
    let formData = this.data.formData[_data.index]
    let detail = e.detail

    checkPantone({list:[detail.value]}).then(res =>{
      if(!res.success){
        this.modalFun({contentText:res.message,time:1000})
      }
    })
    console.log('formData---', formData._name, _data.index, _data.index2);
    formData[_data.key][_data.index2] = detail.value
    this.setVal(_data, formData)
  },
  // 下拉选择
  selectChange(e) {
    let _data = e.currentTarget.dataset
    let detail = e.detail
    _data.index = this.data.index
    let formData = this.data.formData[_data.index]
    let key = _data.key
    console.log('selectChange',e, key);

    if (_data.key == 'pantoneNumber') { // 专色下拉
      let pantoneNumber = formData.pantoneColorList.length
      let val = Number(detail.value)

      if (pantoneNumber > val) {
        for (let i = 0; i < pantoneNumber - val; i++) {
          formData.pantoneColorList.splice(-1, 1)
        }
      } else if (pantoneNumber < val) {
        for (let i = 0; i < val - pantoneNumber; i++) {
          formData.pantoneColorList.push('')
        }
      }
    }

    // formData[_data.default] = detail.index
    formData[_data.key] = detail.value
    this.setData({
      [_data.key]: false,
    })
    this.setVal(_data, formData)
  },

  /**
   * 校验数据
   */
  verifyData() {
    console.log('formDta',this.data.formData);
    var formData = this.data.formData;
    console.log('go', formData);
    if (formData[0].sizeLength == "") {
      return "请输入外尺寸长度";
    }
    if (formData[0].sizeWidth == "") {
      return "请输入外尺寸宽度";
    }
    if (formData[0].sizeHeight == "") {
      return "请输入外尺寸高度";
    }
    if (formData[0].sizeLength*1<10||formData[0].sizeWidth*1<10) {
      return "尺寸低于最小限制";
    }
  
    if (formData[0].number == ""||formData[0].number==0) {
      return "请选择印刷数量";
    }
    
    if (formData[0].number == "other" && (!formData[0].otherNumber || formData[0].otherNumber == "")) {
      return "请输入印刷数量";
    }

    for (let i = 0; i < formData.length; i++) {
      const item = formData[i]
      if (item.show && (item.type == 'fabric' || item.type == 'coreBoard')) {
        if (item.materialType == "") {
          return `请选择${item.title}${item.type == 'fabric' ? '面料' : item.type == 'coreBoard' ? '芯板' : '' }材质`;
        } else if (item.materialType == "其他") {
          if(item.paperSurface==''){
            return `请输入${item.title}${item.type == 'fabric' ? '面料' : item.type == 'coreBoard' ? '芯板' : '' }材质`;
          }
          if(item.paperGram==''){
            return `请输入${item.title}${item.type == 'fabric' ? '面料' : item.type == 'coreBoard' ? '芯板' : '' }克重`;
          }
          if(item.paperPrice==''){
            return `请输入${item.title}${item.type == 'fabric' ? '面料' : item.type == 'coreBoard' ? '芯板' : '' }单价`;
          }
        }

        if (item.type == 'fabric') {
          if (item.cutting == 'special') {
            if (!item.specialLong) {
              return `请输入${item.title}面料常规分切长度`
            }
            if (!item.specialWidth) {
              return `请输入${item.title}面料常规分切宽度`
            }
          }
          
          if (item.spot){
            let arr = item.pantoneColorList.filter(e=>e)
            if (arr.length!=item.pantoneColorList.length) {
              return "请填写"+ item.title + "PANTONE色号"
            }
          }
          let  reg=/^[1-9]\d*(\.\d{1,2})?$|^0+(\.\d{1,2})?$/
          let maxLength = 0
          let maxWidth = 0
          let otherMap = this.data.otherMap
          if (this.data.goodsId == '1620') {
            maxLength = otherMap.CC_THREE[0]
            maxWidth = otherMap.CC_THREE[1]
          } else {
            maxLength = otherMap.CC_ONE[0]
            maxWidth = otherMap.CC_ONE[1]
          }
          if (item.gold) {
            let text = ''
            for (let i = 0; i < item.colorList.length; i++) {
              const el = item.colorList[i];
              let checked = false
              for (let ii = 0; ii < el.chiled.length; ii++) {
                const items = el.chiled[ii];
                checked = items.checked
                if (items.checked) {
                  if (!el.length || !el.width) {
                    text = '请输入烫金尺寸'
                  } else if (Number(el.length) > Number(maxLength) || Number(el.width) > Number(maxWidth)) {
                    text = '烫金尺寸不可超过展开尺寸'
                  } else if (Number(el.length) <= 0 || Number(el.width) <= 0) {
                    text = '烫金尺寸不可小于或等于 0'
                  } else if (!reg.test(el.length) || !reg.test(el.width)) {
                    text = '烫金尺寸最多保留两位小数'
                  }
                  break
                }
              }
              if (!checked) {
                text = item.title + '请选择烫金颜色'
              }
            }
            if (text) {
              return text
            }
          } else if (item.camList.length) {
            for (let i = 0; i < item.camList.length; i++) {
              const el = item.camList[i];
              if (!el.sizeLength || !el.sizeWidth) {
                return '请输入击凸尺寸'
              } else if (!reg.test(el.sizeLength) || !reg.test(el.sizeWidth)) {
                return '击凸尺寸最多保留两位小数'
              } else if (Number(el.sizeLength) > Number(maxLength) || Number(el.sizeWidth) > Number(maxWidth)) {
                return '击凸尺寸不可超过展开尺寸'
              }
            }
          }

        } else if (item.type == 'coreBoard') {
          if (item.wrapper == 'side' && item.foldingSize == '') {
            return `请输入${item.title}包边尺寸`
          }
        }
      }
    }
  },
  /**
   * 拼接数据
   * @returns 属性字符串 
   */
  jointStr(){
    let formData = this.data.formData
    let Str = ''
    let goodsId = this.data.goodsId
    let titleList = this.data.boxTypeList

    let tian = []
    let di = []
    let nei = []
    
    // 前期准备 将部件数据分类
    formData.forEach(e => {
      if (e.show) { // 面料 和 芯板
        if (e.type == 'coreBoard' || e.type == 'fabric') {
          if (e._name == 'tian') { // 天盖 部件1
            tian.push({...e})
          } else if (e._name == 'di') { // 地盒 部件2
            di.push({...e})
          } else if (e._name == 'hebing') {
            tian.push({...e,_name:'tian'})
            di.push({...e,_name:'di'})
          } else if (e._name == 'nei') {
            nei.push({...e, _name: 'nei'})
          }
        }
      }
    })

    if (goodsId == '1620') {
      if (this.data.formData[0].innerBoxDiff == '相同' || this.data.formData[0].innerBoxDiff == '同天盖') {
        let obj = tian.find(e => e.type == 'fabric' && (e._name == 'hebing' || e._name == 'tian'))
        nei.push({...obj, _name: 'nei'})
      } else if (this.data.formData[0].innerBoxDiff == '同地盖') {
        let obj = di.find(e => e.type == 'fabric' && e._name == 'di')
        nei.push({...obj, _name: 'nei'})
      }
    }

    console.log('tian', tian, 'di', di, 'nei', nei);
    let otherMap = this.data.otherMap

    tian = this.partsJointStr(tian)
    if (goodsId == '1616') {
      tian += `${titleList.title3}1尺寸:${ this.toFixed_2(otherMap.CC_ONE[0]) }_${this.toFixed_2(otherMap.CC_ONE[1])};`
    } else if (goodsId == '1620') {
      tian += `${titleList.title3}1尺寸:${ this.toFixed_2(formData[0].sizeLength)}_${this.toFixed_2(formData[0].sizeWidth)}_${this.toFixed_2(formData[0].tianHeight)};`
    } else {
      tian += `${titleList.title3}1尺寸:${ this.toFixed_2(otherMap.CC_ONE[0]) }_${this.toFixed_2(otherMap.CC_ONE[1])}_${this.toFixed_2(otherMap.CC_ONE[2])};`
    }
    di = this.partsJointStr(di)
    if (goodsId == '1620') {
      di += `${titleList.title4}1尺寸:${this.toFixed_2(formData[0].sizeLength)}_${this.toFixed_2(formData[0].sizeWidth) }_${this.toFixed_2(formData[0].diHeight)};`
    } else {
      di += `${titleList.title4}1尺寸:${this.toFixed_2(otherMap.CC_THREE[0])}_${this.toFixed_2(otherMap.CC_THREE[1])}_${this.toFixed_2(otherMap.CC_THREE[2])};`
    }

    Str = `成品外尺寸:${Number(formData[0].sizeLength).toFixed(2)}_${Number(formData[0].sizeWidth).toFixed(2)}_${Number(formData[0].sizeHeight).toFixed(2)};`
    Str += `组装工艺:粘接;`
    this.data.competGoodsAttr = Str
    Str += `|#|部件:${titleList.title3}1;面料1定型模切:面板;芯板纸板定型模切:纸板;打角:是;糊盒:机器;裱合工艺:裱纸;` + tian
    if (goodsId == '1616') {
      Str += '裱合工艺:贴片_铁片;'
    }
    this.data.competGoodsAttr += `|#|部件:${titleList.title3}1;` + tian
    Str += `|#|部件:${titleList.title4}1;面料1定型模切:面板;芯板纸板定型模切:纸板;打角:是;糊盒:机器;裱合工艺:裱纸;` + di
    this.data.competGoodsAttr += `|#|部件:${titleList.title4}1;` + di

    if (goodsId == '1620') {
      nei = this.partsJointStr(nei)
      nei += `内围框1尺寸:${otherMap.CC_FOUR[0]}_${otherMap.CC_FOUR[1]};`
      Str += `|#|部件:${titleList.title5}1;面料1定型模切:面板;芯板纸板定型模切:纸板;打角:是;糊盒:机器;裱合工艺:裱纸;` + nei
      this.data.competGoodsAttr += `|#|部件:${titleList.title5}1;` + nei
    } else if (goodsId == '1616') {
      Str += `裱合工艺:贴片_圆磁;配件圆磁带铁片样式来源:傲彩标准;配件圆磁带铁片规格:12_18;配件圆磁带铁片个数:1;`
    }

    let neto = formData.find(e => e.type == 'neto')
    if (neto.assembly == 'yes') {
      Str += `|#|部件:整体配件;${neto.netoType };关联配件PO号:无;需要粘:是;单独打包:否;`
      this.data.competGoodsAttr += `|#|部件:整体配件;${neto.netoType };`
    }

    this.setData({
      competGoodsAttr: this.data.competGoodsAttr
    })
    console.log('Str', Str);

    return Str
  },
  toFixed_2(num){
    return Number(num).toFixed(2)
  },
  partsJointStr(data) { // 部件拼接字段
    let mianStr = ''
    let neiStr = ''
    let str = ''

    data.forEach(e => {
      if (e.type == 'fabric') {
        if (e.materialType=='其他') {
          mianStr += `其他纸张;面料1材质:${e.paperSurface}_${e.paperGram};${e.unit}:${e.paperPrice};`
          neiStr += `其他纸张;内衬材质:${e.paperSurface}_${e.paperGram};${e.unit}:${e.paperPrice};`
        } else {
          mianStr += `面料1材质:${(e.thicknessList.find(s => s.kg===e.thickness)).keyvalue};`
          neiStr += `内衬材质:${(e.thicknessList.find(s => s.kg===e.thickness)).keyvalue};`
        }

        if(e.printsize == 'four') {
          mianStr += `面料1印刷:普通印刷;面料1印刷颜色:多色_CMYK;`
          neiStr += `内衬印刷:普通印刷;内衬印刷颜色:多色_CMYK;`
        }

        if(e.white) {
          mianStr += `面料1加印白墨;`
          neiStr += `面料1加印白墨;`
        }

        if(e.spot) {
          let arr = e.pantoneColorList.map(item => item)
          mianStr += `面料1专色:${e.pantoneNumber},${arr.join(',')};`
          neiStr += `内衬专色:${e.pantoneNumber},${arr.join(',')};`
        }

        if(e.surface) {
          if (e.surface == '逆向UV') {
            mianStr += `面料1过油:${e.surface};`
            neiStr += `内衬过油:${e.surface};`
          } else {
            mianStr += `面料1覆膜:${e.surface};`
            neiStr += `内衬覆膜:${e.surface};`
          }
        }

        if (e.postTreatmentList.length>0) { // 其他工艺 
          e.postTreatmentList.map(item=>{
            if (item.checked) {
              if (item.craftName=='烫金') {
                for (let i = 0; i <e.colorList.length; i++) {
                  const el = e.colorList[i];
                  for (let ii = 0; ii < el.chiled.length; ii++) {
                    const ell = el.chiled[ii];
                    if (ell.checked) { 
                      mianStr+=`面料1烫金${i+1}:${ell.name}_${el.length}_${el.width};`
                      neiStr+=`内衬烫金${i+1}:${ell.name}_${el.length}_${el.width};`
                    }
                  }
                }
              } else if (item.craftName=='击凸') {
                for (let i = 0; i < e.camList.length; i++) {
                  const el = e.camList[i];
                  mianStr+=`面料1击凸${i+1}:${el.sizeLength}_${el.sizeWidth};`
                  neiStr+=`内衬击凸${i+1}:${el.sizeLength}_${el.sizeWidth};`
                }
              }else if (item.craftName=='局部UV') {
                mianStr+=`面料1局部UV1:1_1;`
                neiStr+=`内衬局部UV1:1_1;`
              }
            }
          })
        }

        if (e._name == 'nei') {
          neiStr = ''
        }

      } else if (e.type == 'coreBoard') {
        str = `芯板纸板材质:${e.materialType}_${e.thickness};${e.sizing == 'v' ? '芯板纸板定型V槽:V槽_4;': e.sizing == 'break' ? '芯板纸板定型:断板;' : '芯板纸板定型:啤半穿;'}`
        if (e.wrapper == 'all') {
          str += neiStr
        }
      }
    })
    
    return mianStr+str
  },
  /**
   * 立即下单
   */
  placeOrder() {
    this.edition(1)
    this.saveReport(4)
  },
  /**
   * 添加购物车
   */
    addEditionCart() {
    this.edition(0)
    this.saveReport(3)
  },
  /**
   * 
   * @param {*} isFrom  0|1 |立即下单
   * @returns 
   */
 async edition(isFrom){
   var _this = this
  var msg = this.verifyData();
    if (msg) {
      _this.modalFun({contentText:msg,time:1000})
      return;
    }

    wx.showLoading({
      title: isFrom==0?'添加购物车':'正在下单',
      mask:true
    })
    let attrStr = _this.data.attrStr
    if (_this.data.pinbanObj.outBoxPriceMap) {
      let box = _this.data.pinbanObj.outBoxPriceMap
      attrStr += `|#|部件:包装服务;品类:平口箱;成品内尺寸:${this.toFixed_2(box.boxLength)}_${this.toFixed_2(box.boxWide)}_${this.toFixed_2(box.boxHeight)};展开尺寸:${this.toFixed_2(box.goodAl)}_${this.toFixed_2(box.goodAw)};数量:${box.boxNumber};堆叠方式:${box.StackingWay}`
    }
    
    var info = {
      miniCart: {
        extendsStr: "0",
        goodsAttr: attrStr,
        goodsId: _this.data.auto?_this.data.goodsId:640,//盒型，小程序没有盒型，暂时写死双插盒id-938,自定义盒型640
        goodsTotal: _this.data.price,
        isfrom: isFrom,
        num: this.data.formData[0].number == 'other' ? this.data.formData[0].otherNumber : this.data.formData[0].number,
        totalTime: _this.data.orderTime,
        webfrom:1,
        versionType:_this.data.auto?2:3,
        pinBanStr:_this.data.priceObj.pin_ban,
        cutModelUrl: this.data.pdfUrl
      },
      competPinBan:_this.data.pinBanStr,
      competGoodsAttr: this.data.competGoodsAttr,
      number: 1,
      loseMap: this.data.loseMap,
      wxSpecialReq:{
        daomoMap: this.data._daomoUrl
      }
    };
    add(info).then(res => {
      _this.getCartCount()
      wx.hideLoading()
      if (res.success) {
        if(isFrom==1){
          wx.hideLoading()
          wx.navigateTo({
            url: "../../../Confirm/ConfirmSingleOrder/index?isFrom=1&pickUpDate="+this.data.pickUpDate,
          });
        }else{
          singUpdateCheck({isCheck:true,list:[res.data[0].id]})
        }
        
      } else {
        wx.hideLoading()
        _this.modalFun({contentText:res.message,time:2000})
      }
    }).catch((err)=>{
      wx.hideLoading()
    });
   
 },
 valuation(e){
  if(this.data.formData[0].tianHeight < 1) {
    this.modalFun({contentText: '请填写天盖高度'})
    return
  }
  if(this.data.formData[0].diHeight < 1) {
    this.modalFun({contentText: '请填写地盒高度'})
    return
  }

  var _this = this;
  if (this.data.goodsId == '1620' && this.data.formData[0].coreBoardDiff == 'diff') {
    let obj = this.data.formData.find(e => e.type == 'coreBoard' && e._name == 'di')
    obj.thickness = this.data.formData[2].thickness
  }
  var msg = this.verifyData();
  if(msg){
    this.setData({
      price: '0.00' ,
      originalPrice: '0.00',
      priceArr:[],
      priceObj:null,
      unitPrice:null
    });
  
    if(msg){
      _this.modalFun({contentText:msg,time:1000})
    }
    return
  }
   this.setData({
     pin:true
   })
   this.startPinBan(e.currentTarget.dataset.re)
   this.saveReport(2)
 },
  /**
   *  计算价格
   */
 async countPrice(e) {
  console.log('countPrice');
  var _this = this;
  var msg = this.verifyData();
  var formData = this.data.formData;

  if (!_this.data.pinBanStr) {
    console.log('停止计价','!_this.data.pinBanStr');
    return
  }
  if(msg){
    this.setData({
      price: '0.00' ,
      originalPrice: '0.00',
      priceArr:[],
      priceObj:null,
      unitPrice:null
    });
    _this.modalFun({contentText:msg,time:1000})
    wx.hideLoading();
    return
  }
  if (_this.data.showReset) {
    console.log('停止计价','showReset');
    return
  }
   
  if (!this.data.pin&&!this.data.pinbanObj) {
    console.log('停止计价','!this.data.pinbanObj');
    return
  }
   clearTimeout(this.data.timeOut)
    //改变上面选项需要等待纸张重新计价完成
    if (this.data.flag2) {
      console.log('timeOut ');
      this.setData({
        timeOut : setTimeout(()=>{_this.countPrice(e)},500)
      })
      return false
    }
    var attrStr = _this.jointStr();
    console.log('重新计价：attrStr', attrStr);
    this.setData({
      attrStr: attrStr
    })
    // _this.joinStr();
    wx.showLoading({
      mask:true
    })
    getPriceSpecial({
      goodsId:_this.data.auto?_this.data.goodsId:640,//盒型，小程序没有盒型，暂时写死双插盒id-938,自定义盒型640
      fnumber: 1,
      goodsAttr: attrStr,
      number: formData[0].number == 'other' ? Number(formData[0].otherNumber) : formData[0].number,
      cextends:1,
      type: 0,
      city:(_this.data.region[0]!=''?_this.data.region[0]:'')+' '+(_this.data.region[1]!=''?_this.data.region[1]:'')+' '+(_this.data.region[2]!=''?_this.data.region[2]:''),
      competPinBan: _this.data.compute ? _this.data.pinBanStr : _this.data.pinBanPlans,
      competGoodsAttr: this.data.competGoodsAttr, // 展示数据
      loseMap: this.data.loseMap
    }).then((res) => {
      _this.getCartCount()
      _this.data.compute = false
      wx.hideLoading()
      if (res.success) {
        console.log('计价结果',res);
        var data = res.data

        let pinbanObj = {
          pngPathList: data.priceInfo.pngPathList.map(item => this.data.imgBaseUrl + item),
          facialTissue: JSON.parse(data.priceInfo.facialTissue), // 面纸内贴
          facialTissueResp: JSON.parse(data.priceInfo.facialTissueResp), // 费用
          greyVersion: JSON.parse(data.priceInfo.greyVersion), // 灰板
          outBoxPriceMap: data.priceInfo.outBoxPriceMap, // 包装服务
          magnetNumber: data.priceInfo.magnetNumber,
          magnetPrice: data.priceInfo.magnetPrice,
          pi: data.priceInfo.pi
        }
        // 天盖面纸 canopySurface 地盖面纸  floorSurface 天盖内贴面纸 canopyFaceSurface 地盖内贴面纸  floorFaceSurface 天盖灰板  canopyGray 地盖灰板  floorGray

        // if (pinbanObj.greyVersion.length == 2 && pinbanObj.greyVersion[0].part != 'canopyGray') { // 面料
        //   [pinbanObj.greyVersion[0],pinbanObj.greyVersion[1]] = [pinbanObj.greyVersion[1],pinbanObj.greyVersion[0]]
        // }

        let obj = {}

        for (let i = 0; i < pinbanObj.greyVersion.length; i++) {
          const e = pinbanObj.greyVersion[i];
          obj[e.part] = e.lose
          let ar = e.part.split('_')
          e.title = this.findName(ar)
          if (e.title.indexOf('天') != -1) {
            e.sort = 0
          } else if (e.title.indexOf('皮') != -1) {
            e.sort = 0
          } else if (e.title.indexOf('地') != -1) {
            e.sort = 1
          } else if (e.title.indexOf('内盒') != -1) {
            e.sort = 1
          } else if (e.title.indexOf('内围') != -1) {
            e.sort = 2
          }
        }
        this.sortByKey(pinbanObj.greyVersion, 'sort')

        for (let i = 0; i < pinbanObj.facialTissue.length; i++) {
          const e = pinbanObj.facialTissue[i];
          obj[e.part] = e.lose
          let ar = e.part.split('_')
          e.title = this.findName(ar)
          if (e.title.indexOf('天') != -1) {
            e.sort = 0
          } else if (e.title.indexOf('皮') != -1) {
            e.sort = 0
          } else if (e.title.indexOf('地') != -1) {
            e.sort = 1
          } else if (e.title.indexOf('内盒') != -1) {
            e.sort = 1
          } else if (e.title.indexOf('内围') != -1) {
            e.sort = 2
          }
        }
        this.sortByKey(pinbanObj.facialTissue, 'sort')

        console.log('pinbanObj--', pinbanObj);

        _this.setData({
          loseMap: {...obj},
          pinBanStr: res.data.competPinBan,
          price: Math.ceil(data.total_price*100)/100,
          pinbanImg:res.data.priceInfo.pngPathList,
          priceObj:data,
          unitPrice:(data.total_price/(this.data.formData[0].number == 'other' ? this.data.formData[0].otherNumber : this.data.formData[0].number)).toFixed(2),
          orderTime:Number(data.time),
          pin:false,
        });
        if (!_this.data.pinbanObj) {
          _this.setData({
            pinbanObj:pinbanObj
          })
          wx.pageScrollTo({
            scrollTop:0,
            duration:300
          })
        }else{
          _this.setData({
            pinbanObj:pinbanObj
          })
        }
        
      }else{
        _this.modalFun({contentText:res.message+'请稍后重试',time:2000})
      }
    }).catch(() => {
      this.setData({
        showReset:true,
        pinbanObj:null,
        loseMap:{}
      })
    });
  },
  findName(ar) {
    let arr = [ { key: "floor", val: "地盒" }, { key: "canopy", val: "天盖" }, { key: "innerFrame", val: "内围框" }, { key: "leather", val: "皮壳", },
      { key: "innerBox", val: "内盒", }, { key: "cabinet", val: "柜桶", }, { key: "drawer", val: "抽屉", }]
    let str = ''

    for (let i = 0; i < ar.length; i++) {
      const el = ar[i];
      
      let obj = arr.find(ell => el.indexOf(ell.key) != -1 && el.indexOf('Face') == -1) // Face 内贴
      if (!obj) {
        continue
      }
      if (str.indexOf(obj.val) != -1) {
        str += '1'
        obj.val += '2'
      }
      if (i) {
        str+= '/'
      }
      str += obj.val
    }

    return str
  },
  sortByKey(array, key) {
    return array.sort(function(a,b) {
      var x = a[key]
      var y = b[key]
      return ((x<y)?-1:((x>y)?1:0))
    })
  },
  coupleBack:function(){
    wx.navigateTo({
      url: '../../../coupleBack/index' 
    })
  },
  notice:function() {
    wx.navigateTo({
      url: '../../edition/tips/index'
    })
  },
  checkCart(){
    wx.switchTab({
      url: '/pages/singleCart/index',
    })
  },
  preview(e){
    wx.previewImage({
      urls: this.data.pinbanObj.pngPathList,
      current: e.currentTarget.dataset.img
    })
  },
  saveReport(actionId){
    let _this = this;
    app.saveReport(_this.data.goodsId!==640?{goodsId:_this.data.goodsId, actionId:actionId,type:'专版报价'}:{channel:500800})
  }
});
