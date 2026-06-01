const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('./src', function(filePath) {
    if (!filePath.endsWith('.jsx') && !filePath.endsWith('.js')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check missing alt
    let imgRegex = /<img\b([^>]*?)>/g;
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
        if (!match[1].includes('alt=')) {
            console.log(`Missing alt in ${filePath}: ${match[0]}`);
        } else if (match[1].match(/alt=(['"])\1/)) {
            console.log(`Empty alt in ${filePath}: ${match[0]}`);
        }
    }
    
    // Check duplicate h1
    let h1Regex = /<h1\b/g;
    let h1Count = (content.match(h1Regex) || []).length;
    if (h1Count > 1) {
        console.log(`Duplicate h1 in ${filePath}: ${h1Count} tags found`);
    }
});
