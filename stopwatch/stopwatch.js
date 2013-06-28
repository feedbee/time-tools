(function () {
    var it, t, buf = 0;
    
    var toggle = function() {
        if (!it) {
            if (!t) t = (new Date()).getTime();
            it = setInterval(function () {
                f(buf + (new Date()).getTime() - t);
            }, 10);
            $('#b-start-stop').text('Stop');
        } else {
            it = clearInterval(it);
            buf += (new Date()).getTime() - t;
            t = undefined;
            $('#b-start-stop').text('Start');
        }
    };

    var clear = function() {
        it && toggle();
        t = f(0);
        buf = 0;
    };

    $('#b-start-stop').on('click', toggle);
    $('#b-clear').on('click', clear);

    var f = function (m) {
        var ms = Math.floor(m % 1000 / 10);
        var s = Math.floor(m / 1000)
        var m = Math.floor(s / 60);
        var h = Math.floor(m / 60);
        var d = Math.floor(h / 24);

        s = s % 60;
        m = m % 60;
        h = h % 24;

        $('#t-hms').text(
            (d > 0 ? d + "d " : "") + spl(h, 2) 
            + ":" + spl(m, 2) + ":" + spl(s, 2)
        );
        $('#t-ms').text("." + spl(ms, 2));
    };

    var spl = function (i, n) {
        var s = String(i);
        while (n - s.length > 0) s = "0" + s;
        return s;
    };

    $(document).on('keydown', function (e) {
        if (e.which == 90) toggle();
        if (e.which == 88) clear();
    });
})();