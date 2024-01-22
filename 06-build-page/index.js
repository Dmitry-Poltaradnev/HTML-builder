const fs = require('node:fs');
const { copyFile, rm } = require('node:fs/promises');
const path = require('node:path');
const maindest = path.join(__dirname, 'project-dist');

function copyDir(dest, src) {
  fs.mkdir(dest, { recursive: true }, () => {
    fs.readdir(src, (err, files) => {
      files.forEach((file) => {
        fs.stat(path.join(src, file), (err, stats) => {
          if (stats.isFile())
            copyFile(path.join(src, file), path.join(dest, file));
          else copyDir(path.join(dest, file), path.join(src, file));
        });
      });
      fs.readdir(dest, (err, oldfiles) => {
        oldfiles.forEach((file) => {
          if (files.indexOf(file) === -1) rm(path.join(dest, file));
        });
      });
    });
  });
}
function mergeStyles(dest, src) {
  const writeStream = fs.createWriteStream(dest);
  fs.readdir(src, (err, files) => {
    let content = Array(files.length).fill('');
    let readCount = 0;
    files.forEach((file, index) => {
      const filedir = path.join(src, file);
      fs.stat(path.join(src, file), (err, stats) => {
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
}
function replaceTempTags(dest, src, srcTags) {
  const stream = fs.createReadStream(src, 'ascii');
  stream.on('data', (chunk) => {
    const regExp = /{{[A-z]*}}/g;
    const tags = chunk.match(regExp);
    let count = 0;
    tags.forEach((element) => {
      const streamTag = fs.createReadStream(
        path.join(srcTags, element.substring(2, element.length - 2) + '.html'),
        'ascii',
      );
      streamTag.on('data', (data) => {
        count += 1;
        chunk = chunk.replace(element, data);
        if (count === tags.length) {
          const writeStream = fs.createWriteStream(dest);
          writeStream.write(chunk);
        }
      });
    });
  });
}

fs.mkdir(maindest, { recursive: true }, () => {
  copyDir(path.join(maindest, 'assets'), path.join(__dirname, 'assets'));
  mergeStyles(path.join(maindest, 'style.css'), path.join(__dirname, 'styles'));
  replaceTempTags(
    path.join(maindest, 'index.html'),
    path.join(__dirname, 'template.html'),
    path.join(__dirname, 'components'),
  );
});
