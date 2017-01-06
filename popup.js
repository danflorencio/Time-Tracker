/*
 * popup.js is the code that is executed when the user clicks on the popup
 * within Chrome to start the timer.
 */

// window.onload() is invoked whenever the user clicks on the
// popup within Chrome
window.onload = function() {
  // bgPage is background.js and contains all code necessary to run in
  // the background.
  var bgPage = chrome.extension.getBackgroundPage();
  // Debug statement
  console.log("bgPage.startTime()");
  // This counter exists because we don't want to start
  // a global clock incrementing more than once, if we didn't have this counter
  // and the user clicked the popup twice, the global clock would run at
  // twice the speed. If clicked three times, three times the speed, etc.
  if (bgPage.count == 0) {
    bgPage.startWatch();
    bgPage.count++;
  }

  // loopy() exists to refresh the global clock when the popup is activated, if
  // we didn't update the clock every second, the only time the global clock
  // would be accurate is right at the instant the popup is clicked
  var resetMe;
  function refresh() {
    document.getElementById('status').innerHTML = chrome.extension.getBackgroundPage().totalTime;
    resetMe = setTimeout(loopy, 1000);
  }

  // addTimes() will add the domains and the times a user has spent visiting
  // them to the popup within Chrome, to acheive this we will create an
  // unordered list and append list elements to them
  function addTimes() {
    for (var i = 0; i < bgPage.sites.length; i++) {
      var node = document.createElement("LI");
      var textNode = document.createTextNode(bgPage.sites[i] + "  "
                                             + bgPage.formatTime(bgPage.timers[i]));
      node.appendChild(textNode);
      document.getElementById("list").appendChild(node);
    }
  }
  refresh();
  bgPage.realTimeUpdate();
  addTimes();
}
