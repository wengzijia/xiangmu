export default class myZRender {
  constructor(dom, zrender) {
    this.ZRender = zrender;
    this.ZR = zrender.init(dom);
    // console.log('this.ZR', this.ZR);
    this.Group = new zrender.Group();
    this.ZR.add(this.Group);
    this.activeRect = debounce(this.hoverRect, 100);
  }

  ZR;
  Group;
  ZRender;
  rects;
  rectIndex = '';
  defect;
  /**
   * 添加画好的元素
   * @param {*} el
   */
  add(el) {
    // console.log(99600, el);
    this.Group.add(el);
  }

  removes() {
    let _this = this;
    _this.Group.removeAll();
  }

  /**
   * 删除全部
   */
  removesAll() {
    let _this = this;
    _this.Group.removeAll();
  }
  /**
   * 画矩形
   * @param {*} obj
   * @returns
   */
  Rect(obj) {
    let el = new this.ZRender.Rect(obj);
    this.add(el);
    return el;
  }

  Text(obj) {
    let el = new this.ZRender.Text(obj);
    this.add(el);
    return el;
  }

  /**
   * 更新全部的矩形
   * @param {*} arr
   */
  updataRects(arr) {
    this.Group.eachChild((el, i) => {
      let x = arr[i].startX;
      let y = arr[i].startY;
      let width = arr[i].endX - x;
      let height = arr[i].endY - y;
      el.attr({
        shape: { x, y, width, height }
      });
    });
  }

  animateStart(el) {
    el.animate('style', true)
      .when(0, {
        stroke: '#ffff00'
      })
      .when(200, {
        stroke: '#ffff00'
      })
      .when(400, {
        stroke: '#ff0000'
      })
      .start();
  }

  animateStop(el) {
    el.stopAnimation();
  }

  animateStopAll() {
    let _this = this;
    _this.Group.eachChild((el, i) => {
      el.stopAnimation();
      el.attr({
        style: {
          stroke: '#f00'
        }
      });
    });
  }

  /**
   * 批量画矩形
   * @param {*} arr
   * @returns
   */
  renderRects(arr, scale) {
    let _this = this;
    // console.log('childCount', arr);
    let list = arr.map(e => {
      let x = e.startX * scale;
      let y = e.startY * scale;
      let width = e.endX * scale - x;
      let height = e.endY * scale - y;
      return _this.Rect({
        shape: { x, y, width, height },
        rectHover: true,
        style: {
          fill: null,
          lineWidth: 1,
          lineDash: [0, 0],
          stroke: '#f00',
          strokeNoScale: true
        },
        zlevel: 1
      });
    });
    _this.rects = list;
    return list;
  }
  /**
   * 鼠标移动触发事件
   * @param {}} e
   */
  hoverRect(e) {
    let _this = this;
    let rects = _this.rects;
    let boolRects = rects.map(s => {
      return s.rectContain(e.offsetX, e.offsetY);
    });
    let ind = boolRects.lastIndexOf(true);
    _this.Group.eachChild((el, i) => {
      if (ind === i) {
        _this.animateStart(el);
      } else {
        _this.animateStop(el);
        el.attr({
          style: {
            stroke: '#f00'
          }
        });
      }
    });
  }

  resize(obj) {
    this.ZR.resize(obj);
  }

  /**
   * 一次性闪烁全部矩形
   */
  activeRectAll() {
    //  console.log(' myZRender.rects', this.rects);
    this.Group.eachChild(el => {
      el.animate('style', false)
        .when(0, {
          stroke: '#ff0000'
        })
        .when(300, {
          stroke: '#ffff00'
        })
        .when(600, {
          stroke: '#ff0000'
        })
        .when(900, {
          stroke: '#ffff00'
        })
        .when(1200, {
          stroke: '#ff0000'
        })
        .start();
    });
  }

  /**
   * 给canvas添加类似内边距的效果，防止矩形绘制在边缘鼠标移出画布不停止动画
   */
  static canvasPadding = 10;
  /**
   *
   * @param {{arr:[{}],pdfVH:number,pdfVW:number,canvasWidth:number,keys:{}}} param
   *  arr=数据数组，pdfVH=pdf文件高度，pdfVW=pdf文件宽度，canvasWidth=canvas宽度，canvasHeight=canvas高度度，keys=arr数据内坐标对应的key，isRestrict=是否限制坐标位置不超出画布
   * @returns
   */
  static modifyArrData({ arr, pdfVH, pdfVW, canvasWidth, keys, canvasHeight, isRestrict }) {
    if (!keys) {
      keys = {
        startX: 'minX',
        endX: 'maxX',
        startY: 'maxY',
        endY: 'minY'
      };
    }
    const cp = myZRender.canvasPadding;
    const CW = canvasWidth - cp * 2;
    const CH = canvasHeight - cp * 2;
    const scale = CW / (pdfVW * (100 / 72)); //本身是72的dpi,后端转成100dpi所以要转换一下
    const coordinateY = pdfVH * (100 / 72); //Y轴坐标在左下角需要换算一下
    return arr
      .map(e => {
        let startX = e[keys.startX] * scale;
        let startY = (coordinateY - e[keys.startY]) * scale;
        let endX = e[keys.endX] * scale;
        let endY = (coordinateY - e[keys.endY]) * scale;
        if (isRestrict) {
          //限制坐标不能超出画布
          startX = startX < 0 ? 0 : startX;
          startY = startY < 0 ? 0 : startY;
          endX = endX > CW ? CW : endX;
          endY = endY > CH ? CH : endY;
        }
        if (cp) {
          startX = startX + cp;
          endY = endY + cp;
          startY = startY + cp;
          endX = endX + cp;
        }
        return {
          startX,
          endY,
          startY,
          endX
        };
      })
      .sort((a, b) => {
        return a.startX + a.startY - (b.startX + b.startY);
      });
  }
}

/**
 * 防抖函数
 * @param {f} fn
 * @param {*} wait
 * @returns
 */
export function debounce(fn, wait) {
  let timer,
    startTimeStamp = 0;
  let context, args;
  let run = timerInterval => {
    timer = setTimeout(() => {
      let now = new Date().getTime();
      let interval = now - startTimeStamp;
      if (interval < timerInterval) {
        startTimeStamp = now;
        run(wait - interval); // reset timer for left time
      } else {
        fn.apply(context, args);
        clearTimeout(timer);
        timer = null;
      }
    }, timerInterval);
  };
  //  console.log('timer',timer);
  return function() {
    // console.log('thisthisthis',this);
    context = this;
    args = arguments;
    let now = new Date().getTime();
    startTimeStamp = now;
    if (!timer) {
      // console.log('debounce set', wait);
      run(wait); // last timer alreay executed, set a new timer
    }
  };
}
