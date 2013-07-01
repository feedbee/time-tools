/*
 * NTP.js http://jehiah.cz/a/ntp-for-javascript
 * copyright Jehiah Czebotar jehiah@gmail.com
 * licensed under http://unlicense.org/ please modify as needed
 * to use configure serverUrl to an endpoint that when queried
 *     GET serverUrl + '?t=' + timestamp_in_miliseconds
 *
 * returns 
 *    time_offset_in_miliseconds + ':' + argument_t
 *
 * Modified (refactored) by feedbee, 2013. http://valera.ws
 *
 */
var NTP = {
  cookieShelfLife : 7, //7 days
  requiredResponses : 2,
  offsets : new Array, 
  serverUrl : "time.php",
  resyncTime : 10, // minutes
  sync : function() {
    // if the time was set within the last x minutes; ignore this set request; time was synce recently enough
    var offset = NTP.getCookie("NTPClockOffset");
    if (offset) {
      try {
        var t = offset.split("|")[1];	  
        var d = NTP.fixTime()-parseInt(t, 10);
        if (d < (1000 * 60 * NTP.resyncTime)) {
          return false; // x minutes; return==skip
        }
      } catch(e) {}
    }
    
    NTP.offsets = new Array;
    NTP.getServerTime();
  },
  getNow : function() {
    var date = new Date();
    return date.getTime();
  },
  parseServerResponse : function(responseText) {
    var serverData = responseText.split(":");
    var serverOffset = parseInt(serverData[0]);
    var initialClientTime = parseInt(serverData[1]);

    var avgTransportDelay = ((NTP.getNow() - initialClientTime) / 2);
    var netOffset = serverOffset - avgTransportDelay;
    NTP.offsets.push(netOffset);

    // if we have enough responces set cookie
    if (NTP.offsets.length >= NTP.requiredResponses)
    {
      // build average
      var average = NTP.getAvgOffset();
      NTP.setCookie("NTPClockOffset", average + '|' + NTP.fixTime()); // save the timestamp that we are setting it
    } else {
      NTP.getServerTime();
    }
  },
  getAvgOffset : function () {
    var sum = 0;
    var i = 0;
    for (i = 0; i < NTP.offsets.length; i++) {
       sum += NTP.offsets[i];
    }
    return Math.round(sum / i);
  },
  getServerTime : function() {
    try {
      var req = $.get(NTP.serverUrl, {t: NTP.getNow()}, NTP.parseServerResponse);
    } catch(e) {
      return false;
      //jquery.js not available
    }
  },
  setCookie : function(aCookieName, aCookieValue) {
     var date = new Date();
     date.setTime(date.getTime() + (NTP.cookieShelfLife * 24*60*60*1000));
     var expires = '; expires=' + date.toGMTString();
     document.cookie = aCookieName + '=' + aCookieValue + expires + '; path=/';
  },
  getCookie : function(aCookieName) {
    var crumbs = document.cookie.split('; ');
    for (var i = 0; i < crumbs.length; i++)
    {
      var crumb = crumbs[i].split('=');
      if (crumb[0] == aCookieName && crumb[1] != null)
      {
        return crumb[1];
      }
    }
    return false;
  },
  fixTime : function(timeStamp) {
      if (!timeStamp) {
        timeStamp = NTP.getNow();
      }
      var offset = NTP.getCookie("NTPClockOffset");
      try {
        if (!offset) {
          offset = 0;
        } else {
          offset = offset.split("|")[0];
        }
        if (isNaN(parseInt(offset, 10))) {
          return timeStamp;
        }
        return timeStamp + parseInt(offset, 10);
      } catch(e) {
        return timeStamp;
      }
  }
}
setTimeout('NTP.sync()',2500);