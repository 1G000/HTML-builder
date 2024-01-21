const path = require('path');
const { mkdir, readdir, copyFile, readFile } = require('node:fs/promises');
const { createWriteStream, createReadStream } = require('fs');
const bundle = path.join(__dirname, 'project-dist', 'style.css');
const stylesDir = path.join(__dirname, 'styles');
const writer = createWriteStream(bundle);
const projectDist = path.join(__dirname, 'project-dist');
const assets = path.join(__dirname, 'assets');
const assetsTo = path.join(projectDist, 'assets');
const componentsFolder = path.join(__dirname, 'components');

mkdir(projectDist, { recursive: true });

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

const copyDir = function (copyFrom, copyTo) {
  mkdir(copyTo, { recursive: true })
    .then(() => readdir(copyFrom, { withFileTypes: true }))
    .then((files) => {
      files.map((el) => {
        if (el.isFile()) {
          return copyFile(
            path.join(copyFrom, el.name),
            path.join(copyTo, el.name),
          );
        } else {
          return copyDir(
            path.join(copyFrom, el.name),
            path.join(copyTo, el.name),
          );
        }
      });
    })
    .catch((err) => console.error(err));
};

copyDir(assets, assetsTo);

const components = {};

readdir(componentsFolder, { withFileTypes: true })
  .then((files) => {
    return files.filter((el) => el.isFile());
  })
  .then((files) => {
    return Promise.all(
      files.map((el) => {
        return readFile(path.join(el.path, el.name)).then((fileContent) => {
          const file = path.join(el.path, el.name);
          const fileName = path.parse(file).name;
          components[fileName] = fileContent.toString();
        });
      }),
    );
  })
  .then(() => {
    const reader = createReadStream(
      path.join(__dirname, 'template.html'),
      'utf-8',
    );
    let data = '';
    reader.on('data', (chunk) => (data += chunk));
    reader.on('end', () => {
      Object.entries(components).forEach(([name, value]) => {
        data = data.replaceAll(`{{${name}}}`, value);
      });

      const writeableStream = createWriteStream(
        path.join(projectDist, 'index.html'),
        'utf-8',
      );
      writeableStream.write(data);
      writeableStream.end();
    });
  })

  .catch((err) => console.error(err));
