{
  chrome.runtime.onInstalled.addListener(function(details){
    console.log("background.js chrome.runtiem.onInstalled.addListener");
    timedText();
  })

  // Keep a list of visited websites and the timers that go with them
  var sites = [];
  var timers = [];
  function logSites(domain) {
    var visited = false;
    for (var i = 0; i < sites.length; i++) {
      if (sites[i] == domain) {
        visited = true;
        break;
      }
    }
    if (!visited) {
      // Add a domain to the list of visited sites
      sites.push(domain);
      // Add a corresponding timer to the timers array
    }
    console.log(domain);
  }

  function timedText() {
    setTimeout(myTimeout3, 10000)
  }


  function myTimeout3() {
    console.log("4 seconds");
    for (var i = 0; i < sites.length; i++) {
      console.log(sites[i]);
    }
  }

  chrome.runtime.onStartup.addListener(function(details){
    console.log("background.js chrome.runtime.onStartup.addListener");
  })

  chrome.tabs.onActivated.addListener(function(info) {
    chrome.tabs.get(info.tabId, function (tab) {
      //console.log(tab.url);
      var url = new URL(tab.url);
      var domain = url.hostname;
      logSites(domain);
    });
  });


  // Code begins for the stopWatch
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
  var clearState;
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
    //var statusX = document.getElementById('status');
    totalTime = getHours + mins + secs;
    //console.log(statusX);
    // Call the seconds counter
    seconds++;
    // Keep the stopwatch alive
    clearTime = setTimeout(startWatch, 1000);
  }

  // Create a function to start the stopWatch
  //function startTime() {
    // Check if seconds, minutes and hours are equal to 0 and start
    /*if (seconds === 0 && minutes === 0 && hours === 0) {
      var fullTime = document.getElementById("fullTime");
      fullTime.style.display = "none";
      this.style.display = "none";
      startWatch();
    }*/
  //  startWatch();
  //  console.log("startWatch()");
  //}

  /*window.onload = function() {
    startWatch();
  }*/
}
