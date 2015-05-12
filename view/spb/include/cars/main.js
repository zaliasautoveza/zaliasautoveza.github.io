var car = {
	width_screen: 0,
	width: 0,
	start: function() {
		car.width_screen = parseInt($('body').width());
		car.width_view = parseInt($('#cars_anim').width());
		car.width = parseInt($('#cars_anim .car>img:first').width());
		car.phone();
		car.go();
		car.cars();
		car.wall();
		setInterval(car.windadd, 1000);
		$(window).resize(car.cars_resize);
	},
	phone: function() {
		$('#cars_anim .phone>img:eq(1)').animate({'opacity': 0.1}, 500, function() {
			$(this).animate({'opacity': 1}, 500, car.phone);
		});
	},
	go: function() {		
		car.width = parseInt($('#cars_anim .car>img:first').width()) > 0 ? parseInt($('#cars_anim .car>img:first').width()) : 350;		
		var from = parseInt($('#cars_anim .car').css('left'));
		var to = car.width_view - car.width;
		to = randomXtoY(0, to < 50 ? 50 : to);		
		var delta = Math.abs(from - to);
		if (delta < 30) { car.go(); return; }
		var speed = delta * 40;
		$('#cars_anim .car').animate({left: to}, speed, 'easeInOutBack', car.go);
	},
	windadd: function() {
		var count = $('#cars_anim .wind').length
		if (count < 5)
			for (var i = count; i <= 5; i++)
				setTimeout(car.wind, randomXtoY(0, 2000));
	},
	wind: function() {			
		var wind = $('#cars_anim .wind:first').clone().css('top', randomXtoY(60, 200));
		var from = randomXtoY(car.width_view - 200, car.width_view + 50);
		var to = randomXtoY(0, 100);			
		$(wind).appendTo('#cars_anim')
		.css('left', from).show().css('z-index', randomXtoY(0, 1))
		.animate({'left': to}, {
			step: function(now, fx) {
				var step = (to - from) / 100;
				var position = (now - from) / step;
				$(fx.elem).css('opacity', Math.abs(Math.abs(fx.pos - 0.5) - 0.5) * 2);					
				if (now == to) $(wind).remove();
			},
			duration: 1000
		});
	},
	cars: function() {
		car.cars_resize();
		car.cars_go();
		setInterval(car.cars_go, 3000);
	},	
	cars_go: function() {
		$.each($('#cars_anim .cars>img'), function(i, car) {
			var left = parseInt($(car).position().left);			
			if (left < -300) {
				$(car).stop().css('left', $('body').width() + 300 + i*randomXtoY(500, 1000))
				.animate({left: -450}, 10000 + i*randomXtoY(1000, 5000));
			}
		});		
	},
	cars_resize: function() {
		$('#cars_anim .cars').css({
			left: -$('#cars_anim').offset().left,
			width: $('body').width()
		});
	},
	wall: function() {
		var bg_cl = '.anim';
		var bg_snow = $(bg_cl).hasClass('snow') ? 'snow' : '';
		var bg_width = $(bg_cl).hasClass('snow') ? 846 : 846;
		var bg_height = $(bg_cl).height()+2;
		var bg_speed = $(bg_cl).hasClass('snow') ? 30000 : 30000;
				
		if (useragent() == 'mozilla' || useragent() == 'opera') {
			var n = Math.ceil(car.width_screen / bg_width) + 2;
			$('<div style="position: absolute; top: 0px; width: 100%; height: '+bg_height+'px; overflow: hidden;"><div class="'+bg_cl.substr(1)+' '+bg_snow+'" style="width: '+(bg_width*n)+'px; height: '+bg_height+'px; position: absolute;"></div></div>').insertBefore(bg_cl);
			$('.header'+bg_cl).removeClass(bg_cl.substr(1)).css({'position': 'absolute', 'width': '100%', 'top': 0});
			$('body').css('padding-top', bg_height);
			$(bg_cl).animate({'left': -bg_width}, bg_speed, 'linear');
			setInterval(function() {
				$(bg_cl).css('left', 0);
				$(bg_cl).stop().animate({'left': -bg_width}, bg_speed, 'linear');
			}, bg_speed);
		} else {
			$(bg_cl).animate({'background-position-x': -bg_width}, bg_speed, 'linear');
			setInterval(function() {
				$(bg_cl).css('background-position-x', 0);
				$(bg_cl).stop().animate({'background-position-x': -bg_width}, bg_speed, 'linear');
			}, bg_speed);
		}
	}
}

function randomXtoY(minVal, maxVal, floatVal) {
	var randVal = minVal+(Math.random()*(maxVal-minVal));
	return typeof floatVal=='undefined'?Math.round(randVal):randVal.toFixed(floatVal);
}