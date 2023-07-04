import {PIN_BAN_URL} from '../../../../utils/request.js'

export const goodsListTitle = {
	'1616': {
		name: '书型盒',
		title: {
			title1: '皮壳/内盒',
			title2: '皮壳/内盒',
			title3: '皮壳',
			title4: '内盒',
		},
		pinBanUrl: {
			tian_hui: PIN_BAN_URL + '/hardcoverBook/shellCore.php?',
			tian_mian: PIN_BAN_URL + '/hardcoverBook/shellCover.php?',
			tian_nei: PIN_BAN_URL + '/hardcoverBook/shellLining.php?',
			di_hui: PIN_BAN_URL + '/hardcoverBook/innerCore.php?',
			di_mian: PIN_BAN_URL + '/hardcoverBook/innerCover.php?',
			di_nei: PIN_BAN_URL + '/hardcoverBook/innerLining.php?'
		},
		parts: {
			fabric: 2,
			coreBoard: 2
		}
	},
	'1617': {
		name: '抽屉盒',
		title: {
			title1: '柜桶/抽屉',
			title2: '柜桶/抽屉',
			title3: '柜桶',
			title4: '抽屉',
		}
	},
	'1619': {
		name: '天包地天地盒',
		title: {
			title1: '天盖/地盒',
			title2: '天盖/地盒',
			title3: '天盖',
			title4: '地盒',
		},
		pinBanUrl: {
			tian_hui: PIN_BAN_URL + 'hardcover/canopyCore.php?',
			tian_mian: PIN_BAN_URL + 'hardcover/canopyCover.php?',
			tian_nei: PIN_BAN_URL + 'hardcover/canopyLining.php?',
			di_hui: PIN_BAN_URL + 'hardcover/landCore.php?',
			di_mian: PIN_BAN_URL + 'hardcover/landCover.php?',
			di_nei: PIN_BAN_URL + 'hardcover/landLining.php?'
		},
		parts: {
			fabric: 2,
			coreBoard: 2
		}
	},
	'1620': {
		name: '平口天地盒',
		title: {
			title1: '天盖/地盒/内围框',
			title2: '天盖/地盒',
			title3: '天盖',
			title4: '地盒',
			title5: '内围框',
		},
		pinBanUrl: {
			tian_hui: PIN_BAN_URL + 'hardcoverFence/canopyCore.php?',
			tian_mian: PIN_BAN_URL + 'hardcoverFence/canopyCover.php?',
			tian_nei: PIN_BAN_URL + 'hardcoverFence/canopyLining.php?',
			di_hui: PIN_BAN_URL + 'hardcoverFence/landCore.php?',
			di_mian: PIN_BAN_URL + 'hardcoverFence/landCover.php?',
			di_nei: PIN_BAN_URL + 'hardcoverFence/landLining.php?',
			nei: PIN_BAN_URL + 'hardcoverFence/' // 内围框
		},
		parts: {
			fabric: 3,
			coreBoard: 3
		}
	}
}
export const _surfaceHandle = {
	'双铜纸':[
		"哑胶",
		"光胶",
		"触感膜",
		"防刮花哑膜",
		"防刮花光膜",
		"无"
	],
	'银卡纸':[
		"逆向UV",
		"哑胶",
		"光胶",
		"触感膜",
		"防刮花哑膜",
		"防刮花光膜",
		"无"
	],
	'其他':[
		"哑胶",
		"光胶",
		"触感膜",
		"防刮花哑膜",
		"防刮花光膜",
		"无"
	]
}

// export const _printList = {
// 	size:[{value:'four',lable:'四色印刷'},{value:'null',lable:'无'}],
// 	bordure:[{value:'side',lable:'包边'},{value:'all',lable:'全包'}],
// 	ev:[{value:'v',lable:'V槽'},{value:'hemi',lable:'半穿'}],
//   }

export const _data = {
    modal: {
      show: false,//modal是否显示，默认false
      contentText:'',
      icon:'',
      iconSize:'',
      image:'',
      imageSize:''
    },
    tips:false,
    numberText:'请输入1000的整倍数',
    knifeUrl:'',
    img:'',
    daomo:'',
    auto:false,//是否自动拼版
    pinBanStr:'',//拼版计价字符串
    pinbanImg:'',//拼版图片
    flag2:false,//是否正在拼版
    region:['请选择', '请选择'],//位置
    goodsId:'',
    show:false,//显示省市区选择器
    // areaList,
    pinbanObj:null,
    imgBaseUrl:'https://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/',
    pin:false,
    attrStr:'',//计价下单用参数串
    showReset:false,
    pdfUrl: [],//刀模pdf的oss地址
    PinBanParams:null,
    isShow:false,//是否是金银卡纸
    // sizeLimit:{}
    printList:{
      size:[{value:'four',lable:'四色印刷'},{value:'null',lable:'无'}],
      bordure:[{value:'side',lable:'包边'},{value:'all',lable:'全包'}],
      ev:[{value:'v',lable:'V槽'}],
    },
    frontShow:false,
    backShow:false,
    inputList:[1,2,3],
    unitPrice:null,
    InputList: [
      1000,
      2000,
      3000,
      4000,
      5000
    ],
    cuttingList: [{lable: '常规分切',value: null}, {lable: '正度', value: null}, {lable: '大度', value: null}],
    pinbanData: {},
    pinbanCount: 0,
    otherMap: {}, // 尺寸
    competGoodsAttr: '',
    // positiveDegreeNumber: null, // 正度参数
    // bigDegreeNumber: null, // 大度参数
    loseMap: {},
    trowel_fenqie_w: '',
    boxTypeList: {}
  }

// 双驳纸判断公式
export const designFormula = {
	VTC: (data) => { // 围条灰板材质：VTC {双灰:1，单白或单黑:2，双面滑:3}
		if (data == '双灰纸板') {
			return 1
		} else if (data == '灰底黑板' || data == '灰底白板') {
			return 2
		} else {
			return 3
		}
	},
	VTX: (data) => { // 围条灰板厚度系数：VTX { VTC=1:VTX=1.55,VTC=2:VTX=1.45,VTC=3:VTX=1.40 }
		if (data == 1) {
			return 1.55
		} else if (data == 2) {
			return 1.45
		} else if (data == 3) {
			return 1.40
		}
	},
	VTG: (data) => { // 围条灰板克重：VTG {600:1,800:2,1000:3,1200:4,1400:5,1600:1,1800:6}
		switch (data) {
			case 600: return 1;
			case 800: return 2;
			case 1000: return 3;
			case 1200: return 4;
			case 1400: return 5;
			case 1600: return 1;
			case 1800: return 6;
			default:
				break;
		}
	},
	VTN: (data, VTX) => { // 围条灰板厚度：VTN
		switch (data) {
			case 1: return (6 * (VTX * 1000)) / 10000 // VTG=1,VTN=0.6*VTX
			case 2: return (8 * (VTX * 1000)) / 10000 // VTG=2,VTN=0.8*VTX
			case 3: return (10 * (VTX * 1000)) / 10000 // VTG=3,VTN=1.0*VTX
			case 4: return (12 * (VTX * 1000)) / 10000 // VTG=4,VTN=1.2*VTX
			case 5: return (14 * (VTX * 1000)) / 10000 // VTG=5,VTN=1.4*VTX
			case 6: return (16 * (VTX * 1000)) / 10000 // VTG=6,VTN=1.6*VTX
			case 7: return (18 * (VTX * 1000)) / 10000 // VTG=7,VTN=1.8*VTX
		}
	},
	VTY: (data) => { // 围条灰板工艺：VTY{V槽:1，半穿:2}
		if (data == 'v') return 1
		return 2
	},
	VTM: (data, VTN) => { // 围条灰板工艺系数：VTM { VTY=1:VTM=0 , VTY=2:VTM=VTN }
		if (data == 1) {
			return 0
		}
		else if (data == 2) {
			return VTN
		}
	},
	// DG: (data) { // 天地盖露腰高度：DG 自定义：10 限制：DG>=0
	// },
	AC: (data) => { // 天地盖摩擦放位：AC { DG>=0,AC=1.3 , AC=1 }
		if (data >= 0) {
			return 1.3
		} else {
			return 1
		}
	},
	CBB: (data) => { // 地盖灰板材质：CBB {双灰:1，单白或双灰:2，双面滑:3}
		if (data == '双灰纸板') {
			return 1
		} else if (data == '灰底黑板' || data == '灰底白板') {
			return 2
		} else {
			return 3
		}
	},
	GB: (data) => { // 地盖灰板厚度系数：GB { CBB=1:GB=1.55, CBB=2:GB=1.45, CBB=3:GB=1.40}
		if (data == 1) {
			return 1.55
		} else if (data == 2) {
			return 1.45
		} else if (data == 3) {
			return 1.40
		}
	},
	CFG: (data) => { // 天地盖灰板克重：CFG { 600:1,800:2,1000:3,1200:4,1400:5,1600:6,1800:7 }
		switch (data) {
			case 600: return 1;
			case 800: return 2;
			case 1000: return 3;
			case 1200: return 4;
			case 1400: return 5;
			case 1600: return 6;
			case 1800: return 7;
		}
	},
	GD: (data, GB) => { // 地盖灰板厚度：GD
		switch (data) {
			case 1: return 6 * (GB * 1000) / 10000 // CFG=1,GD=0.6*GB
			case 2: return 8 * (GB * 1000) / 10000 // CFG=2,GD=0.8*GB
			case 3: return 10 * (GB * 1000) / 10000 // CFG=3,GD=1.0*GB
			case 4: return 12 * (GB * 1000) / 10000 // CFG=4,GD=1.2*GB
			case 5: return 14 * (GB * 1000) / 10000 // CFG=5,GD=1.4*GB
			case 6: return 16 * (GB * 1000) / 10000 // CFG=6,GD=1.6*GB
			case 7: return 18 * (GB * 1000) / 10000 // CFG=7,GD=1.8*GB
		}
	},
	CAB: (data) => { // 地盖芯板工艺：CAB { V槽1，半穿2}
		if (data == 'v') {
			return 1
		}
		return 2
	},
	TD: (data, GD) => { // 地盖灰板工艺系数：TD { CAB=1:TD=0, CAB=2,TD=GD }
		if (data == 1) {
			return 0
		}
		return GD
	},
	// L:精装盒外长 
	// W:精装盒外宽 
	W2: (data, TD) => { // 地盖灰板宽：W2 { W2=W-TD*2 }
		return data - TD * 2
	},
	L2: (data, TD) => { // 地盖灰板长：L2 { L2=L-TD*2 }
		return data - TD * 2
	},
}