var images = [];
var imageNumber = 0;
var numberOfImages = 0;
var oldHash;
var interval;
$(document).ready(function () {
    setInterval(checkHash, 100);
});

function passImagesToSlideshow(_images) {
    if (images) {
        images = _images;
        numberOfImages = Object.keys(images).length;
        if (numberOfImages > 1) {
            var bulletshtml = "";
            for (i = 0; i < numberOfImages; i++) {
                bulletshtml += (`<a href="#${i}"><li></li></a>`);
            }
            document.getElementById('slideshowBullets').innerHTML = bulletshtml;
        }
        changeSlideshowImage();
        interval = setInterval(changeSlideshowImage, 5000);

    }
}

function changeSlideshowImage() {
    if (imageNumber <= images.length - 1) {

        /*setTimeout(function () {
            document.getElementById("slideshow").className = "fadeOut";
        }, 5000);*/


        document.getElementById("slideshow").src = images[imageNumber];
        imageNumber++;
        /*
        setTimeout(function () {
            document.getElementById("slideshow").className = "";
        }, 400);
*/
    }
    else {
        imageNumber = 0;
        changeSlideshowImage();
    }

}

function checkHash() {
    if (window.location.hash) {
        var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
        if (hash != oldHash) {
            oldHash = hash;
            document.getElementById("slideshow").src = images[hash];
            clearInterval(interval);
            interval = setInterval(changeSlideshowImage, 5000);

            imageNumber = hash;
            if (imageNumber + 1 < numberOfImages) {
                imageNumber++;
            }
            else {
                imageNumber = 0;
            }
        }
    }
}
