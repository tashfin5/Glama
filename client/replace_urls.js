const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.next') {
        walkDir(dirPath, callback);
      }
    } else {
      if (f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.js')) {
        callback(path.join(dir, f));
      }
    }
  });
}

walkDir(__dirname, function(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let newContent = content;
  
  newContent = newContent.replace(/'http:\/\/localhost:5000([^']*)'/g, "`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}$1`");
  newContent = newContent.replace(/`http:\/\/localhost:5000([^`]*)`/g, "`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}$1`");
  newContent = newContent.replace(/"http:\/\/localhost:5000([^"]*)"/g, "`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}$1`");

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`Updated ${filePath}`);
  }
});
console.log('Done replacing URLs');
