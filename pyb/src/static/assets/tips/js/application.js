// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++
!function ($) {
jQuery.easing['jswing'] = jQuery.easing['swing'];
jQuery.extend(jQuery.easing, {
    def: 'easeOutQuad',
    swing: function(x, t, b, c, d) {
        //alert(jQuery.easing.default);
        return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
    },
    easeInQuad: function(x, t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    easeOutQuad: function(x, t, b, c, d) {
        return - c * (t /= d) * (t - 2) + b;
    },
    easeInOutQuad: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return - c / 2 * ((--t) * (t - 2) - 1) + b;
    },
    easeInCubic: function(x, t, b, c, d) {
        return c * (t /= d) * t * t + b;
    },
    easeOutCubic: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOutCubic: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    },
    easeInQuart: function(x, t, b, c, d) { //..
        return c * (t /= d) * t * t * t + b;
    },
    easeOutQuart: function(x, t, b, c, d) {
        return - c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeInOutQuart: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
        return - c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    easeInQuint: function(x, t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },
    easeOutQuint: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOutQuint: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },
    easeInSine: function(x, t, b, c, d) {
        return - c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeOutSine: function(x, t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeInOutSine: function(x, t, b, c, d) {
        return - c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    easeInExpo: function(x, t, b, c, d) {
        return (t == 0) ? b: c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    easeOutExpo: function(x, t, b, c, d) {
        return (t == d) ? b + c: c * ( - Math.pow(2, -10 * t / d) + 1) + b;
    },
    easeInOutExpo: function(x, t, b, c, d) {
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * ( - Math.pow(2, -10 * --t) + 2) + b;
    },
    easeInCirc: function(x, t, b, c, d) {
        return - c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOutCirc: function(x, t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOutCirc: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return - c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
    easeInElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return - (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    easeOutElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    easeInOutElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d / 2) == 2) return b + c;
        if (!p) p = d * (.3 * 1.5);
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        if (t < 1) return - .5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
    },
    easeInBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOutBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOutBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },
    easeInBounce: function(x, t, b, c, d) {
        return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
    },
    easeOutBounce: function(x, t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        } else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        }
    },
    easeInOutBounce: function(x, t, b, c, d) {
        if (t < d / 2) return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
        return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
    }
});
$.fn.DynamicToTop = function(options) {
	var defaults = {
		text: "",
		min: "200",
		fade_in: 600,
		fade_out: 400,
		speed: "1000",
		easing: "easeInOutExpo",
		version: "",
		id: 'dynamic-to-top'
	};
	var settings = $.extend(defaults, options);
	if (settings.version == "") {
		settings.text = '';
	}
	var $toTop = $('<a href=\"#\" id=\"' + settings.id + '\"></a>').html(settings.text);
	$toTop.appendTo(document.body);
	$toTop.hide().click(function() {
		$('html, body').stop().animate({
			scrollTop: 0
		},
		settings.speed, settings.easing);
		return false;
	});
	$(window).scroll(function() {
		var sd = $(window).scrollTop();
		if (typeof document.body.style.maxHeight === "undefined") {
			$toTop.css({
				'position': 'absolute',
				'top': $(window).scrollTop() + $(window).height() - mv_dynamic_to_top.margin
			});
		}
		if (sd > settings.min) {
			$toTop.fadeIn(settings.fade_in);
		} else {
			$toTop.fadeOut(settings.fade_out);
		}
	});
};
$('body').DynamicToTop();
$(function(){
	$('.jumbotron').outerHeight($(window).height()-$('.footer').height() - $('.navbar').height());
	
	$(window).resize(function() {
		$('.jumbotron').outerHeight($(window).height()-$('.footer').height() - $('.navbar').height());
	});

	var $window = $(window);
	// Disable certain links in docs
	$('section [href^=#]').click(function (e) {
	  e.preventDefault()
	});

	// side bar
	//$('.bs-docs-sidenav').affix();

	// make code pretty
	window.prettyPrint && prettyPrint();

// example http://tianshaojie.com
    var serviceQQ = ' <a href="//wpa.b.qq.com/cgi/wpa.php?ln=1&key=XzgwMDgyMjAwNl80NzE5OTVfODAwODIyMDA2XzJf" target="_blank">在线客服</a> ';
    var dantongstr = '<div class="bigBackground_left fl">' +
    '<p class="BestBig">单铜纸 ' +
    '<i class="English_Size">英文：One-side Coated Paper</i>' +
    '</p>' +
    '<p>中文其它称呼：单面铜版纸，白卡纸，单面涂布白卡纸，单粉卡</p>' +
    '<p class="bottomLink">如有疑问，请与' + serviceQQ + '联系。</p>' +
    '</div>';


    var yinkastr = '<div class="bigBackground_left fl">' +
        '<p class="BestBig">银卡纸</p>' +
        '<p style="color:#f00">温馨提示：银卡材质表面处理过光膜或哑膜，在文件无大面积印底色时，容易出现有划痕的情况，建议表面做逆向UV工艺。</p>' +
        '<p class="bottomLink">如有疑问，请与' + serviceQQ + '联系。</p>' +
        '</div>';

    var yajiaostr = '<div class="bigBackground_left fl">' +
        '<p class="BestBig">覆哑膜</p>' +
        '<p>中文其它称呼：过哑胶</p>' +
        '<p style="color:#f00">温馨提示：</p>' +
        '<p style="color:#f00">  1.在文件无底色时，过膜容易出现有划痕的情况，建议表面处理选择逆向UV。</p>' +
        '<p style="color:#f00">  2.深色大墨位过哑胶容易拖花，高品质要求产品，建议过防刮花哑膜。</p>' +
        '<p class="bottomLink">如有疑问，请与' + serviceQQ + '联系。</p>' +
        '</div>';

    var guangjiaostr = '<div class="bigBackground_left fl">' +
        '<p class="BestBig">覆光膜</p>' +
        '<p>中文其它称呼：过光胶，覆亮膜</p>' +
        '<p style="color:#f00">温馨提示：在文件无底色时，过膜容易出现有划痕的情况，建议表面处理选择逆向UV。</p>' +
        '<p class="bottomLink">如有疑问，请与' + serviceQQ + '联系。</p>' +
        '</div>';

    var guangyoustr = '<div class="bigBackground_left fl">' +
        '<p class="BestBig">过光油' +
        '<i class="English_Size">英文：varnishing</i>' +
        '</p>' +
        '<p>中文其它称呼：上光</p>' +
        '<p style="color:#f00">温馨提示：光油会存在擦花掉色风险，如要求比较高的产品，建议采取覆膜工艺。</p>' +
        '<p class="bottomLink">如有疑问，请与' + serviceQQ + '联系。</p>' +
        '</div>';

    var nixiangstr = '<div class="bigBackground_left fl">' +
        '<p class="BestBig">逆向UV</p>' +
        '<p>中文其它称呼：大印象，逆向上光，起砂油</p>' +
        '<p style="color:#f00;">温馨提示：由于UV油墨层较厚，在折线处对折多次后，会出现轻微的爆色现象。</p>' +
        '<p class="bottomLink">如有疑问，请与' + serviceQQ + '联系。</p>' +
        '</div>';

    var Protrudingstr = '<div class="bigBackground_left fl">' +
        '<p class="BestBig">击凸</p>' +
        '<p>中文其它称呼：凹凸、起凸</p>' +
        '<p class="bottomLink">如有疑问，请与' + serviceQQ + '联系。</p>' +
        '</div>';

    var localUvstr = '<div class="bigBackground_left fl">' +
        '<p class="BestBig">局部UV</p>' +
        '<p>中文其它称呼：丝印局部UV，局部UV上光</p>' +
        '<p class="bottomLink">如有疑问，请与' + serviceQQ + '联系。</p>' +
        '</div>';

    var fenhuistr = '<div class="bigBackground_left fl" style="width:350px;">' +
        '<p class="BestBig">粉灰' +
        '<i class="English_Size">英文：Coated Duplex Board With Grey Back</i>' +
        '</p>' +
        '<p>中文其它称呼：灰底白板纸，灰底白</p>' +
        '<br />' +
        '<p class="BestBig">瓦楞纸板' +
        '<i class="English_Size">英文：Corrugated Fiberboard</i>' +
        '</p>' +
        '<p>中文其它称呼：波纹纸板，坑纸，瓦通纸，纸皮</p>' +
        ' <p class="bottomLink">如有疑问，请与' + serviceQQ + '联系。</p>' +
        '</div>';
    var filmpriterlabel1str = '<div class="bigBackground_left fl" style="width:350px;">' +
        '<p>正印正看时粘位在内</p>'+
        ' <p class="bottomLink">如有疑问，请与' + serviceQQ + '联系。</p>' +
        '</div>';

    var filmpriterlabel2str = '<div class="bigBackground_left fl" style="width:350px;">' +
        '<p>反印正看时粘位在外</p>'+
        ' <p class="bottomLink">如有疑问，请与' + serviceQQ + '联系。</p>' +
        '</div>';

    var serverstr = '<div class="bigBackground_left fl" style="width:350px;">' +
        '<p>适用于打成品样、结构白样、颜色样服务，包括需要实物打样的正稿服务等包含多样服务的打样服务</p>'+
        ' <p class="bottomLink">如有疑问，请与' + serviceQQ + '联系。</p>' +
        '</div>';

    var serverstr2 = '<div class="bigBackground_left fl" style="width:350px;">' +
        '<p>适用于只需要跟色跟样的打样服务</p>'+
        ' <p class="bottomLink">如有疑问，请与' + serviceQQ + '联系。</p>' +
        '</div>';
    
    var serverstr3 = '<div class="bigBackground_left fl" style="width:350px;">' +
        '<p>适用于不需要实物打样的正稿服务</p>'+
        ' <p class="bottomLink">如有疑问，请与' + serviceQQ + '联系。</p>' +
        '</div>';
		
    var finishedtips = '<div class="bigBackground_left fl" style="width:350px;">' +
        '<p class="proofingTipsColor">为图稿与结构做成成品交货</p>'+
        ' <p class="bottomLink">如有疑问，请与' + serviceQQ + '联系。</p>' +
        '</div>';
	var structuretips = '<div class="bigBackground_left fl" style="width:350px;">' +
        '<p class="proofingTipsColor">为只打图样，按文件大小打图样介整张出货</p>'+
        ' <p class="bottomLink">如有疑问，请与' + serviceQQ + '联系。</p>' +
        '</div>';
	var tincttips = '<div class="bigBackground_left fl" style="width:350px;">' +
        '<p class="proofingTipsColor">按客户提供的结构割结构样出货</p>'+
        ' <p class="bottomLink">如有疑问，请与' + serviceQQ + '联系。</p>' +
        '</div>';
	var weight300tips = '<div class="bigBackground_left fl" style="width:350px;">' +
        '<p>大货无白卡300g材质</p>'+
        ' <p class="bottomLink">如有疑问，请与' + serviceQQ + '联系。</p>' +
        '</div>';
	var greypapertips = '<div class="bigBackground_left fl" style="width:350px;">' +
        '<p>大货无灰底白材质</p>'+
        ' <p class="bottomLink">如有疑问，请与' + serviceQQ + '联系。</p>' +
        '</div>';
    
    $('.dantong').pt({
        position:'t',
        width: 320,
        height: 100,
        content: dantongstr
    });

    $('.yinka').pt({
        position:'t',
        width: 320,
        height: 120,
        content: yinkastr
    });

    $('.yajiao').pt({
        position:'t',
        width: 320,
        height: 170,
        content: yajiaostr
    });

    $('.guangjiao').pt({
        position:'t',
        width: 320,
        height: 120,
        content: guangjiaostr
    });

    $('.guangyou').pt({
        position:'t',
        width: 320,
        height: 130,
        content: guangyoustr
    });

    $('.nixiang').pt({
        position:'t',
        width: 320,
        height: 120,
        content: nixiangstr
    });

    $('.Protruding').pt({
        position:'t',
        width: 320,
        height: 90,
        content: Protrudingstr
    });

    $('.localUv').pt({
        position:'t',
        width: 320,
        height: 90,
        content: localUvstr
    });

    $('.fenhui').pt({
        position:'t',
        width: 380,
        height: 150,
        content: fenhuistr
    });
    $('.filmpriterlabel1str').pt({
        position:'t',
        width: 380,
        height: 70,
        content: filmpriterlabel1str
    });
    $('.filmpriterlabel2str').pt({
        position:'t',
        width: 380,
        height: 70,
        content: filmpriterlabel2str
    });
    $('.proofing').pt({
        position:'t',
        width: 380,
        height: 70,
        content: serverstr
    });
    $('.proofing_color').pt({
        position:'t',
        width: 380,
        height: 70,
        content: serverstr2
    });
    $('.proofint_edit').pt({
        position:'t',
        width: 380,
        height: 70,
        content: serverstr3
    });
	$('.kind_finished').pt({
        position:'t',
        width: 380,
        height: 70,
        content: finishedtips
    });
	$('.kind_structure').pt({
        position:'t',
        width: 380,
        height: 70,
        content: structuretips
    });
	$('.kind_tinct').pt({
        position:'t',
        width: 380,
        height: 70,
        content: tincttips
    });
	$('.weight300').pt({
        position:'t',
        width: 380,
        height: 70,
        content: weight300tips
    });
	$('.greypapertips').pt({
        position:'t',
        width: 380,
        height: 70,
        content: greypapertips
    });
	$('.laser').pt({
        position:'t',
        width: 300,
        height: 210,
        content: '<div class="bigBackground_left fl">' +
        '<p class="BestBig">镭射雪花膜</p>' +
        '<p style="color:#f00;">温馨提示：本平台暂时上线一种镭射雪花膜，如需要其它镭射膜材质，请与' + serviceQQ + '联系。</p>' +
        '<p class="bottomLink"><img src="/static/index/img/laserTipsimg.png" width="270" /></p>' +
        '</div>'
    });

    $('.otherGildColor, .otherGildColor2').pt({
        position:'t',
        width: 300,
        height: 70,
        content:'<div class="bigBackground_left fl">' +
            '<p>其它金料请联系客服登记，谢谢合作。</p>' +
            '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
            '</div>'
    });
    $('.spotfactTips').pt({
        position:'t',
        width: 300,
        height: 70,
        content:'<div class="bigBackground_left fl">' +
            '<p>凡专色要求跟实样的订单样品需要标注清楚并寄样到本公司，寄样不接受到付。</p>' +
            '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
            '</div>'
    });
    $('.competTextTure').pt({
        position:'t',
        width: 380,
        height: 105,
        content:'<div class="bigBackground_left fl">' +
            '<p class="BestBig">双铜纸 ' +
            '<i class="English_Size">英文：Two-Sides Coated Solid Card Board</i>' +
            '</p>' +
            '<p>中文其它称呼：双面铜版纸，双面涂布白卡纸</p>' +
            '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
            '</div>'
    });
    $('.surface_process_yj').pt({
        position:'t',
        width: 380,
        height: 90,
        content:'<div class="bigBackground_left fl">' +
            '<p class="BestBig">覆哑膜 </p>' +
            '<p>中文其它称呼：过哑胶</p>' +
            '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
            '</div>'
    });
    $('.surface_process_gj').pt({
        position:'t',
        width: 380,
        height: 120,
        content:'<div class="bigBackground_left fl">' +
            '<p class="BestBig">覆光膜</p>' +
            '<p>中文其它称呼：过光胶，覆亮膜</p>' +
            '<p style="color:#f00">温馨提示：在文件无底色时，过膜容易出现有划痕的情况，建议表面处理选择逆向UV。</p>'+
            '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
            '</div>'
    });
	$('.tagswidth500').pt({
        position:'t',
        width: 300,
        height: 90,
        content:'<div class="bigBackground_left fl">' +
            '<p class="BestBig">500克的材质为：250g对裱250g。</p>' +
            '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
            '</div>'
    });
	$('.tagswidth600').pt({
        position:'t',
        width: 300,
        height: 90,
        content:'<div class="bigBackground_left fl">' +
            '<p class="BestBig">600克的材质为：350g对裱250g。</p>' +
            '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
            '</div>'
    });
	$('.tagswidth700').pt({
        position:'t',
        width: 300,
        height: 90,
        content:'<div class="bigBackground_left fl">' +
            '<p class="BestBig">700克的材质为：350g对裱350g。</p>' +
            '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
            '</div>'
    });
	$('.tagswidth800').pt({
        position:'t',
        width: 300,
        height: 90,
        content:'<div class="bigBackground_left fl">' +
            '<p class="BestBig">800克的材质为：400g对裱400g。</p>' +
            '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
            '</div>'
    });
	$('.tagsSurface').pt({
        position:'t',
        width: 300,
        height: 90,
        content:'<div class="bigBackground_left fl">' +
            '<p class="BestBig">如选择不做表面处理，可能会出现刮花等风险。</p>' +
            '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
            '</div>'
    });
	$('.competSingleW15').pt({
        position:'t',
        width: 300,
        height: 90,
        content:'<div class="bigBackground_left fl">' +
            '<p class="BestBig">1.5MM单白   参考克重为1050G（单白板0.145MM/100克）。</p>' +
            '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
            '</div>'
    });
	$('.competSingleB15').pt({
        position:'t',
        width: 300,
        height: 90,
        content:'<div class="bigBackground_left fl">' +
            '<p class="BestBig">1.5MM单黑   参考克重为1050G（单黑板0.145MM/100克）。</p>' +
            '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
            '</div>'
    });
	$('.competDoubleB20').pt({
        position:'t',
        width: 300,
        height: 90,
        content:'<div class="bigBackground_left fl">' +
            '<p class="BestBig">2.0MM单黑   参考克重为1400G（单黑0.145MM/100克）。</p>' +
            '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
            '</div>'
    });
	$('.competDoubleW20').pt({
        position:'t',
        width: 300,
        height: 90,
        content:'<div class="bigBackground_left fl">' +
            '<p class="BestBig">2.0MM单白   参考克重为1400G（单白0.145MM/100克）。</p>' +
            '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
            '</div>'
    });
	$('.competDoubleG15').pt({
        position:'t',
        width: 300,
        height: 90,
        content:'<div class="bigBackground_left fl">' +
            '<p class="BestBig">1.5MM双灰   参考克重为1000G（双灰板0.155MM/100克）。</p>' +
            '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
            '</div>'
    });
	$('.competDoubleG20').pt({
        position:'t',
        width: 300,
        height: 90,
        content:'<div class="bigBackground_left fl">' +
            '<p class="BestBig">2.0MM双灰   参考克重为1300G（双灰板0.155MM/100克）。</p>' +
            '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
            '</div>'
    });
	$('.digitalTagsGuleTips').pt({
        position:'t',
        width: 300,
        height: 90,
        content:'<div class="bigBackground_left fl">' +
            '<p class="BestBig">不过胶表面易刮花</p>' +
            '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
            '</div>'
    });
	$('.proofingToningTips').pt({
        position:'t',
        width: 300,
        height: 100,
        content:'<div class="bigBackground_left fl">' +
            '<p class="proofingTipsColor">调色服务仅限单铜材质</p>' +
            '<p class="proofingTipsColor">按客户提供现有色样进行调色；调色程度在跟原色样的85%以上</p>' +
            '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
            '</div>'
    });
	$('.proofingGetSelfTips').pt({
        position:'t',
        width: 300,
        height: 80,
        content:'<div class="bigBackground_left fl">' +
            '<p class="BestBig proofingTipsColor">不支持送货上门，请到店自取</p>' +
            '<p class="BestBig proofingTipsColor">取样时间下午17：30-20：30</p>' +
            '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
            '</div>'
    });
	$('.perfectMould').pt({
        position:'t',
        width: 300,
        height: 100,
        content:'<div class="bigBackground_left fl">' +
            '<p class="proofingTipsColor">在客源文件有结构的情况下，结构不合理需做修改，完善结构合理性</p>' +
            '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
            '</div>'
    });
	$('.designMould').pt({
        position:'t',
        width: 300,
        height: 70,
        content:'<div class="bigBackground_left fl">' +
            '<p class="proofingTipsColor">客源文件无结构，需要按要求设计结构</p>' +
            '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
            '</div>'
    });
	$('.noMould').pt({
        position:'t',
        width: 300,
        height: 70,
        content:'<div class="bigBackground_left fl">' +
            '<p class="proofingTipsColor">按客源文件不做任何更改打印或戒样交货</p>' +
            '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
            '</div>'
    });
	$('.draftUpdate').pt({
        position:'t',
        width: 300,
        height: 100,
        content:'<div class="bigBackground_left fl">' +
            '<p class="proofingTipsColor">在客源文件的基础上按客户需求修改文字，尺寸，去掉或增加文字及条形码，二维码等内容</p>' +
            '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
            '</div>'
    });
	$('.draftDesign').pt({
        position:'t',
        width: 300,
        height: 100,
        content:'<div class="bigBackground_left fl">' +
            '<p class="proofingTipsColor">客户无印刷文件，按客户提供资料（文字信息、LOGO、图片等）及要求进行版面排版设计</p>' +
            '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
            '</div>'
    });
    //胶片盒打样印刷方式提示
    $('.proofFilmPrintTips').pt({
        position:'t',
        width: 300,
        height: 100,
        content:'<div class="bigBackground_left fl">' +
            '<p class="proofingTipsColor">受机械设备限制，打样只支持正印正看</p>' +
            '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
            '</div>'
    });
    //胶片盒打样逆向UV提示
    $('.proofFilmSurfaceTips').pt({
        position:'t',
        width: 300,
        height: 100,
        content:'<div class="bigBackground_left fl">' +
            '<p class="proofingTipsColor">大货为防刮油及哑油，打样效果与大货会有出入</p>' +
            '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
            '</div>'
    });
    //胶片盒打样粘盒提示
    $('.proofFilmStickTips').pt({
        position:'t',
        width: 300,
        height: 100,
        content:'<div class="bigBackground_left fl">' +
            '<p class="proofingTipsColor">大货为特种设备粘合，打样为双面胶粘合，透明度会与大货有出入</p>' +
            '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
            '</div>'
    });
    //软包装牛皮纸
	$('.softTipsCOWY').pt({
        position:'t',
        width: 300,
        height: 300,
        content: '<div class="bigBackground_left fl">' +
        '<p class="BestBig">牛皮纸</p>' +
        '<p style="color:#f00;">温馨提示：牛皮纸有良好的抗拉强度，能承受较大拉力和压力不破裂，柔韧结实，耐破度高，一般用于食品包装袋。</p>' +
        '<p class="bottomLink"><img src="/uploads/images/products/%E9%BB%84%E7%89%9B%E7%9A%AE%E7%BA%B8.jpg" width="270" /></p>' +
        '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
        '</div>'
    });
    //软包装牛皮纸
	$('.softTipsCOWW').pt({
        position:'t',
        width: 300,
        height: 300,
        content: '<div class="bigBackground_left fl">' +
        '<p class="BestBig">牛皮纸</p>' +
        '<p style="color:#f00;">温馨提示：牛皮纸有良好的抗拉强度，能承受较大拉力和压力不破裂，柔韧结实，耐破度高，一般用于食品包装袋。</p>' +
        '<p class="bottomLink"><img src="/uploads/images/products/%E7%99%BD%E7%89%9B%E7%9A%AE%E7%BA%B8.jpg" width="270" /></p>' +
        '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
        '</div>'
    });
    //软包装MOPP哑光膜
	$('.softTipsMOPP').pt({
        position:'t',
        width: 300,
        height: 300,
        content: '<div class="bigBackground_left fl">' +
        '<p class="BestBig">MOPP哑膜</p>' +
        '<p style="color:#f00;">温馨提示：又称MOPP哑光(消光)膜，高哑光性能，高拉伸强度，优异的印刷性能和涂层附着力，优异的阻隔性能；一般用于食品包装包装.</p>' +
        '<p class="bottomLink"><img src="/uploads/images/products/MOPP%E5%93%91%E5%85%89%EF%BC%88%E6%B6%88%E5%85%89%EF%BC%89%E8%86%9C.jpg" width="270" /></p>' +
        '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
        '</div>'
    });
    //软包装BOPP光膜
	$('.softTipsBOPP').pt({
        position:'t',
        width: 300,
        height: 300,
        content: '<div class="bigBackground_left fl">' +
        '<p class="BestBig">BOPP光膜</p>' +
        '<p style="color:#f00;">温馨提示：高透明度和光泽度，优异的阻氧、阻油性，优异的印刷性能和涂层附着力，优异的平整度，低静电性能；一般用于食品包装。</p>' +
        '<p class="bottomLink"><img src="/uploads/images/products/BOPP%E5%85%89%E8%86%9C.jpg" width="270" /></p>' +
        '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
        '</div>'
    });
    //软包装PET光膜
	$('.softTipsPET').pt({
        position:'t',
        width: 300,
        height: 280,
        content: '<div class="bigBackground_left fl">' +
        '<p class="BestBig">PET光膜</p>' +
        '<p style="color:#f00;">温馨提示：透明性好，光泽度高，机械性能优良，优良的耐热、耐寒性，印刷性能较好。</p>' +
        '<p class="bottomLink"><img src="/uploads/images/products/PET%E5%85%89%E8%86%9C.jpg" width="270" /></p>' +
        '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
        '</div>'
    });
    //软包装PA尼龙膜
	$('.softTipsPA').pt({
        position:'t',
        width: 300,
        height: 320,
        content: '<div class="bigBackground_left fl">' +
        '<p class="BestBig">PA尼龙膜</p>' +
        '<p style="color:#f00;">温馨提示：简称PA或NY，透明性好，良好的光泽，抗张强度、拉伸强度较高，良好的耐热性、耐寒性、耐油性，耐穿刺性优良，且比较柔软，阻氧性优良。</p>' +
        '<p class="bottomLink"><img src="/uploads/images/products/%E5%B0%BC%E9%BE%99%E8%86%9C.jpg" width="270" /></p>' +
        '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
        '</div>'
    });
    //软包装VMPET镀铝膜
	$('.softTipsVMPET').pt({
        position:'t',
        width: 300,
        height: 320,
        content: '<div class="bigBackground_left fl">' +
        '<p class="BestBig">VMPET镀铝膜</p>' +
        '<p style="color:#f00;">温馨提示：遮光、防紫外线照射，较好的阻隔性能，比铝箔便宜，主要应用于茶叶、饼干、坚果等干燥、膨化食品，以及一些医药、化妆品的外包装上。</p>' +
        '<p class="bottomLink"><img src="/uploads/images/products/VMPET.jpg" width="270" /></p>' +
        '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
        '</div>'
    });
    //软包装AL铝箔
	$('.softTipsAL').pt({
        position:'t',
        width: 300,
        height: 320,
        content: '<div class="bigBackground_left fl">' +
        '<p class="BestBig">AL铝箔</p>' +
        '<p style="color:#f00;">温馨提示：纯铝，优良的导热体和避光体，不透光、不透湿、不透气，阻隔性非常好，主要用作高温蒸煮食品包装、阻隔性包装（如面膜、香料等）和电磁屏蔽包装等。</p>' +
        '<p class="bottomLink"><img src="/uploads/images/products/%E9%93%9D%E7%AE%94%EF%BC%88AL%EF%BC%89.jpg" width="270" /></p>' +
        '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
        '</div>'
    });
    //软包装PET阴阳镀铝膜
	$('.softTipsPETYY').pt({
        position:'t',
        width: 300,
        height: 300,
        content: '<div class="bigBackground_left fl">' +
        '<p class="BestBig">PET阴阳镀铝膜</p>' +
        '<p style="color:#f00;">温馨提示：一半是透明膜，一半是镀铝膜，一般用于阴阳袋包装，阴阳袋都有窗口位，可通过窗口看到袋子里面的商品。</p>' +
        '<p class="bottomLink"><img src="/uploads/images/products/PET%E9%98%B4%E9%98%B3%E9%95%80%E9%93%9D%E8%86%9C.jpg" width="270" /></p>' +
        '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
        '</div>'
    });
    //软包装CPP
	$('.softTipsCPP').pt({
        position:'t',
        width: 300,
        height: 320,
        content: '<div class="bigBackground_left fl">' +
        '<p class="BestBig">CPP</p>' +
        '<p style="color:#f00;">温馨提示：平台上线的为普通CPP薄膜，非蒸煮级CPP薄膜，不能做蒸煮类袋；安全无味，可直接接触食品，一般用于茶叶、坚果、杂粮等干燥食品。</p>' +
        '<p class="bottomLink"><img src="/uploads/images/products/%E5%BB%B6%E8%81%9A%E4%B8%99%E7%83%AF%E8%96%84%E8%86%9C%EF%BC%88CPP%EF%BC%89.jpg" width="270" /></p>' +
        '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
        '</div>'
    });
    //软包装VMCPP镀铝膜
	$('.softTipsVMCPP').pt({
        position:'t',
        width: 300,
        height: 320,
        content: '<div class="bigBackground_left fl">' +
        '<p class="BestBig">VMCPP镀铝膜</p>' +
        '<p style="color:#f00;">温馨提示：镀铝级CPP薄膜，由CPP薄膜和铝箔复合而成的一种薄膜，透明度极好，厚度、纵横向的性能均匀。一般用于茶叶、坚果、杂粮等干燥食品。</p>' +
        '<p class="bottomLink"><img src="/uploads/images/products/VMCPP.jpg" width="270" /></p>' +
        '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
        '</div>'
    });
    //软包装PE
	$('.softTipsPE').pt({
        position:'t',
        width: 300,
        height: 300,
        content: '<div class="bigBackground_left fl">' +
        '<p class="BestBig">PE</p>' +
        '<p style="color:#f00;">温馨提示：具有防潮性、透湿性小，柔软性好，延伸率高，并且硬度低，主要用作复合袋的内层。</p>' +
        '<p class="bottomLink"><img src="/uploads/images/products/PE.jpg" width="270" /></p>' +
        '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
        '</div>'
    });
    //软包装开口方向下
	$('.softOpenDown').pt({
        position:'t',
        width: 300,
        height: 270,
        content: '<div class="bigBackground_left fl">' +
        '<p class="BestBig">下开口</p>' +
        '<p style="color:#f00;">温馨提示：袋子没装产品前，没有热封边的那一方即开口方向</p>' +
        '<p class="bottomLink"><img src="/static/mulindex/img/softpack/softOpenDown.jpg" width="270" /></p>' +
        '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
        '</div>'
    });
    //软包装开口方向上
	$('.softOpenUp').pt({
        position:'t',
        width: 300,
        height: 270,
        content: '<div class="bigBackground_left fl">' +
        '<p class="BestBig">上开口</p>' +
        '<p style="color:#f00;">温馨提示：袋子没装产品前，没有热封边的那一方即开口方向</p>' +
        '<p class="bottomLink"><img src="/static/mulindex/img/softpack/softOpenUp.jpg" width="270" /></p>' +
        '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
        '</div>'
    });
	$('.softTearOne').pt({
        position:'t',
        width: 300,
        height: 200,
        content: '<div class="bigBackground_left fl">' +
        '<p class="BestBig">一字型</p>' +
        '<p class="bottomLink"><img src="/static/mulindex/img/softpack/softTearOne.jpg" width="270" /></p>' +
        '</div>'
    });
	$('.softTearV').pt({
        position:'t',
        width: 300,
        height: 200,
        content: '<div class="bigBackground_left fl">' +
        '<p class="BestBig">V字型</p>' +
        '<p class="bottomLink"><img src="/static/mulindex/img/softpack/softTearV.jpg" width="270" /></p>' +
        '</div>'
    });
	$('.softTearU').pt({
        position:'t',
        width: 300,
        height: 200,
        content: '<div class="bigBackground_left fl">' +
        '<p class="BestBig">U字型</p>' +
        '<p class="bottomLink"><img src="/static/mulindex/img/softpack/softTearU.jpg" width="270" /></p>' +
        '</div>'
    });
	$('.softTearZigzag').pt({
        position:'t',
        width: 300,
        height: 200,
        content: '<div class="bigBackground_left fl">' +
        '<p class="BestBig">锯齿边</p>' +
        '<p class="bottomLink"><img src="/static/mulindex/img/softpack/softTearZigzag.jpg" width="270" /></p>' +
        '</div>'
    });
	$('.softCutStraight').pt({
        position:'t',
        width: 300,
        height: 200,
        content: '<div class="bigBackground_left fl">' +
        '<p class="BestBig">双刀切直角</p>' +
        '<p class="bottomLink"><img src="/static/mulindex/img/softpack/softCutStraight.jpg" width="270" /></p>' +
        '</div>'
    });
	$('.softCutFillet').pt({
        position:'t',
        width: 300,
        height: 200,
        content: '<div class="bigBackground_left fl">' +
        '<p class="BestBig">双刀切圆角</p>' +
        '<p class="bottomLink"><img src="/static/mulindex/img/softpack/softCutFillet.jpg" width="270" /></p>' +
        '</div>'
    });
	$('.softCutCircle').pt({
        position:'t',
        width: 300,
        height: 270,
        content: '<div class="bigBackground_left fl">' +
        '<p class="BestBig">模切圆角</p>' +
        '<p style="color:#f00;">温馨提示：模切圆角需做模切版，圆角效果更圆滑、对称</p>' +
        '<p class="bottomLink"><img src="/static/mulindex/img/softpack/softCutCircle.jpg" width="270" /></p>' +
        '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
        '</div>'
    });
	$('.TipsZipper').pt({
        position:'t',
        width: 300,
        height: 310,
        content: '<div class="bigBackground_left1 fl">' +
        '<p class="BestBig">拉链</p>' +
        '<p style="color:#f00;">温馨提示：热封底层材质为PE，拉链材质对应为PE；热封底层材质为CPP，拉链材质对应为CPP；PE拉链比较软，CPP拉链比较硬、比较脆。</p>' +
        '<p class="bottomLink"><img src="/static/mulindex/img/softpack/zipper.jpg" width="270" /></p>' +
        '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
        '</div>'
    });
    //塑料吊扣
    $('.TipsBuckleWhite').pt({
        position:'t',
        width: 220,
        height: 220,
        content: '<div class="bigBackground_left1 fl">' +
        '<p class="BestBig">白色塑料吊扣</p>' +
        '<p class="bottomLink"><img src="/uploads/images/plastic_buckle_white.jpg" width="200" /></p>' +
        '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
        '</div>'
    });
    $('.TipsBuckleBlack').pt({
        position:'t',
        width: 220,
        height: 220,
        content: '<div class="bigBackground_left1 fl">' +
        '<p class="BestBig">黑色塑料吊扣</p>' +
        '<p class="bottomLink"><img src="/uploads/images/plastic_buckle_black.jpg" width="200" /></p>' +
        '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
        '</div>'
    });
    $('.TipsBuckleBright').pt({
        position:'t',
        width: 220,
        height: 250,
        content: '<div class="bigBackground_left1 fl">' +
        '<p class="BestBig">透明吊扣</p>' +
        '<p class="bottomLink"><img src="/uploads/images/plastic_buckle_bright.jpg" width="200" /></p>' +
        '<p class="bottomLink">如有疑问，请与' + serviceQQ + ' 联系。</p>' +
        '</div>'
    });
    
});
}(window.jQuery)