var baseURL = "https://api.covid19api.com/"
var confirmCase = $("#totalConfirmed");
var confirmDeath = $("#totalDeaths");
var totalRecovered = $("#totalRecovered");
var main = $("main")
var countryArray;
var countryAutoComplete;
var fullSummary;
var NYTFeed ;
var Headlines = $("#headlines") 

function init() {
  //makePageElements();
  getSummary();
}


//ADD LINK TO HERE - MY GOD :
//https://www.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6


function makePageElements() {
  var countryTableDiv = $("div").attr("id","countryTableDiv")
  main.append(countryTableDiv);
//<div id="countryTableDiv"></div>
      
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
    console.log(response);
    confirmCase.text(response.Global.TotalConfirmed);
    confirmDeath.html(response.Global.TotalDeaths);
    totalRecovered.html(response.Global.TotalRecovered);
    fullSummary = response;
    makeCountryIndex();

  });
}


$(document).ready(function(){
  $('.modal').modal();
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
  $table.append('')
    // thead

    //ADD SORTING HEADERS :
    .append('<thead>').children('thead')
    .append('<tr />').children('tr').append('<th onclick="sortTable(0)">Country</th><th onclick="sortTable(1)">NewConfirmed</th><th onclick="sortTable(2)">TotalConfirmed</th><th onclick="sortTable(3)">NewDeaths</th><th onclick="sortTable(4)">TotalDeaths</th><th onclick="sortTable(5)">NewRecovered</th><th onclick="sortTable(6)">TotalRecovered</th>');

  //tbody
  var $tbody = $table.append('<tbody />').children('tbody');

  // PLACE IN A FOR EACH LOOP
  for (i = 0; i < fullSummary.Countries.length; i++) {

    var detailButton = $("<button>").attr("data-id", fullSummary.Countries[i].Slug).attr("href","#modal1").attr("class", "waves-effect waves-red btn-flat").text(fullSummary.Countries[i].Country);
    detailButton.click(function () {
      var slug = $(this).attr('data-id');
      var country = $(this).text();
      getCountryInfo(slug);
      getNewsFeed(country);

      //LEARNED THIS FROM A YOUTUBE VIDEO :)
      //var instance = M.Modal.getInstance($("#modal1"));
      //instance.open();
      
      
    });

    $tbody.append('<tr />').children('tr:last')
      .append(detailButton)
      //.append("<td><a>" + fullSummary.Countries[i].Country + "<a/ data-id=" + fullSummary.Countries[i].Slug + "></td>")
      .append("<td>" + parseFloat(fullSummary.Countries[i].NewConfirmed).toLocaleString('en')    + "</td>")
      .append("<td>" + parseFloat(fullSummary.Countries[i].TotalConfirmed).toLocaleString('en')    + "</td>")
      .append("<td>" + parseFloat(fullSummary.Countries[i].NewDeaths).toLocaleString('en')    + "</td>")
      .append("<td>" + parseFloat(fullSummary.Countries[i].TotalDeaths).toLocaleString('en')    + "</td>")
      .append("<td>" + parseFloat(fullSummary.Countries[i].NewRecovered).toLocaleString('en')    + "</td>")
      .append("<td>" + parseFloat(fullSummary.Countries[i].TotalRecovered).toLocaleString('en')    + "</td>");

  }
  //LAST STEP
  $table.appendTo(countryTableDiv);

}

//FILTER TABLE FUNCTION

  $(document).ready(function(){
    $("#myInput").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#countryIDX tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
  });




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


/*
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
*/


function getCountryInfo(slug) {
  
  var endDate = moment().format("YYYY-MM-DD");
  var startDate = '2020-08-01';
  //var slug = "united-states"

  var settings = {
    "url": baseURL + "total/country/" + slug + "?from=" + startDate + "&to=" + endDate,
    "method": "GET",
    "timeout": 0,
    success: function (data) {
      countryData = data;
      pCountryData(slug);
      renderCountryData(countryData);
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

function renderCountryData(countryData){
  
  //GRAB OUR TABLE PLACEMENT DIV
  var countryDetailTableDiv = $("#twoWeekDetail");
  countryDetailTableDiv.empty();
  // create table
  var $table = $('<table>');

  $table.attr("id", "countryDetail").attr("class", "responsive-table centered highlight countryTable")

  // caption
  $table.append('<caption>[COUNTRYNAME]</caption>')
  $table.append('')
    // thead

    //ADD SORTING HEADERS :
    .append('<thead>').children('thead')
    .append('<tr />').children('tr').append('<th>Date</th><th>Active</th><th>Confirmed</th><th>Recovered</th><th>Deaths</th>');

  //tbody
  var $tbody = $table.append('<tbody />').children('tbody');

  // PLACE IN A FOR EACH LOOP
  for (i = 0; i < countryData.length; i++) {

    if ( i && (i % 7 === 0)) {
    $tbody.append('<tr />').children('tr:last')
      .append("<td>" + countryData[i].Date + "</td>")
      .append("<td>" + parseFloat(countryData[i].Active).toLocaleString('en')  + "</td>")
      .append("<td>" + parseFloat(countryData[i].Confirmed).toLocaleString('en')    + "</td>")
      .append("<td>" + parseFloat(countryData[i].Recovered).toLocaleString('en')    + "</td>")
      .append("<td>" + parseFloat(countryData[i].Deaths).toLocaleString('en')    + "</td>")
    
  }}
  //LAST STEP
  $table.appendTo(countryDetailTableDiv);


};


function pCountryData(slug) {

  var settings = {
    "url": "https://api.covid19api.com/premium/country/data/" + slug,
    "method": "GET",
    "timeout": 0,
    "headers": {
      "X-Access-Token": "5cf9dfd5-3449-485e-b5ae-70a60e997864"
    },
  };
  
  $.ajax(settings).done(function (response) {
    console.log(response);
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
    //console.log(articles);
    renderNews(articles);
  });
  }
  function renderNews(articles){
   Headlines.empty();

    for (i=0 ; i < articles.length ; i++){
      //WRITE OUT VARIABLES FOR THE CORE ELEMENTS RETURNED FROM NYT - NOT ALL WILL BE USED YET - BUT THIS CAN SERVE AS A GENERALLY NICE BUILDING BLOCK.
      var headline = articles[i].headline.main;
      var lead = articles[i].lead_paragraph;
      var pub_date = articles[i].ub_date;
      var news_desk = articles[i].news_desk ; 
      var url = articles[i].web_url
      var articleCard = '<p><a href=' + url +' target=_blank>' + headline + '</a></p>'
      Headlines.append(articleCard)

  } 
    //OPEN THE MODAL AFTER NEWS HAS BEEN RETIREVED
    var instance = M.Modal.getInstance($("#modal1"));
    instance.open();
  };

  function renderArticle(docs){
  }

  //PUT OUR INIT AT THE BOTTOM OF THE DOC.
init();