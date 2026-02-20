const crypto = require('crypto');
const flag = process.argv[2];
const hash = crypto.createHash('sha256').update(flag).digest('hex');
console.log(hash);
