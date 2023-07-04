(function () {
    var bv = new Bideo();
    var ds = new Bideo();
    var dm = new Bideo();
    var host = 'http://'+window.location.host;
    bv.init({
        // Video element
        videoEl: document.querySelector('#background_price_video'),

        // Container element
        container: document.querySelector('body'),

        // Resize
        resize: true,

        // autoplay: false,

        isMobile: window.matchMedia('(max-width: 768px)').matches,

        // Array of objects containing the src and type
        // of different video formats to add
        src: [
            {
                src: host+'/static/active/images/night.mp4',
                type: 'video/mp4'
            },
            {
                src: 'night.webm',
                type: 'video/webm;codecs="vp8, vorbis"'
            }
        ],

        // What to do once video loads (initial frame)
        onLoad: function () {
            document.querySelector('#video_price_cover').style.display = 'none';
        }
    });
    ds.init({
        // Video element
        videoEl: document.querySelector('#background_ds_video'),

        // Container element
        container: document.querySelector('body'),

        // Resize
        resize: true,

        // autoplay: false,

        isMobile: window.matchMedia('(max-width: 768px)').matches,

        // Array of objects containing the src and type
        // of different video formats to add
        src: [
            {
                src: host+'/static/active/images/3dv.mp4',
                type: 'video/mp4'
            },
            {
                src: 'night.webm',
                type: 'video/webm;codecs="vp8, vorbis"'
            }
        ],

        // What to do once video loads (initial frame)
        onLoad: function () {
            document.querySelector('#video_ds_cover').style.display = 'none';
        }
    });
    dm.init({
        // Video element
        videoEl: document.querySelector('#background_dm_video'),

        // Container element
        container: document.querySelector('body'),

        // Resize
        resize: true,

        // autoplay: false,

        isMobile: window.matchMedia('(max-width: 768px)').matches,

        // Array of objects containing the src and type
        // of different video formats to add
        src: [
            {
                src: host+'/static/active/images/dmv.mp4',
                type: 'video/mp4'
            },
            {
                src: 'night.webm',
                type: 'video/webm;codecs="vp8, vorbis"'
            }
        ],

        // What to do once video loads (initial frame)
        onLoad: function () {
            document.querySelector('#video_dm_cover').style.display = 'none';
        }
    });
}());
