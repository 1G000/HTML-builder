const path = require('path');
const { readdir } = require('node:fs/promises');
const { createWriteStream, createReadStream } = require('fs');
const bundle = path.join(__dirname, 'project-dist', 'bundle.css');
const stylesDir = path.join(__dirname, 'styles');
const writer = createWriteStream(bundle);

readdir(stylesDir, { withFileTypes: true })
  .then((files) => {
    files.forEach((el) => {
      const file = path.join(el.path, el.name);
      const fileExt = path.parse(file).ext.slice(1);

      if (el.isFile() && fileExt === 'css') {
        const style = path.join(stylesDir, el.name);
        const reader = createReadStream(style, 'utf-8');
        reader.pipe(writer);
      }
    });
  })
  .catch((err) => console.error(err));
