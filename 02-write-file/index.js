const fs = require('fs');
const path = require('path');
const process = require('node:process');
const exitWord = 'exit';

const writeableStream = fs.createWriteStream(
  path.join(__dirname, 'text.txt'),
  'utf-8',
);

process.stdin.setEncoding('utf8');

const closeProcess = function () {
  writeableStream.end();
  process.stdout.write('Ладно, покеда!!');
  process.exit();
};

process.stdout.write('Йо, ну че там у тебя?? Вводи: \n');

process.stdin.on('data', (data) => {
  if (!data.includes(exitWord)) {
    writeableStream.write(data);
  } else closeProcess();
});

process.on('SIGINT', closeProcess);
