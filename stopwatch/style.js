(function(){

	var r = /stl-([\d\w]{3})/;

	var setStyle = function (s) {
		var el = $(document.body);
		if (el.attr("class")) {
			el.attr("class", el.attr("class").split(" ").filter(function(item) {
				return item.match(r) ? item : "";
			}).join(" "));
		}
		el.addClass('sch-' + s);
	};

	var process = function (h) {
		if (h) {
			var m = h.match(r);
			if (m.length > 1) {
				setStyle(m[1]);
			}
		}
	};
	process(window.location.hash);

	$('.stl-swch').on('click', function (e) {
		window.location.hash = this.hash;
		process(this.hash);
		return false;
	});
})()