function fileupload(filetag, acceptFileTypes, url, istag){
    var loadtag = false;
    var host = 'http://'+window.location.host;
    $(filetag).fileupload({
        url: url,
        dataType: 'json',
        done: function (e, data) {
            var res = data.result;
            if(res.code){
                Callback(res.data,istag);
                loadtag = true;
                $("#loadingsrc").attr("src",host+"/static/upload/images/finish.png");
                setTimeout(function(){  //使用  setTimeout（）方法设定定时2000毫秒
                    layer.closeAll();
                },1000);
                setTimeout(function(){  //使用  setTimeout（）方法设定定时2000毫秒
                    clear();
                },2000);

            }else{
                layer.msg(res.msg,{icon:2});
                layer.closeAll();
            }

        },
        add: function(e, data) {
            //文件类型判断
            console.log(data.originalFiles[0]['type']);
            if(data.originalFiles[0]['type'].length && !acceptFileTypes.test(data.originalFiles[0]['type'])) {

                layer.msg("上传文件类型不对！",{icon:2});
                return ;
            }

            var size_total = 200 * 1024 * 1024;
            //文件大小判断
            if(data.originalFiles[0]['size'] > size_total){
                layer.msg("文件超过200M！",{icon:2});
                return ;
            }

            init();

            data.submit();
        },
        progressall: function (e, data) {

            var progress = parseInt(data.loaded / data.total * 100, 10);

            $('.progress-bar').css(
                'width',
                progress + '%'
            );
        }
    }).prop('disabled', !$.support.fileInput)
        .parent().addClass($.support.fileInput ? undefined : 'disabled');
    function init(){

        //初始化数据
        layer.open({
            type: 1,
            title: "分析中···",
            closeBtn: 0, //不显示关闭按钮
            shade: [0],
            area: ['450px', '185px'],
            offset: 'rb', //右下角弹出
            anim: 2,
            content: $("#progreebar") //iframe的url，no代表不显示滚动条

        });
    }
    function clear(){
        //重置数据
        $('#progress .progress-bar').css('width','0%');
        $("#loadingsrc").attr("src",host+"/static/upload/images/loading2.gif");
    }
}