//卡盒加价设置
var InitiateEditableDataTable = function () {
    return {
        init: function () {
            //Datatable Initiating
        	var labelid = '#editabledatatable';
        	datainit(labelid,1);
        }

    };
}();
//手提袋加价设置
var InitiateEditablebagDataTable = function () {
    return {
        init: function () {
            //Datatable Initiating
        	var labelid = '#editablebagdatatable';
        	datainit(labelid,2);
        }

    };
}();
//纸罐加价设置
var InitiateEditablecansDataTable = function () {
	return {
        init: function () {
            //Datatable Initiating
        	var labelid = '#editablecansdatatable';
        	datainit(labelid,3);
        }
    };
}();
//标签吊牌加价设置
var InitiateEditabletagDataTable = function () {
	return {
        init: function () {
            //Datatable Initiating
        	var labelid = '#editabletagdatatable';
        	datainit(labelid,4);
        }
    };
}();
//纸杯加价设置
var InitiateEditablecupDataTable = function () {
	return {
        init: function () {
            //Datatable Initiating
        	var labelid = '#editablecupdatatable';
        	datainit(labelid,5);
        }
    };
}();
//精品盒加价设置
var InitiateEditableboxDataTable = function () {
	return {
        init: function () {
            //Datatable Initiating
        	var labelid = '#editableboxdatatable';
        	datainit(labelid,6);
        }
    };
}();
//微坑盒加价设置
var InitiateEditablekboxDataTable = function () {
	return {
        init: function () {
            //Datatable Initiating
        	var labelid = '#editablekboxdatatable';
        	datainit(labelid,7);
        }
    };
}();
//微坑盒加价设置
var InitiateEditabletinDataTable = function () {
	return {
        init: function () {
            //Datatable Initiating
        	var labelid = '#editabletindatatable';
        	datainit(labelid,8);
        }
    };
}();
//封箱胶带加价设置
var InitiateEditabletapeDataTable = function () {
	return {
        init: function () {
            //Datatable Initiating
        	var labelid = '#editabletapedatatable';
        	datainit(labelid,9);
        }
    };
}();
//铁罐加价设置
var InitiateEditabletinguandatatable = function () {
	return {
        init: function () {
            //Datatable Initiating
        	var labelid = '#editabletinguandatatable';
        	datainit(labelid,10);
        }
    };
}();
//塑料盒加价设置
var InitiateEditableplasdatatable = function () {
	return {
        init: function () {
            //Datatable Initiating
        	var labelid = '#editableplasdatatable';
        	datainit(labelid,11);
        }
    };
}();
//塑料罐加价设置
var InitiateEditableplasguandatatable = function () {
	return {
        init: function () {
            //Datatable Initiating
        	var labelid = '#editableplasguandatatable';
        	datainit(labelid,12);
        }
    };
}();
//软包装加价设置
var InitiateEditablepackagedatatable  = function () {
	return {
        init: function () {
            //Datatable Initiating
        	var labelid = '#editablepackagedatatable';
        	datainit(labelid,13);
        }
    };
}();
//吊牌加价设置
var InitiateEditablelabeldatatable  = function () {
	return {
        init: function () {
            //Datatable Initiating
        	var labelid = '#editablelabeldatatable';
        	datainit(labelid,14);
        }
    };
}();
//内托价格设置
var InitiateEditablenetodatatable = function () {
	return {
        init: function () {
            //Datatable Initiating
        	var labelid = '#editablenetodatatable';
        	datainit(labelid,15);
        }
    };
}();
//公共方法
function datainit(labelid,catId){
    var oTable = $(labelid).dataTable({
        "aLengthMenu": [
            [10, 20, -1],
            [10, 20, "All"]
        ],
        "searching" : false,	//禁止搜索
        //"bSort": false,		//禁止排序
        "paging": false,		//禁止分页
        //"info": false,		//禁止底部信息
        "iDisplayLength": 10,
        "sPaginationType": "bootstrap",
        "sDom": "Tflt<'row DTTTFooter'<'col-sm-7'i><'col-sm-7'p>>",
        "oTableTools": {
            "aButtons": [],
            "sSwfPath": "assets/swf/copy_csv_xls_pdf.swf"
        },
        "language": {
            "search": "",
            "sLengthMenu": "_MENU_",
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"
            }
        },
        "aoColumns": [
          { "bSortable": false },
          { "bSortable": false },
          { "bSortable": false },
          { "bSortable": false },
          { "bSortable": false },
          { "bSortable": false },
          { "bSortable": false }
        ]
    });

    var isEditing = null;

    //Add New Row
    $(labelid+'_new').click(function (e) {
        e.preventDefault();
        //注意这里error
        var aiNew = oTable.fnAddData(['', '', '', '', '', '',
            '<a href="#" class="btn btn-success btn-xs save"><i class="fa fa-edit"></i> 保存</a> <a href="#" class="btn btn-warning btn-xs cancel"><i class="fa fa-times"></i> 取消</a>'
        ]);

        var nRow = oTable.fnGetNodes(aiNew[0]);
        addRow(nRow);
        isEditing = nRow;
    });
    //关闭/开启
    $(labelid).on("click", 'a.switch', function (e) {
        e.preventDefault();
        var nRow = $(this).parents('tr')[0];
        var id = $(this).attr("data-id");

        //oTable.fnDeleteRow(nRow);
        var url = 'useprice';
        $.ajax({
            cache: true,
            type: "POST",
            url : url,
            data: {id:id},
            async: false,
            success: function(result){

                if (result.code) {
                    layer.msg(result.msg,{icon:1});
                    setTimeout(function () {
                        location.href = '/index.php/agent/user/prices';
                    }, 1000);
                } else {
                    layer.msg(result.msg,{icon:2});
                    return false;
                }
            },
            error: function(request) {
                layer.msg("系统错误",{icon:2});
                return false;
            }
        });
        layer.close(index);
    });

    //Delete an Existing Row
    $(labelid).on("click", 'a.delete', function (e) {
        e.preventDefault();
        var nRow = $(this).parents('tr')[0];
        var id = $(this).attr("data-id");
        layer.confirm('确定删除该记录吗',  function(index){
        	
            oTable.fnDeleteRow(nRow);
            var url = 'delprice';
            $.ajax({
				cache: true,
				type: "POST",
				url : url,
				data: {id:id},
				async: false,
				success: function(result){
					
					if (result.code) {
						layer.msg(result.msg,{icon:1});
					} else {
						layer.msg(result.msg,{icon:2});
				  		return false;
					}
				},
				error: function(request) {
			  		layer.msg("系统错误",{icon:2});
			  		return false;
				}
			});
            layer.close(index);
    	});
    });

    //Cancel Editing or Adding a Row
    $(labelid).on("click", 'a.cancel', function (e) {
        e.preventDefault();
        
        if ($(this).attr("data-mode") == "new") {
            var nRow = $(this).parents('tr')[0];
            oTable.fnDeleteRow(nRow);
        } else {
            restoreRow(oTable, isEditing);
            isEditing = null;
        }
    });

    //Edit A Row
    $(labelid).on("click", 'a.edit', function (e) {
        e.preventDefault();
        var id = $(this).attr('data-id');
        var nRow = $(this).parents('tr')[0];
        
        editRow(oTable, nRow, id);
        isEditing = nRow;
    });

    //Save an Editing Row
    $(labelid).on("click", 'a.save', function (e) {
        e.preventDefault();
        if (this.innerHTML.indexOf("保存") >= 0) {
        	var id = $(this).attr('data-id');
        	if(typeof(id) == 'undefined'){
        		id = 0;
        	}
        	
        	var nRow = $(this).parents('tr')[0];
        	var jqInputs = $('input', nRow);
        	var start_section 	= jqInputs[0].value;
        	var end_section 	= jqInputs[1].value;
        	var min_money 		= jqInputs[2].value;
        	var discount 		= jqInputs[3].value;
        	var tax_rate 		= jqInputs[4].value;
        	
        	if(start_section == ''){
        		layer.msg("订单最小数量不能为空",{icon:2});
        		return false;
        	}else if(isNaN(start_section)){
        		layer.msg("订单最小数量必须为数字",{icon:2});
        		return false;
        	}
        	
        	if(end_section != '' && isNaN(end_section)){
        		layer.msg("订单最大数量必须为数字",{icon:2});
        		return false;
        	}
        	
        	if(min_money != '' && isNaN(min_money)){
        		layer.msg("订单保底利润必须为数字",{icon:2});
        		return false;
        	}
        	
        	if(discount != '' && isNaN(discount)){
        		layer.msg("加价比例必须为数字",{icon:2});
        		return false;
        	}
        	var url = 'pricedata';
        	var disid = 0;
            //Some Code to Highlight Updated Row
            $.ajax({
				cache: true,
				type: "POST",
				url : url,
				data: {id:id,cat_id:catId,start_section:start_section,end_section:end_section,min_money:min_money,discount:discount,tax_rate:tax_rate},
				async: false,
				success: function(result){
					
					if (result.code) {
						disid = result.data.id;
						layer.msg(result.msg,{icon:1});
					} else {
						layer.msg(result.msg,{icon:2});
                        setTimeout(function () {
                            location.href = '/index.php/agent/user/prices';
                        }, 1000);
				  		return false;
					}
				},
				error: function(request) {
			  		layer.msg("系统错误",{icon:2});
			  		return false;
				}
			});
            
            saveRow(oTable, isEditing, disid);
            isEditing = null;
        }
    });

    function restoreRow(oTable, nRow) {
        var aData = oTable.fnGetData(nRow);
        var jqTds = $('>td', nRow);
        console.log(jqTds);
        for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
            oTable.fnUpdate(aData[i], nRow, i, false);
            
        }

        oTable.fnDraw();
    }

    function editRow(oTable, nRow, disid) {
        var aData = oTable.fnGetData(nRow);
        var jqTds = $('>td', nRow);
        jqTds[0].innerHTML = '<input type="text" class="form-control input-small" value="' + aData[0] + '">';
        jqTds[1].innerHTML = '<input type="text" class="form-control input-small" value="' + aData[1] + '">';
        jqTds[2].innerHTML = '<input type="text" class="form-control input-small" value="' + aData[2] + '">';
        jqTds[3].innerHTML = '<input type="text" class="form-control input-small" value="' + aData[3] + '">';
        jqTds[4].innerHTML = '<input type="text" class="form-control input-small" value="' + aData[4] + '">';
        jqTds[5].innerHTML = '';
        jqTds[6].innerHTML = '<a href="#" class="btn btn-success btn-xs save" data-id="'+disid+'"><i class="fa fa-save"></i> 保存</a> <a href="#" class="btn btn-warning btn-xs cancel"><i class="fa fa-times"></i> 取消</a>';
    }

    function addRow(nRow) {
        var jqTds = $('>td', nRow);

        jqTds[0].innerHTML = '<input type="text" class="form-control input-small" value="0">';
        jqTds[1].innerHTML = '<input type="text" class="form-control input-small" value="">';
        jqTds[2].innerHTML = '<input type="text" class="form-control input-small" value="0">';
        jqTds[3].innerHTML = '<input type="text" class="form-control input-small" value="0">';
        jqTds[4].innerHTML = '<input type="text" class="form-control input-small" value="0">';
        jqTds[5].innerHTML = '<a href="#" class="btn btn-success btn-xs switch"><i class="fa fa-check right"></i> 开</a>';
        jqTds[6].innerHTML = '<a href="#" class="btn btn-success btn-xs save"><i class="fa fa-save"></i> 保存</a> <a href="#" data-mode="new" class="btn btn-warning btn-xs cancel"><i class="fa fa-times"></i> 取消</a>';
    }
    
    function saveRow(oTable, nRow, disid) {
        var jqInputs = $('input', nRow);
        
        oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
        oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
        oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
        oTable.fnUpdate(jqInputs[3].value, nRow, 3, false);
        oTable.fnUpdate(jqInputs[4].value, nRow, 4, false);
        oTable.fnUpdate('<a href="#" class="btn btn-success btn-xs switch" data-id="'+disid+'"><i class="fa fa-check right"></i> 开</a>', nRow, 5, false);
        oTable.fnUpdate('<a href="#" class="btn btn-info btn-xs edit" data-id="'+disid+'"><i class="fa fa-edit"></i> 编辑</a> <a href="#" class="btn btn-danger btn-xs delete" data-id="'+disid+'"><i class="fa fa-trash-o"></i> 删除</a>', nRow, 6, false);
        oTable.fnDraw();
    }

    function cancelEditRow(oTable, nRow) {
        var jqInputs = $('input', nRow);
        oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
        oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
        oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
        oTable.fnUpdate(jqInputs[3].value, nRow, 3, false);
        oTable.fnUpdate(jqInputs[4].value, nRow, 4, false);
        oTable.fnUpdate(jqInputs[5].value, '', 5, false);
        oTable.fnUpdate('<a href="#" class="btn btn-info btn-xs edit"><i class="fa fa-edit"></i> 编辑</a> <a href="#" class="btn btn-danger btn-xs delete"><i class="fa fa-trash-o"></i> 删除</a>', nRow, 6, false);
        oTable.fnDraw();
    }
}