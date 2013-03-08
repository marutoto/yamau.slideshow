
;(function($) {

	$.fn.mySlideshow = function(options) {

		var elements = this;

		var opts = $.extend({}, $.fn.mySlideshow.defaults, options);

		// スライドショー表示領域のブロック要素を1つずつ回す
		elements.each(function() {
			
			/******************************/
			/* 初期化・オプションチェック */
			/******************************/
			
			/***** TODO: *****/
			// デザインをオプションで指定
			// デフォルトはシンプルなデザイン
			// 背景（ul部分とか）も指定できるように？
			
			
			// グローバル変数
			var $slideshow  = $(this);
			var disp_number = 0;
			var image_cnt   = 0;
			var setTimeout_id = false;
			
			var before_x = 0;
			var current_x = 0;
			
			/********************/
			/* メインプログラム */
			/********************/
			
			// スライドショーHTMLを生成する
			var html;
			html  = '<div class="prev-area"><div><img class="prev-button" src="'+opts.btn_img_l+'"></div></div>';
			html += '<ul class="image-area">';
			for(var i in opts.images) {
				html += '<li><p><img src="'+opts.images[i]+'"></p></li>';
				image_cnt++;
			}
			html += '</ul>';
			html += '<div class="next-area"><div><img class="next-button" src="'+opts.btn_img_r+'"></div></div>';
			html += '<div class="footer">';
			
			// スライドガイドを生成する
			if(opts.slide_guide) {
				for(var i in opts.images) {
					if(i == 0) {
						var filepath = splitFilename(opts.slide_guide_img);
						filepath = filepath[0] + '-on.' + filepath[1];
						html += '<img src="' + filepath + '">'
					} else {
						html += '<img src="' + opts.slide_guide_img + '">';
					}
				}
			}
			
			html += '</div>';
			
			
			// セレクタの要素内へHTMLを描写する
			$slideshow.append(html);
			
			// スライドショー画像のleft位置を設定する
			var ul_width = opts.li_width + opts.li_x_margin * 2;
			
			$slideshow.children('ul').css('width', ul_width+'px');
			$slideshow.children('ul').children('li').css('width', opts.li_width+'px');
			
			var ul_height = opts.li_height + opts.li_y_margin * 2;
			
			$slideshow.children('ul').css('height', ul_height+'px');
			$slideshow.children('ul').children('li').css('height', opts.li_height+'px');
			$slideshow.children('ul').children('li').css('top', opts.li_y_margin+'px');
			
			var li_left = opts.li_x_margin;
			
			$slideshow.children('ul').children('li').each(function() {
				
				$(this).css('left', li_left+'px');
				li_left += opts.li_width + opts.li_x_margin - opts.li_l_r_disp;
				
			});
			
			// ボタンの表示を設定する
			$slideshow.children('.prev-area').css('height', ul_height+'px');
			$slideshow.children('.prev-area').children('div').css('height', ul_height+'px');
			
			$slideshow.children('.next-area').css('height', ul_height+'px');
			$slideshow.children('.next-area').children('div').css('height', ul_height+'px');
			
			// スライドショー全体の幅を指定する
			var slideshow_width = ul_width + opts.button_width * 2;
			$slideshow.css('width', slideshow_width+'px');
			//$slideshow.css('background-color', '#000000');
			
			
			// スライド動作時間 <= 自動スライドの間隔 の場合のみ、自動スライドは有効
			// そうでない場合は自動スライドを無効にする
			if(opts.silde_time > opts.auto_slide_interval) opts.auto_slide_interval = false;
			
			// 自動スライドが有効であれば、実行する（autoSlide()の初回起動）
			if(opts.auto_slide_interval) autoSlide();
			
			
			/****************/
			/* 共通関数定義 */
			/****************/
			
			// 画像をスライドさせる関数
			function slideImage(disp_number) {
				
				var movement = $slideshow.children('ul').children('li:eq('+disp_number+')').position().left - opts.li_x_margin;
					
				var plus_or_minus;
				if(movement >= 0) plus_or_minus = '-';
				else              plus_or_minus = '+';
				
				$slideshow.children('ul').children('li').stop().animate({
					"left": plus_or_minus + '=' + Math.abs(movement) + 'px'
				}, opts.silde_time);
				
			}
			
			// 自動でスライドさせる関数（setTimeout()で時間を遅らせ、再帰的にautoSlide()を呼び出す）
			function autoSlide() {
				
				setTimeout_id = setTimeout(function() {
					
					removeOn($slideshow.children('.footer').children('img:eq(' + disp_number + ')'), opts.slide_guide_img);
					
					if(disp_number < image_cnt-1) disp_number++;
					else                          disp_number = 0;
					
					attachOn($slideshow.children('.footer').children('img:eq(' + disp_number + ')'));
					
					slideImage(disp_number);
					
					autoSlide();
					
				}, opts.auto_slide_interval);
				
			}
			
			// 自動スライドのインターバルをリセットし、autoSlide()を呼び直す関数
			function resetInterval() {
				
				clearTimeout(setTimeout_id);
				autoSlide();
				
			}
			
			// 縦横比を保ったまま、枠内に収まるよう画像をリサイズする関数
			function resizeImage($img_obj, max_width, max_height) {
				
				var img_w = $img_obj.width();
				var img_h = $img_obj.height();
				
				// 横だけはみ出している場合
				if(img_w > max_width && img_h <= max_height) {
					$img_obj.width(max_width);
					
				// 縦だけはみ出している場合
				} else if(img_w <= max_width && img_h > max_height) {
					$img_obj.height(max_height);
					
				// どちらもはみ出している場合
				} else if(img_w > max_width && img_h > max_height) {
					
					// 横差・縦差の大きい方に合わせてリサイズ
					var x_diff = img_w - max_width;
					var y_diff = img_h - max_height;
					
					if(x_diff > y_diff) $img_obj.width(max_width);
					else                $img_obj.height(max_height);
					
				}
			}
			
			// 拡張子以前と以降に分割する関数
			function splitFilename(filepath) {
				
				var arr_path = ['', ''];
				var index = filepath.lastIndexOf('.');
				
				// 拡張子以前を取得
				for(var i=0 ; i<index ; i++) {
					arr_path[0] += filepath.charAt(i);
				}
				
				// 拡張子を取得
				for(var i=index+1 ; i<filepath.length ; i++) {
					arr_path[1] += filepath.charAt(i);
				}
				
				return arr_path;
				
			}
			
			// 画像ファイル名に「-on」をつける関数
			function attachOn($img_obj) {
				
				var filepath = '';
				filepath = splitFilename($img_obj.attr('src'));
				filepath = filepath[0] + '-on.' + filepath[1];
				
				$img_obj.attr('src', filepath);
				
			}
			
			// 画像ファイル名から「-on」を取り除く関数（元画像pathに書き換える）
			function removeOn($img_obj, origin_path) {
				
				$img_obj.attr('src', origin_path);
				
			}
			
			
			/************************/
			/* イベントを定義・監視 */
			/************************/
			
			// 画面をロード後、画像をリサイズする
			$(window).bind('load', function() {
			
				// ボタン画像のリサイズ
				resizeImage($slideshow.children('.prev-area').children('div').children('.prev-button'), opts.button_width, opts.button_height);
				resizeImage($slideshow.children('.next-area').children('div').children('.next-button'), opts.button_width, opts.button_height);
				
				// スライド画像のリサイズ
				$slideshow.children('ul').children('li').children('p').children('img').each(function() {
					resizeImage($(this), opts.li_width, opts.li_height);
				});
				
				// スライドガイド画像のリサイズ
				if(opts.slide_guide) {
					var footer_width = $slideshow.children('.footer').width();
					var guide_width  = $slideshow.children('.footer').children('img').width() + 10;
					if(footer_width < (guide_width * image_cnt)) {
						var adjust_width = footer_width / image_cnt - 10;
						$slideshow.children('.footer').children('img').each(function() {
							$(this).width(adjust_width);
						});
					}
				}
			
			});
			
			// ひとつ前の画像へ戻るイベントを監視
			$slideshow.children('.prev-area').children('div').children('.prev-button').click(function() {
				
				removeOn($slideshow.children('.footer').children('img:eq(' + disp_number + ')'), opts.slide_guide_img);
				
				if(disp_number > 0) disp_number--;
				else                disp_number = image_cnt-1;
				
				attachOn($slideshow.children('.footer').children('img:eq(' + disp_number + ')'));
				slideImage(disp_number);
				if(opts.auto_slide_interval) resetInterval();
				
			});
			
			// ひとつ後の画像へ進むイベントを監視
			$slideshow.children('.next-area').children('div').children('.next-button').click(function() {
				
				removeOn($slideshow.children('.footer').children('img:eq(' + disp_number + ')'), opts.slide_guide_img);
				
				if(disp_number < image_cnt-1) disp_number++;
				else                          disp_number = 0;
				
				attachOn($slideshow.children('.footer').children('img:eq(' + disp_number + ')'));
				slideImage(disp_number);
				if(opts.auto_slide_interval) resetInterval();
				
			});
			
			// マウスホバー時の画像切り替えイベントを監視
			$slideshow.children('div').children('div').children('img').hover(function() {
				
				attachOn($(this));
				
			
			}, function() {
				
				if($(this).attr('class') == 'prev-button') removeOn($(this), opts.btn_img_l);
				else                                       removeOn($(this), opts.btn_img_r);
				
			});
			
			// スライドガイドクリック時のイベントを監視
			if(opts.slide_guide) {
				$slideshow.children('.footer').children('img').click(function() {
					
					removeOn($slideshow.children('.footer').children('img:eq(' + disp_number + ')'), opts.slide_guide_img);
					
					disp_number = $slideshow.children('.footer').children('img').index(this);
					
					attachOn($slideshow.children('.footer').children('img:eq(' + disp_number + ')'));
					
					slideImage(disp_number);
					if(opts.auto_slide_interval) resetInterval();
					
				});
			}
			
			// 【スマートフォン対応】画像のフリックイベントを監視
			//$slideshow.children('ul').each(function() {
				
				//$slideshow.children('ul')[0].addEventListener('touchstart', slideImageHandler, false);
				
				//$slideshow.children('ul')[0].addEventListener('touchmove', slideImageHandler, false);
				
				//$slideshow.children('ul')[0].addEventListener('touchend', slideImageHandler, false);
				
			//});
			
			$slideshow.children('ul').bind('touchstart touchmove touchend', slideImageHandler);
			
			
			function slideImageHandler(e) {
				
				var touch = e.originalEvent.touches[0];
				var start_x = 0;
				
				if(e.type == 'touchstart') {
					
					// 自動スライドを止める
					if(opts.auto_slide_interval) clearTimeout(setTimeout_id);
					start_x  = touch.pageX;
					before_x = touch.pageX;
					
					//$('#before').html(before_x);
				}
				
				if(e.type == 'touchmove') {
					
					//$('#touchtest').html(touch.pageX);
					var movement = 0;
					current_x = touch.pageX;
					movement = current_x - before_x;
					
					//$('#current').html(current_x);
					//$('#diff').html(movement);
					
					
					$slideshow.children('ul').children('li').css({
						"left": '+=' + movement + 'px'
					});
					
					
					before_x = current_x;
					
					
				}
				
				if(e.type == 'touchend') {
					
					//$('#touchtest').html('end');
					
					if(false) {
						disp_number++;
						
					} else if(false) {
						disp_number--;
						
					} else {
						slideImage(disp_number);
						
					}
					
					// 自動スライドを再開する
					if(opts.auto_slide_interval) autoSlide();
					
					//$('#before').html('');
					//$('#current').html('');
					//$('#diff').html('');
					
				}
				
			}
			
		});

		return this;

	}

	// デフォルトオプション
	$.fn.mySlideshow.defaults = {
		images              : ['images/no-image.png'],
		li_width            : 200,
		li_x_margin         : 20,
		li_height           : 500,
		li_y_margin         : 50,
		li_l_r_disp         : 0,
		button_width        : 50,
		button_height       : 100,
		btn_img_l           : 'images/prev.png',
		btn_img_r           : 'images/next.png',
		slide_time          : 500,
		slide_guide         : false,
		slide_guide_img     : 'images/guide.png',
		auto_slide_interval : 0
	}

}) (jQuery);