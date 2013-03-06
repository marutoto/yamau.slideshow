
;(function($) {

	$.fn.mySlideshow = function(options) {

		var elements = this;

		var opts = $.extend({}, $.fn.mySlideshow.defaults, options);

		// スライドショー表示領域のブロック要素を1つずつ回す
		elements.each(function() {
			
			/******************************/
			/* 初期化・オプションチェック */
			/******************************/
			
			// オプション
			var opt_li_width = 200;
			var opt_li_x_margin = 30;
			var opt_l_r_disp = 0;
			
			var opt_li_height = 500;
			var opt_li_y_margin = 50;
			
			var opt_button_width = 50;
			var opt_button_height = 100;
			var opt_btn_img_l = 'im.ages/prev.png';
			var opt_btn_img_r = 'im.ages/next.png';
			
			var opt_silde_time = 500;
			
			var opt_auto_slide_interval = 3000;
			
			var opt_slide_guide = true;
			
			// スライド動作時間 <= 自動スライドの間隔 の場合のみ、自動切換えは有効
			// そうでない場合は自動スライドを無効にする
			if(opt_silde_time > opt_auto_slide_interval) opt_auto_slide_interval = false;
			
			
			/***** TODO: *****/
			// デザインをオプションで指定
			// デフォルトはシンプルなデザイン
			// 背景（ul部分とか）も指定できるように？
			
			
			// グローバル変数
			var $slideshow  = $(this);
			var disp_number = 0;
			var image_cnt   = 0;
			var setTimeout_id = false;
			
			
			/********************/
			/* メインプログラム */
			/********************/
			
			// スライドショーHTMLを生成する
			var html;
			html  = '<div class="prev-area"><div><img class="prev-button" src="'+opt_btn_img_l+'"></div></div>';
			html += '<ul class="image-area">';
			for(var i in opts.images) {
				html += '<li><p><img src="'+opts.images[i]+'"></p></li>';
				image_cnt++;
			}
			html += '</ul>';
			html += '<div class="next-area"><div><img class="next-button" src="'+opt_btn_img_r+'"></div></div>';
			html += '<div class="clear"></div>';
			
			
			
			
			/***** TODO: *****/
			// スライドガイドを生成する
			if(opt_slide_guide) {
				
			}
			
			
			
			
			// セレクタの要素内へHTMLを描写する
			$slideshow.append(html);
			
			// スライドショー画像のleft位置を設定する
			var ul_width = opt_li_width + opt_li_x_margin * 2;
			
			$slideshow.children('ul').css('width', ul_width+'px');
			$slideshow.children('ul').children('li').css('width', opt_li_width+'px');
			
			var ul_height = opt_li_height + opt_li_y_margin * 2;
			
			$slideshow.children('ul').css('height', ul_height+'px');
			$slideshow.children('ul').children('li').css('height', opt_li_height+'px');
			$slideshow.children('ul').children('li').css('top', opt_li_y_margin+'px');
			
			var li_left = opt_li_x_margin;
			
			$slideshow.children('ul').children('li').each(function() {
				
				$(this).css('left', li_left+'px');
				li_left += opt_li_width + opt_li_x_margin - opt_l_r_disp;
				
			});
			
			// ボタンの表示を設定する
			$slideshow.children('.prev-area').css('height', ul_height+'px');
			$slideshow.children('.prev-area').children('div').css('height', ul_height+'px');
			
			$slideshow.children('.next-area').css('height', ul_height+'px');
			$slideshow.children('.next-area').children('div').css('height', ul_height+'px');
			
			var slideshow_width = ul_width + opt_button_width * 2;
			$slideshow.css('width', slideshow_width+'px');
			//$slideshow.css('background-color', '#000000');
			
			// 自動スライドが有効であれば、実行する（autoSlide()の初回起動）
			if(opt_auto_slide_interval) {
				autoSlide();
			}
			
			
			/****************/
			/* 共通関数定義 */
			/****************/
			
			// 画像をスライドさせる関数
			function slideImage(disp_number) {
				
				var movement = $slideshow.children('ul').children('li:eq('+disp_number+')').position().left - opt_li_x_margin;
					
				var plus_or_minus;
				if(movement >= 0) plus_or_minus = '-';
				else              plus_or_minus = '+';
				
				$slideshow.children('ul').children('li').stop().animate({
					"left": plus_or_minus + '=' + Math.abs(movement) + 'px'
				}, opt_silde_time);
				
			}
			
			// 自動でスライドさせる関数（setTimeout()で時間を遅らせ、再帰的にautoSlide()を呼び出す）
			function autoSlide() {
				
				setTimeout_id = setTimeout(function() {
					
					if(disp_number < image_cnt-1) {
						disp_number++;
						slideImage(disp_number);
					} else {
						disp_number = 0;
						slideImage(disp_number);
					}
					
					autoSlide();
					
				}, opt_auto_slide_interval);
				
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
				
				// liの縦幅・横幅指定のうち、短いほうに合わせて画像をリサイズする
				if(max_width >= max_height) {
					if(max_height < img_h) {
						$img_obj.height(max_height); // 縦幅指定が短いので、heightを基準に比率を保持してリサイズ
					}
				} else {
					if(max_width < img_w) {
						$img_obj.width(max_width);   // 横幅指定が短いので、widthを基準に比率を保持してリサイズ
					}
				}
				
			}
			
			// 拡張子以前の文字列を取り出す関数
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
			
			
			/************************/
			/* イベントを定義・監視 */
			/************************/
			
			// 画面をロード後、画像をリサイズする
			$(window).bind('load', function() {
			
				// ボタン画像のリサイズ
				resizeImage($slideshow.children('.prev-area').children('div').children('.prev-button'), opt_button_width, opt_button_height);
				resizeImage($slideshow.children('.next-area').children('div').children('.next-button'), opt_button_width, opt_button_height);
				
				// スライド画像のリサイズ
				$slideshow.children('ul').children('li').children('p').children('img').each(function() {
					resizeImage($(this), opt_li_width, opt_li_height);
				});
			
			});
			
			// ひとつ前の画像へ戻るイベントを監視
			$slideshow.children('.prev-area').children('div').children('.prev-button').click(function() {
				
				if(disp_number > 0) {
					disp_number--;
					slideImage(disp_number);
					if(opt_auto_slide_interval) resetInterval();
				}
				
			});
			
			// ひとつ後の画像へ進むイベントを監視
			$slideshow.children('.next-area').children('div').children('.next-button').click(function() {
				
				if(disp_number < image_cnt-1) {
					disp_number++;
					slideImage(disp_number);
					if(opt_auto_slide_interval) resetInterval();
				}
				
			});
			
			// マウスホバー時の画像切り替えイベントを監視
			$slideshow.children('div').children('div').children('img').hover(function() {
			
				var filepath = '';
				filepath = splitFilename($(this).attr('src'));
				filepath = filepath[0] + '-on.' + filepath[1];
				
				$(this).attr('src', filepath);
				
			
			}, function() {
			
				if($(this).attr('class') == 'prev-button') $(this).attr('src', opt_btn_img_l);
				else                                       $(this).attr('src', opt_btn_img_r);
			
			});
			
		});

		return this;

	}

	$.fn.mySlideshow.defaults = {
		images: [],
		interval: 2000

	}

}) (jQuery);