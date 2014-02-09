(function () {
  document.onreadystatechange = function () {
    var state = document.readyState
      if (state == 'complete') {
        addWallObserver()
      }
  }

  function decodeMessage(message){
    var msg_parts = message.split("\ufeff\ufeff\n\n");
    var msg = msg_parts[0];
    if (msg_parts.length <= 1)
      return msg;
    var meta_data = getJsonFromUrl(message.split("\ufeff\ufeff\n\n")[1]);
    var count = 0;
    for (var i in meta_data) {
      if (meta_data.hasOwnProperty(i)) {
        if (i.indexOf("si") != -1)
          count++;
      }
    }
    var html = "";
    var start = 0;
    for (var i = 0; i < count; i++) {
      html += msg.substring(start, parseInt(meta_data['si' + i]));
      html += "<img class='aniways-image' src='http://az493648.vo.msecnd.net/aniways-assets/android/ldpi/" + meta_data['id' + i] + "'  title=':" + msg.substring(parseInt(meta_data['si' + i]), parseInt(meta_data['si' + i]) + parseInt(meta_data['l' + i])) + ":'>";
      start = parseInt(meta_data['l' + i]) + parseInt(meta_data['si' + i]);
    }
    html += msg.substring(start);
    return html;
  }

  function getJsonFromUrl(url) {
    url = url.replace(/&amp;/g, '&')
    var query = url.split("?")[1];
    var data = query.split("&");
    var result = {};
    for (var i = 0; i < data.length; i++) {
      var item = data[i].split("=");
      result[item[0]] = item[1];
    }
    return result;
  }

  function addWallObserver(){
    var target = document.querySelector('.aniways-wall');

    // create an observer instance
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        for (var i = 0; i < mutation.addedNodes.length; ++i) {
          var node = mutation.addedNodes[i];
          var textNodes = node.getElementsByClassName('aniways-text');
          if(textNodes.length > 0){
            var decodedMessage = decodeMessage(textNodes[0].innerHTML);
            textNodes[0].innerHTML = decodedMessage;
          }
        }
      });
    });

    // configuration of the observer:
    var config = { childList: true, subtree: true };

    // pass in the target node, as well as the observer options
    observer.observe(target, config);
  }
})();
