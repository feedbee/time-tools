NTP.sync();

var upd = function () {
    if (NTP.wasInitialSynced) {
        $('#t-server').text(fmt(new Date(NTP.fixTime())));
    }
    $('#t-local').text(fmt(new Date()));
    setTimeout(upd, 50);
};

var fmt = function (time) {
    return spl(time.getDate(), 2) + "." + spl(time.getMonth() + 1, 2) + "." + time.getFullYear() + " "
        + spl(time.getHours(), 2) + ":" + spl(time.getMinutes(), 2) + ":" + spl(time.getSeconds(), 2)
        + "." + spl(Math.floor(time.getMilliseconds() / 10), 2);
};

var spl = function (i, n) {
    var s = String(i);
    while (n - s.length > 0) {
        s = "0" + s;
    }
    return s;
};

upd();