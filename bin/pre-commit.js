const fs = require('fs');

const versionPath = 'public/version.json';
console.log('Updating ' + versionPath);

const versionFile = fs.readFileSync(versionPath);
const data = JSON.parse(versionFile.toString());
data.updated = (new Date()).toLocaleString();
data.version++;
fs.writeFileSync(versionPath, JSON.stringify(data, null, 2));
console.log(data);
