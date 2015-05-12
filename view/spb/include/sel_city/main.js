$('body').click(function() { sel_city_toggle(event, 1); });
function sel_city_toggle(event, a) {
	if ($("#sel_city_pop").is(':visible') || a) {
		$("#sel_city_pop").fadeOut(100);
		$("#sel_city_pop>span").css('border-bottom', '2px dashed');
		sp(event);
	} else {
		$("#sel_city_pop>span").css('border-bottom', '');
		$("#sel_city_pop").fadeIn(100);
		sp(event);
	}
}		
function sp(event) {
	event = event || window.event;
	if (event.stopPropagation) event.stopPropagation();
	else event.cancelBubble = true;
}
function set_sess() {
	$.ajax({
		 async: false,
		 url: "/view/spb/include/sel_city/sess.php"
	});
}