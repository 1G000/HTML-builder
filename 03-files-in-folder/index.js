const path = require('path');
const fs = require('node:fs/promises');
const dir = path.join(__dirname, 'secret-folder');

fs.readdir(dir, { withFileTypes: true })
  .then((files) => {
    files.forEach((el) => {
      if (el.isFile()) {
        const file = path.join(el.path, el.name);
        const fileName = path.parse(file).name;
        const fileExt = path.parse(file).ext.slice(1);

        fs.stat(file)
          .then((stats) => {
            console.log(`${fileName} - ${fileExt} - ${stats.size / 1000}kb`);
          })
          .catch((err) => console.error(err));
      }
    });
  })
  .catch((err) => console.error(err));
