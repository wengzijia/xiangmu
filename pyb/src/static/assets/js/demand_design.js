// JavaScript Document
function get_attr(attr, string){
    var msg = '';
	
    $.each(attr, function(i,item){
        if(item.indexOf(string) >= 0){
            msg = item.replace(string,'');

            return false;
        }
    });
	
    return msg;
}
function showdata(result, tocart) {
	//console.log(result);
	var _this;
	if (tocart == 0) {
		_this = $('#myModal_0622');
	} else {
		_this = $('#myModal_0724');
	}
	
	_this.find('.demand_sn').text(result.data.demand_sn);
	
	var _param = result.data.param;
	
	//console.log(_param);
	attr = _param.split(';');
	
	setdefault();
	
	//成品尺寸:200_120_140;展开尺寸:655.00_380.00;纸张材质:单铜纸_250;表面处理:哑油;印刷颜色:单色_品红;烫金1:银色_12_14;
	
	var size = get_attr(attr, '成品尺寸:');
	
	if (size.length<1) {
		$('.sizediv').hide();
	} else {
		var _lwh = size.split('_');
		var _csize = _this.find('.csize');
		$.each(_csize, function(i){
			$(this).val(_lwh[i]);
		});
		_this.find('.sizediv').show();
	}
	
	
	var open_size = get_attr(attr, '展开尺寸:');
	var _open_lwh = open_size.split('_');
	$('.unfoldsize').html(_open_lwh[0]+'mm*'+_open_lwh[1]+'mm');
	
	var _material = get_attr(attr, '纸张材质:');
	var _paper = _material.split('_');
	
	setval($('.paper'), _paper[0]);
	$('.weight').hide();
	if (_paper[0] == '单铜纸') {
		setval($('.dantong'), _paper[1]);
		$('.dantong').show();
	} else if (_paper[0] == '银卡纸') {
		setval($('.yinka'), _paper[1]);
		$('.yinka, .wbb1022Jiayinbaimo').show();
		$('.surface').hide();
		$('.niuv').show();
	} else if (_paper[0] == '双面红牛皮纸') {
		setval($('.hongniupi'), _paper[1]);
		$('.hongniupi').show();
	} else if (_paper[0] == '雪白牛皮纸') {
		setval($('.bainiupi'), _paper[1]);
		$('.bainiupi').show();
	}
	
	var _surface = get_attr(attr, '表面处理:');
	setval($('.surface'), _surface);
	
	var _yinwhite = attr.indexOf('加印白墨');
	if (_yinwhite >= 0) {
		$('.wbb1022Jiayinbaimo').addClass('selectedBox');
	}
	
	var _color = get_attr(attr, '印刷颜色:');
	var _arr_color = _color.split('_');
	setval($('.colors'), _arr_color[0]);
	
	if (_arr_color[0] == '多色') {
		$('.multise').show();
		setval2($('.multise'), _arr_color[1]);
	} else {
		$('.singlese').show();
		setval2($('.singlese'), _arr_color[1]);
	}
	
	//$("input[name='num']").val(result.data.num);
	
	var _gilding = get_attr(attr, '烫金1:');
	
	if (_gilding != '') {
		$('.tangjinli').addClass('wbb1202Dd2727li');
		var _arr_gilding = _gilding.split('_');
		setval($('.tangjincolor>li'), _arr_gilding[0]);
		$('.gilding_l').val(_arr_gilding[1]);
		$('.gilding_w').val(_arr_gilding[2]);
	}
	
	var _gilding2 = get_attr(attr, '烫金2:');
	
	if (_gilding2 != '') {
		$('.tangjin2').removeClass('hide');
		var _arr_gilding2 = _gilding2.split('_');
		setval($('.tangjincolor2>li'), _arr_gilding2[0]);
		$('.gilding_l2').val(_arr_gilding2[1]);
		$('.gilding_w2').val(_arr_gilding2[2]);
	}
	
	var _emboss = get_attr(attr, '击凸1:');
	if (_emboss != '') {
		$('.jituli').addClass('wbb1202Dd2727li');
		var _arr_emboss = _emboss.split('_');
		$('.emboss_l').val(_arr_emboss[0]);
		$('.emboss_w').val(_arr_emboss[1]);
	}
	
	var _emboss2 = get_attr(attr, '击凸2:');
	if (_emboss2 != '') {
		$('.jitu2').removeClass('hide');
		var _arr_emboss2 = _emboss2.split('_');
		$('.emboss_l2').val(_arr_emboss2[0]);
		$('.emboss_w2').val(_arr_emboss2[1]);
	}
	
	var _part = get_attr(attr, '局部UV1:');
	if (_part != '') {
		$('.jubuli').addClass('wbb1202Dd2727li');
		var _arr_part = _part.split('_');
		$('.part_l').val(_arr_part[0]);
		$('.part_w').val(_arr_part[1]);
	}
	
	var _part2 = get_attr(attr, '局部UV2:');
	if (_part2 != '') {
		$('.jubu2').removeClass('hide');
		var _arr_part2 = _part2.split('_');
		$('.part_l2').val(_arr_part2[0]);
		$('.part_w2').val(_arr_part2[1]);
	}
	
	var _stick = get_attr(attr, '贴窗:');
	if (_stick != '') {
		$('.tieli').addClass('wbb1202Dd2727li');
		var _arr_stick = _stick.split('_');
		$('.stick_l').val(_arr_stick[0]);
		$('.stick_w').val(_arr_stick[1]);
	}
	
	if (tocart == 0) {
		layer.open({
		  type: 1,
		  anim: 1,
		  area: ['65%', '95%'],
		  title: '代下订单详情',
		  content: $('#myModal_0622')
		});
		//$('#myModal_0622').modal('show');
	} else {
		layer.open({
		  type: 1,
		  anim: 1,
		  area: ['65%', '95%'],
		  title: '代下订单详情',
		  content: $('#myModal_0724')
		});
		//$('#myModal_0724').modal('show');
	}
	
}
function setval(obj, _val) {
	obj.removeClass('wbb1202Dd2727li');
	$.each(obj, function(i,n){
		var _data = $(this).attr('data-val');
		
		if (_data == _val) {
			$(this).addClass('wbb1202Dd2727li');
		}
	});
}
function setval2(obj, _val) {
	obj.removeClass('selectedBox');
	$.each(obj, function(i,n){
		var _data = $(this).attr('data-val');
		
		if (_data == _val) {
			$(this).addClass('selectedBox');
		}
	});
}
function setdefault() {
	$('.wbb1202Right-connect-ul2>li').removeClass('wbb1202Dd2727li');
	$('.wbb1203SmallTriangle, .wbb1022Hide, .wbb1022Jiayinbaimo').hide();
	$('.wbb1203Addqita>div').hide();
	$('.wbb1022Jiayinbaimo').removeClass('selectedBox');
	$('.wbb1203Addqita').find("input").attr({'readOnly':'readOnly'}).val('');
}