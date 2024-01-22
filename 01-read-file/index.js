const fs = require('fs');
const path = require('path');

const fileName = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(fileName, 'utf8');

readStream.on('data', (chunk) => {
  console.log(chunk);
});

readStream.on('error', (err) => {
  console.log(err.message);
});
