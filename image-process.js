const Jimp = require('jimp').Jimp;  // Standard import
const path = require('path');

// ASCII characters from light to dark
const asciiChars = "@%#*+=-:. ";

function imageToAscii(imagePath, outputWidth = 100) {
  if (typeof outputWidth !== 'number') {
    throw new Error('Output width must be a number');
  }

  Jimp.read(imagePath)
    .then((image) => {
      const aspectRatio = image.bitmap.height / image.bitmap.width;
      const height = Math.round(outputWidth * aspectRatio * 0.5);

      image.resize(outputWidth, height);  // Valid input (number)
      image.greyscale();  // Convert to grayscale

      let asciiArt = "";

      for (let y = 0; y < image.bitmap.height; y++) {
        for (let x = 0; x < image.bitmap.width; x++) {
          const pixelColor = Jimp.intToRGBA(image.getPixelColor(x, y));
          const brightness = (pixelColor.r + pixelColor.g + pixelColor.b) / 3;
          const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1));
          asciiArt += asciiChars[asciiChars.length - 1 - charIndex];
        }
        asciiArt += '\n';  // New line at the end of each row
      }

      console.log(asciiArt);
    })
    .catch((err) => {
      console.error('Error reading the image:', err);
    });
}

// Use an absolute path to ensure correct file access
imageToAscii(path.resolve(__dirname, 'images/peeper.png'));
