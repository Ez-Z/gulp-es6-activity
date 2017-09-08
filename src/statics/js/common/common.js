// 设计图宽度
window['adaptive'].desinWidth = 750;
// body 字体大小 会将body字体大小设置为 baseFont / 100 + 'rem'  750的设计图一般设置为28,640的设计图一般设置为24
window['adaptive'].baseFont = 24;
//最大宽度
window['adaptive'].maxWidth = 750;
// 初始化
window['adaptive'].init();

/**
 * URL参数处理
 * @param {String} name
 */
var getUrlParam = function(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}
var webUrl = '/webUrl';
var pcUrl = '/pcUrl';
var wapUrl = '/wapUrl';
if(webUrl.split('/')[1] == 'webUrl'){
	webUrl = '';
}
/*
	假日宝点击礼盒
*/

function lottery(){
	//白银礼盒
	$(document).on('click','.gift-silver img',function(){
		$('.gift-silver img').attr('src','/statics/img/pages/2017/holiday2/silver-open.png').removeClass('imgWidth2').addClass('imgWidth1');
		$('.gift-gold img').attr('src','/statics/img/pages/2017/holiday2/gold-close.png').removeClass('imgWidth1').addClass('imgWidth2');
		$('.gift-Diamonds img').attr('src','/statics/img/pages/2017/holiday2/diamonds-close.png').removeClass('imgWidth1').addClass('imgWidth2');
		$('.gift-lists1').removeClass('hide').siblings('div').addClass('hide');
		$('.holiday-bi').html('1个假日币');
		$('.arrow1').css({'margin-left':'.64rem'});
	})
	$(document).on('click','.gift-gold img',function(){
		$('.gift-silver img').attr('src','/statics/img/pages/2017/holiday2/silver-close.png').removeClass('imgWidth1').addClass('imgWidth2');
		$('.gift-gold img').attr('src','/statics/img/pages/2017/holiday2/gold-open.png').removeClass('imgWidth2').addClass('imgWidth1');
		$('.gift-Diamonds img').attr('src','/statics/img/pages/2017/holiday2/diamonds-close.png').removeClass('imgWidth1').addClass('imgWidth2');
		$('.gift-lists2').removeClass('hide').siblings('div').addClass('hide');
		$('.holiday-bi').html('5个假日币');
		$('.arrow1').css({'margin-left':'3.16rem'});
	})
	$(document).on('click','.gift-Diamonds img',function(){
		$('.gift-silver img').attr('src','/statics/img/pages/2017/holiday2/silver-close.png').removeClass('imgWidth1').addClass('imgWidth2');
		$('.gift-gold img').attr('src','/statics/img/pages/2017/holiday2/gold-close.png').removeClass('imgWidth1').addClass('imgWidth2');
		$('.gift-Diamonds img').attr('src','/statics/img/pages/2017/holiday2/diamonds-open.png').removeClass('imgWidth2').addClass('imgWidth1');
		$('.gift-lists3').removeClass('hide').siblings('div').addClass('hide');
		$('.holiday-bi').html('10个假日币');
		$('.arrow1').css({'margin-left':'5.5rem'});
	})
};

//抽奖
function prize(){
	$(document).on('click','.gift-text',function(){
		var giftType = $(this).attr('type');
		if(giftType == 0){
			var span = '确定领取白银礼盒吗？',
			src1 = '/statics/img/pages/2017/holiday2/silver1.png',
			src2 = '/statics/img/pages/2017/holiday2/silver1.png',
			src3 = '/statics/img/pages/2017/holiday2/silver1.png';

		}else if(giftType == 1){
			var span = '确定领取钻石礼盒吗？'
			src1 = '/statics/img/pages/2017/holiday2/silver2.png',
			src2 = '/statics/img/pages/2017/holiday2/silver2.png',
			src3 = '/statics/img/pages/2017/holiday2/silver2.png';
		}else if(giftType == 2){
			var span = '确定领取黄金礼盒吗？'
			src1 = '/statics/img/pages/2017/holiday2/silver1.png',
			src2 = '/statics/img/pages/2017/holiday2/silver2.png',
			src3 = '/statics/img/pages/2017/holiday2/silver1.png';
		}
		layer.open({
			className:'get-gift',
			shadeClose:false,
			content: '<div class="close pos-abs"><div class="close-btn"></div></div><p class="conYou"><span class="span-gift">'+span+'</span></p><p class="spanP">领取后随机获得礼盒中的一件奖品</p><div class="img-list"><dl class="img-item"><dt><img class="img1" src='+src1+'></dt><dd>2元红包</dd></dl><dl class="img-item"><dt><img class="img1" src='+src2+'></dt><dd>2元红包</dd></dl><dl class="img-item"><dt><img class="img1" src='+src3+'></dt><dd>2元红包</dd></dl></div><div class="address">确认领取</div>'
		});
		$(document).on('click','.close-btn',function(){
			 layer.closeAll();
		});
		$(document).one('click','.address',function(){
			layer.closeAll();
			$.ajax({
				type: "get",
				url: webUrl + "/holiday/lottery.html",
				data: {
					userId: getUrlParam('userId'),
					giftType:giftType
				},
				dataType: "jsonp",
				success: function(data) {
					if (typeof responseData == "string") {
						data = JSON.parse(data);
					}
					console.log(data);
					if (data.result) {
						var name = data.gift.name;
						var src = '/statics/img/pages/2017/holiday2/second11.png';
							layer.open({
								className:'get-gift2 pos-rel',
								shadeClose:false,
								content: '<div class="close pos-abs"><div class="close-btn"></div></div><p class="conYou"><span>恭喜你~</span></p><p class="spanP">领取<span>'+name+'</span>奖品</p><img src='+src+'><p class="address">您可以去<span>APP-我的-奖品区</span><p/><p class="address">查询中奖记录哦!</p><div class="lay-share pos-abs">分享朋友圈&nbsp;,&nbsp;&nbsp;让更多朋友知道</div>',
								success:function(elem){
									self.getLotteryNumber();
								}
							});
					}else{
						alert("抽奖msg="+data.msg)
					}
				},
				error:function(data){
					alert('error')
				}
			});
		})
	})
}

//抽奖次数
function prizeNum(){
	$.ajax({
		type: "get",
		url: webUrl + "/holiday/getLotteryNumber.html",
		data: {
			userId: getUrlParam('userId'),
		},
		dataType: "jsonp",
		success: function(data) {
			console.log(data);
			if (typeof responseData == "string") {
				data = JSON.parse(data);
			}
			if(data.result){
				if(data.count == 1){
					$('.counts').html(data.counts);
					if(data.counts>0  && data.counts<5){
						$('.gift-text1').removeClass('btn-disabled').addClass('btn-abled-color');
					}else if (data.counts>=5 && data.counts<10) {
						$('.gift-text1').removeClass('btn-disabled').addClass('btn-abled-color');
						$('.gift-text2').removeClass('btn-disabled').addClass('btn-abled-color');
					}else if (data.counts>=10) {
						$('.gift-text1').removeClass('btn-disabled').addClass('btn-abled-color');
						$('.gift-text2').removeClass('btn-disabled').addClass('btn-abled-color');
						$('.gift-text3').removeClass('btn-disabled').addClass('btn-abled-color');
					}
				}else{
					$('.counts').html(0);
				}
			}else{
				alert('抽奖次数='+data.msg)
			}
		}
	});
}
