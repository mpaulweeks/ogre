import fs from 'fs';

const versionPath = 'public/version.json';
const versionFile = fs.readFileSync(versionPath);
const data = JSON.parse(versionFile.toString());
data.updated = (new Date()).toLocaleString();
data.version++;
fs.writeFileSync(versionPath, JSON.stringify(data));
console.log(data);
