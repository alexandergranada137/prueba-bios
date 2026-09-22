const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const srcRegex = /src=["']([^"']+)["']/g;
  let match;
  while ((match = srcRegex.exec(content)) !== null) {
    const src = match[1];
    if (!src.startsWith('http') && !src.startsWith('//') && !src.startsWith('data:')) {
      const fullPath = path.resolve(src);
      if (!fs.existsSync(fullPath)) {
        console.log(file + ': Missing src file -> ' + src);
      }
    }
  }

  const hrefRegex = /href=["']([^"'#]+)["']/g;
  while ((match = hrefRegex.exec(content)) !== null) {
    const href = match[1];
    if (!href.startsWith('http') && !href.startsWith('//') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:')) {
      const cleanHref = href.split('?')[0];
      const fullPath = path.resolve(cleanHref);
      if (!fs.existsSync(fullPath)) {
        console.log(file + ': Missing href file -> ' + href);
      }
    }
  }
});
console.log('Link check complete.');
