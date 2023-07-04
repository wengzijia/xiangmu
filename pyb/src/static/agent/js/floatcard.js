var TQKF = {
    version: "20100501",
    date: "2016-5-11",
    open_win_w: 800,
    open_win_h: 580,
    userDefined: {
        openWinType: 1
    }
};
TQ_RQF = "-1";
TQ_RQC = "-1";
TQKF.webchat_url2 = "http://www.yin.com/index.php/index/cart/paydone.html";
TQKF.CreatURL = function(url, order_no, paytype, reurl) {

    var str = "?";
    if (url.indexOf("?") != -1) str = "&";
    var tracq_url = url + str + "order_no=" + order_no + "&paytype="+paytype;
    return tracq_url
};
TQKF.OpenWindow = function(url, cid) {
    if (TQKF.userDefined.openWinType == 1) {
        if (url.indexOf("leavemsg") != -1 && tq_isFullScreenLeavmsg) window.open(url);
        else {
            window.open(url, "tq_webchat", "width=" + this.open_win_w + ",height=" + this.open_win_h + ",location=no,resizable=1,scrollbars=0,status=no,toolbar=no,menu=no,top=100,left=200")
        }
    } else {
        var link = document.createElement('A');
        link.href = url;
        link.innerHTML = "_";
        link.target = '_blank';
        TQUtils.AppendDOM(link);
        var callClick = function(element) {
            if (element.click) {
                element.click()
            } else if (element.fireEvent) {
                element.fireEvent('onclick')
            } else if (document.createEvent) {
                var evt = document.createEvent("MouseEvents");
                evt.initEvent("click", true, true);
                element.dispatchEvent(evt)
            }
        };
        callClick(link);
        link.parentNode.removeChild(link)
    }
};
TQKF.Binding = function(target, type, uin, tactic_code, is_hide_ui, ui) {
    if (typeof target == 'string') target = TQUtils.GetObj(target);
    if (target) {
    	TQKF.OpenWindow(TQKF.CreatURL(type == "leavemsg" ? TQKF.leavemsg_url: TQKF.webchat_url2, type, uin, tactic_code ? tactic_code: tq_tactic_id, "unknown"), uin);
        if (is_hide_ui) {
            if (typeof ui == 'string') ui = TQUtils.GetObj(ui);
            ui && (ui.style.display = "none")
        }
    }
};

var TQUtils = {
    tq_fixJQueryMouseMoveEvent: null,
    browserType: navigator.userAgent.toLowerCase(),
    isDOM: (document.getElementById ? true: false),
    isNS4: (document.layers ? true: false),
    isNS: navigator.appName == "Netscape",
    IE: ((navigator.appName.toLowerCase() == "microsoft internet explorer") && (parseInt(navigator.appVersion) >= 4)),
    Chrome: navigator.userAgent.toLowerCase().indexOf("chrome") != -1,
    NS: (document.layers) ? 1 : 0,
    isIE4: document.all && !(document.getElementById),
    FF: navigator.userAgent.toLowerCase().indexOf("firefox") != -1,
    Se360: navigator.userAgent.toLowerCase().indexOf("360se") != -1,
    IsUndefined: function(name) {
        return eval("typeof(" + name + ")=='undefined'")
    },
    SetValueIfUndefined: function(name, value) {
        if (this.IsUndefined(name)) {
            var tqtemp = value;
            eval(name + "=tqtemp")
        }
    },
    SetValueIfUndefinedOrEmpty: function(name, value) {
        if (this.IsUndefined(name) || eval(name) === "") {
            var tqtemp = value;
            eval(name + "=tqtemp")
        }
    },
    SetDefaultValue: function(name, value) {
        if (name == "") name = value
    },
    LoadJS: function(url, isDefer) {
        try {
            var jsID = "TQJS" + Math.random();
            var jsDOM = document.createElement("script");
            document.getElementsByTagName("head")[0].appendChild(jsDOM);
            jsDOM.id = jsID;
            if (isDefer == true && TQUtils.IE == true) jsDOM.defer = "defer";
            jsDOM.src = url
        } catch(e) {}
    },
    LoadJS2: function(url, callback) {
        var jsID = "TQJS" + Math.random();
        var jsDOM = document.createElement("script");
        document.getElementsByTagName("head")[0].appendChild(jsDOM);
        jsDOM.id = jsID;
        jsDOM.src = url;
        try {
            jsDOM.onreadystatechange = function() {
                if (jsDOM.readyState == "loaded") callback()
            }
        } catch(e) {}
        try {
            jsDOM.onload = callback
        } catch(e) {}
    },
    LoadJSAndAutoRemoveSelf: function(scriptId, url) {
        {
            var jsID = "TQJS" + Math.random();
            var jsDOM = document.createElement("script");
            document.getElementsByTagName("head")[0].appendChild(jsDOM);
            jsDOM.id = jsID;
            jsDOM.src = url; {
            var callback = function() {
                try {
                    setTimeout(function() {
                            if (jsDOM && jsDOM.parentNode) jsDOM.parentNode.removeChild(jsDOM)
                        },
                        2000)
                } catch(e) {}
            };
            try {
                jsDOM.onreadystatechange = function() {
                    if (jsDOM.readyState == "complete" || jsDOM.readyState == "loaded") callback()
                }
            } catch(e) {}
            try {
                jsDOM.onload = callback
            } catch(e) {}
        }
        }
    },
    LoadCSS: function(url) {
        if (TQKF.userDefined.loadCSSType == "auto") {
            try {
                var cssID = "TQCSS" + Math.random();
                var cssDOM = document.createElement("link");
                cssDOM.setAttribute("rel", "stylesheet");
                cssDOM.setAttribute("type", "text/css");
                cssDOM.rel = "stylesheet";
                cssDOM.type = "text/css";
                document.getElementsByTagName("head")[0].appendChild(cssDOM);
                cssDOM.id = cssID;
                cssDOM.href = url
            } catch(e) {}
            if (TQKF.userDefined.forceWriteCSS == 1) document.write('<link rel="stylesheet" type="text/css" href="' + url + '"/>')
        }
    },
    AppendDOM: function(dom) {
        if (TQKF.userDefined.appendDOMType == "appendChild") {
            try {
                document.body.appendChild(dom)
            } catch(e) {
                try {
                    setTimeout(function() {
                            document.body.appendChild(dom)
                        },
                        10000)
                } catch(e) {}
            }
        } else {
            try {
                document.body.insertBefore(dom, document.body.firstChild)
            } catch(e) {
                try {
                    setTimeout(function() {
                            document.body.appendChild(dom)
                        },
                        10000)
                } catch(e) {}
            }
        }
    },
    toJSONString: function(json) {
        if (Object.prototype.toJSONString) return json.toJSONString();
        else {
            var s = "{";
            for (var t in json) {
                if (typeof(json[t]) == "function") continue;
                if (typeof(json[t]) == "object" && json[t] != null) {
                    s += (t + ":" + this.toJSONString(json[t]) + ",")
                } else if (json[t] != null) {
                    s += (typeof(json[t]) == "number" ? (t + ":" + json[t] + ",") : (t + ":\"" + json[t] + "\","))
                }
            }
            s = s.substring(0, s.length - 1) + "}";
            return s
        }
    },
    Drag: {
        canDrag: true,
        obj: null,
        init: function(o, oRoot, minX, maxX, minY, maxY, bSwapHorzRef, bSwapVertRef, fXMapper, fYMapper) {
            o.onmousedown = TQUtils.Drag.start;
            o.hmode = bSwapHorzRef ? false: true;
            o.vmode = bSwapVertRef ? false: true;
            o.root = oRoot && oRoot != null ? oRoot: o;
            if (o.hmode && isNaN(parseInt(o.root.style.left))) o.root.style.left = "0px";
            if (o.vmode && isNaN(parseInt(o.root.style.top))) o.root.style.top = "0px";
            if (!o.hmode && isNaN(parseInt(o.root.style.right))) o.root.style.right = "0px";
            if (!o.vmode && isNaN(parseInt(o.root.style.bottom))) o.root.style.bottom = "0px";
            o.minX = typeof minX != 'undefined' ? minX: null;
            o.minY = typeof minY != 'undefined' ? minY: null;
            o.maxX = typeof maxX != 'undefined' ? maxX: null;
            o.maxY = typeof maxY != 'undefined' ? maxY: null;
            o.xMapper = fXMapper ? fXMapper: null;
            o.yMapper = fYMapper ? fYMapper: null;
            o.root.onDragStart = new Function();
            o.root.onDragEnd = new Function();
            o.root.onDrag = new Function()
        },
        start: function(e) {
            if (! (TQUtils.Drag.canDrag)) return;
            var o = TQUtils.Drag.obj = this;
            e = TQUtils.Drag.fixE(e);
            var y = parseInt(o.vmode ? o.root.style.top: o.root.style.bottom);
            var x = parseInt(o.hmode ? o.root.style.left: o.root.style.right);
            o.root.onDragStart(x, y);
            o.lastMouseX = e.clientX;
            o.lastMouseY = e.clientY;
            if (o.hmode) {
                if (o.minX != null) o.minMouseX = e.clientX - x + o.minX;
                if (o.maxX != null) o.maxMouseX = o.minMouseX + o.maxX - o.minX
            } else {
                if (o.minX != null) o.maxMouseX = -o.minX + e.clientX + x;
                if (o.maxX != null) o.minMouseX = -o.maxX + e.clientX + x
            }
            if (o.vmode) {
                if (o.minY != null) o.minMouseY = e.clientY - y + o.minY;
                if (o.maxY != null) o.maxMouseY = o.minMouseY + o.maxY - o.minY
            } else {
                if (o.minY != null) o.maxMouseY = -o.minY + e.clientY + y;
                if (o.maxY != null) o.minMouseY = -o.maxY + e.clientY + y
            }
            if (TQUtils.tq_fixJQueryMouseMoveEvent == null) TQUtils.tq_fixJQueryMouseMoveEvent = document.onmousemove;
            document.onmousemove = TQUtils.Drag.drag;
            document.onmouseup = TQUtils.Drag.end;
            return false
        },
        drag: function(e) {
            e = TQUtils.Drag.fixE(e);
            var o = TQUtils.Drag.obj;
            var ey = e.clientY;
            var ex = e.clientX;
            var y = parseInt(o.vmode ? o.root.style.top: o.root.style.bottom);
            var x = parseInt(o.hmode ? o.root.style.left: o.root.style.right);
            var nx, ny;
            if (o.minX != null) ex = o.hmode ? Math.max(ex, o.minMouseX) : Math.min(ex, o.maxMouseX);
            if (o.maxX != null) ex = o.hmode ? Math.min(ex, o.maxMouseX) : Math.max(ex, o.minMouseX);
            if (o.minY != null) ey = o.vmode ? Math.max(ey, o.minMouseY) : Math.min(ey, o.maxMouseY);
            if (o.maxY != null) ey = o.vmode ? Math.min(ey, o.maxMouseY) : Math.max(ey, o.minMouseY);
            nx = x + ((ex - o.lastMouseX) * (o.hmode ? 1 : -1));
            ny = y + ((ey - o.lastMouseY) * (o.vmode ? 1 : -1));
            if (o.xMapper) nx = o.xMapper(y);
            else if (o.yMapper) ny = o.yMapper(x);
            TQUtils.Drag.obj.root.style[o.hmode ? "left": "right"] = nx + "px";
            TQUtils.Drag.obj.root.style[o.vmode ? "top": "bottom"] = ny + "px";
            TQUtils.Drag.obj.lastMouseX = ex;
            TQUtils.Drag.obj.lastMouseY = ey;
            TQUtils.Drag.obj.root.onDrag(nx, ny);
            return false
        },
        end: function() {
            document.onmousemove = TQUtils.tq_fixJQueryMouseMoveEvent;
            document.onmouseup = null;
            TQUtils.Drag.obj.root.onDragEnd(parseInt(TQUtils.Drag.obj.root.style[TQUtils.Drag.obj.hmode ? "left": "right"]), parseInt(TQUtils.Drag.obj.root.style[TQUtils.Drag.obj.vmode ? "top": "bottom"]));
            TQUtils.Drag.obj = null
        },
        fixE: function(e) {
            if (typeof e == 'undefined') e = window.event;
            if (typeof e.layerX == 'undefined') e.layerX = e.offsetX;
            if (typeof e.layerY == 'undefined') e.layerY = e.offsetY;
            return e
        }
    },
    GetScrollTop: function() {
        var tq_posY = 0;
        var d = document;
        if (d.documentElement && d.documentElement.scrollTop) {
            tq_posY = d.documentElement.scrollTop
        } else if (d.body) {
            tq_posY = d.body.scrollTop
        } else if (window.innerHeight) {
            tq_posY = window.pageYOffset
        }
        if (tq_posY == "undefined") tq_posY = 0;
        return tq_posY
    },
    GetScrollLeft: function() {
        var tq_posX = 0;
        var d = document;
        if (d.documentElement && d.documentElement.scrollLeft) {
            tq_posX = d.documentElement.scrollLeft
        } else if (d.body) {
            tq_posX = d.body.scrollLeft
        } else if (window.innerWidth) {
            tq_posX = window.pageXOffset
        }
        if (tq_posX == "undefined") tq_posX = 0;
        return tq_posX
    },
    GetWinSize: function() {
        var size = new Object();
        var d = document;
        var db = d.body;
        var de = d.documentElement;
        if (de && de.clientHeight) {
            size.w = de.clientWidth;
            size.h = de.clientHeight
        } else if (db) {
            size.w = db.clientWidth;
            size.h = db.clientHeight
        } else if (window.innerHeight) {
            size.w = window.innerWidth;
            size.h = window.innerHeight
        }
        var strict = document.compatMode && document.compatMode == "CSS1Compat";
        if (!strict) {
            size.w = db.clientWidth;
            size.h = db.clientHeight
        }
        return size
    },
    GetObj: function(id) {
        if (this.isDOM) return document.getElementById(id);
        if (this.isIE4) return document.all[id];
        if (this.isNS4) return document.layers[id]
    },
    GetCookieVal: function(offset) {
        var endstr = document.cookie.indexOf(";", offset);
        if (endstr == -1) endstr = document.cookie.length;
        return unescape(document.cookie.substring(offset, endstr))
    },
    GetCookie: function(name) {
        var arg = name + "=";
        var alen = arg.length;
        var clen = document.cookie.length;
        var i = 0;
        while (i < clen) {
            var j = i + alen;
            if (document.cookie.substring(i, j) == arg) {
                return this.GetCookieVal(j)
            }
            i = document.cookie.indexOf(" ", i) + 1;
            if (i == 0) break
        }
        return ""
    },
    SetCookie: function(name, value) {
        var argv = TQUtils.SetCookie.arguments;
        var argc = TQUtils.SetCookie.arguments.length;
        var expires = new Date();
        expires.setTime(expires.getTime() + ((2 < argc) ? argv[2] : 365 * 24) * 60 * 60 * 1000);
        var expires_time = expires;
        var path = (3 < argc) ? argv[3] : null;
        var domain = (4 < argc) ? argv[4] : null;
        var secure = (5 < argc) ? argv[5] : false;
        document.cookie = name + "=" + value + ((expires == null) ? "": ("; expires=" + expires_time.toGMTString())) + ((path == null) ? "": ("; path=" + path)) + ((domain == null) ? "": ("; domain=" + domain)) + ((secure == true) ? "; secure": "")
    },
    SetCookie2: function(name, value) {
        var argv = TQUtils.SetCookie2.arguments;
        var argc = TQUtils.SetCookie2.arguments.length;
        var expires = new Date();
        expires.setTime(expires.getTime() + ((2 < argc) ? argv[2] : 365 * 24) * 60 * 60 * 1000);
        var expires_time = expires;
        var path = (3 < argc) ? argv[3] : null;
        var domain = (4 < argc) ? argv[4] : null;
        var secure = (5 < argc) ? argv[5] : false;
        document.cookie = name + "=" + value + ((expires == null) ? "": ("; expires=" + expires_time.toGMTString())) + ("; path=/") + ((domain == null) ? "": ("; domain=" + domain)) + ((secure == true) ? "; secure": "")
    },
    getRootDomain: function() {
        if (document.domain != null && document.domain != "") {
            try {
                return document.domain.match(/(\w+\.(?:com.cn|com|cn|net|org|cc))(?:\/|$)/)[1]
            } catch(e) {
                return null
            }
        }
        return null
    },
    GetTime: function() {
        var d = new Date();
        var mon = d.getMonth() + 1;
        var nowtime = d.getFullYear() + '-' + mon + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        return nowtime
    },
    GetTime_invite: function() {
        var d = new Date();
        var mon = d.getMonth() + 1;
        var nowtime = d.getFullYear() + '-' + mon + '-' + d.getDate() + ',' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        return nowtime
    },
    GetTime_debug: function() {
        var d = new Date();
        var mon = d.getMonth() + 1;
        var nowtime = d.getFullYear() + '-' + mon + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ':' + d.getMilliseconds();
        return nowtime
    },
    GetPageSize: function() {
        var d = document;
        var b = (d.compatMode != "CSS1Compat") ? d.body: d.documentElement;
        var size = new Object();
        size.w = Math.max(b.scrollWidth, b.clientWidth);
        size.h = Math.max(b.scrollHeight, b.clientHeight);
        return size
    },
    AddEvent: function(target, event, fn) {
        if (typeof target == 'string') target = TQUtils.GetObj(target);
        if (typeof target.addEventListener != "undefined") {
            target.addEventListener(event, fn, false)
        } else if (typeof target.attachEvent != "undefined") {
            this.AddListener(target, "on" + event, fn)
        } else if (typeof eval(target + ".on" + event) == "function") {
            var fnOld = eval(target + ".on" + event);
            eval(target + ".on" + event + " = function() {fnOld();fn();}")
        } else {
            eval(target + ".on" + event + " = fn")
        }
    },
    AddListener: function(target, eventType, fn) {
        if (typeof target == 'string') target = TQUtils.GetObj(target);
        target.attachEvent(eventType, fn)
    },
    HeartBeat: function(obj, inteval, timer, lastPos, isHeartbeat) {
        if (!isHeartbeat) return;
        var tq_diffY1 = TQUtils.GetScrollTop();
        var tq_diffX1 = TQUtils.GetScrollLeft();
        if (tq_diffY1 != lastPos.y) {
            var tq_percent1 = .1 * (tq_diffY1 - lastPos.y);
            if (tq_percent1 > 0) {
                tq_percent1 = Math.ceil(tq_percent1)
            } else {
                tq_percent1 = Math.floor(tq_percent1)
            }
            if (TQUtils.NS) {
                document.tq_float_container.top += tq_percent1
            }
            obj.style.top = tq_percent1 + parseInt(obj.style.top) + "px";
            lastPos.y = lastPos.y + tq_percent1
        }
        if (tq_diffX1 != lastPos.x) {
            var tq_percent1 = .1 * (tq_diffX1 - lastPos.x);
            if (tq_percent1 > 0) {
                tq_percent1 = Math.ceil(tq_percent1)
            } else {
                tq_percent1 = Math.floor(tq_percent1)
            }
            if (TQUtils.NS) {
                document.tq_float_container.left += tq_percent1
            }
            obj.style.left = tq_percent1 + parseInt(obj.style.left) + "px";
            lastPos.x = lastPos.x + tq_percent1
        }
        timer = setTimeout(function() {
                TQUtils.HeartBeat(obj, inteval, timer, lastPos, isHeartbeat)
            },
            inteval)
    },
    GetTitle: function() {
        var tq_visit_title = "";
        try {
            tq_visit_title = document.title;
            if (tq_visit_title != "undefined" && tq_visit_title != null && tq_visit_title != "" && tq_visit_title.length > 22) tq_visit_title = tq_visit_title.substring(0, 22);
            tq_visit_title = encodeURI(tq_visit_title)
        } catch(e) {}
        return tq_visit_title
    },
    GetLocalURL: function() {
        var local_url = window.location.href.replace(/\&/g, "*").replace(/\#/gi, "$").replace(/\?/gi, "!");
        if (local_url.length > TQKF.local_url_length) local_url = local_url.substring(0, TQKF.local_url_length);
        return local_url
    },
    GetSourcePageURL: function(time) {
        var source_page_url = this.GetCookie("tq_source_page_url");
        if (source_page_url == null || source_page_url == "") {
            var reffer = this.GetReffer();
            if (reffer != "") {
                source_page_url = this.ReCreatReffer(reffer);
                this.SetCookie("tq_source_page_url", source_page_url, time)
            }
        }
        return source_page_url
    },
    GetReffer: function() {
        var tq_refTemp = '';
        if (document.referrer.length > 0) {
            tq_refTemp = document.referrer
        }
        try {
            if (tq_refTemp.length == 0 && opener && opener.location.href.length > 0) {
                tq_refTemp = opener.location.href
            }
        } catch(e) {}
        return tq_refTemp
    },
    GetPara: function(url, name) {
        if (url == null || url == "") return "";
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = url.substr(url.indexOf("\?") + 1).match(reg);
        if (r != null) {
            return (r[2])
        }
        return ""
    },
    ReCreatReffer: function(url) {
        if (url == null || url.length == 0) return "";
        var domain = url.substring(0, url.indexOf("?"));
        for (var i = 0; i < TQKF.filterURLs.length; i++) {
            var isSearchEngine = false;
            for (var j = 0; j < TQKF.filterURLs[i].domain.length; j++) {
                if (domain.indexOf(TQKF.filterURLs[i].domain[j]) != -1) {
                    isSearchEngine = true
                }
            }
            if (isSearchEngine) {
                var keyword = this.GetPara(url, TQKF.filterURLs[i].keyPara);
                if (keyword != "") {
                    return domain + "?" + TQKF.filterURLs[i].keyPara + "=" + keyword.replace(/\%/g, "^")
                }
            }
        }
        if (url.length > TQKF.reffer_url_length) url = url.substring(0, TQKF.reffer_url_length);
        return url.replace(/\&/g, "*").replace(/\%/g, "^").replace(/\#/gi, "%23")
    },
    SetConfigValue: function(prefix, config) {
        for (var v in config) {
            if (eval("typeof(" + prefix + v + ")!='undefined'")) {
                if (eval(prefix + v) != "") config[v] = eval(prefix + v)
            }
        }
    },
    SetValue: function(from, to) {
        for (var prop in from) {
            if (typeof(from[prop]) == "function") continue;
            else if (from[prop] != null && from[prop] != "null" && !(from[prop] === "")) {
                if (typeof(from[prop]) == "object") {
                    if (!to[prop]) to[prop] = {};
                    this.SetValue(from[prop], to[prop])
                } else to[prop] = from[prop]
            }
            if (from[prop] === "" && !to[prop]) to[prop] = from[prop]
        }
    },
    FillInnertip: function(str) {
        return str.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, "&")
    },
    IsFlash: function(url) {
        return url.indexOf(".swf") != -1 || url.indexOf(".flv") != -1
    },
    Disp: function(obj) {
        if (typeof obj == 'string') obj = TQUtils.GetObj(obj);
        obj == null || (obj.style.visibility = "visible")
    },
    Hide: function(obj) {
        if (typeof obj == 'string') obj = TQUtils.GetObj(obj);
        obj == null || (obj.style.visibility = "hidden")
    },
    setDefaultValue: function(def, value) {
        if (value == null || value == "") return def;
        else return value
    },
    FixFlash: function() {
        if (TQKF.isFlashFixed == true) return;
        TQKF.isFlashFixed = true;
        var d = document;
        var fs = d.getElementsByTagName('object'),
            ems = d.getElementsByTagName('embed');
        if (TQUtils.FF) {
            for (var i = 0; i < ems.length; i++) {
                ems[i].setAttribute("wmode", "transparent");
                ems[i].setAttribute("src", ems[i].getAttribute("src"))
            }
        } else {
            for (var i = 0; i < fs.length; i++) {
                var newFlash = document.createElement('object');
                newFlash.setAttribute("codeBase", fs[i].getAttribute("codeBase"));
                newFlash.setAttribute("classid", fs[i].getAttribute("classid"));
                newFlash.setAttribute("width", fs[i].getAttribute("width"));
                newFlash.setAttribute("height", fs[i].getAttribute("height"));
                for (var j = 0; j < fs[i].childNodes.length; j++) {
                    newFlash.appendChild(fs[i].childNodes[j])
                }
                var wc = document.createElement('param');
                wc.name = 'wmode';
                wc.value = 'transparent';
                newFlash.appendChild(wc);
                var h = newFlash.outerHTML;
                fs[i].outerHTML = h
            }
        }
    },
    isInCode: function(status, code) {
        var codes = code.split("|");
        for (var i = 0; i < codes.length; i++) {
            if (codes[i] == status) return true
        }
        return false
    }
};
window.onerror = function() {
    return true
};
