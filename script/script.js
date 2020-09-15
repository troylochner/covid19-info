var baseURL = "https://api.covid19api.com/"

console.log("LOOK A MADE A BRANCH");

function getCountries(){
    var settings = {
        "url": baseURL + "countries",
        "method": "GET",
        "timeout": 0,
      }; 
      $.ajax(settings).done(function (response) {
        console.log(response);
      });
};

function getCountryInfo(slug){
  var startDate = '2020-09-01';
  var endDate = '2020-09-14';
  //var slug = "united-states"

  var settings = {
    "url": baseURL + "total/country/" + slug + "?from=" + startDate + "&to=" + endDate ,
    "method": "GET",
    "timeout": 0,
    success: function (data) {
      countryData = data;
      //LOOP THROUGH THE DAYS
      for (i=0;i<countryData.length;i++){
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