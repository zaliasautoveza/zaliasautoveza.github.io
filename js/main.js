$(function() {	
	main.init();
});

var main = {		
	init: function() {
		callback.init();
		actions.init();
		this.rmenu.init();
	},
	rmenu: {
		limit: 0,
		init: function() {
			if ($('.page>.menu').length > 0) {
				this.limit = $('.page>.menu').offset().top - 20;
				$(window).bind('resize', this.update);
				$(window).bind('scroll', this.update);				
				$('.page').css('min-height', $('.page>.menu').height() + 50);
			}
		},
		update: function() {
			var mw = parseInt($('body').css('min-width'));
			var top = $(document).scrollTop();
			var bottom = $(document).height() - $(window).height() - $('body>.footer').height();
			
			// Если скролл ниже меню
			if (top >= main.rmenu.limit) {				
				// Если меню не дошло до подвала
				if (top < bottom) {		
					$('.page>.menu').css({'position': 'fixed', 'bottom': 'auto', 'top': 20});
					if ($(window).width() < mw) $('.page>.menu').css('right', -(mw - $(window).width() - 80));
				// Меню упёрлось в подвал
				} else if ($(window).height() - $('body>.footer').height() < $('.page>.menu').height()) {
					$('.page>.menu').css({'position': 'absolute', 'bottom': 0, 'top': 'auto'});
					$('.page>.menu').css('right', 80);
				}
			// Исходное состояние меню
			} else {
				$('.page>.menu').css('position', 'absolute').css('top', 'auto');
				$('.page>.menu').css('right', 80);
			}
		}			
	},
	sp: function(event) {
        event = event || window.event;
        if (event.stopPropagation) event.stopPropagation();
        else event.cancelBubble = true;
    },
	num_to_str: function(n, arr) {
		return n%10 == 1 && n%100 != 11 ? arr[0] : ( n%10 >= 2 && n%10 <= 4 && (n%100 < 10 || n%100 >= 20) ? arr[1] : arr[2]);
	},
	formSend: function(but, send) {
		var form = $(but).closest('.form');
		var errors = 0;
		var data = {send: send};
		
		$.each($('input[type=text]:not(:disabled), input[type=radio]:checked, input[type=hidden], select, textarea', form), function(k, v) {
			if ($(v).hasClass('req') && $(v).val() == '') {
				$(v).addClass('error').bind('focus', function(el) {
					$(el.target).removeClass('error');
				});
				errors++;
			}
			data[$(v).attr('name')] = $(v).val();
		})
		
		//console.log(errors);
		//console.log(data);
		
		if (errors == 0) {
			if (typeof send == 'object'){				
				$.ajax({
					url: send.url != undefined ? send.url : "../ajax/mysql.php",
					data: data,
					dataType: 'json',
					type: 'post',
					success: function(r) {
						if (r.success) {
							if (r.post.send.success != 'undefined') alert(r.post.send.success);
							$.each($('input[type=text], textarea', form), function(k, v) {
								$(v).val('');
							})
						} else alert(r.post.send.error);
					},
					failure: function() {
						alert(r.post.send.failure);
					}
				});
				return false;
			}
		} else {
			alert('Заполните форму!');
			return false;
		}
	}
};

var callback = {
	init: function() {
		$('.header .callback a').bind('click', this.toggle);
	},
	toggle: function(event) {		
		if ($('#callback').length > 0) {			
			$('#callback').fadeOut(300, function() {
				$('#callback').remove();
				clearTimeout(callback.timer);
			});
			$('body').unbind('click');
		} else {
			$('.header .callback').append('<div id="callback"></div>');
			$('#callback').click(main.sp).load('../view/'+$('body').attr('loc')+'/include/callback.php', function() {
				$(this).fadeIn(300);
				$('body').bind('click', callback.toggle);
			});
		}
	},
	done: function() {
		$('#callback .box').css('height', $('#callback .box').height());		
		$('#callback .cont').hide();
		$('#callback .box').animate({'height': 46}, 500);
		$('#callback .msg').fadeIn(300);
		callback.timer = setTimeout(callback.toggle, 3000);
	}
}

var actions = {
	init: function() {
		$('.actions>div.roll').bind('mouseenter', actions.rDown).bind('mouseleave', actions.rUp);
		$('.actions>div.popup').bind('mouseenter', actions.pShow).bind('mouseleave', actions.pHide);
	},
	rDown:function(e) {			
		var el = $(e.target).closest('.roll');
		$('.rollc', el).slideDown(150, function() {
			$('.rollf:first', el).hide().next().show();
			$('.rollt', el).css('height', '241px');
			el.stop().animate({'height': '241px'}, 400, 'easeOutCirc');
		});
	},
	rUp: function(e) {
		var el = $(e.target).closest('.roll');
		$('.rollc', el).slideUp(100, function() {
			$('.rollf:first', el).show().next().hide();
			$('.rollt', el).css('height', '146px');
			el.stop().animate({'height': '146px'}, 200, 'easeOutCirc');
		});
	},
	pShow: function(e) {
		$(e.target).closest('.popup').find('>div:first').stop().fadeIn(150);
	},
	pHide: function(e) {
		$(e.target).closest('.popup').find('>div:first').stop().fadeOut(100);
	}
}

// Other functions
	
function docheight() {
     var D = document;
     return Math.max(Math.max(D.body.scrollHeight, D.documentElement.scrollHeight), Math.max(D.body.offsetHeight, D.documentElement.offsetHeight), Math.max(D.body.clientHeight, D.documentElement.clientHeight));
};

function parseGetParams() { 
   var $_GET = {}; 
   var __GET = window.location.search.substring(1).split("&"); 
   for(var i=0; i<__GET.length; i++) { 
      var getVar = __GET[i].split("="); 
      $_GET[getVar[0]] = typeof(getVar[1])=="undefined" ? "" : getVar[1]; 
   } 
   return $_GET; 
}

function useragent() {
	var useragent = navigator.userAgent;
	var navigatorname;
	if (useragent.indexOf('MSIE')!= -1)
		navigatorname="ie";
	else if (useragent.indexOf('Gecko')!= -1) {
		if (useragent.indexOf('Chrome')!= -1)
		navigatorname="chrome";
		else navigatorname="mozilla";
	} else if (useragent.indexOf('Mozilla')!= -1)
		navigatorname="mozilla";
	else if (useragent.indexOf('Opera')!= -1)
		navigatorname="opera";
	return navigatorname;
}