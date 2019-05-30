window.addEventListener("load", function() {
	new ClipboardJS('#copy-ref-button');
	$('#copy-ref-button').click(function() {
		setTimeout(function(){
			$('#copy-ref-button').popover('hide')
        },1500);
	});
	$('[data-toggle="popover"]').popover();
	var date = new Date();
    date.setTime(date.getTime()+(1*24*60*60*1000));
	var url_string = window.location.href;
	var url = new URL(url_string);

	if (url.searchParams.get("masternode") !== null) {
	  var toSet = "masternode=" + url.searchParams.get("masternode");
	  document.cookie=toSet+"; expires="+date.toGMTString();
	}
	if (url.searchParams.get("dailyroinode") !== null) {
		var toSet = "dailyroinode=" + url.searchParams.get("dailyroinode");
		document.cookie=toSet+"; expires="+date.toGMTString();
	}
	$('.wrap-drak-mode-checkbox').change(function() {
		var darkModeStatus = $('.wrap-drak-mode-checkbox:checked').length > 0 ? false : true; 
		iniDarkModeInterface(darkModeStatus);
		setDarkModeStatus(darkModeStatus); 
	});
	initDarkModeStatus();
});	
function initDarkModeStatus() {
	var darkModeStatus;
	if (getCookie('darkModeStatus')) {
		darkModeStatus = getCookie('darkModeStatus').split(';')[0];	
	}
    if (supportsLocalStorage()) {
      darkModeStatus = localStorage.getItem('darkModeStatus');
    } 
    darkModeStatus = darkModeStatus != null ? darkModeStatus : false;
    if (darkModeStatus == false || darkModeStatus == "false") {
    	$('.wrap-drak-mode-checkbox').attr('checked', true);
    } else {
    	$('.wrap-drak-mode-checkbox').attr('checked', false);
    }
    iniDarkModeInterface(darkModeStatus);
}
function iniDarkModeInterface(darkModeStatus) {
	if (darkModeStatus == false || darkModeStatus == "false") {
		$('body').attr('id', '');
	} else {
		$('body').attr('id', 'dark-mode');
	} 
}
function setDarkModeStatus(darkModeStatus) {
    var theCookie = "darkModeStatus=" + darkModeStatus;
    if (!supportsLocalStorage()) {
        // No HTML5 localStorage Support
        document.cookie=theCookie;
    } else {
        // HTML5 localStorage Support JSON.stringify(user));
        localStorage.setItem('darkModeStatus', darkModeStatus);
    }
}
function supportsLocalStorage() {
    return typeof(Storage)!== 'undefined';
} 
function getCookie(name) {
          var dc = document.cookie;
          var prefix = name + "=";
          var begin = dc.indexOf("; " + prefix);

          if (begin == -1) {
            begin = dc.indexOf(prefix);
            if (begin != 0) return "";
          }
          else
          {
            begin += 2;
            var end = document.cookie.indexOf(";", begin);
            if (end == -1) {
            end = dc.length;
            }
          }

          return decodeURI(dc.substring(begin + prefix.length, end));
  }