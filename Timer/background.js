{
  var currDomain;   // The curent domain user is visitng
  var sites = [];   // The array of the websites the user has visited
  var timers = [];  // The array of the actual times corresponding to the sites
  var startTime;    // To measure elapsed time -> endTime - startTime
  var endTime;
  var realTime;     // To perform an update when popup is clicked on

  function logSites(domain) {
    var visited = false;
    // Easier way to do this, indexOf()?
    for (var i = 0; i < sites.length; i++) {
      if (sites[i] == domain) {
        // If we know a website has been visited perviously, it is already
        // in the sites array and has a corresponding timer, don't mess with
        // anything
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
    //console.log(domain);
  }

  function getDomainIndex(domain) {
    for (var i = 0; i < sites.length; i++) {
      if (sites[i] == domain) {
        return i;
      }
    }
    // Domain is not in the array
    return 0;
  }

  function formatTime(millisecs) {
    // Javascript is weird.
    var second = Math.floor((millisecs / 1000) % 60);
    var minute = Math.floor((millisecs / (1000 * 60)) % 60);
    var hour = Math.floor((millisecs / (1000 * 60 * 60)) % 24);

    var time = hour.toString() + "h: " + minute.toString() + "m: " + second.toString() + "s";
    return time;
  }

  function realTimeUpdate() {
    realTime = new Date();
    var index = getDomainIndex(currDomain);
    timers[index] += realTime - startTime;
    startTime = new Date();
  }

  // Never fired, only starts when chrome starts, not when extension starts
  chrome.runtime.onStartup.addListener(function(info){
    console.log("background.js chrome.runtime.onStartup.addListener");
  })

  // This will execute when the extension is installed
  chrome.runtime.onInstalled.addListener(function(info){
    //console.log("background.js chrome.runtime.onInstalled.addListener");
    timedText();
    // Measure the elasped time
    startTime = new Date();
    // Push the website we are currently visitng!
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var url = new URL(tabs[0].url);
        currDomain = url.hostname;
        logSites(currDomain);
        //console.log("Starting domain: " + currDomain);
    });
  })

  // This will execute when tabs are switched
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

  // When you're loading up a page, wait for it to complete and
  // then start the timer for it.
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

  function timedText() {
    setTimeout(myTimeout3, 20000)
  }

  function myTimeout3() {
    console.log("20 seconds");
    for (var i = 0; i < sites.length; i++) {
      console.log(sites[i] + " -> " + formatTime(timers[i]));
    }
  }
}
