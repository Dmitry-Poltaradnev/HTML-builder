const fs = require('node:fs');
const path = require('node:path');
const dir = path.join(__dirname, 'styles');
const dest = path.join(__dirname, 'project-dist');
const writeStream = fs.createWriteStream(path.join(dest, 'bundle.css'));
fs.readdir(dir, (err, files) => {
  let content = Array(files.length).fill('');
  let readCount = 0;
  files.forEach((file, index) => {
    const filedir = path.join(dir, file);
    fs.stat(path.join(dir, file), (err, stats) => {
      if (stats.isFile() && path.extname(filedir) === '.css') {
        const stream = fs.createReadStream(filedir, 'ascii');
        stream.on('data', (chunk) => {
          content[index] += chunk;
          readCount += 1;
          if (readCount === files.length) {
            content.forEach((element) => {
              writeStream.write(element);
            });
          }
        });
      } else readCount += 1;
    });
  });
});
