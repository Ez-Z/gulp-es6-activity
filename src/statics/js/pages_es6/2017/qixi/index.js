define(function(require, exports, module) {
	require('jquery');
	let layer = require('layer');
	require('layerCss');
	require('fastclick');
	FastClick.attach(document.body);
	let redBag = {
		'30': [5, 5, 20],
		'77': [15, 22, 40],
		'500': [60, 70, 80, 90, 200],
		'888': [120, 80, 200, 400, 800],
		'1600': [120, 120, 160, 400, 800],
		'3000': [120, 120, 240, 220, 900, 1400]
	};
	class Qixi {
		constructor() {
			this.init = ::this.init;
			this.listen = ::this.listen;
			this.init();
			this.listen();
		}
		init() {
			this.userId = getUrlParam('userId');
			this.type = getUrlParam('type');
			if(!this.type){
				this.setPage();
				this.app();
			}
		}
		app() {
			let self = this;
			//S-APP交互相关
			function connectWebViewJavascriptBridge(callback) { //判断APP是否支持WebViewJavascriptBridge
				if (window.WebViewJavascriptBridge) {
					callback(WebViewJavascriptBridge)
				} else {
					document.addEventListener('WebViewJavascriptBridgeReady', function() {
						callback(WebViewJavascriptBridge)
					}, false)
				}
			}
			connectWebViewJavascriptBridge(function(bridge) {

				//加载页面后调用
				bridge.init(function(message, responseCallback) {
					var data = { 'Javascript Responds': 'Wee!' }
					responseCallback(data);
				});

				$(document).on('click', '#rules', function() {

					bridge.callHandler('goPageHandler', { 'title': '活动规则', 'icon': 0, 'backBtn': 0 }, function(responseData) {
						if (typeof responseData == "string") responseData = JSON.parse(responseData);
						if (responseData.result) location.href = `${webUrl}/view/2017/qixi/rules.html?userId=${self.userId}`;
					});
				});

				$("#goAppFinancing").on("click", function() {
					bridge.callHandler('goAppModule', { 'target': 'financing' }, function(responseData) {
						if (typeof responseData == "string") responseData = JSON.parse(responseData);
						if (responseData.result) console.log("success");
					});

				});

			});
			//E-APP交互相关
		}
		listen() {
			let self = this;
			$('.bagbtn').on('click', function() {
				if ($(this).hasClass('disabled')) {
					return false;
				}
				let type = $(this).data('type');
				let redBagList = redBag[type];
				let redBagHtml = '';
				redBagList.map(item => {
					redBagHtml += `<span class="bag"><b>${item}</b>元</span>`;
				});
				let html = `<div class="bagbox">
							<div class="_title">${type}元七夕礼包</div>
							<img src="/statics/img/pages/2017/qixi/taohua.png" alt="" />
							<div class="_bags">
								${redBagHtml}
							</div>
							<div class="close" onclick="layer.closeAll()">x</div>
						</div>`;
				layer.open({
					content: html,
					btn: ['确认领取'],
					yes: function() {
						// layer.open({
						// 	type: 2,
						// 	content: '加载中...',
						// 	shade: true,
						// 	shadeClose: false,
						// 	time: 2
						// });
						self.receiveRedBag(type);
					}
				});
			});
			$('.tab').on('click', function() {
				let tabIndex = $(this).data('index');
				$('.content').attr('class', `content tab${tabIndex}`);
			});
			if(self.type == 'h5'){
				$('#rules').on('click',function () {
					location.href = '/view/2017/qixi/rules.html';
				});
				$('#goAppFinancing').on('click',function () {
					location.href = wapUrl;
				});
			}
			if(self.type == 'pc'){
				$('#rules').on('click',function () {
					location.href = '/view/2017/qixi/rules.html';
				});
				$('#goAppFinancing').on('click',function () {
					location.href = `${pcUrl}/financing.html`;
				});
			}
		}
		setPage() {
			let self = this;
			$.ajax({
					url: `${webUrl}/valentines/ValentinesConfig.html`,
					type: 'GET',
					dataType: 'jsonp',
					data: {
						userId: self.userId
					},
				})
				.done(function(data) {
					let bagNum = 0;
					let btns = $('.bagbtn');
					$(btns).addClass('disabled');
					console.log(data);
					if (data.result) {
						const {
							balance,
							luckCount,
							luckValue,
							winnerList
						} = data;
						let marqueeHtml = ``;
						if (winnerList.length > 0) {
							winnerList.map(item => {
								marqueeHtml += `恭喜 ${item.phone} ${item.type}&nbsp;&nbsp;&nbsp;&nbsp;`;
							});
							$('.marquee').html(marqueeHtml).show();
							document.getElementById('marquee').start();
						}
						$('#luckyVal').text(luckValue);
						$('#redBagNum').text(`当前红包领取值：${luckCount}`);
						if (balance > 0) {
							if (balance >= 5000) {
								bagNum = 1;
								if (balance >= 10000) {
									bagNum = 2;
									if (balance >= 50000) {
										bagNum = 3;
										if (balance >= 100000) {
											bagNum = 4;
											if (balance >= 300000) {
												bagNum = 5;
												if (balance >= 500000) {
													bagNum = 6;
												}
											}
										}
									}
								}
							}
						}
						for (let i = 0; i < bagNum; i++) {
							$(btns[i]).removeClass('disabled');
						}
						let  lineLength = Math.floor(luckCount / 777);
						let progressHtml = $('.progress').html();
						if (lineLength > 0) {
							$('.line').attr('style', 'width: 70%;left: 30%;');
							let _lineHtml = '';
							for (let i = 0; i < lineLength; i++) {
								_lineHtml += `<span class="_line"><span class="_lineText">${777*(i+1)}</span></span>`;
							}
							
							let html = `<span class="_777line">
										${_lineHtml}
									</span>`;
							html += progressHtml;
							// $(html).insertBefore('.line');
							$('.progress').html(html);
							$('.line').attr('style', 'width: 70%;left: 30%;');
						}
						$('.line ._line').width(`${((luckCount%777)/777*100).toFixed(2)}%`);
						$('.line ._ball').attr('style', `left:${((luckCount%777)/777*100).toFixed(2)}%`);

					} else {
						//提示
						if(data.msg){
							layer.open({
								content: data.msg,
								skin: 'msg',
								time: 2 //2秒后自动关闭
							});
						}
					}
					setTimeout(function() {
						layer.closeAll();
					}, 300);
					// console.log(data);

				})
				.fail(function() {
					setTimeout(function() {
						layer.closeAll();
						//提示
						layer.open({
							content: '网络请求失败',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}, 300);

					console.log("error");
				});


		}
		receiveRedBag(type) {
			let self = this;
			$.ajax({
					url: `${webUrl}/valentines/ValentinesGift.html`,
					type: 'GET',
					dataType: 'jsonp',
					data: {
						userId: self.userId,
						type: `qixi-${type}`
					},
				})
				.done(function(data) {
					layer.closeAll();
					if (data.result) {
						let html = `<div class="successbox">
										<div class="_title">恭喜您</div>
										<img src="/statics/img/pages/2017/qixi/successIcon.png" alt="" />
										<span class="_text">恭喜您获得${type}元七夕大礼包!</span>
										<span>可前往<i>【我的】-【券包】</i>中查看!</span>
									</div>`;
						layer.open({
							content: html,
							shadeClose: false,
							btn: ['确认'],
							yes: function() {
								self.setPage();
								layer.closeAll();
							}
						});
					} else {
						//提示
						layer.open({
							content: data.msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
				})
				.fail(function(data) {
					layer.closeAll();
					//提示
					layer.open({
						content: '网络请求失败',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
					console.log("error");
				});
		}
	}
	let qixi = new Qixi();
});