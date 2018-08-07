import Bird from './Bird'
import Sky from './Sky'
import Pipe from './Pipe'

var Fly = {};
Fly.Bird = Bird;
Fly.Sky = Sky;
Fly.Pipe = Pipe;

// image loader
Fly.loadImages = function(imgsSrcArr, callback) {
    var loadedCount = 0,
        length = imgsSrcArr.length,
        imgList = {};

    imgsSrcArr.forEach(function(imgSrc) {
        var img = new Image();
        img.src = FILE_PUBLIC_URL + imgSrc + ".png";

        imgList[imgSrc] = img;

        img.onload = function() {
            loadedCount++;

            if (loadedCount >= length) {
                callback(imgList);
            }
        };
    });
};

export default Fly