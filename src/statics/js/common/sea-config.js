seajs.config({
    // base: 'http://localhost:8889/statics/js/plugins/',
    alias: {
        'jquery': 'jquery-3.2.1.min.js',
        'swiper': 'swiper/swiper.min.js',
		'zepto': 'zepto/zepto-seajs.min.js',
        'fastclick': 'fastclick.min.js',
        'artTemplate': 'artTemplate/template.js',
		'artTemplate4': 'artTemplate/template-web.js',
        'artTemplateHelper': 'artTemplate/helper.js',
        'layer': 'layer.m/layer.js',
        'layerCss': 'layer.m/need/layer.css',
        "download":"channel-download.js",
        "wechat":"wx/jweixin-1.0.0.js"
    },
    //map: [[/^(.*\.(?:css|js))(.*)$/i, '$1?v=2017040620002']],
    charset: 'utf-8'
});
