'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(function (require, exports, module) {
	require('jquery');
	var layer = require('layer');
	require('layerCss');
	require('fastclick');
	FastClick.attach(document.body);
	var redBag = {
		'30': [5, 5, 20],
		'77': [15, 22, 40],
		'500': [60, 70, 80, 90, 200],
		'888': [120, 80, 200, 400, 800],
		'1600': [120, 120, 160, 400, 800],
		'3000': [120, 120, 240, 220, 900, 1400]
	};

	var Qixi = function () {
		function Qixi() {
			_classCallCheck(this, Qixi);

			this.init = this.init.bind(this);
			this.listen = this.listen.bind(this);
			this.init();
			this.listen();
		}

		_createClass(Qixi, [{
			key: 'init',
			value: function init() {
				this.userId = getUrlParam('userId');
				this.type = getUrlParam('type');
				if (!this.type) {
					this.setPage();
					this.app();
				}
			}
		}, {
			key: 'app',
			value: function app() {
				var self = this;
				//S-APP交互相关
				function connectWebViewJavascriptBridge(callback) {
					//判断APP是否支持WebViewJavascriptBridge
					if (window.WebViewJavascriptBridge) {
						callback(WebViewJavascriptBridge);
					} else {
						document.addEventListener('WebViewJavascriptBridgeReady', function () {
							callback(WebViewJavascriptBridge);
						}, false);
					}
				}
				connectWebViewJavascriptBridge(function (bridge) {

					//加载页面后调用
					bridge.init(function (message, responseCallback) {
						var data = { 'Javascript Responds': 'Wee!' };
						responseCallback(data);
					});

					$(document).on('click', '#rules', function () {

						bridge.callHandler('goPageHandler', { 'title': '活动规则', 'icon': 0, 'backBtn': 0 }, function (responseData) {
							if (typeof responseData == "string") responseData = JSON.parse(responseData);
							if (responseData.result) location.href = webUrl + '/view/2017/qixi/rules.html?userId=' + self.userId;
						});
					});

					$("#goAppFinancing").on("click", function () {
						bridge.callHandler('goAppModule', { 'target': 'financing' }, function (responseData) {
							if (typeof responseData == "string") responseData = JSON.parse(responseData);
							if (responseData.result) console.log("success");
						});
					});
				});
				//E-APP交互相关
			}
		}, {
			key: 'listen',
			value: function listen() {
				var self = this;
				$('.bagbtn').on('click', function () {
					if ($(this).hasClass('disabled')) {
						return false;
					}
					var type = $(this).data('type');
					var redBagList = redBag[type];
					var redBagHtml = '';
					redBagList.map(function (item) {
						redBagHtml += '<span class="bag"><b>' + item + '</b>\u5143</span>';
					});
					var html = '<div class="bagbox">\n\t\t\t\t\t\t\t<div class="_title">' + type + '\u5143\u4E03\u5915\u793C\u5305</div>\n\t\t\t\t\t\t\t<img src="/statics/img/pages/2017/qixi/taohua.png" alt="" />\n\t\t\t\t\t\t\t<div class="_bags">\n\t\t\t\t\t\t\t\t' + redBagHtml + '\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="close" onclick="layer.closeAll()">x</div>\n\t\t\t\t\t\t</div>';
					layer.open({
						content: html,
						btn: ['确认领取'],
						yes: function yes() {
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
				$('.tab').on('click', function () {
					var tabIndex = $(this).data('index');
					$('.content').attr('class', 'content tab' + tabIndex);
				});
				if (self.type == 'h5') {
					$('#rules').on('click', function () {
						location.href = '/view/2017/qixi/rules.html';
					});
					$('#goAppFinancing').on('click', function () {
						location.href = wapUrl;
					});
				}
				if (self.type == 'pc') {
					$('#rules').on('click', function () {
						location.href = '/view/2017/qixi/rules.html';
					});
					$('#goAppFinancing').on('click', function () {
						location.href = pcUrl + '/financing.html';
					});
				}
			}
		}, {
			key: 'setPage',
			value: function setPage() {
				var self = this;
				$.ajax({
					url: webUrl + '/valentines/ValentinesConfig.html',
					type: 'GET',
					dataType: 'jsonp',
					data: {
						userId: self.userId
					}
				}).done(function (data) {
					var bagNum = 0;
					var btns = $('.bagbtn');
					$(btns).addClass('disabled');
					console.log(data);
					if (data.result) {
						var balance = data.balance,
						    luckCount = data.luckCount,
						    luckValue = data.luckValue,
						    winnerList = data.winnerList;

						var marqueeHtml = '';
						if (winnerList.length > 0) {
							winnerList.map(function (item) {
								marqueeHtml += '\u606D\u559C ' + item.phone + ' ' + item.type + '&nbsp;&nbsp;&nbsp;&nbsp;';
							});
							$('.marquee').html(marqueeHtml).show();
							document.getElementById('marquee').start();
						}
						$('#luckyVal').text(luckValue);
						$('#redBagNum').text('\u5F53\u524D\u7EA2\u5305\u9886\u53D6\u503C\uFF1A' + luckCount);
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
						for (var i = 0; i < bagNum; i++) {
							$(btns[i]).removeClass('disabled');
						}
						var lineLength = Math.floor(luckCount / 777);
						var progressHtml = $('.progress').html();
						if (lineLength > 0) {
							$('.line').attr('style', 'width: 70%;left: 30%;');
							var _lineHtml = '';
							for (var _i = 0; _i < lineLength; _i++) {
								_lineHtml += '<span class="_line"><span class="_lineText">' + 777 * (_i + 1) + '</span></span>';
							}

							var html = '<span class="_777line">\n\t\t\t\t\t\t\t\t\t\t' + _lineHtml + '\n\t\t\t\t\t\t\t\t\t</span>';
							html += progressHtml;
							// $(html).insertBefore('.line');
							$('.progress').html(html);
							$('.line').attr('style', 'width: 70%;left: 30%;');
						}
						$('.line ._line').width((luckCount % 777 / 777 * 100).toFixed(2) + '%');
						$('.line ._ball').attr('style', 'left:' + (luckCount % 777 / 777 * 100).toFixed(2) + '%');
					} else {
						//提示
						if (data.msg) {
							layer.open({
								content: data.msg,
								skin: 'msg',
								time: 2 //2秒后自动关闭
							});
						}
					}
					setTimeout(function () {
						layer.closeAll();
					}, 300);
					// console.log(data);
				}).fail(function () {
					setTimeout(function () {
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
		}, {
			key: 'receiveRedBag',
			value: function receiveRedBag(type) {
				var self = this;
				$.ajax({
					url: webUrl + '/valentines/ValentinesGift.html',
					type: 'GET',
					dataType: 'jsonp',
					data: {
						userId: self.userId,
						type: 'qixi-' + type
					}
				}).done(function (data) {
					layer.closeAll();
					if (data.result) {
						var html = '<div class="successbox">\n\t\t\t\t\t\t\t\t\t\t<div class="_title">\u606D\u559C\u60A8</div>\n\t\t\t\t\t\t\t\t\t\t<img src="/statics/img/pages/2017/qixi/successIcon.png" alt="" />\n\t\t\t\t\t\t\t\t\t\t<span class="_text">\u606D\u559C\u60A8\u83B7\u5F97' + type + '\u5143\u4E03\u5915\u5927\u793C\u5305!</span>\n\t\t\t\t\t\t\t\t\t\t<span>\u53EF\u524D\u5F80<i>\u3010\u6211\u7684\u3011-\u3010\u5238\u5305\u3011</i>\u4E2D\u67E5\u770B!</span>\n\t\t\t\t\t\t\t\t\t</div>';
						layer.open({
							content: html,
							shadeClose: false,
							btn: ['确认'],
							yes: function yes() {
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
				}).fail(function (data) {
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
		}]);

		return Qixi;
	}();

	var qixi = new Qixi();
});