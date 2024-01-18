const { mkdir, readdir, copyFile } = require('node:fs/promises');
const path = require('path');
const dir = path.join(__dirname, 'files');
const dirCopy = path.join(__dirname, 'files-copy');

const copyDir = function () {
  mkdir(dirCopy, { recursive: true })
    .then(() => readdir(dir, { withFileTypes: true }))
    .then((files) => {
      files.map((el) => {
        return copyFile(path.join(dir, el.name), path.join(dirCopy, el.name));
      });
    })
    .catch((err) => console.error(err));
};

copyDir();
