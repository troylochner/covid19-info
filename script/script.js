var baseURL = "https://api.covid19api.com/"
var confirmCase = $("#totalConfirmed");
var confirmDeath = $("#totalDeaths");
var totalRecovered = $("#totalRecovered");
var main = $("main")
var countryArray;
var country ;
var countryAutoComplete;
var fullSummary;
var NYTFeed ;
var Headlines = $("#headlines") 

function init() {
  getSummary();
}

//ADD LINK TO HERE - MY GOD :
//https://www.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6

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
    confirmCase.text((response.Global.TotalConfirmed).toLocaleString('en'));
    confirmDeath.text((response.Global.TotalDeaths).toLocaleString('en'));
    totalRecovered.text((response.Global.TotalRecovered).toLocaleString('en'));
    fullSummary = response;
    makeCountryIndex();

  });
}

//CONTROL THE MODAL POPUP
$(document).ready(function(){
  $('.modal').modal();
});


//MAKE COUNTRY INDEX TABLE:
function makeCountryIndex() {

  //GRAB OUR TABLE PLACEMENT DIV
  var countryTableDiv = $("#countryTableDiv");
  

  //MAKE AN EMPTY TABLE ELEMENT
  var $table = $('<table>');
  $table.attr("id", "countryIDX").attr("class", "responsive-table centered highlight countryTable")

  // REMOVED THE CAPTION - BUT LEAVING CODE IN - IF WE WANT THIS FOR FUTURE USE.
  //$table.append('<caption>Current Case Counts</caption>')
  $table.append('')

    //ADD SORTING HEADERS :
    .append('<thead>').children('thead')
    .append('<tr />').children('tr').append('<th onclick="sortTable(0)">Country</th><th onclick="sortTable(1)">NewConfirmed</th><th onclick="sortTable(2)">TotalConfirmed</th><th onclick="sortTable(3)">NewDeaths</th><th onclick="sortTable(4)">TotalDeaths</th><th onclick="sortTable(5)">NewRecovered</th><th onclick="sortTable(6)">TotalRecovered</th>');

  //ADD A TABLE BODY
  var $tbody = $table.append('<tbody />').children('tbody');

  // PLACE IN A FOR EACH LOOP
  for (i = 0; i < fullSummary.Countries.length; i++) {

    var detailButton = $("<button>").attr("data-id", fullSummary.Countries[i].Slug).attr("href","#modal1").attr("class", "waves-effect waves-red btn-flat").text(fullSummary.Countries[i].Country);
    detailButton.click(function () {
      var slug = $(this).attr('data-id');
      var country = $(this).text();
      //WHEN A USER CLICKS THE COUNTRY BUTTON - TWO API CALLS ARE TRIGGERED - ONE TO GET DAILY DATA - THE OTHER TO GET NYT HEADLINES
      getCountryInfo(slug);
      getNewsFeed(country);

      });

    //ADD INFORMATION INTO THE TABLE ROWS
      $tbody.append('<tr />').children('tr:last')
      .append(detailButton)
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

//FILTER TABLE ROWS ON THE COUNTRY INDEX
  $(document).ready(function(){
    $("#myInput").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#countryIDX tbody tr").filter(function() {
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


function getCountryInfo(slug) {
  //WHEN GETTING COUNTRY INFO - START AT THE CURRENT DATE (END) - WORK BACK THROUGH 8 WEEKS
  var endDate = moment().format("YYYY-MM-DD");
  var startDate = moment(endDate,'YYYY-MM-DD').subtract(8,'weeks')
  var settings = {
    "url": baseURL + "total/country/" + slug + "?from=" + startDate + "&to=" + endDate,
    "method": "GET",
    "timeout": 0,
    success: function (data) {
      countryData = data;
      
      //GET PREMIUM COUNTRY DATA - UNUSED
      //pCountryData(slug);

      //RENDER THE COUNTRY DATA
      renderCountryData(countryData);
      //console.log("getCountryInfo -> countryData", countryData)

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
  
  //GRAB OUR TABLE PLACEMENT DIV & EMPTY
  var countryDetailTableDiv = $("#twoWeekDetail");
  countryDetailTableDiv.empty();
  
  //CREATE THE TABLE
  var $table = $('<table>');
  $table.attr("id", "countryDetail").attr("class", "responsive-table centered highlight countryTable")
  // ADD CAPTION
  $table.append('<caption><H4>' + countryData[0].Country  + '</H4></caption><hr>')
  $table.append('')
    //ADD HEADERS :
    .append('<thead>').children('thead')
    .append('<tr />').children('tr').append('<th>Date</th><th>Active</th><th>Active +/- from prev.</th><th>Confirmed</th><th>Recovered</th><th>Deaths</th>');

  //APPEND THE TABLE 
  var $tbody = $table.append('<tbody />').children('tbody');

  //COMPARE ACTIVE CASES ON A WEEKLY BASIS
  var activeCasesCurrent = parseFloat(countryData[0].Active) ;
  var activeCasesPrev = parseFloat(countryData[0].Active) ; 
  var activeCaseDelta = parseFloat(0)  ; 
  var deltaStyle;

  // PLACE IN A FOR EACH LOOP
  //for (i = 0; i < countryData.length; i++) {

    //Trying a reverse loop
    //IF WE WANTED TO TRY TO REVERSE LOOP
    for (i = countryData.length ; i >= 0 ; i--){

    //ONLY DISPLAY EVERY 7th DAY
    if ( i && (i % 7 === 0)) {
      
      console.log("ITTERATION : " + i +  ' | ' + (i % 7))
      activeCasesCurrent = parseFloat(countryData[i].Active);
      console.log("CURRENT CASES : ", activeCasesCurrent)
      
      activeCaseDelta = (activeCasesCurrent - activeCasesPrev);
      console.log("CHANGE IN CASES : ", moment(countryData[i].Date).format('YYYY-MM-DD') + ' | ' + activeCaseDelta)

      //STYLE THE RESPONSE IF CASES ARE UP OR DOWN FROM PREVIOUS WEEK
      if ( activeCaseDelta === null){
        deltaStyle = "#2d3436"
      } else if (activeCaseDelta > 0){
        deltaStyle = "#e17055"
      } else if (activeCaseDelta < 0 ){
        deltaStyle ="#10ac84"
      };

   
    
    
    $tbody.append('<tr />').children('tr:last')
      .append("<td>" + moment(countryData[i].Date).format('YYYY-MM-DD') + "</td>")
      .append("<td>" + parseFloat(countryData[i].Active).toLocaleString('en')  + "</td>")
      .append("<td style=color:" + deltaStyle + ">" + activeCaseDelta + "</td>")
      .append("<td>" + parseFloat(countryData[i].Confirmed).toLocaleString('en')    + "</td>")
      .append("<td>" + parseFloat(countryData[i].Recovered).toLocaleString('en')    + "</td>")
      .append("<td>" + parseFloat(countryData[i].Deaths).toLocaleString('en')    + "</td>")
      
      //SET THE PREVIOUS ACTIVE CASES TO BE USES AS A COMPARITIVE FOR THE NEXT ITTERATION IN THE LOOP
      activeCasesPrev = activeCasesCurrent;
      console.log("THE PREVIOUS CASES : ", activeCasesPrev)
    
  }}
  //LAST STEP
  $table.appendTo(countryDetailTableDiv);


};


//THIS FUNCTION RETURNS PREMIUM COUNTRY DATA - THIS COULD BE USEFUL WHEN OPENING UP A MODAL. NOT CURRENTLY USED
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
  country = slug
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
  Headlines.append('<H6> Latest ' + country + " headlines from NYT." + '</H6><hr>')


    for (i=0 ; i <5 ; i++){
      //WRITE OUT VARIABLES FOR THE CORE ELEMENTS RETURNED FROM NYT - NOT ALL WILL BE USED YET - BUT THIS CAN SERVE AS A GENERALLY NICE BUILDING BLOCK.
      var headline = articles[i].headline.main;
      var lead = articles[i].lead_paragraph;
      var pub_date = articles[i].ub_date;
      var news_desk = articles[i].news_desk ; 
      var url = articles[i].web_url
      var articleCard = '<p><a href=' + url +' target=_blank>' + headline + '</a></p>'
      Headlines.append(articleCard)

  } 
    //OPEN THE MODAL AFTER NEWS HAS BEEN RETRIEVED
    var instance = M.Modal.getInstance($("#modal1"));
    instance.open();
  };
  function renderArticle(docs){

  }

  //PUT OUR INIT AT THE BOTTOM OF THE DOC.
init();