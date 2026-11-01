import fs from 'fs';
import path from 'path';

const ASSETS_DIR = path.resolve('public/assets');
const MANIFEST_FILE = path.resolve('src/data/asset-manifest.json');
const WORLD_FILE = path.resolve('src/data/my-world.json');

function scanDir(dir, base = '') {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    const relativePath = path.join(base, file);

    if (stat && stat.isDirectory()) {
      results = results.concat(scanDir(filePath, relativePath));
    } else {
      if (!file.startsWith('.') && file !== '.gitkeep') {
        results.push(relativePath.replace(/\\/g, '/'));
      }
    }
  });
  
  return results;
}

try {
  console.log('Scanning all assets...');
  const assets = scanDir(ASSETS_DIR);
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(assets, null, 2));
  console.log(`Successfully indexed ${assets.length} assets.`);

  // Sync My World Images
  if (fs.existsSync(WORLD_FILE)) {
    const worldData = JSON.parse(fs.readFileSync(WORLD_FILE, 'utf8'));
    let updated = false;

    worldData.forEach(album => {
      const albumPath = path.join(ASSETS_DIR, 'my-world', album.folder);
      if (fs.existsSync(albumPath)) {
        const images = fs.readdirSync(albumPath)
          .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f) && f !== '.gitkeep')
          .map(f => `/assets/my-world/${album.folder}/${f}`);
        
        if (JSON.stringify(album.images) !== JSON.stringify(images)) {
          album.images = images;
          updated = true;
        }
      }
    });

    if (updated) {
      fs.writeFileSync(WORLD_FILE, JSON.stringify(worldData, null, 2));
      console.log('Updated my-world.json with new images.');
    }
  }

} catch (error) {
  console.error('Error syncing assets:', error);
  process.exit(1);
}
