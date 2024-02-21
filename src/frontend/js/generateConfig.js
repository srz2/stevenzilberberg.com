const fs = require('fs');
const {GITHUB_API_KEY} = process.env;

const content = `{\"github_api_key:\": \"${GITHUB_API_KEY}\"}`;

fs.writeFileSync('src/frontend/js/config.json', content);
console.log('Config file generated')