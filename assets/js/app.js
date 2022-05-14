/* global $,console,document,Handlebars */

//default not avail image
var IMAGE_NOT_AVAIL = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available";

//my key
var KEY = "3d6bd3acb1691f2b4475823f3933cb22f190092f";
var hash = '3d6bd3acb1691f2b4475823f3933cb22f190092f';

//credit: http://stackoverflow.com/a/1527820/52160
function getRandomInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
		
function getComicData(year) {
    //https://gateway.marvel.com:443/v1/public/comics?format=comic&formatType=comic&dateDescriptor=thisMonth&apikey=0b0978c066ab6b1971c35e90aa799998
    //var url = "http://gateway.marvel.com/v1/public/comics?limit=100&format=comic&formatType=comic&dateRange="+year+"-01-01%2C"+year+"-12-31&apikey="+KEY;
	var url = "https://gateway.marvel.com:443/v1/public/comics?format=comic&formatType=comic&dateDescriptor=thisMonth&apikey="+KEY+'&hash='+hash;
	console.log('getComicData('+year+')');
	return $.get(url);
}
		
$(document).ready(function() {
	
	var $results = $("#results");
	var $status = $("#status");
	
	var templateSource = $("#reportTemplate").html();
    console.log(templateSource);
	//var template = Handlebars.compile(templateSource);
	var start = 2013;
	var end = 1950;
	
	var promises = [];
	
	$status.html("<i>Getting comic book data - this will be slow - stand by...</i>");
	
	for(var x=start; x>=end; x--) {
		promises.push(getComicData(x));
	}
	
	$.when.apply($,promises).done(function() {

		var args = Array.prototype.slice.call(arguments, 0);

		$status.html("");
		
		for(var x=0; x<args.length; x++) {
			var year = start-x;
			console.log("displaying year", year);	

			var stats = {};
			stats.year = year;
			stats.priceTotal = 0;
			stats.priceCount = 0;
			stats.minPrice = 999999999;
			stats.maxPrice = -999999999;
			stats.pageTotal = 0;
			stats.pageCount = 0;
			stats.pics = [];
			
			var res = args[x][0];
			
			if(res.code === 200) {
				for(var i=0;i<res.data.results.length;i++) {
					var comic = res.data.results[i];
					//just get the first item
					if(comic.prices.length && comic.prices[0].price !== 0) {
						stats.priceTotal += comic.prices[0].price;
						if(comic.prices[0].price > stats.maxPrice) stats.maxPrice = comic.prices[0].price;
						if(comic.prices[0].price < stats.minPrice) stats.minPrice = comic.prices[0].price;
						stats.priceCount++;
					}
					if(comic.pageCount > 0) {
						stats.pageTotal+=comic.pageCount;
						stats.pageCount++;
					}
					if(comic.thumbnail && comic.thumbnail.path != IMAGE_NOT_AVAIL) stats.pics.push(comic.thumbnail.path + "." + comic.thumbnail.extension);
					
				}
				stats.avgPrice = (stats.priceTotal/stats.priceCount).toFixed(2);
				stats.avgPageCount = (stats.pageTotal/stats.pageCount).toFixed(2);
				
				//pick 5 thumbnails at random
				stats.thumbs = [];
				while(stats.pics.length > 0 && stats.thumbs.length < 5) {
					var chosen = getRandomInt(0, stats.pics.length);
					stats.thumbs.push(stats.pics[chosen]);
					stats.pics.splice(chosen, 1);
				}
				
				console.dir(stats);
				var html = template(stats);
				$results.append(html);
			}
		}
	});
	
});