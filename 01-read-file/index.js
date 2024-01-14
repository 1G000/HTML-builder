const fs = require('fs');
const path = require('path');
const reader = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
let data = '';
reader.on('data', (chunk) => (data += chunk));
reader.on('end', () => console.log(data));
