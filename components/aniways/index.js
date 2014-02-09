window.Aniways = (function () {
  'use strict';

  var aniways = {
    init: function(){
      if (document.getElementsByClassName('aniways-text').length > 0){
        addWallObserver();
      } else {
        console.log("Can't find element with aniways-wall class");
      }
    }
  };

  function decodeMessage(message){
    var msg_parts = message.split("\ufeff\ufeff\n\n");
    var msg = msg_parts[0];
    if (msg_parts.length <= 1){
      return msg;
    }
    var meta_data = getJsonFromUrl(message.split("\ufeff\ufeff\n\n")[1]);
    var count = 0;
    for (var i in meta_data) {
      if (meta_data.hasOwnProperty(i)) {
        if (i.indexOf("si") !== -1){
          count++;
        }
      }
    }
    var html = "";
    var start = 0;
    for (var j = 0; j < count; j++) {
      html += msg.substring(start, parseInt(meta_data['si' + j]));
      html += "<img class='aniways-image' src='http://az493648.vo.msecnd.net/aniways-assets/android/ldpi/" + meta_data['id' + j] + "'  title='" + msg.substring(parseInt(meta_data['si' + j]), parseInt(meta_data['si' + j]) + parseInt(meta_data['l' + j])) + "'>";
      start = parseInt(meta_data['l' + j]) + parseInt(meta_data['si' + j]);
    }
    html += msg.substring(start);
    return html;
  }

  function getJsonFromUrl(url) {
    url = url.replace(/&amp;/g, '&');
    var query = url.split("?")[1];
    var data = query.split("&");
    var result = {};
    for (var i = 0; i < data.length; i++) {
      var item = data[i].split("=");
      result[item[0]] = item[1];
    }
    return result;
  }

  function addWallObserver() {
    var target = document.querySelector('.aniways-wall');

    // create an observer instance
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === 'childList') {
          for (var i = 0; i < mutation.addedNodes.length; i++) {
            var node = mutation.addedNodes[i];
            if(typeof node.getElementsByClassName === 'function'){
              var textNodes = node.getElementsByClassName('aniways-text');
              if(textNodes.length > 0){
                var decodedMessage = decodeMessage(textNodes[0].innerHTML);
                textNodes[0].innerHTML = decodedMessage;
              }
            }
          }
        }
      });
    });

    // configuration of the observer:
    var config = { childList: true, subtree: true };

    // pass in the target node, as well as the observer options
    observer.observe(target, config);
  }
  return aniways;
})();

