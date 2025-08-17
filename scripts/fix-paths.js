const fs = require('fs');
const path = require('path');

function normalizeImagesInProductsJson() {
  const file = path.join(process.cwd(), 'src/data/products.json');
  if (!fs.existsSync(file)) return;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  let changed = false;
  const fixed = data.map((p) => {
    const np = { ...p };
    if (Array.isArray(np.images)) {
      const ni = np.images.map((x) => (typeof x === 'string' ? x.replace(/\\/g, '/') : x));
      if (JSON.stringify(ni) !== JSON.stringify(np.images)) { np.images = ni; changed = true; }
    }
    if (typeof np.imageUrl === 'string') {
      const iu = np.imageUrl.replace(/\\/g, '/');
      if (iu !== np.imageUrl) { np.imageUrl = iu; changed = true; }
    }
    if (Array.isArray(np.descriptionImages)) {
      const di = np.descriptionImages.map((x) => (typeof x === 'string' ? x.replace(/\\/g, '/') : x));
      if (JSON.stringify(di) !== JSON.stringify(np.descriptionImages)) { np.descriptionImages = di; changed = true; }
    }
    return np;
  });
  if (changed) {
    fs.writeFileSync(file, JSON.stringify(fixed, null, 2), 'utf8');
    console.log('Fixed backslashes in src/data/products.json');
  } else {
    console.log('No path fixes needed in src/data/products.json');
  }
}

if (require.main === module) {
  normalizeImagesInProductsJson();
}

module.exports = { normalizeImagesInProductsJson };

