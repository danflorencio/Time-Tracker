/*
 * popup.js is executed when the popup.html is clicked on. The api used to
 * grab trending headlines and put them into a conveinient JSON format is
 * provided by newsapi.org, and the news outlet choice is The Washington Post.
 */

var theNewScript = document.createElement("script");
theNewScript.type = "text/javascript";
theNewScript.src = "jquery.js";

window.onload = function() {
  // Debug
  console.log("window.onload");

  // Grab the metadata and put it into JSON
  $.get("https://newsapi.org/v1/articles?source=the-washington-post&sortBy=top&apiKey=hidden", function(newsy) {

    // Begin building popup.html
    for (var i = 0; i < newsy.articles.length; i++) {
      // Create a link with the article's title
      var link = document.createElement('a');
      link.textContent = newsy.articles[i].title;
      link.href = newsy.articles[i].url;

      // Grab the image and set the attributes
      var newImg = document.createElement("IMG");
      newImg.src = newsy.articles[i].urlToImage;
      newImg.title = newsy.articles[i].description;

      // Now append to the HTML body
      document.body.appendChild(link);
      document.body.appendChild(newImg);
    }

    // Give credit to newsAPI.org
    var newLink = document.createElement('p');
    newLink.href = 'https://newsAPI.org';
    newLink.innerHTML = 'Powered by NewsAPI.org';
    document.body.appendChild(newLink);
  });
}

// Make those links in popup.html clickable so that a user can open them in
// a new tab
window.addEventListener('click', function(e){
  if(e.target.href !== undefined){
    chrome.tabs.create({url:e.target.href})
  }
})
