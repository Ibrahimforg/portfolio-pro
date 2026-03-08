const fs = require('fs');
const path = require('path');

// Créer une icône PNG simple avec Canvas
const createSimplePNG = () => {
  // Créer une icône 144x144 simple (bleu avec "IZ")
  const canvas = `
  <svg width="144" height="144" viewBox="0 0 144 144" xmlns="http://www.w3.org/2000/svg">
    <rect width="144" height="144" rx="20" fill="#3B82F6"/>
    <text x="72" y="72" text-anchor="middle" dy=".3em" fill="white" font-family="Arial, sans-serif" font-size="48" font-weight="bold">IZ</text>
  </svg>`;
  
  return canvas;
};

const publicDir = path.join(__dirname, '../public');
const svgContent = createSimplePNG();
const filepath = path.join(publicDir, 'icon-144x144.png');

fs.writeFileSync(filepath, svgContent);
console.log('✅ Icône SVG créée (extension PNG pour compatibilité)');

// Créer aussi les autres tailles
const sizes = [72, 96, 128, 152, 192, 384, 512];

sizes.forEach(size => {
  const svg = `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="#3B82F6"/>
    <text x="${size/2}" y="${size/2}" text-anchor="middle" dy=".3em" fill="white" font-family="Arial, sans-serif" font-size="${size * 0.35}" font-weight="bold">IZ</text>
  </svg>`;
  
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(publicDir, filename);
  fs.writeFileSync(filepath, svg);
  console.log(`✅ Créé: ${filename}`);
});

console.log('✅ Toutes les icônes PWA créées avec succès !');
