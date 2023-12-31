  // 图片上传demo
jQuery(function() {

    onefile('cover_path',$('.insertCover'));
    onefile('cover_path_wx',$('.insertCover_wx'));
    onefile('cover_path_qr',$('.insertCover_qr'));
    onefile('photo_path_1',$('.photo_path_1_insertPhoto'));
    onefile('photo_path_2',$('.photo_path_2_insertPhoto'));
    onefile('photo_path_3',$('.photo_path_3_insertPhoto'));
    onefile('photo_path_4',$('.photo_path_4_insertPhoto'));
    onefile('photo_path_5',$('.photo_path_5_insertPhoto'));
    onefile('photo_path_6',$('.photo_path_6_insertPhoto'));
    onefile('photo_path_7',$('.photo_path_7_insertPhoto'));
    onefile('cutter_path',$('.insertCutter'));
    onefile('unfold_img',$('.insertUnfold'));
    function onefile(fileList,pickbutton) {
        var $ = jQuery,
            $list = $('#'+fileList),
            // 优化retina, 在retina下这个值是2
            ratio = window.devicePixelRatio || 1,

            // 缩略图大小
            thumbnailWidth = 100 * ratio,
            thumbnailHeight = 100 * ratio,

            // Web Uploader实例
            uploader;

        // 初始化Web Uploader
        uploader = WebUploader.create({

            // 自动上传。
            auto: true,

            // swf文件路径
            swf: uploadFlash,

            // 文件接收服务端。
            server: uploadPictuer,

            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: pickbutton,

            // 只允许选择文件，可选。
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png,pdf,cdr',
                mimeTypes: 'image/*,application/pdf'
            }
        });

        // 当有文件添加进来的时候
        uploader.on( 'fileQueued', function( file ) {
            var $li = $(
                    '<div id="' + file.id + '" class="file-item thumbnail">' +
                        '<img>' +
                    '</div>'
                    ),
                $img = $li.find('img');

            $list.html( $li );

            // 创建缩略图
            uploader.makeThumb( file, function( error, src ) {
                if ( error ) {
                    $img.replaceWith('<span>不能预览</span>');
                    return;
                }

                $img.attr( 'src', src );
            }, thumbnailWidth, thumbnailHeight );
        });

        // 文件上传过程中创建进度条实时显示。
        uploader.on( 'uploadProgress', function( file, percentage ) {
            var $li = $( '#'+file.id ),
                $percent = $li.find('.progress span');

            // 避免重复创建
            if ( !$percent.length ) {
                $percent = $('<p class="progress"><span></span></p>')
                        .appendTo( $li )
                        .find('span');
            }

            $percent.css( 'width', percentage * 100 + '%' );
        });

        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
        uploader.on( 'uploadSuccess', function( file ,response) {
            $( '#'+file.id ).addClass('upload-state-done');
            $('.'+fileList).val(response.path);
        });
        // 文件上传失败，现实上传出错。
        uploader.on( 'uploadError', function( file ) {
            var $li = $( '#'+file.id ),
                $error = $li.find('div.error');

            // 避免重复创建
            if ( !$error.length ) {
                $error = $('<div class="error"></div>').appendTo( $li );
            }

            $error.text('上传失败');
        });

        // 完成上传完了，成功或者失败，先删除进度条。
        uploader.on( 'uploadComplete', function( file ) {
            $( '#'+file.id ).find('.progress').remove();
        });

    }
});