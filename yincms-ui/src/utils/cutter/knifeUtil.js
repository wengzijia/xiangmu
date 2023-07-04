import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import * as pdfjsLib from 'pdfjs-dist';

let host = 'https://admin.aocai.cn'; //正式
//let host = 'http://192.168.1.220'; //测试
let threePrefixUrl = '/index.php/index/cutter/php_knife';
let knifePrefixUrl = '/knife';
let integrate = '/integrate';

// let path = 'http://192.168.7.12:8088/'; //测试
let path = 'https://sd.liaotu.com/'; //正式
//
//包装方案3d渲染
export function package_3d(that, skinPath, mouldPath) {
  that.url = path + '/pack/api/pack/3d?skinPath=' + skinPath + '&mouldPath=' + mouldPath;

  // console.log(2222, that.url);
}
//包装方案3d渲染
export function allPackage_3d(that, id) {
  that.url = path + '/pack/api/pack/all3d?designId=' + id;
  // http://192.168.2.5:8081/pack/api/pack/all3d?designId=25
  // console.log('allPackage_3d', that.url, id);
}

//包装方案3d渲染
export function package_3d_2(skinPath, mouldPath, goodsThumbnail, type) {
  // console.log(2222, path + '/pack/api/pack/3d?skinPath=' + skinPath + '&mouldPath=' + mouldPath + '&goodsThumbnail=' + goodsThumbnail);
  if (type == 1) {
    return path + '/pack/api/pack/3d?skinPath=' + skinPath + '&mouldPath=' + mouldPath + '&goodsThumbnail=' + goodsThumbnail;
  } else {
    return path + '/pack/api/pack/3d?skinPath=' + skinPath + '&mouldPath=' + mouldPath + '&goodsThumbnail=' + goodsThumbnail + '&initTexture=' + goodsThumbnail;
  }
}
//包装方案3d渲染
export function allPackage_3d_2(id) {
  // export function allPackage_3d_2(goodsList,allImg) {
  // let mould3d = 'mouldPathList=';
  // let skinFile = 'skinPathList=';
  // let thumbnail = 'thumbnail='+allImg;
  // console.log('allImg------',allImg);
  // goodsList.map((item, index) => {
  //   if (index == 0) {
  //     mould3d += item.mould3d;
  //     skinFile += item.skinFile;
  //   } else {
  //     mould3d += '&mouldPathList=' + item.mould3d;
  //     skinFile += '&skinPathList=' + item.skinFile;
  //   }
  // });
  // console.log('mould3d-------', mould3d);
  // console.log('skinFile-------', skinFile);
  // return path + 'pack/api/pack/paramShowAll3d?'+skinFile+'&'+mould3d+'&'+thumbnail;
  return path + '/pack/api/pack/all3d?designId=' + id;
}
//自定义设计3d渲染
export function iframeSrc({ cutterModelUrl, previewImg }) {
  return path + `pack/api/3d/proof?imgSrc=/aliyunoss/${previewImg}&${cutterModelUrl}`;
  // return path + `pack/api/3d/proof?imgSrc=/aliyunoss/${previewImg}&length=${length}&width=${width}&height=${height}&thick=${thick}${typeArg}`;
}

//3d渲染
export function knife_3d(that, cateId, gSubCateId, gid) {
  let folder = getFolder(cateId, gSubCateId, gid);
  that.src = host + threePrefixUrl + '?' + that.threeInputStr + that.datastr + that.data.knifeUrl + '&imgSrc=' + that.imgSrc;
  if (folder == 'hardcover' || folder == 'hardcoverBook' || folder == 'hardcoverFence' || folder == 'hardcoverDrawer') {
    that.src += '&scalingX=0.8&scalingY=0.8';
  }
  // console.log(2222, that.src);
}
//刀模3d渲染2
export function knife_3d2(that, cateId, gSubCateId, gid, imgSrc) {
  let folder = getFolder(cateId, gSubCateId, gid);
  that.src2 = path + 'pack/api/3d/proof?' + that.threeInputStr + that.datastr + that.data.knifeUrl + '&imgSrc=/aliyunoss/' + imgSrc;
  if (folder == 'hardcover' || folder == 'hardcoverBook' || folder == 'hardcoverFence' || folder == 'hardcoverDrawer') {
    that.src2 += '&scalingX=0.8&scalingY=0.8';
  }
  console.log(2222, that.src2);
}
//pdf渲染
export function knife_pdf(that, cateId, gSubCateId, gid) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  let winW = document.documentElement.clientWidth;
  // pdf 的 localhost地址是把用来做测试的pdf放在了项目里，实际运用可以用后台返回的线上地址
  // let pdfUrl = '/knife/' + folder + '/?long=' + that.length + '&width=' + that.width + '&height=' + that.height + '&' + that.datastr + that.data.daomoUrl;
  let daomoUrl = that.data.daomoUrl ? that.data.daomoUrl : '';
  let pdfUrl = knifePrefixUrl + '/' + that.folder + '?' + that.knifeInputStr + that.datastr + daomoUrl;
  if (that.folder == 'integrate') {
    pdfUrl = integrate + '/?' + that.knifeInputStr + that.datastr + daomoUrl;
  }
  let loadingTask = pdfjsLib.getDocument(pdfUrl);
  loadingTask.promise.then(
    pdf => {
      let pageNum = pdf.numPages;
      that.totalPage = pageNum;
      for (let i = 1; i <= pageNum; i++) {
        pdf.getPage(i).then(page => {
          let viewport = page.getViewport({ scale: 1.0 });
          var scale = '';
          var Width = 842;
          var Height = 578;
          if (Height / viewport.height < Width / viewport.width) {
            scale = Height / viewport.height;
          } else {
            scale = Width / viewport.width;
          }
          viewport = page.getViewport({ scale: scale });
          var canvas = document.getElementById('the-canvas' + i);
          var context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          viewport = page.getViewport({ scale: scale });
          //居中
          if (viewport.height < viewport.width) {
            context.setTransform(viewport.width / canvas.width, 0, 0, viewport.width / canvas.width, 0, 0);
          } else {
            context.setTransform(viewport.height / canvas.height, 0, 0, viewport.height / canvas.height, 0, 0);
          }
          var renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          var renderTask = page.render(renderContext);
          renderTask.promise.then(function() {
            console.log('Page rendered');
          });
        });
      }
    },
    function(reason) {
      console.error(reason);
    }
  );
}
//获取下载刀模php文件夹名称
export function getFolder(cateId, gSubCateId, gid) {
  let folder = '';
  console.log(555, cateId);
  //卡盒管式盒
  if (cateId == 1) {
    folder = 'cardBox';
  }
  //卡盒抽屉盒
  if (cateId == 1 && gSubCateId == 244) {
    folder = 'cardDrawer';
  }

  //卡盒天地盖
  if (cateId == 1 && gSubCateId == 245) {
    folder = 'cardWorld';
  }

  //卡盒一体成型盒
  if (cateId == 1 && gSubCateId == 243) {
    folder = 'integrate';
  }

  console.log(555, cateId, gSubCateId, folder);
  //坑盒,自动锁底盒,锁底盒
  if (cateId == 2) {
    folder = 'prototype';
  }
  //一体成型盒
  if (cateId == 2 && gSubCateId == 251) {
    folder = 'onePieceBox';
  }
  //坑天地盖
  if (cateId == 2 && gSubCateId == 253) {
    folder = 'prototypeCover';
  }
  //胶片盒
  if (cateId == 8) {
    folder = 'FilmBox';
  }
  //精装盒
  if (cateId == 3) {
    folder = 'hardcover';
  }
  //精装书形盒
  if (cateId == 3 && gid == 1370) {
    folder = 'hardcoverBook';
  }
  //精装围边天地盖
  if (cateId == 3 && gid == 1371) {
    folder = 'hardcoverFence';
  }
  //精装抽屉盒
  if (cateId == 3 && gid == 1372) {
    folder = 'hardcoverDrawer';
  }
  //内托
  if (cateId == 4) {
    folder = 'netopit';
  }
  //手提袋
  if (cateId == 7) {
    folder = 'bags';
  }
  //外箱-一体成型盒
  if (cateId == 70 && gSubCateId == 287) {
    folder = 'outerBoxOnePieceBox';
  }
  //外箱-刀卡平卡
  if (cateId == 70 && gSubCateId == 286) {
    folder = 'knifecard';
  }
  //外箱-彩盒堆码
  if (cateId == 70 && gSubCateId == 285) {
    folder = 'outerBox';
  }
  //外箱-彩盒堆码
  if (cateId == 70 && (gSubCateId == 284 || gSubCateId == 283)) {
    folder = 'outerBoxClass';
  }

  return folder;
}

//下载刀模连接
export function knifeDownload(that, loca) {
  var daomoUrl = that.data.daomoUrl ? that.data.daomoUrl : '';

  if (that.folder == 'integrate') {
    loca.href = host + '/scm' + '/' + that.folder + '?' + that.knifeInputStr + that.datastr + daomoUrl;
  } else {
    loca.href = host + knifePrefixUrl + '/' + that.folder + '?' + that.knifeInputStr + that.datastr + daomoUrl;
  }
  if (that.folder == 'netopit') {
    let boxtype = 0;
    let s = that.datastr;
    boxtype = s.substring(s.indexOf('boxtype') + 8, s.indexOf('boxtype') + 9);
    console.log(1112, that.noteCalcAttr);
    setTimeout(function() {
      getboxknife(that, loca, boxtype);
    }, 500);
  }
}
function getboxknife(that, loca, boxtype) {
  let make_long = that.noteCalcAttr.make_long;
  let make_wide = that.noteCalcAttr.make_wide;
  let make_height = that.noteCalcAttr.make_height;
  if (boxtype == 2) {
    loca.href =
      host +
      knifePrefixUrl +
      '/cardBox?long=' +
      make_long +
      '&width=' +
      make_wide +
      '&height=' +
      make_height +
      '&thick=0.35&cover_dark_buckle=undefined&lower_dark_buckle=undefined&buckle_type=undefined&on_zipper_knife=undefined&down_zipper_knife=undefined&cover=A01&case=B01&lower=C02';
  }
  if (boxtype == 3) {
    loca.href =
      host +
      knifePrefixUrl +
      '/cardBox/?long=' +
      make_long +
      '&width=' +
      make_wide +
      '&height=' +
      make_height +
      '&thick=0.35&cover_dark_buckle=undefined&lower_dark_buckle=undefined&buckle_type=undefined&on_zipper_knife=undefined&down_zipper_knife=undefined&cover=A01&case=B01&lower=C11';
  }
  if (boxtype == 4) {
    loca.href =
      host +
      knifePrefixUrl +
      '/cardBox/?long=' +
      make_long +
      '&width=' +
      make_wide +
      '&height=' +
      make_height +
      '&thick=0.35&cover_dark_buckle=undefined&lower_dark_buckle=undefined&buckle_type=undefined&on_zipper_knife=undefined&down_zipper_knife=undefined&cover=A01&case=B01&lower=C13';
  }
  if (boxtype == 5) {
    loca.href =
      host +
      knifePrefixUrl +
      '/cardBox/?long=' +
      make_long +
      '&width=' +
      make_wide +
      '&height=' +
      make_height +
      '&thick=0.35&cover_dark_buckle=undefined&lower_dark_buckle=undefined&buckle_type=undefined&on_zipper_knife=ON_ZYES&down_zipper_knife=DO_ZYES&cover=A12&case=B01&lower=C09';
  }
  if (boxtype == 6) {
    loca.href =
      host +
      knifePrefixUrl +
      '/cardBox/?long=' +
      make_long +
      '&width=' +
      make_wide +
      '&height=' +
      make_height +
      '&thick=0.35&cover_dark_buckle=undefined&lower_dark_buckle=undefined&buckle_type=aircraft&on_zipper_knife=undefined&down_zipper_knife=undefined&cover=A10&case=B01&lower=C01';
  }
}
//获取输入框参数
export function getInputStr(that) {
  that.threeInputStr = 'length=' + that.length + '&width=' + that.width + '&height=' + that.height + '&';
  that.knifeInputStr = 'long=' + that.length + '&width=' + that.width + '&height=' + that.height + '&';
  if (!that.threeInputStr || !that.knifeInputStr) {
    that.threeInputStr = 'length=' + that.defaultLength + '&width=' + that.defaultWidth + '&height=' + that.defaultHeight + '&';
    that.knifeInputStr = 'long=' + that.defaultLength + '&width=' + that.defaultWidth + '&height=' + that.defaultHeight + '&';
  }

  if (that.folder == 'hardcover' || that.folder == 'hardcoverBook' || that.folder == 'hardcoverFence' || that.folder == 'hardcoverDrawer') {
    if (that.hardCoverAttr == 0) {
      that.threeInputStr = 'inside_long=' + that.length + '&inside_width=' + that.width + '&inside_height=' + that.height + '&';
      that.knifeInputStr = 'inside_long=' + that.length + '&inside_width=' + that.width + '&inside_height=' + that.height + '&';
    } else if (that.hardCoverAttr == 1) {
      that.threeInputStr = 'make_long=' + that.length + '&make_width=' + that.width + '&make_height=' + that.height + '&';
      that.knifeInputStr = 'make_long=' + that.length + '&make_width=' + that.width + '&make_height=' + that.height + '&';
    }
  } else if (that.folder == 'netopit') {
    let neto = 'long=0&width=0&height=0&';
    let make = 'make_long=0&make_width=0&make_height=0&';
    let entity = 'entity_long=0&entity_width=0&entity_height=0&';
    if (that.netopitAttr == 0) {
      that.threeInputStr = 'length=' + that.length + '&width=' + that.width + '&height=' + that.height + '&' + make + entity;
      that.knifeInputStr = 'long=' + that.length + '&width=' + that.width + '&height=' + that.height + '&' + make + entity;
    } else if (that.netopitAttr == 1) {
      that.threeInputStr = 'make_long=' + that.length + '&make_width=' + that.width + '&make_height=' + that.height + '&' + neto + entity;
      that.knifeInputStr = 'make_long=' + that.length + '&make_width=' + that.width + '&make_height=' + that.height + '&' + neto + entity;
    } else if (that.netopitAttr == 2) {
      that.threeInputStr = 'entity_long=' + that.length + '&entity_width=' + that.width + '&entity_height=' + that.height + '&' + 'entity_type=' + that.notepitEnityType + '&' + neto + make;
      that.knifeInputStr = 'entity_long=' + that.length + '&entity_width=' + that.width + '&entity_height=' + that.height + '&' + 'entity_type=' + that.notepitEnityType + '&' + neto + make;
    }
  } else if (that.folder == 'knifecard') {
    that.knifeInputStr = 'entity_long=' + that.length + '&entity_width=' + that.width + '&entity_height=' + that.height + '&';
  }
}
