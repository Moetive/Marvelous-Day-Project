var searchBody = document.querySelector('#search-body');


//---------------------------searchLatLon--------------------------------------------
function searchComic() {
  //my key
var pvtkey = "0b0978c066ab6b1971c35e90aa799998";
var pubkey = '3d6bd3acb1691f2b4475823f3933cb22f190092f';

// var ts = new Date();
// ts = ts.getUTCMilliseconds(); 
// console.log(ts);


//----------------------
//var str_1 = ts + environment.pvtkey + environment.pubkey;  
//var str_2 = request.data["timeStamp"] + request.data["apiKey"];
//var hash = CryptoJS.MD5(str_1).toString(); 

var ts = Number(new Date());

var message = ts+pubkey+pvtkey;  
var hash = CryptoJS.MD5(message).toString(); 

// Create variables for date range, then put those in the URL
var year = '1990';
var munth = '01';
var date1 = year + "-" + munth + "-" + '01';
var date2 = year + "-" + munth + "-" + '31';
var dateRange = "dateRange=" + date1 + "%2C%20" + date2;
console.log(dateRange);

QueryUrl = 'https://gateway.marvel.com/v1/public/characters?ts='+ts+'&orderBy=name&apikey='+ pvtkey +'&hash='+ hash;
QueryUrl = "https://gateway.marvel.com:443/v1/public/comics?" + dateRange + "&format=comic&formatType=comic&dateDescriptor=thisMonth&ts=" + ts + "&apikey=" + pvtkey + "&hash=" + hash;


console.log(hash);
console.log(QueryUrl);

  fetch(QueryUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (locRes) {
      console.log(locRes);
      if (!locRes) {
        console.log('No results found!');
        resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
      } else {
        var newObj = locRes['data']['results'];
        console.log(newObj);
        for (var i = 0; i < newObj.length; i++) {
          printout(newObj[i]['characters']['items']);
        }
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}

function printout(items){
  for (var i = 0; i < items.length; i++) {
    searchHistory(items[i]['name']);
  }
}


//------------------------------search history-------------------------------------------
function searchHistory(resultObj) {
  console.log(resultObj);
      var linkButtonEl = document.createElement('a');
      //https://www.google.com/search?q=fantastic+four
      var url = 'https://www.google.com/search?q=' + resultObj+ ' comic book marvel';
      linkButtonEl.textContent = resultObj;
      linkButtonEl.setAttribute('id',resultObj);
      linkButtonEl.setAttribute('href', url);
      linkButtonEl.classList.add('btn', 'btn-dark','column','margin','btn-info', 'btn-block');
      searchBody.prepend(linkButtonEl);
}