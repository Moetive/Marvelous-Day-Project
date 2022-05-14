
//---------------------------searchLatLon--------------------------------------------
function searchComic() {
  //my key
var PoKEY = "4ad6d5dfbe0363fc5df19946c9351c2a";
// var PoKEY = "justesting"
var PrKey = 'f820964efbbd5f5c999a0e07acf2d1121d12729d';
// var PrKey = "awdpawdpakwd"
// 
var cTime = "1234"
//console.log(cTime);


//----------------------

var hashTest = CryptoJS.MD5(cTime+PrKey+PoKEY);
var hash = hashTest.toString(CryptoJS.enc.Hex);

console.log(PoKEY);
console.log(PrKey);
console.log(cTime);
console.log(hash);

  var QueryUrl = "https://gateway.marvel.com:443/v1/public/comics?dateRange=1990-01-31%2C%201990-01-01&format=comic&formatType=comic&dateDescriptor=thisMonth&ts=" + cTime + "&apikey=" + PoKEY + "&hash=" + hash;
  

  console.log(QueryUrl);


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