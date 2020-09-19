var baseURL = "https://api.covid19api.com/"
var confirmCase = $("#totalConfirmed");
var confirmDeath = $("#totalDeaths");
var totalRecovered = $("#totalRecovered");
var countryArray;
var countryAutoComplete;
var fullSummary;
var NYTFeed ; 

function init() {
  getSummary();
}

function makeTableDiv() {

};

function getSummary() {

  var settings = {
    "url": "https://api.covid19api.com/summary",
    "method": "GET",
    "timeout": 0,
    "headers": {
      "X-Access-Token": "5cf9dfd5-3449-485e-b5ae-70a60e997864"
    },
  };

  $.ajax(settings).done(function (response) {
    //console.log(response);
    confirmCase.text(response.Global.TotalConfirmed);
    confirmDeath.html(response.Global.TotalDeaths);
    totalRecovered.html(response.Global.TotalRecovered);
    fullSummary = response;
    //confirm('Did this function');
    makeCountryIndex();

  });
}

function getCountries() {
  var settings = {
    "url": baseURL + "countries",
    "method": "GET",
    "timeout": 0,
  };
  $.ajax(settings).done(function (response) {
    countryArray = response;
    createAutoComplete(countryArray);
  });
};

function createAutoComplete(countryArray) {
  var x = [];
  for (i = 0; i < countryArray.length; i++) {
    x.push(countryArray[i].Country)
  }
  countryAutoComplete = JSON.stringify(x)
}

function sendItem(val) {
  console.log(val);
}

//BUILDING IN COUNTRY AUTOCOMPLETE - USING ONLY 3 COUNTRIES AS MY START POINT
$(function () {
  $('input.autocomplete').autocomplete({
    data: {
      "mexico": null,
      "canada": null,
      "united-states": null,
      "austria": null,
      "yemen": null,
    },
    onAutocomplete: function (txt) {
      //UPON AUTOCOMPLETE - CALL FUNCTION
      //sendItem(txt);
      getCountryInfo(txt);
    },
    limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
  });

});

//MAKE COUNTRY INDEX TABLE:
function makeCountryIndex() {

  //GRAB OUR TABLE PLACEMENT DIV
  var countryTableDiv = $("#countryTableDiv");
  // create table
  var $table = $('<table>');
  
  $table.attr("id", "countryIDX").attr("class", "responsive-table centered highlight countryTable")

  // caption
  $table.append('<caption>Current Case Counts</caption>')
    // thead

    //ADD SORTING HEADERS :
    .append('<thead>').children('thead')
    .append('<tr />').children('tr').append('<th onclick="sortTable(0)">Country</th><th onclick="sortTable(1)">NewConfirmed</th><th onclick="sortTable(2)">TotalConfirmed</th><th onclick="sortTable(3)">NewDeaths</th><th onclick="sortTable(4)">TotalDeaths</th><th onclick="sortTable(5)">NewRecovered</th><th onclick="sortTable(6)">TotalRecovered</th>');

  //tbody
  var $tbody = $table.append('<tbody />').children('tbody');

  // PLACE IN A FOR EACH LOOP
  for (i = 0; i < fullSummary.Countries.length; i++) {

    var detailButton = $("<button>").attr("data-id", fullSummary.Countries[i].Slug).attr("class", "waves-effect waves-red btn-flat").text(fullSummary.Countries[i].Country);
    detailButton.click(function () {
      var slug = $(this).attr('data-id');
      getCountryInfo(slug);
      getNewsFeed(slug);
      
     // console.log($(this).attr('data-id'))
      $('.modal').modal();
    });

    $tbody.append('<tr />').children('tr:last')
      .append(detailButton)
      //.append("<td><a>" + fullSummary.Countries[i].Country + "<a/ data-id=" + fullSummary.Countries[i].Slug + "></td>")
      .append("<td>" + parseFloat(fullSummary.Countries[i].NewConfirmed) + "</td>")
      .append("<td>" + parseFloat(fullSummary.Countries[i].TotalConfirmed) + "</td>")
      .append("<td>" + parseFloat(fullSummary.Countries[i].NewDeaths) + "</td>")
      .append("<td>" + parseFloat(fullSummary.Countries[i].TotalDeaths) + "</td>")
      .append("<td>" + parseFloat(fullSummary.Countries[i].NewRecovered) + "</td>")
      .append("<td>" + parseFloat(fullSummary.Countries[i].TotalRecovered) + "</td>");

  }
  //LAST STEP
  $table.appendTo(countryTableDiv);

}

//FUNCTION - GET COUNTRY DETAIL:


//SORT TABLE FUNCTION DIRECT FROM w3:
function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("countryIDX");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}



//MAKE A TABLE
function makeTable(x) {
  //GRAB OUR TABLE PLACEMENT DIV
  var countryTableDiv = $("#countryTableDiv");
  // create table
  var $table = $('<table>');
  // caption
  $table.append('<caption>[REPLACE WITH COUNTRY NAME HERE]s</caption>')
    // thead
    .append('<thead>').children('thead')
    .append('<tr />').children('tr').append('<th>Date</th><th>Active</th><th>Confirmed</th><th>Recovered</th>');

  //tbody
  var $tbody = $table.append('<tbody />').children('tbody');

  // add row
  $tbody.append('<tr />').children('tr:last')
    .append("<td>val</td>")
    .append("<td>val</td>")
    .append("<td>val</td>")
    .append("<td>val</td>");


  // add table to dom
  $table.appendTo(countryTableDiv);

}

function getCountryInfo(slug) {
  var startDate = '2020-09-01';
  var endDate = '2020-09-19';
  //var slug = "united-states"

  var settings = {
    "url": baseURL + "total/country/" + slug + "?from=" + startDate + "&to=" + endDate,
    "method": "GET",
    "timeout": 0,
    success: function (data) {
      countryData = data;
      //LOOP THROUGH THE DAYS
      for (i = 0; i < countryData.length; i++) {
        console.log(countryData[i].Date);
      }
      console.log("getCountryInfo -> countryData", countryData)
    },
    error: function (ex) {
      alert(ex.data);
    }
  };
  $.ajax(settings).done(function (response) {
    //console.log(response);
  });
}


//SEARCH NYT ARTICLES
function getNewsFeed(slug){
  var settings = {
    "url": "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=Coronavirus," + slug  + "&api-key=hPVtMuGI16UdYIJkeNoARxbNILrtWNLG",
    "method": "GET",
    "timeout": 0,
  };
  
  $.ajax(settings).done(function (response) {
    var articles = response.response.docs
    renderNews(articles);
    //console.log(response);
    //console.log(response.response.docs);
  });
  }
  
  function renderNews(articles){
  for (i=0 ; i < articles.length ; i++){
  renderArticle(articles[i]);
  //console.log(articles[i].headline.main);
  //console.log(
  
  }
  
  };

  function renderArticle(docs){
    var headline = docs.headline.main;
    console.log("renderArticle -> headline", headline)
    var lead = docs.lead_paragraph;
    console.log("renderArticle -> lead", lead);
    var pub_date = docs.pub_date;
    console.log("renderArticle -> pub_date", pub_date)
    var news_desk = docs.news_desk ; 
    console.log("renderArticle -> news_desk", news_desk)
    var uri = docs.uri
    console.log("renderArticle -> uri", uri)



  }

init();