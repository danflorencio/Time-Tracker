{
  var currDomain;   // The curent domain user is visitng

  // Using parallel arrays, efficient on space, but lookup not so great,
  // maybe switch to hash table in next version?
  var sites = [];   // The array of the websites the user has visited
  var timers = [];  // The array of the actual times corresponding to the sites
  var startTime;    // To measure elapsed time -> endTime - startTime
  var endTime;      // When switching to a new tab or loading different domain
  var realTime;     // To perform an update when popup is clicked on

  // logSites(domain) will search through the sites array looking for the domain
  // passed in, if the domain is in the sites array, there is a previous value
  // in the corresponding timers array and we simply increment within the
  // calling function. Otherwise, the site has not been visited yet, and we
  // append the new domain to the sites array and a corresponding "dummy" value
  // into the timers array.
  function logSites(domain) {
    var visited = false;
    // Easier way to do this, indexOf()?
    for (var i = 0; i < sites.length; i++) {
      if (sites[i] == domain) {
        // If we know a website has been visited perviously, it is already
        // in the sites array and has a corresponding timer, simply increment
        // within the calling function
        visited = true;
        break;
      }
    }
    // If a website has not been visited perviously
    if (!visited) {
      // Add a domain to the list of visited sites
      sites.push(domain);
      // Add a corresponding dummy value to the timers array
      timers.push(0);
    }
  }

  // getDomainIndex(domain) simply searches through the sites array checking to
  // see if the domain passed is in the sites array.
  function getDomainIndex(domain) {
    for (var i = 0; i < sites.length; i++) {
      if (sites[i] == domain) {
        return i;
      }
    }
    // Domain is not in the array
    return 0;
  }

  // formatTime(millisecs) is used to format x amount of milliseconds passed in
  // into a common "Hour : Minute: Second" string. Only called when formatting
  // the global timer.
  function formatTime(millisecs) {
    var second = Math.floor((millisecs / 1000) % 60);
    var minute = Math.floor((millisecs / (1000 * 60)) % 60);
    var hour = Math.floor((millisecs / (1000 * 60 * 60)) % 24);

    var time = hour.toString() + "h: " + minute.toString() + "m: " + second.toString() + "s";

    return time;
  }

  // errorCheck exists to get rid of a bug encountered at start time. Not the
  // most elegant way around it, but it works.
  function errorCheck(domain) {
    if (isNaN(timers[getDomainIndex(domain)])) {
      timers[getDomainIndex(domain)] = 0;
      return true;
    }
    return false;
  }

  // realTimeUpdate is used when first starting the extension. Check if there is
  // a corresponding value in the timers array with the current domain, if there
  // is, increment the value at the corresponding index in the timers array.
  // If there is no corresponding value in the timers array, push 0 milliseconds
  // into the corresponding index in the timers array.
  function realTimeUpdate() {
    realTime = new Date();

    console.log(getDomainIndex(currDomain));
    console.log(timers[getDomainIndex(currDomain)]);
    /*if errorCheck(currDomain) {
      startTime = new Date();
      return;
    }*/
    errorCheck(currDomain);

    timers[getDomainIndex(currDomain)] += realTime - startTime;
    startTime = new Date();
  }

  // This function will execute when the extension is installed
  /*chrome.runtime.onInstalled.addListener(function(info){
    //console.log("background.js chrome.runtime.onInstalled.addListener");
    debug();
    // Measure the elasped time
    startTime = new Date();
    // Push the website we are currently visitng
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var url = new URL(tabs[0].url);
        currDomain = url.hostname;
        logSites(currDomain);
        //console.log("Starting domain: " + currDomain);
    });
  })*/

  // This function will execute when tabs are changed.
  chrome.tabs.onActivated.addListener(function(info) {
    //console.log("switched tab!");
    // When we switch a tab, are we on the same domain still?
    chrome.tabs.get(info.tabId, function (tab) {
      var url = new URL(tab.url);
      var domain = url.hostname;
      // Check if we are moving to a different domain and we are visitng
      // a domain that we have not previously visited
      if (currDomain != domain) {
        // We are visiting a new domain, measure the elapsed time of the current
        // domain, and push it onto the appropriate array
        endTime = new Date();
        var index = getDomainIndex(currDomain);
        timers[index] += endTime - startTime;
        // Now handle the newly visited domain
        logSites(domain);
        currDomain = domain;
        // This is a different domain, so measure the elapsed time for this one
        startTime = new Date();
      }
      // Otherwise, the domain is the same, we need not do anything because
      // the domain has not changed, in other words, we only need to
      // do something if the domain changes
    });
  });

  // This function will execute when loading a page, wait for it to complete and
  // then start the timer for the domain. For example, if a user types into
  // the address bar, "facebook.com" and tries to access that page, the function
  // will wait until facebook is loaded before measuring time spent visiting
  // facebook.
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
      chrome.tabs.getSelected(null, function (tab1) {
        var url = new URL(tab.url);
        var domain = url.hostname;
        // Check if different domain and if it is not completely new to us
        if (currDomain != domain) {
          endTime = new Date();
          var index = getDomainIndex(domain);
          timers[index] += endTime - startTime;
          logSites(domain);
          currDomain = domain;
          startTime = new Date();
        }
      })
    }
  })

  // Code begins for the stopWatch so the user can see the total time spent
  // using Google Chrome
  var clear;
  var count = 0;

  // Keep the stopwatch going and increment every second.
  var stopWatch = function() {
    clear = setTimeout("stopWatch()", 1000);
  }

  // variables
  var count = 0;
  var clearTime;
  var seconds = 0;
  var minutes = 0;
  var hours = 0;
  var secs;
  var mins;
  var getHours;
  var totalTime = document.getElementById('status');

  // startWatch() is used for the global timer, it keeps track of the seconds
  // and icrements the global timer at every second, formatting the milliseconds
  // into a string that can be displayed to popup.html
  function startWatch() {
    // Check if seconds == 60, if so increment minutes and set seconds to 0
    if (seconds == 60) {
      seconds = 0;
      minutes += 1;
    }
    mins = (minutes < 10) ? ('0' + minutes + ': ') : (minutes + ': ');
    if (minutes == 60) {
      minutes = 0;
      hours += 1;
    }
    // Formatting
    getHours = (hours < 10) ? ('0' + hours + ': ') : (hours + ': ');
    secs = (seconds < 10) ? ('0' + seconds) : (seconds);
    // Display the time
    totalTime = getHours + mins + secs;
    // Call the seconds counter
    seconds++;
    // Keep the stopwatch alive
    clearTime = setTimeout(startWatch, 1000);
  }

  // Function exists only to debug.
  function debug() {
    setTimeout(myTimeout3, 20000)
  }

  // Function exists only to debug.
  function myTimeout3() {
    console.log("20 seconds");
    for (var i = 0; i < sites.length; i++) {
      console.log(sites[i] + " -> " + formatTime(timers[i]));
    }
  }
}
