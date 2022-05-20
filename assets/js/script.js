var searchBody = document.querySelector('#search-body');
var colapsTag = document.querySelector('#accordion');
var p1 = document.querySelector('#p1');

var year;
var munth;
var wikiObj;
//document.getElementById("myDIV").style.opacity = "0.5";


//---------------------------search Comic--------------------------------------------
function searchComic() {
  //my key
getParams();
document.body.style.background.opacity = '0.1';


var pvtkey = "0b0978c066ab6b1971c35e90aa799998";
var pubkey = '3d6bd3acb1691f2b4475823f3933cb22f190092f';

var ts = Number(new Date());

var message = ts+pubkey+pvtkey;  
var hash = CryptoJS.MD5(message).toString(); 

// Create variables for date range, then put those in the URL

var date1 = year + "-" + munth + "-" + '01';
var date2 = year + "-" + munth + "-" + '31';
var dateRange = "dateRange=" + date1 + "%2C%20" + date2;
console.log(dateRange);

// QueryUrl = 'https://gateway.marvel.com/v1/public/characters?ts='+ts+'&orderBy=name&apikey='+ pvtkey +'&hash='+ hash;
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
          // printout(newObj[i]['characters']['items']);
          searchHistory(newObj[i]['title'],newObj[i]['thumbnail']['path'],newObj[i]['urls'][0]['url']);
        }
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}

//----------------------------------------------------------------------------------
//https://en.wikipedia.org/w/rest.php/v1/search/page?q=Captain%20America&limit=100
//https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=&srlimit=20&srsearch=SEARCH_QUERY_GOES_HERE
//---------------------------search Wiki--------------------------------------------
function searchWiki(resultObj) {
  var wikiTitle;
  var nameCleaned = resultObj.replace(/\s/g, '%20')
  var value = "'"+nameCleaned+"'"
  console.log(value);
  var WikiQueryUrl = 'https://en.wikipedia.org/w/rest.php/v1/search/page?limit=1&q='+value;
  //console.log(WikiQueryUrl);
  
    fetch(WikiQueryUrl)
      .then(function (response) {
        if (!response.ok) {
          throw response.json();
        }
        return response.json();
      })
      .then(function (locRes) {
        if (!locRes) {
          console.log('No results found!');
          resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
        } else {
          console.log(locRes);
          wikiObj = locRes['pages'][0]['title'];
          console.log(wikiObj);
          return wikiTitle;  
        }

      })
      .catch(function (error) {
        console.error(error);
      });
      // wikiTitle = locRes['pages'][0]['description'];
    return wikiTitle;
  }
  
//Ben's indexing var
var idIndex = 0;

//Ben's modal el
var modalEl = $("#comicDetails");
//------------------------------search history-------------------------------------------
function searchHistory(resultObj,path,Marvelurl) {
      var wikiTitle = searchWiki(resultObj);
      console.log(wikiTitle);
      var p1 = document.createElement('p');
      var linkButtonEl = document.createElement('a');
      //https://www.google.com/search?q=fantastic+four
      var url = 'https://www.google.com/search?q=' + resultObj+ ' comic book marvel';
      linkButtonEl.textContent = resultObj;
      p1.setAttribute('id','p1');
  //  linkButtonEl.setAttribute('href', path+'.jpg', target = "_self");
      // linkButtonEl.setAttribute('href',Marvelurl, target = "_self");
      linkButtonEl.setAttribute('title',wikiTitle);
      linkButtonEl.setAttribute('id', idIndex);
      linkButtonEl.classList.add('btn', 'btn-dark','column','margin','btn-info', 'btn-block');
      searchBody.append(p1);
      p1.appendChild(linkButtonEl);
      // b.getAttribute("href") && b.hostname !== location.hostname && (b.target = "_blank") } } ; externalLinks();  
      linkButtonEl.addEventListener('click', function (event) {
        var btnID = event.target.id;
        //var inputText = "what ever just testing"  // document.getElementById(btnIndex).value; //wtf is this
        //based on index above, save the input text to an object
        $("#detail-body").text(btnID);
        modalEl.Modal("show");
      });    
      idIndex++;
      console.log(modalEl.innerHTML);

}

//------------------------------function printout-------------------------------------------

function printout(items){
  for (var i = 0; i < items.length; i++) {
    searchHistory(items[i]['name']);
  }
}
//------------------------------click event-------------------------------------------
var munthText = document.getElementById("munthText");

// document.getElementById("munthPick").addEventListener("click", handlemunthPick);

// function handlemunthPick(event) {
//    console.log(document.getElementById("date").value);
// }
$(document).on("click", ".myclass figure", function() {
  var year = document.getElementById("date").value;
  console.log(year);
  var munth = $('i', this).length ? $('i', this).text() : $(this).text();
  var url = './search-result.html?year=' + year+'&munth=' + munth;
  console.log(url);
  document.location= url,'_blank';
});
//----------------------------get Params from url------------------------------------------
function getParams() {
  var searchParamsArr = document.location.search.split('&');
  year = searchParamsArr[0].split('=').pop();
  munth = searchParamsArr[1].split('=').pop();
  console.log(year,munth);
  return;
  // Get the query and format values
  //cityName = searchParamsArr[0].split('=').pop();

  //searchApi(query, format);
}
//---------------------------------------------------------------------------
$(function() {
  $('#p1 a').miniPreview({ prefetch: 'pageload' });
});
//---------------------------background effect------------------------------
console.clear();
const canvas = document.createElement('canvas');
document.body.append(canvas);
canvas.style.display = 'block';
canvas.style.width = '100vw';
canvas.style.height = '100vh';

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const gl = canvas.getContext('webgl2');
if (!gl) {
    alert('require webgl 2.0, bye')
}

const vss = `#version 300 es
in vec2 p;
void main() {
  gl_Position = vec4(p, 0.0, 1.0);
}
`;

const fss = `#version 300 es
precision mediump float;
out vec4 o;
uniform vec4 c;
void main() {
  o = c;
}
`;


// Create shader program
// # should query both shader logs and program logs
// #  only if program link's status is false.
// 
// Here's the antipattern .. keep for ref
//

const vs = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vs, vss);
gl.compileShader(vs);
if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(vs));
    throw 1;
}

const fs = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fs, fss);
gl.compileShader(fs);
if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(fs));
    throw 2;
}

const prg = gl.createProgram();
gl.attachShader(prg, vs);
gl.attachShader(prg, fs);
gl.linkProgram(prg);
if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(prg));
    throw 3;
}

gl.detachShader(prg, vs);
gl.deleteShader(vs);
gl.detachShader(prg, fs);
gl.deleteShader(fs);

// ---- End of antipattern ----

const $p = gl.getAttribLocation(prg, 'p');
const $c = gl.getUniformLocation(prg, 'c');

const va = gl.createVertexArray();
gl.bindVertexArray(va);

const N = 300; // n triangles

let ps;
{    
    ps = new Float32Array(2 + N * 2 * 2);
    ps[0] = 0; // clip space center
    ps[1] = 0;
    let j = 2;
    for (let i = 0; i < N; ++i) {
        ps[j++] = Math.random() * 2 - 1; //x 
        ps[j++] = Math.random() * 2 - 1; //y
        ps[j++] = Math.random() * 2 - 1; //x 
        ps[j++] = Math.random() * 2 - 1; //y
    }
}

const buf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buf);
gl.bufferData(gl.ARRAY_BUFFER, ps, gl.DYNAMIC_DRAW);
gl.enableVertexAttribArray($p);
gl.vertexAttribPointer(
    $p,
    2, gl.FLOAT, // two 32b-float (8bytes)
    false,
    0, // skip n byte to fetch next
    0  // skip n byte to fetch first
);

let idxs; 
{ 
    idxs = new Uint16Array(3 * N);
    let j = 0;
    for (let i = 0; i < N; ++i) {
        idxs[j++] = 0;
        idxs[j++] = 1 + i * 2;
        idxs[j++] = 2 + i * 2;
    }
}

const ibuf = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuf);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idxs, gl.STATIC_DRAW);

gl.bindVertexArray(null);

//----- render

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clearColor(0.1, 0.1, 0.1, 1);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
gl.enable(gl.BLEND);
gl.disable(gl.CULL_FACE);
gl.useProgram(prg);
gl.bindVertexArray(va);



function f() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform4fv($c, [0.2, 0.2, 0.2, 0.02]);
    gl.drawElements(
        gl.TRIANGLES,
        idxs.length, // n indices
        gl.UNSIGNED_SHORT, // ui16
        0 // skip n bytes to fetch first
    );
}
f();

// ---
gl.bindBuffer(gl.ARRAY_BUFFER, buf);
document.body.onmousemove = (e) => {
    ps[0] = e.clientX / window.innerWidth * 2 - 1;
    ps[1] = -1 * (e.clientY / window.innerHeight * 2 - 1);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, ps.slice(0, 2)); // that's why DYNAMIC_DRAW
    f();
} 

// Wiki API stuff

var url = "https://en.wikipedia.org/w/api.php"; 

var params = {
    action: "opensearch",
    search: "Spider Man" + " Comic",
    limit: "5",
    namespace: "0",
    format: "json"
};

url = url + "?origin=*";
Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

fetch(url)
    .then(function(response){return response.json();})
    .then(function(response) {console.log(response);})
    .catch(function(error){console.log(error);});
