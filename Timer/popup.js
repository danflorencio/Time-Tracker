/**
 * Create a timer for the active tab.
 *
 */
function startTimer() {
  // Create a new timer for the url the user is on
  var myTimer = new chrome.Interval();
  document.getElementById('status').textContent = "Awesome";
}

chrome.browserAction.onClicked.addListener(function(tab) {

})

chrome.runtime.onInstalled.addListener(function(details){

})

chrome.runtime.onStartup.addListener(function(details){

})

window.onload = function() {
  var bgPage = chrome.extension.getBackgroundPage();
  console.log("bgPage.startTime()");
  if (bgPage.count == 0) {
    bgPage.startWatch();
    bgPage.count++;
  }
  var resetMe;
  function loopy() {
    document.getElementById('status').innerHTML = chrome.extension.getBackgroundPage().totalTime;
    resetMe = setTimeout(loopy, 1000);
  }
  function addTimes() {
    for (var i = 0; i < bgPage.sites.length; i++) {
      var node = document.createElement("LI");
      var textNode = document.createTextNode(bgPage.sites[i] + "  "
                                             + bgPage.formatTime(bgPage.timers[i]));
      node.appendChild(textNode);
      document.getElementById("list").appendChild(node);
    }
  }
  loopy();
  addTimes();
}
