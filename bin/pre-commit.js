const fs = require('fs');

// node bin/pre-commit.sh [versionPath]
const versionPath = process.argv[2];
console.log('Updating ' + versionPath);

const versionFile = fs.readFileSync(versionPath);
const data = JSON.parse(versionFile.toString());
data.updated = (new Date()).toLocaleString();
data.version++;
fs.writeFileSync(versionPath, JSON.stringify(data, null, 2));
console.log(data);
