var baseURL = "https://api.covid19api.com/"
  var confirmCase = $("#totalConfirmed");
  var confirmDeath = $("#totalDeaths");
  var totalRecovered = $("#totalRecovered");

function init() {
  getSummary();
}

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
    //confirm('Did this function');

  });
}

function getCountries() {
  var settings = {
    "url": baseURL + "countries",
    "method": "GET",
    "timeout": 0,
  };
  $.ajax(settings).done(function (response) {
    console.log(response);
  });
};




function getCountryInfo(slug) {
  var startDate = '2020-09-01';
  var endDate = '2020-09-14';
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

init();