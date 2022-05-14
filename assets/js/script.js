
//---------------------------searchLatLon--------------------------------------------
function searchComic() {
  //my key
var PoKEY = "0b0978c066ab6b1971c35e90aa799998";
var PrKey = '3d6bd3acb1691f2b4475823f3933cb22f190092f';
// 
var cTime = 1;
//console.log(cTime);


//----------------------

var hash = CryptoJS.MD5(cTime+PoKEY+PrKey).toString();
console.log(hash);

  var QueryUrl = "https://gateway.marvel.com:443/v1/public/comics?ts=1&format=comic&formatType=comic&dateDescriptor=thisMonth&apikey="+PoKEY+'&hash='+hash;
  
  console.log(QueryUrl);


  fetch(QueryUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (locRes) {
      // write query to page so user knows what they are viewing
      // resultTextEl.textContent = locRes.search.query;
      // console.log(locRes);
      //console.log(locRes.length);
      if (!locRes.length) {
        console.log('No results found!');
        resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
      } else {
        resultContentEl.textContent = '';
        for (var i = 0; i < locRes.length; i++) {
          
          lat = locRes[i].lat;
          lon = locRes[i].lon;
          console.log('Lat = ',lat,'lon = ' , lon);

          searchWeather(lat,lon);
        }
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}