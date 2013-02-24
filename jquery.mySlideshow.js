
;(function($) {

	$.fn.mySlideshow = function(options) {

		var elements = this;

		var opts = $.extend({}, $.fn.mySlideshow.defaults, options);

		elements.each(function() {

			var $img    = $(this);
			var current = 0;

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

		});

		return this;

	}

	$.fn.mySlideshow.defaults = {
		images: [],
		interval: 2000

	}

}) (jQuery);