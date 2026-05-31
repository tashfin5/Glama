const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (dirPath.endsWith('.tsx')) {
      callback(path.join(dir, f));
    }
  });
}

const largeTextRegex = /text\-(lg|xl|2xl|3xl|4xl|5xl|6xl)/;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Find all classNames and process them
  content = content.replace(/className=(["'])(.*?)\1/g, (match, quote, classStr) => {
    if (!classStr.includes('font-black') && !classStr.includes('font-extrabold')) {
      return match;
    }

    let isLarge = largeTextRegex.test(classStr);
    
    // Replace font-black or font-extrabold
    let newClassStr = classStr
      .replace(/\bfont-black\b/g, isLarge ? 'font-serif font-medium' : 'font-bold')
      .replace(/\bfont-extrabold\b/g, isLarge ? 'font-serif font-medium' : 'font-bold')
      // Also, tracking-tighter looks bad with elegant fonts, let's fix that for large headers
      .replace(/\btracking-tighter\b/g, isLarge ? 'tracking-widest' : 'tracking-normal')
      .replace(/\btracking-tight\b/g, isLarge ? 'tracking-widest' : 'tracking-normal');
      
    return `className=${quote}${newClassStr}${quote}`;
  });

  // Handle template literals className={`...`}
  content = content.replace(/className=\{`([^`]+)`\}/g, (match, classStr) => {
    if (!classStr.includes('font-black') && !classStr.includes('font-extrabold')) {
      return match;
    }

    let isLarge = largeTextRegex.test(classStr);
    
    let newClassStr = classStr
      .replace(/\bfont-black\b/g, isLarge ? 'font-serif font-medium' : 'font-bold')
      .replace(/\bfont-extrabold\b/g, isLarge ? 'font-serif font-medium' : 'font-bold')
      .replace(/\btracking-tighter\b/g, isLarge ? 'tracking-widest' : 'tracking-normal')
      .replace(/\btracking-tight\b/g, isLarge ? 'tracking-widest' : 'tracking-normal');
      
    return `className={\`${newClassStr}\`}`;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

walkDir(path.join(__dirname, 'app'), processFile);
walkDir(path.join(__dirname, 'components'), processFile);

console.log('Done!');
