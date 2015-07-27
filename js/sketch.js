// Palette Knife
// Extracts color palettes from photographs.

// Copyright (C) 2015  Ross Goodwin

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

// You can contact Ross Goodwin at ross.goodwin@gmail.com or address 
// physical correspondence and verbal abuse to:

// Ross Goodwin c/o ITP
// 721 Broadway
// 4th Floor
// New York, NY 10003

var img = null;
var nMostCommonRGB;

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function hsbToHex(arr) {
	var h = int(arr[0]);
	var s = int(arr[1]);
	var b = int(arr[2]);

	var c = color(h,s,b);

	var r = red(c);
	var g = green(c);
	var b = blue(c);

    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}


function getNMostCommonRGB(binArr) {
	var binArrCounts = []; // arr of objs

	for (var j=0; j<binArr.length; j++) {
		var arr = binArr[j]
		var counts = {};
		for (var i = 0; i < arr.length; i++) {
		    counts[arr[i]] = 1 + (counts[arr[i]] || 0);
		}
		binArrCounts.push(counts);
	}

	output = [];

	for (var i=0; i<binArr.length; i++) {
		var obj = binArrCounts[i];
		var arr = Object.keys( obj ).map(function ( key ) { return obj[key]; });
		var max = Math.max.apply( null, arr );
		for (var key in obj) {
			if (obj.hasOwnProperty(key) && obj[key] === max) {
				
				var maxKey = key;
			}
		}

		output.push(maxKey);

	}

	return output;
}

function getNLargestBins(n, bins) {
	binArrays = []; // 2D
	for (var key in bins) {
	  if (bins.hasOwnProperty(key)) {
	  	binArrays.push(bins[key]);
	  }
	}
	binArrays.sort(function(a, b){
	  return b.length - a.length;
	});
	console.log(binArrays);
	return binArrays.slice(0,n);
}

function fillBins(rngR, rngs) {
  var bins = {};

  img.loadPixels();

  for (var i=0; i<img.pixels.length; i+=4) {

  	var redVal = img.pixels[i];
  	var greVal = img.pixels[i+1];
  	var bluVal = img.pixels[i+2];

  	var rgb = [redVal, greVal, bluVal];
  	var keys = ['r', 'g', 'b'];

  	var label = [];

	for (var jx=0; jx<rngR.length; jx++) {

		if (rgb[0] >= rngR[jx][0] && rgb[0] <= rngR[jx][1]) {
			label.push(keys[0]);
			label.push(jx);
		}
	}	

  	for (var ix=1; ix<rgb.length; ix++) {

  		for (var jx=0; jx<rngs.length; jx++) {

	  		if (rgb[ix] >= rngs[jx][0] && rgb[ix] <= rngs[jx][1]) {
	  			label.push(keys[ix]);
	  			label.push(jx);
	  		}
	  	}
  	}

  	strLabel = label.join();

  	if (label in bins) {
  		bins[strLabel].push(rgb);
  	} else {
  		bins[strLabel] = [];
  		bins[strLabel].push(rgb);
  	}

  }

  return bins;
}

function range(start, stop, step) {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
}

function main() {
  var rangesH = [[0,31],[32,63],[64,95],[96,127],
  				 [128,159],[160,191],[192,223],[224,255]];
  var rangesSB = [[64,127],[128,191],[192,255]]

  var initBins = fillBins(rangesH, rangesSB);

  console.log(initBins);

  var nLargestBins = getNLargestBins(24, initBins);

  console.log(nLargestBins);

  nMostCommonRGB = getNMostCommonRGB(nLargestBins);

  nMostCommonRGB = nMostCommonRGB.map(function(x){
  	return x.split(",");
  }).sort(function(a,b){
  	return b[2] - a[2];
  });

  console.log(nMostCommonRGB);
}

// function preload() {
//   img = loadImage("assets/wes.jpg");
// }

function setup() {
  // createCanvas(640, 480);
  colorMode('HSB', 255, 255, 255, 100);
}

function draw() { }