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

function getColors(url) {

      loadImage(url, function(im) {

        img = im;

        main();

        $('#colors').empty();

        // image(img, 0, 0);

        var magic = function(name){return this[name]};
        var hgt = magic.call(null, "height");
        var wdt = magic.call(null, "width");

        var s = 1;

        background(255,255,255);

        for (var i=0; i<nMostCommonRGB.length; i+=s) {
          var cur = nMostCommonRGB[i];
          // console.log(cur);
          fill(cur[0], cur[1], cur[2]);

          // console.log(10+25*i/s);
          // console.log(height-25);
          var incre = 80*i/s;

          // var rgbStr = cur.join();
          var hexStr = hsbToHex(cur);
          var rgbStr = hexToRgb(hexStr);

          $('#colors').append('<div id=\"block'+ i + '\"></div>');
          $('#block'+i).append('<div id=\"color'+ i + '\"></div>');
          $('#block'+i).append('<div id=\"info'+ i + '\"></div>');

          $('#block'+i).css("display", "inline-block");

          $('#info'+i).append('<p class="infoblock">'+hexStr+'</p>');
          $('#info'+i).append('<p class="infoblock">'+rgbStr+'</p>');

          $('#color'+i).css("background-color", hexStr);
          $('#color'+i).addClass("colorblock");

          $('#colors').fadeIn("slow");


          // ellipse(40 + incre%wdt, 40 + 80 * Math.floor(incre/wdt), 50, 50);
        }

      });
}

(function() {
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  var width = 320;    // We will scale the photo width to this
  var height = 0;     // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  var streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  var video = null;
  var canvas = null;
  var photo = null;
  var startbutton = null;

  function startup() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    startbutton = document.getElementById('startbutton');

    navigator.getMedia = ( navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.msGetUserMedia);

    navigator.getMedia(
      {
        video: true,
        audio: false
      },
      function(stream) {
        if (navigator.mozGetUserMedia) {
          video.mozSrcObject = stream;
        } else {
          var vendorURL = window.URL || window.webkitURL;
          video.src = vendorURL.createObjectURL(stream);
        }
        video.play();
      },
      function(err) {
        console.log("An error occured! " + err);
      }
    );

    video.addEventListener('canplay', function(ev){
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);
      
        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.
      
        if (isNaN(height)) {
          height = width / (4/3);
        }
      
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);

    startbutton.addEventListener('click', function(ev){
      takepicture();
      ev.preventDefault();
    }, false);
    
    clearphoto();
  }

  // Fill the photo with an indication that none has been
  // captured.

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }
  
  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

  function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
    
      var data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);

      // p5 stuff
      getColors(data);

    } else {
      clearphoto();
    }
  }

  // Set up our event listener to run the startup process
  // once loading is complete.
  window.addEventListener('load', startup, false);


  // fill divs


})();