
//---------------------------searchLatLon--------------------------------------------
function searchComic() {

// Create variables from pub and private keys
var PoKEY = "4ad6d5dfbe0363fc5df19946c9351c2a";
var PrKey = 'f820964efbbd5f5c999a0e07acf2d1121d12729d';
var cTime = "1234"; //this should probably be a real timestamp

//----------------------
// Create the hash
var hashTest = CryptoJS.MD5(cTime+PrKey+PoKEY);
var hash = hashTest.toString(CryptoJS.enc.Hex);

//just testing
console.log(PoKEY);
console.log(PrKey);
console.log(cTime);
console.log(hash);

// Create variables for date range, then put those in the URL
var date1 = "1990-01-01"
var date2 = "1990-01-31"
var dateRange = "dateRange=" + date1 + "%2C%20" + date2;

// The url, baby!
var QueryUrl = "https://gateway.marvel.com:443/v1/public/comics?" + dateRange + "&format=comic&formatType=comic&dateDescriptor=thisMonth&ts=" + cTime + "&apikey=" + PoKEY + "&hash=" + hash;

  console.log(QueryUrl);

// I don't actually know what any of this does..
  fetch(QueryUrl)
    .then(function (response) {
      return response;
    })
    .then(function (response) {
      console.log(response.json());
      })
    .catch(function (error) {
      console.error(error);
    });
}

searchComic();