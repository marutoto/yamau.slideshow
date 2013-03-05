
;(function($) {

	$.fn.mySlideshow = function(options) {

		var elements = this;

		var opts = $.extend({}, $.fn.mySlideshow.defaults, options);

		// スライドショー用のブロック要素を1つずつ回す
		elements.each(function() {

			// オプション予定
			var opt_li_width = 200;
			var opt_li_x_margin = 30;
			var opt_r_l_disp = 0;
			
			var opt_li_height = 500;
			var opt_li_y_margin = 50;
			
			var opt_silde_time = 700;
			
			var opt_auto_slide_interval = 5000;
			
			var opt_slide_guide = true;
			
			
			// TODO:
			// デザインをオプションで指定
			// デフォルトはシンプルなデザイン
			// prev、nextの画像を指定できるように？
			// 背景（ul部分とか）も指定できるように？
			
			// 初期化
			var $slideshow  = $(this);
			var disp_number = 0;
			var image_cnt   = 0;
			
			// スライドショーHTMLを生成する
			var html;
			html  = '<div class="prev-button"></div>';
			html += '<ul class="image-area">';
			for(var i in opts.images) {
				html += '<li><p><img src="'+opts.images[i]+'"></p></li>';
				image_cnt++;
			}
			html += '</ul>';
			html += '<div class="next-button"></div>';
			html += '<div class="clear"></div>';
			
			// TODO:
			// スライドガイドを生成する
			if(opt_slide_guide) {
				
			}
			
			// セレクタの要素内へHTMLを描写する
			$slideshow.append(html);
			
			// positionのleft位置を設定する
			var ul_width = opt_li_width + opt_li_x_margin * 2;
			
			$slideshow.children('ul').css('width', ul_width+'px');
			$slideshow.children('ul').children('li').css('width', opt_li_width+'px');
			
			var ul_height = opt_li_height + opt_li_y_margin * 2;
			
			$slideshow.children('ul').css('height', ul_height+'px');
			$slideshow.children('ul').children('li').css('height', opt_li_height+'px');
			$slideshow.children('ul').children('li').css('top', opt_li_y_margin+'px');
			
			var left = opt_li_x_margin;
			
			$slideshow.children('ul').children('li').each(function() {
				
				$(this).css('left', left+'px');
				left += opt_li_width + opt_li_x_margin - opt_r_l_disp;
				
			});
			
			// 画面をロード後、画像をリサイズする
			$(window).bind('load', function() {
			
				$slideshow.children('ul').children('li').children('p').children('img').each(function() {
					
					var img_w = $(this).width();
					var img_h = $(this).height();
					
					// liの縦幅・横幅指定のうち、短いほうに合わせて画像をリサイズする
					if(opt_li_width >= opt_li_height) {
						if(opt_li_height < img_h) {
							$(this).height(opt_li_height); // 縦幅指定が短いので、heightを基準に比率を保持してリサイズ
						}
					} else {
						if(opt_li_width < img_w) {
							$(this).width(opt_li_width);   // 横幅指定が短いので、widthを基準に比率を保持してリサイズ
						}
					}
					
				});
			
			});
			
			//TODO:autoイベントをつくる
			var id = false;
			// 自動切り替えが有効であれば、実行する
			if(opt_auto_slide_interval) {
				
				var i = 0;
				
				// 自動切り替えイベント実行
				autoSlide();
				// show → start でループ
				function autoSlide() {
					
					
					
					id = setTimeout(function() {
						/*
						console.log('pass', i);
						i++;
						*/
						
						// 「ひとつ後の画像へ進むイベント」と全く同じ
						if(disp_number < image_cnt-1) {
							disp_number++;
							
							var movement = $slideshow.children('ul').children('li:eq('+disp_number+')').position().left - opt_li_x_margin;
							
							$slideshow.children('ul').children('li').stop().animate({
								"left": '-=' + Math.abs(movement) + 'px'
							}, opt_silde_time, function() {
								
							});
						} else {
							
							disp_number = 0;
					
							var movement = $slideshow.children('ul').children('li:eq('+disp_number+')').position().left - opt_li_x_margin;
							
							$slideshow.children('ul').children('li').stop().animate({
								"left": '+=' + Math.abs(movement) + 'px'
							}, opt_silde_time, function() {
								
							});
							
						}
						
						autoSlide();
					}, opt_auto_slide_interval);
					
					
				}
			}
			
			// ひとつ前の画像へ戻るイベントを監視
			$slideshow.children('.prev-button').click(function() {
				
				if(disp_number > 0) {
					disp_number--;
					
					var movement = $slideshow.children('ul').children('li:eq('+disp_number+')').position().left - opt_li_x_margin;
					
					$slideshow.children('ul').children('li').stop().animate({
						"left": '+=' + Math.abs(movement) + 'px'
					}, opt_silde_time, function() {
						
					});
					
					// autoをストップして再開する
					clearTimeout(id);
					autoSlide();
				}
			});
			
			// ひとつ後の画像へ進むイベントを監視
			$slideshow.children('.next-button').click(function() {
				
				if(disp_number < image_cnt-1) {
					disp_number++;
					
					var movement = $slideshow.children('ul').children('li:eq('+disp_number+')').position().left - opt_li_x_margin;
					
					$slideshow.children('ul').children('li').stop().animate({
						"left": '-=' + Math.abs(movement) + 'px'
					}, opt_silde_time, function() {
						
					});
					
					// autoをストップして再開する
					clearTimeout(id);
					autoSlide();
				}
				
			});
			
			
			
/*
			// 「prev_event」「next_event」「goto_event」を定義・監視
			// 監視しているイベントが起きたら、コールバック関数が起動
			$img.bind('prev_event', function() {

				show(current - 1);

			}).bind('next_event', function() {

				show(current + 1);

			}).bind('goto_event', function(event, img_num) {

				show(img_num);

			})

			function show(img_num) {

				var total = opts.images.length;

				while(img_num < 0) {
					img_num += total;
				}
				while(img_num >= total) {
					img_num -= total;
				}

				current = img_num;
				$img.fadeOut(500, function() {
					$img.attr('src', opts.images[img_num]);
					$(this).fadeIn(1500);
				});

				// ↓ただ切り替えるだけ
				//$img.attr('src', opts.images[img_num]);

				// 自動切換え
				if(auto) {
					start();
				}

			}

			var auto = false;
			var id;

			function start() {
				stop();
				auto = true;
				id = setTimeout(function() {
					show(current + 1);
				}, opts.interval);
			}

			function stop() {
				auto = false;
				clearTimeout(id);
			}

			$img.bind('start_event', start);
			// ↓stopイベントは作らなくても良くない？
			//$img.bind('start', start).bind('stop', stop);
			
			$('#prev').click(function(event) {
				event.preventDefault();
				$image.trigger('prev_event');
			});
		
			$('#next').click(function(event) {
				event.preventDefault();
				$image.trigger('next_event');
			});
			
			$image.trigger('goto_event', 0);
			$image.trigger('start_event');
*/
		});

		return this;

	}

	$.fn.mySlideshow.defaults = {
		images: [],
		interval: 2000

	}

}) (jQuery);