var searchBody = document.querySelector('#search-body');
var year;
var munth;
//document.getElementById("myDIV").style.opacity = "0.5";

//---------------------------searchLatLon--------------------------------------------
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
          // printout(newObj[i]['characters']['items']);
          searchHistory(newObj[i]['title'],newObj[i]['thumbnail']['path']);
        }
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}
//------------------------------search history-------------------------------------------
function searchHistory(resultObj,path) {
  console.log(resultObj);
      var linkButtonEl = document.createElement('a');
      //https://www.google.com/search?q=fantastic+four
      var url = 'https://www.google.com/search?q=' + resultObj+ ' comic book marvel';
      linkButtonEl.textContent = resultObj;
      linkButtonEl.setAttribute('id',resultObj);
      linkButtonEl.setAttribute('href', path+'.jpg', target = "_self");
      linkButtonEl.classList.add('btn', 'btn-dark','column','margin','btn-info', 'btn-block');
      searchBody.prepend(linkButtonEl);

      // b.getAttribute("href") && b.hostname !== location.hostname && (b.target = "_blank") } } ; externalLinks();

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