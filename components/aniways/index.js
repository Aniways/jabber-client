window.Aniways = (function () {
  'use strict';

  var aniways = {
    init: function(){
      if (document.getElementsByClassName('aniways-wall').length > 0){
        addWallObserver();
      } else {
        console.log("Can't find element with aniways-wall class");
      }
    },
    decodeMessage: function(message){
      return decodeMessage(message);
    },
    getJsonFromUrl: getJsonFromUrl
  };

  function decodeMessage(message){
    var messageParts = message.split("\ufeff\ufeff\n\n");
    var originalMessage = messageParts[0];
    if (messageParts.length <= 1){
      return originalMessage;
    }
    var encodingData = getJsonFromUrl(messageParts[1]);
    var count = 0;
    for (var data in encodingData) {
      if (encodingData.hasOwnProperty(data)) {
        if (data.indexOf("si") !== -1){
          count++;
        }
      }
    }
    var html = "";
    var start = 0;
    for (var j = 0; j < count; j++) {
      html += originalMessage.substring(start, parseInt(encodingData['si' + j]));
      html += "<img class='aniways-image' src='http://az493648.vo.msecnd.net/aniways-assets/android/ldpi/" + encodingData['id' + j] + "'  title='" + originalMessage.substring(parseInt(encodingData['si' + j]), parseInt(encodingData['si' + j]) + parseInt(encodingData['l' + j])) + "'>";
      start = parseInt(encodingData['l' + j]) + parseInt(encodingData['si' + j]);
    }
    html += originalMessage.substring(start);
    return html;
  }

  function getJsonFromUrl(url) {
    url = url.replace(/&amp;/g, '&');
    url = url.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/ );
    var query = url[0].split("?")[1];
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
          var addedNodes = mutation.addedNodes;
          for (var i = 0; i < addedNodes.length; i++) {
            var node = addedNodes[i];
            if(typeof node.getElementsByClassName === 'function'){
              var message = node.getElementsByClassName('aniways-text');
              if(message.length > 0){
                var decodedMessage = decodeMessage(message[0].innerHTML);
                message[0].innerHTML = decodedMessage;
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

