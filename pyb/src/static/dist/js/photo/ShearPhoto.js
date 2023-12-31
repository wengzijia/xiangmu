
window.ShearPhoto = function() {
          this.transform = this.DomMoveEve = this.DomUpEve = this.MoveDivEve = this.zoomEve = false;
          this.DivDownEVe = {};
          this.transformFun();
          !this.addevent && window.addEventListener ? (this.addevent = "add", this.selectionempty = function() {
                    window.getSelection().removeAllRanges();
          }) :(this.addevent = "att", this.selectionempty = function() {
                    document.selection.empty();
          });
          this.MyAjax = new ShearPhoto.MyAjax();
};

ShearPhoto.prototype = {
          transformFun:function() {
                    var Imgstyle = document.body.style;
                    var arr = new Array("MsTransform", "MozTransform", "WebkitTransform", "WebkitTransform", "OTransform", "transform");
                    for (var i = 0; i < arr.length; i++) {
                              if (arr[i] in Imgstyle) {
                                        this.transform = arr[i];
                                        break;
                              }
                    }
          },
          _ieexchange_:function() {
                    var this_ = this;
                    function e(a, b) {
                              var exchange = new Array(this_[a], this_[b]);
                              this_[a] = exchange[1];
                              this_[b] = exchange[0];
                    }
                    e("ImgWidth", "ImgHeight");
          },
          _exchange_:function() {
                    var this_ = this;
                    this._ieexchange_();
                    var IfRotate = Math.abs(this.rotate);
                    if (IfRotate === 90 || IfRotate === 270) {
                              this.ImgRotateFun = function(W, H) {
                                        this.ImgRotateL = (H - W) / 2;
                                        this.ImgRotateT = -this.ImgRotateL;
                                        return [ H, W ];
                              };
                              return function() {
                                        var L = (this_.ImgWidth - this_.ImgHeight) / 2;
                                        var T = -L;
                                        this_.ImgRotateL = L;
                                        this_.ImgRotateT = T;
                                        this_.arg.ImgMain.style.left = this_.ImgMainL + L + "px";
                                        this_.arg.ImgDom.style.left = this_.ImgDomL + L + "px";
                                        this_.arg.ImgMain.style.top = this_.ImgMainT + T + "px";
                                        this_.arg.ImgDom.style.top = this_.ImgDomT + T + "px";
                              };
                    } else {
                              this.ImgRotateFun = function(W, H) {
                                        return [ W, H ];
                              };
                              return function() {
                                        this_.ImgRotateL = 0;
                                        this_.ImgRotateT = 0;
                                        this_.arg.ImgMain.style.left = this_.ImgMainL + "px";
                                        this_.arg.ImgMain.style.top = this_.ImgMainT + "px";
                                        this_.arg.ImgDom.style.left = this_.ImgDomL + "px";
                                        this_.arg.ImgDom.style.top = this_.ImgDomT + "px";
                              };
                    }
          },
          Rotate:function(arg) {
                    if (this.transform) {
                              arg === "left" ? this.rotate -= 90 :this.rotate += 90;
                              (this.rotate == 360 || this.rotate == -360) && (this.rotate = 0);
                              this.arg.ImgMain.style[this.transform] = this.arg.ImgDom.style[this.transform] = "rotate(" + this.rotate + "deg)";
                              var fun = this._exchange_();
                              this.setinitial(this.arg);
                              fun();
                    } else {
                              arg === "left" ? this.rotate -= 1 :this.rotate += 1;
                              this.rotate = this.rotate > 3 ? 0 :this.rotate < 0 ? 3 :this.rotate;
                              if (this.rotate === 1 || this.rotate === 3) {
                                        this.ImgRotateFun = function(W, H) {
                                                  return [ H, W ];
                                        };
                              } else {
                                        this.ImgRotateFun = function(W, H) {
                                                  return [ W, H ];
                                        };
                              }
                              this.arg.ImgMain.style.filter = this.arg.ImgDom.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(rotation=" + this.rotate + ")";
                              this._ieexchange_();
                              this.setinitial(this.arg);
                    }
          },
          pointhandle:function(residencetime, speed, txt, Position, backgroundColor, color) {
                    var point = this.arg.scope.children[0];
                    point.className === "point" && this.arg.scope.removeChild(point);
                    point = document.createElement("div");
                    point.className = "point";
                    this.arg.scope.insertBefore(point, this.arg.scope.childNodes[0]);
                    var this_ = this;
                    var num = -35;
                    function show(begin, end, speed, cmd) {
                              begin += cmd;
                              if (begin > end && 0 < cmd) {
                                        point.style.top = end + "px";
                                        if (residencetime) {
                                                  setTimeout(function() {
                                                            show(end, num, speed, -1);
                                                  }, residencetime);
                                        }
                                        return;
                              } else {
                                        if (end > begin && 0 > cmd) {
                                                  try {
                                                            this_.arg.scope.removeChild(point);
                                                  } catch (e) {}
                                                  return;
                                        }
                              }
                              point.style.top = begin + "px";
                              setTimeout(function() {
                                        show(begin, end, speed, cmd);
                              }, speed);
                    }
                    point.style.color = color;
                    point.style.backgroundColor = backgroundColor;
                    point.innerHTML = "<i></i>" + txt;
                    var pointI = point.getElementsByTagName("i")[0];
                    switch (Position) {
                         case 0:
                              pointI.style.backgroundPosition = "-16px 0px";
                              break;

                         case 1:
                              pointI.style.backgroundPosition = "0 0";
                              break;

                         case 2:
                              pointI.style.backgroundPosition = "-31px 0px";
                              break;
                    }
                    show(num, 0, speed, 1);
          },
          setinitial:function(arg) {
                    if (this.BoxW > this.ImgWidth) {
                              this.relatW = this.ImgWidth;
                              arg.relat.style.width = this.ImgWidth + "px";
                              var BiW = (this.BoxW - this.ImgWidth) / 2;
                              this.relatL = BiW;
                              arg.relat.style.left = BiW + "px";
                              arg.black.style.left = -BiW + "px";
                    } else {
                              arg.relat.style.width = this.BoxW + "px";
                              this.relatW = this.BoxW;
                              arg.relat.style.left = this.relatL = 0;
                              arg.black.style.left = 0;
                    }
                    if (this.BoxH > this.ImgHeight) {
                              this.relatH = this.ImgHeight;
                              arg.relat.style.height = this.ImgHeight + "px";
                              var BiH = (this.BoxH - this.ImgHeight) / 2;
                              this.relatT = BiH;
                              arg.relat.style.top = BiH + "px";
                              arg.black.style.top = -BiH + "px";
                    } else {
                              this.relatH = this.BoxH;
                              arg.relat.style.height = this.BoxH + "px";
                              arg.relat.style.top = arg.black.style.top = this.relatT = 0;
                    }
                    this.AmendOffset();
                    this.MovePhoto();
          },
          MovePhoto:function() {
                    var ImgDom = this.arg.ImgDom, ImgMain = this.arg.ImgMain, also, scale, ImgMainL, ImgMainT, ImgDomL, ImgDomT;
                    if (this.BoxW < this.ImgWidth) {
                              var MinusImgWBoxW = this.ImgWidth - this.BoxW;
                              also = this.BoxW - this.formAllW;
                              scale = also && MinusImgWBoxW / also;
                              var L = -this.formLeft * scale;
                              ImgMainL = L;
                              ImgDomL = L - this.formLeft - this.Border;
                    } else {
                              ImgMainL = 0;
                              ImgDomL = -this.formLeft - this.Border;
                    }
                    if (this.BoxH < this.ImgHeight) {
                              var MinusImgHBoxH = this.ImgHeight - this.BoxH;
                              also = this.BoxH - this.formAllH;
                              scale = also && MinusImgHBoxH / also;
                              var T = -this.formTop * scale;
                              ImgMainT = T;
                              ImgDomT = T - this.formTop - this.Border;
                    } else {
                              ImgMainT = 0;
                              ImgDomT = -this.formTop - this.Border;
                    }
                    isNaN(ImgMainT) || (ImgMain.style.top = ImgMainT + this.ImgRotateT + "px", this.ImgMainT = ImgMainT), 
                    isNaN(ImgDomT) || (ImgDom.style.top = ImgDomT + this.ImgRotateT + "px", this.ImgDomT = ImgDomT), 
                    isNaN(ImgMainL) || (ImgMain.style.left = ImgMainL + this.ImgRotateL + "px", this.ImgMainL = ImgMainL), 
                    isNaN(ImgDomL) || (ImgDom.style.left = ImgDomL + this.ImgRotateL + "px", this.ImgDomL = ImgDomL);
          },
          AmendOffset:function() {
                    typeof this.formLeft === "boolean" && (this.formLeft = parseFloat(this.formParent.style.left) || 0);
                    typeof this.formTop === "boolean" && (this.formTop = parseFloat(this.formParent.style.top) || 0);
                    if (this.saveL) {
                              this.formLeft = this.saveL - this.relatL;
                              this.formTop = this.saveT - this.relatT;
                    } else {
                              this.formLeft -= this.relatL;
                              this.formTop -= this.relatT;
                    }
                    this.formLeft < 0 && (this.formLeft = 0, this.saveL = this.relatL);
                    this.formTop < 0 && (this.formTop = 0, this.saveT = this.relatT);
                    this.formParent.style.left = this.formLeft + "px";
                    this.formParent.style.top = this.formTop + "px";
                    var formWL = this.formLeft + this.formAllW;
                    var formHT = this.formTop + this.formAllH;
                    if (formWL > this.relatW) {
                              var FrL = formWL - this.relatW;
                              if (FrL > this.formLeft) {
                                        this.formParent.style.left = 0;
                                        this.formW = this.formW - (FrL - this.formLeft);
                                        this.formLeft = 0;
                                        this.formParent.style.left = 0;
                                        this.saveL = this.relatL;
                                        this.formAllW = this.formW + this.Mdouble;
                              } else {
                                        this.formLeft -= FrL;
                                        this.formParent.style.left = this.formLeft + "px";
                                        this.saveL = this.formLeft + this.relatL;
                              }
                    }
                    if (formHT > this.relatH) {
                              var FrT = formHT - this.relatH;
                              if (FrT > this.formTop) {
                                        this.formH = this.formH - (FrT - this.formTop);
                                        this.formTop = 0;
                                        this.saveT = this.relatT;
                                        this.formParent.style.top = 0;
                                        this.formAllH = this.formH + this.Mdouble;
                              } else {
                                        this.formTop = this.formTop - FrT;
                                        this.formParent.style.top = this.formTop + "px";
                                        this.saveT = this.formTop + this.relatT;
                              }
                    }
                    if (this.arg.proportional[0]) {
                              var H = this.formAllW / this.arg.proportional[0];
                              if (H > this.formAllH) {
                                        this.formAllW = this.formAllH * this.arg.proportional[0];
                                        this.formW = this.formAllW - this.Mdouble;
                              } else {
                                        this.formAllH = H;
                                        this.formH = H - this.Mdouble;
                              }
                    }
                    this.arg.form.style.width = this.formW + "px";
                    this.arg.form.style.height = this.formH + "px";
          },
          MaxMinLimit:function(this_) {
                    this_.ImgWidth = this_.ImgOWidth = this.width;
                    this_.ImgHeight = this_.ImgOHeight = this.height;
                    if (this_.arg.Max && typeof this_.arg.Max === "number") {
                              this_.ImgWidth > this_.arg.Max && (this_.ImgWidth = this_.arg.Max, this_.ImgHeight = this_.ImgWidth / this_.ImgScales);
                              this_.ImgHeight > this_.arg.Max && (this_.ImgHeight = this_.arg.Max, this_.ImgWidth = this_.ImgHeight * this_.ImgScales);
                    }
                    var MH, MW;
                    if (this_.arg.proportional[0]) {
                              MH = this_.Min;
                              MW = MH * this_.arg.proportional[0];
                              if (MW < this_.Min) {
                                        MW = this_.Min;
                                        MH = MW / this_.arg.proportional[0];
                              }
                    } else {
                              MW = MH = this_.Min;
                    }
                    this_.ImgWidth < MW && (this_.ImgWidth = MW, this_.ImgHeight = this_.ImgWidth / this_.ImgScales);
                    this_.ImgHeight < MH && (this_.ImgHeight = MH, this_.ImgWidth = this_.ImgHeight * this_.ImgScales);
                    this_.artworkW = this_.ImgWidth, this_.artworkH = this_.ImgHeight;
          },
          run:function(ImgUrl) {
                    var this_ = this, arg = this.arg;
                    this.pointhandle(0, 10, "图片已加载，正在创建截图环境，请稍等.......", 2, "#fbeb61", "#3a414c");
                    var image = new Image();
                    this.defaultShear();
                    this.arg = arg;
                    image.onload = function() {
                              if (!this.width > 0 || !this.height > 0) {
                                        this_.pointhandle(3e3, 10, "请选择正确图片", 0, "#f82373", "#fff");
                                        return;
                              }
                              arg.ImgMain.src = arg.ImgDom.src = ImgUrl;
                              this_.pointhandle(3e3, 10, "可以拖动或拉伸蓝边框进行截图", 1, "#fbeb61", "#3a414c");
                              arg.Shearbar.style.display = "block";
                              arg.SelectBox.style.visibility = "hidden";
                              arg.black.style.zIndex = 99;
                              this_.ImgScales = this.width / this.height;
                              this_.Min = arg.Min;
                              this_.MaxMinLimit.call(this, this_);
                              arg.ImgMain.style.width = arg.ImgDom.style.width = this_.artworkW + "px", arg.ImgMain.style.height = arg.ImgDom.style.height = this_.artworkH + "px";
                              this_.BoxW = arg.scope.offsetWidth - 2;
                              this_.BoxH = arg.scope.offsetHeight - 2;
                              this_.Border = arg.Border;
                              this_.Mdouble = arg.Border * 2;
                              arg.form.style.border = arg.Border + "px" + "  " + arg.BorderStyle + "  " + arg.BorderColor;
                              var W, H;
                              if (arg.proportional[0]) {
                                        W = arg.proportional[1] - this_.Mdouble;
                                        H = arg.proportional[1] / arg.proportional[0] - this_.Mdouble;
                              } else {
                                        W = arg.proportional[1] - this_.Mdouble;
                                        H = arg.proportional[2] - this_.Mdouble;
                              }
                              this_.formW = W;
                              this_.formH = H;
                              this_.formAllW = W + this_.Mdouble;
                              this_.formAllH = H + this_.Mdouble;
                              arg.form.style.width = W + "px", arg.form.style.height = H + "px";
                              this_.formParent = arg.form.offsetParent;
                              this_.et();
                              this_.setinitial(arg);
                              var str = this_.MoveDiv = new ShearPhoto.MoveDiv();
                              str.reckon(arg.relat, false);
                              str.selectionempty = this_.selectionempty;
                              str.addevent = this_.addevent;
                              str.run({
                                        to:new Array(arg.form),
                                        form:this_.formParent,
                                        MoveWidth:this_.relatW,
                                        MoveHeight:this_.relatH,
                                        shifting:new Array(),
                                        center:1,
                                        centerFront:function() {
                                                  return [ this_.relatW, this_.relatH ];
                                        },
                                        DivDownFun:function(t) {
                                                  t.arg.MoveWidth = this_.relatW;
                                                  t.arg.MoveHeight = this_.relatH;
                                                  t.DivW = this_.formW + this_.Mdouble;
                                                  t.DivH = this_.formH + this_.Mdouble;
                                        },
                                        centerfun:function(l, t, tt) {
                                                  this_.formLeft = l;
                                                  this_.formTop = t;
                                                  this_.MovePhoto();
                                                  tt.arg.MoveWidth = this_.relatW;
                                                  tt.arg.MoveHeight = this_.relatH;
                                                  tt.DivW = this_.formW + this_.Mdouble;
                                                  tt.DivH = this_.formH + this_.Mdouble;
                                        },
                                        zIndex:100,
                                        MoveFun:function(iL, iT, MoveScale) {
                                                  this_.formLeft = iL;
                                                  this_.formTop = iT;
                                                  this_.MovePhoto();
                                        }
                              });
                              this_.MoveDivEve = function() {
                                        str.delDownEve();
                              };
                              this_.zoom();
                    };
                    image.onerror = function() {
                              this_.pointhandle(0, 10, "无法读取图片", 0, "#f82373", "#fff");
                    };
                    image.src = this.ImgUrl = ImgUrl;
          },
          config:function(arg) {
                    this.arg = arg;
                    arg.scope.style.width = arg.black.style.width = arg.SelectBox.style.width = arg.scopeWidth + "px";
                    arg.scope.style.height = arg.black.style.height = arg.SelectBox.style.height = arg.scopeHeight + "px";
                    this.pointhandle(3e3, 10, "请选择本地照片或相册，进行截取头像", 2, "#307ff6", "#fff");
                    arg.scope.ondragstart = function() {
                              return false;
                    };
          },
          zoom:function() {
                    var this_ = this;
                    var zoom = new ShearPhoto.MoveDiv();
                    zoom.reckon(this_.arg.ZoomDist, false);
                    zoom.selectionempty = this_.selectionempty;
                    zoom.addevent = this_.addevent;
                    var Draggable = this_.arg.ZoomBar;
                    var MH, MW;
                    if (this_.arg.proportional[0]) {
                              MH = this_.Min;
                              MW = MH * this_.arg.proportional[0];
                              if (MW < this_.Min) {
                                        MW = this_.Min;
                                        MH = MW / this_.arg.proportional[0];
                              }
                    } else {
                              MW = MH = this_.Min;
                    }
                    zoom.run({
                              to:new Array(Draggable),
                              form:Draggable,
                              MoveWidth:zoom.ReckonWH.W,
                              MoveHeight:zoom.ReckonWH.H,
                              shifting:new Array(),
                              center:1,
                              zIndex:100,
                              DivDownFun:function() {
                                        this_.saveL = this_.formLeft + this_.relatL;
                                        this_.saveT = this_.formTop + this_.relatT;
                              },
                              cursor:"pointer",
                              MoveFun:function(L) {
                                        var schedule;
                                        if (L < bisect) schedule = Math.round(Zoomout * L + 10) / 100; else schedule = Math.round(L * magnify - 100) / 100;
                                        var W = this_.artworkW * schedule;
                                        var H = this_.artworkH * schedule;
                                        W < MW && (W = MW, H = W / this_.ImgScales);
                                        H < MH && (H = MH, W = H * this_.ImgScales);
                                        var IMGWH = this_.ImgRotateFun(W, H) || [ W, H ];
                                        this_.ImgWidth = IMGWH[0];
                                        this_.ImgHeight = IMGWH[1];
                                        this_.arg.ImgMain.style.width = this_.arg.ImgDom.style.width = W + "px";
                                        this_.arg.ImgMain.style.height = this_.arg.ImgDom.style.height = H + "px";
                                        this_.setinitial(this_.arg);
                              }
                    });
                    this_.zoomEve = function() {
                              zoom.delDownEve();
                    };
                    var zoomMAx = zoom.ReckonWH.W - zoom.DivW;
                    var bisect = zoomMAx / 2;
                    var magnify = 200 / bisect;
                    var Zoomout = 90 / bisect;
          },
          PointerShape:function(Shape) {
                    this.arg.scope.style.cursor = this.arg.form.style.cursor = Shape;
          },
          DelPointerShape:function() {
                    this.arg.scope.style.cursor = "";
                    this.arg.form.style.cursor = "move";
          },
          et:function() {
                    for (var a in this.arg.to) {
                              if (this.addevent === "add") {
                                        if (typeof this.DivDownEVe[a] !== "function") {
                                                  this.DivDownEVe[a] = this.DivDown(a);
                                        } else {
                                                  this.delEvent(this.arg.to[a], "mousedown", this.DivDownEVe[a]);
                                        }
                                        this.addEvent(this.arg.to[a], "mousedown", this.DivDownEVe[a]);
                              } else {
                                        this.arg.to[a].onmousedown = this.DivDown(a);
                              }
                    }
          },
          addEvent:function(obj, evetype, fun) {
                    var addevent = {
                              add:function() {
                                        obj.addEventListener(evetype, fun, false);
                              },
                              att:function() {
                                        obj.attachEvent("on" + evetype, fun);
                              }
                    };
                    addevent[this.addevent] && addevent[this.addevent]();
          },
          delEvent:function(obj, evetype, fun) {
                    var delevent = {
                              add:function() {
                                        obj.removeEventListener(evetype, fun, false);
                              },
                              att:function() {
                                        obj.detachEvent("on" + evetype, fun);
                              }
                    };
                    delevent[this.addevent] && delevent[this.addevent]();
          },
          DomUp:function(dom) {
                    var this_ = this;
                    return function() {
                              typeof this_.arg.UpFun === "function" && this_.arg.UpFun();
                              dom.releaseCapture && dom.releaseCapture();
                              this_.DelPointerShape();
                              typeof this_.DomMoveEve === "function" && this_.delEvent(document, "mousemove", this_.DomMoveEve);
                              if (typeof this_.DomUpEve === "function") {
                                        this_.delEvent(document, "mouseup", this_.DomUpEve);
                                        this_.delEvent(window, "mouseup", this_.DomUpEve);
                                        this_.delEvent(window, "blur", this_.DomUpEve);
                                        this_.delEvent(dom, "losecapture", this_.DomUpEve);
                              }
                              return false;
                    };
          },
          setWHfalse:function(argform, iW, iH, proportional, MaxW, MaxH) {
                    iW > MaxW && (iW = MaxW);
                    iH > MaxH && (iH = MaxH);
                    iW < this.Min && (iW = this.Min);
                    iH < this.Min && (iH = this.Min);
                    return [ iW, iH ];
          },
          setWfalse:function(argform, iW, iH, proportional, MaxW, MaxH) {
                    iW > MaxW && (iW = MaxW);
                    iW < this.Min && (iW = this.Min);
                    return [ iW, this.formAllH ];
          },
          setHfalse:function(argform, iW, iH, proportional, MaxW, MaxH) {
                    iH > MaxH && (iH = MaxH);
                    iH < this.Min && (iH = this.Min);
                    return [ this.formAllW, iH ];
          },
          CycleCalculation:function(iW, iH, proportional, MaxW, MaxH) {
                    if (iH > MaxH) {
                              iH = MaxH;
                              iW = iH * proportional;
                              return this.CycleCalculation(iW, iH, proportional, MaxW, MaxH);
                    }
                    if (iW > MaxW) {
                              iW = MaxW;
                              iH = iW / proportional;
                              return this.CycleCalculation(iW, iH, proportional, MaxW, MaxH);
                    }
                    if (iH < this.Min) {
                              iH = this.Min;
                              iW = iH * proportional;
                              return this.CycleCalculation(iW, iH, proportional, MaxW, MaxH);
                    }
                    if (iW < this.Min) {
                              iW = this.Min;
                              iH = iW / proportional;
                              return this.CycleCalculation(iW, iH, proportional, MaxW, MaxH);
                    }
                    return [ iW, iH ];
          },
          setHtrue:function(argform, iW, iH, proportional, MaxW, MaxH) {
                    iW = iH * proportional;
                    return this.CycleCalculation(iW, iH, proportional, MaxW, MaxH);
          },
          setWtrue:function(argform, iW, iH, proportional, MaxW, MaxH) {
                    iH = iW / proportional;
                    return this.CycleCalculation(iW, iH, proportional, MaxW, MaxH);
          },
          amend:function(iW, iH, formParent, strLL, strTT) {
                    var L = iW - this.formAllW, T = iH - this.formAllH, Left, Top, ImgLeft, ImgTop, this_ = this;
                    var fun = {
                              LL:function() {
                                        Left = this_.formLeft - L;
                                        this_.formLeft = Left;
                                        formParent.style.left = Left + "px";
                              },
                              TT:function() {
                                        Top = this_.formTop - T;
                                        this_.formTop = Top;
                                        formParent.style.top = Top + "px";
                              },
                              ML:function() {
                                        L = L / 2;
                                        this.LL();
                              },
                              MT:function() {
                                        T = T / 2;
                                        this.TT();
                              },
                              NO:function() {}
                    };
                    fun[strLL](), fun[strTT]();
          },
          DomMove:function(this_, dom, disX, disY, PNW, PNH, formParent, MaxW, MaxH, strLL, strTT) {
                    var eveclientX, eveclientY, drawWH, iW, iH, argform, iHH, iWW, ImgMain = this_.arg.ImgMain, ImgDom = this_.arg.ImgDom;
                    if (typeof this_.DomUpEve === "function") {
                              this_.delEvent(document, "mouseup", this_.DomUpEve);
                              this_.delEvent(window, "mouseup", this_.DomUpEve);
                              this_.delEvent(window, "blur", this_.DomUpEve);
                              this_.delEvent(dom, "losecapture", this_.DomUpEve);
                    }
                    this_.DomUpEve = this_.DomUp(dom);
                    this_.addEvent(document, "mouseup", this_.DomUpEve);
                    this_.addEvent(window, "mouseup", this_.DomUpEve);
                    this_.addEvent(window, "blur", this_.DomUpEve);
                    this_.addEvent(dom, "losecapture", this_.DomUpEve);
                    return function(eve) {
                              eve = eve || window.event;
                              if (eve.button > 1) {
                                        this_.DomUp(this)();
                                        return false;
                              }
                              eveclientX = eve.clientX, eveclientY = eve.clientY, argform = this_.arg.form;
                              setTimeout(function() {
                                        iW = PNW * (eveclientX - disX);
                                        iH = PNH * (eveclientY - disY);
                                        this_.selectionempty();
                                        drawWH = this_.drawfun(argform, iW, iH, this_.arg.proportional[0], MaxW, MaxH);
                                        iW = drawWH[0];
                                        iH = drawWH[1];
                                        this_.amend(iW, iH, formParent, strLL, strTT);
                                        this_.formAllW = iW;
                                        this_.formAllH = iH;
                                        iW = this_.formW = iW - this_.Mdouble;
                                        iH = this_.formH = iH - this_.Mdouble;
                                        argform.style.width = iW + "px";
                                        argform.style.height = iH + "px";
                                        this_.MovePhoto();
                              }, 1);
                              return false;
                    };
          },
          defaultShear:function() {
                    this.arg.Shearbar.style.display = "none";
                    typeof this.MoveDivEve === "function" && this.MoveDivEve();
                    typeof this.zoomEve === "function" && this.zoomEve();
                    this.arg.ImgMain.style.filter = this.arg.ImgDom.style.filter = this.arg.ImgDom.style[this.transform] = this.arg.ImgMain.style[this.transform] = "";
                    this.arg = this.ImgUrl = this.formW = this.formH = this.formAllW = this.formAllH = this.drawfun = this.formParent = this.ImgWidth = this.ImgHeight = this.artworkW = this.artworkH = this.BoxW = this.BoxH = this.Border = this.Mdouble = this.ImgScales = this.Min = this.formLeft = this.formTop = this.relatL = this.relatT = this.relatW = this.relatH = this.saveL = this.ImgOWidth = this.ImgOHeight = this.saveT = false;
                    this.rotate = this.ImgMainT = this.ImgDomT = this.ImgMainL = this.ImgDomL = this.ImgRotateL = this.ImgRotateT = 0;
                    this.ImgRotateFun = function(W, H) {
                              return [ W, H ];
                    };
          },
          SendUserMsg:function(msg, n, p, b, c, i, k) {
                    this.arg.black.style.zIndex = i ? 199 :99;
                    this.pointhandle(n, 10, msg, p, b, c);
                    k ? this.arg.Shearbar.style.display = "none" :this.arg.Shearbar.style.display = "block";
          },
          again:function() {
                    this.arg.SelectBox.style.visibility = "visible";
                    this.arg.Shearbar.style.display = "none";
                    this.arg.ImgDom.src = this.arg.ImgMain.src = "images/default.png";
          },
          complete:function(serverdata) {
                    var point = this.arg.scope.childNodes[0];
                    point.className === "point" && this.arg.scope.removeChild(point);
                    var complete = document.createElement("div");
                    complete.className = "complete";
                    complete.style.height = this.arg.scopeHeight + "px";
                    this.arg.scope.insertBefore(complete, this.arg.scope.childNodes[0]);
                    var AllImgSrc = "";
                    var length = serverdata.length;
                    for (var i = 0; i < length; i++) {
						if (serverdata[i]["ImgUrl"] != '') {
							AllImgSrc += '<img src="/' + serverdata[i]["ImgUrl"] + '"/>';
							document.getElementById('fileurlo').value = serverdata[i]["file"];
						}
						if (serverdata[0]["ImgUrl"]) {
							document.getElementById('newpic').value = serverdata[0]["ImgUrl"];
						}
					}
					savepic();
                    complete.innerHTML = AllImgSrc + '<div class="completeTxt"><strong><i></i>保存成功</strong> <p>以上是你图片的' + length + '种尺寸</p><a href="javascript:;" id="completeA">完成</a></div>';
                    var completeA = document.getElementById("completeA");
                    var this_ = this;
                    completeA.onclick || (completeA.onclick = function() {
							window.location.href = "/index.php/designer/user/base.html";
                              //completeA.onclick = null;
                              //this_.arg.scope.removeChild(complete);
                              //this_.again();
                              //this_.pointhandle(3e3, 10, "截图完成！已返回！", 2, "#fbeb61", "#3a414c");
                    });
          },
          SendPHP:function() {
                    var SendPHPSmaller = function(W, H, P) {
                              if (W < 1) {
                                        W = 1;
                                        H = 1 / P;
                              }
                              if (H < 1) {
                                        H = 1;
                                        W = P;
                              }
                              return [ W, H ];
                    };
                    var this_ = this;
                    this.SendUserMsg("正在为你处理截图，稍等...", 0, 2, "#fbeb61", "#3a414c", true, true);
                    var SendArry = {};
                    //SendArry.url = "../" + this.ImgUrl;
                    SendArry.url = this.ImgUrl;
                    var R = {
                              1:90,
                              2:180,
                              3:270,
                              "-90":270,
                              "-180":180,
                              "-270":90
                    }[this.rotate] || (R = this.rotate);
                    var LT = this.ImgWidth;
                    var TL = this.ImgHeight;
                    var XYWH = {
                              0:LT,
                              90:TL,
                              180:LT,
                              270:TL
                    };
                    var XYWHP = this.ImgOWidth / XYWH[R];
                    SendArry.R = -R;
                    SendArry.X = Math.floor((Math.abs(this.ImgDomL) - this.Border) * XYWHP);
                    SendArry.Y = Math.floor((Math.abs(this.ImgDomT) - this.Border) * XYWHP);
                    SendArry.P = this.arg.proportional[0];
                    var P = this.formAllW / this.formAllH;
                    var Smaller = SendPHPSmaller(this.formAllW * XYWHP, this.formAllH * XYWHP, P);
                    SendArry.IW = Smaller[0];
                    SendArry.IH = Smaller[1];
                    Smaller = SendPHPSmaller(this.formAllW, this.formAllH, P);
                    SendArry.FW = Smaller[0];
                    SendArry.FH = Smaller[1];
                    this.MyAjax.carry({
                              url:this_.arg.url,
                              data:"JSdate=" + ShearPhoto.JsonString.JsonToString(SendArry),
                              type:"POST",
                              timeout:1e4,
                              async:true,
                              lock:true,
                              complete:false,
                              success:function(serverdata) {
                                        serverdata = ShearPhoto.JsonString.StringToJson(serverdata);
                                        if (serverdata === false) {
                                                  this_.SendUserMsg("错误:请保证在后端环境运行正常", 5e3, 0, "#f4102b", "#fff", false);
                                                  return;
                                        }
                                        if (serverdata["erro"]) {
                                                  this_.SendUserMsg("错误:" + serverdata["erro"], 5e3, 0, "#f4102b", "#fff", false);
                                                  return;
                                        }
                                        this_.complete(serverdata);
                              },
                              error:function(ErroMsg) {
                                        if (serverdata === false) this_.SendUserMsg("错误:连接后端失败，可能原因，超时！或者后端环境无法运行", 5e3, 0, "#f4102b", "#fff", false);
                              },
                              cache:false
                    });
          },
          DivDown:function(a) {
                    var this_ = this, PNW = 1, PNH = 1, strLL = "NO", strTT = "NO", MaxW, MaxH, W, H, formParentoffsetLeft, formParent, formParentoffsetTop;
                    return function(event) {
                              event = event || window.event;
                              if (event.button < 2) {
                                        W = this_.formAllW, H = this_.formAllH, formParent = this_.formParent, formParentoffsetLeft = this_.formLeft, 
                                        formParentoffsetTop = this_.formTop;
                                        switch (a) {
                                             case "BottomRight":
                                                  MaxW = this_.relatW - formParentoffsetLeft, MaxH = this_.relatH - formParentoffsetTop;
                                                  this_.arg.proportional[0] ? this_.drawfun = this_.setHtrue :this_.drawfun = this_.setWHfalse;
                                                  this_.PointerShape("nw-resize");
                                                  break;

                                             case "TopRight":
                                                  PNH = -1;
                                                  strTT = "TT";
                                                  MaxW = this_.relatW - formParentoffsetLeft, MaxH = formParentoffsetTop + this_.formAllH;
                                                  this_.arg.proportional[0] ? this_.drawfun = this_.setHtrue :this_.drawfun = this_.setWHfalse;
                                                  this_.PointerShape("ne-resize");
                                                  break;

                                             case "Bottomleft":
                                                  PNW = -1;
                                                  strLL = "LL";
                                                  MaxW = formParentoffsetLeft + this_.formAllW;
                                                  MaxH = this_.relatH - formParentoffsetTop;
                                                  this_.arg.proportional[0] ? this_.drawfun = this_.setHtrue :this_.drawfun = this_.setWHfalse;
                                                  this_.PointerShape("ne-resize");
                                                  break;

                                             case "Topleft":
                                                  PNH = PNW = -1;
                                                  strLL = "LL";
                                                  strTT = "TT";
                                                  MaxW = formParentoffsetLeft + this_.formAllW;
                                                  MaxH = formParentoffsetTop + this_.formAllH;
                                                  this_.arg.proportional[0] ? this_.drawfun = this_.setHtrue :this_.drawfun = this_.setWHfalse;
                                                  this_.PointerShape("nw-resize");
                                                  break;

                                             case "Topmiddle":
                                                  strLL = "ML";
                                                  var MaxWA = formParentoffsetLeft, MaxWB = this_.relatW - MaxWA - this_.formAllW;
                                                  MaxW = Math.min(MaxWA, MaxWB) * 2 + this_.formAllW;
                                                  strTT = "TT";
                                                  MaxH = formParentoffsetTop + this_.formAllH;
                                                  PNH = -1;
                                                  this_.arg.proportional[0] ? this_.drawfun = this_.setHtrue :this_.drawfun = this_.setHfalse;
                                                  this_.PointerShape("n-resize");
                                                  break;

                                             case "leftmiddle":
                                                  PNH = PNW = -1;
                                                  MaxW = formParentoffsetLeft + this_.formAllW;
                                                  var MaxHA = formParentoffsetTop, MaxHB = this_.relatH - MaxHA - this_.formAllH;
                                                  MaxH = Math.min(MaxHA, MaxHB) * 2 + this_.formAllH;
                                                  strTT = "MT";
                                                  strLL = "LL";
                                                  this_.arg.proportional[0] ? this_.drawfun = this_.setWtrue :this_.drawfun = this_.setWfalse;
                                                  this_.PointerShape("e-resize");
                                                  break;

                                             case "Rightmiddle":
                                                  MaxW = this_.relatW - formParentoffsetLeft;
                                                  var MaxHA = formParentoffsetTop, MaxHB = this_.relatH - MaxHA - this_.formAllH;
                                                  MaxH = Math.min(MaxHA, MaxHB) * 2 + this_.formAllH;
                                                  strTT = "MT";
                                                  this_.arg.proportional[0] ? this_.drawfun = this_.setWtrue :this_.drawfun = this_.setWfalse;
                                                  this_.PointerShape("e-resize");
                                                  break;

                                             case "Bottommiddle":
                                                  var MaxWA = formParentoffsetLeft, MaxWB = this_.relatW - MaxWA - this_.formAllW;
                                                  MaxW = Math.min(MaxWA, MaxWB) * 2 + this_.formAllW;
                                                  MaxH = this_.relatH - formParentoffsetTop;
                                                  this_.arg.proportional[0] ? this_.drawfun = this_.setHtrue :this_.drawfun = this_.setHfalse;
                                                  strLL = "ML";
                                                  this_.PointerShape("n-resize");
                                                  break;

                                             default:
                                                  break;
                                        }
                                        var disX = event.clientX - PNW * W;
                                        var disY = event.clientY - PNH * H;
                                        this.setCapture && this.setCapture();
                                        typeof this_.DomMoveEve === "function" && this_.delEvent(document, "mousemove", this_.DomMoveEve);
                                        this_.DomMoveEve = this_.DomMove(this_, this, disX, disY, PNW, PNH, formParent, MaxW, MaxH, strLL, strTT);
                                        this_.addEvent(document, "mousemove", this_.DomMoveEve);
                              } else {
                                        this_.DomUp(this)();
                              }
                              return false;
                    };
          }
};

ShearPhoto.MINGGE = function(a) {
          function b() {
                    try {
                              document.documentElement.doScroll("left");
                    } catch (c) {
                              return setTimeout(b, 13), void 0;
                    }
                    a();
          }
          "function" == typeof a && (document.addEventListener ? document.addEventListener("DOMContentLoaded", a, !1) :window.attachEvent ? b() :alert("MINGGE  ERRO"));
};