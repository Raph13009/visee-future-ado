/**
 * Script pour générer des blur placeholders (LQIP)
 * Crée des versions floues de 20x20px en base64 pour chaque image
 * Génère un fichier JSON avec les mappings image -> blurDataURL
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_DIR = path.join(__dirname, '../public');
const OUTPUT_FILE = path.join(__dirname, '../src/data/blur-placeholders.json');

/**
 * Vérifie si un fichier est une image
 */
function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
}

/**
 * Génère un blur placeholder en base64
 */
async function generateBlurPlaceholder(imagePath) {
  try {
    const buffer = await sharp(imagePath)
      .resize(20, 20, { fit: 'inside' })
      .jpeg({ quality: 50 })
      .blur(10)
      .toBuffer();

    const base64 = buffer.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error(`Erreur génération blur pour ${imagePath}:`, error.message);
    return null;
  }
}

/**
 * Récupère récursivement tous les fichiers images
 */
async function getAllImages(dir, fileList = []) {
  const files = await fs.readdir(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      // Ignorer certains dossiers
      if (file === 'node_modules' || file === '.git' || file.startsWith('.')) {
        continue;
      }
      await getAllImages(filePath, fileList);
    } else if (isImageFile(file)) {
      fileList.push(filePath);
    }
  }

  return fileList;
}

/**
 * Convertit un chemin absolu en chemin relatif depuis /public
 */
function getPublicPath(absolutePath) {
  const relativePath = path.relative(path.join(__dirname, '../public'), absolutePath);
  return '/' + relativePath.replace(/\\/g, '/');
}

/**
 * Script principal
 */
async function main() {
  console.log('🚀 Génération des blur placeholders...\n');

  // Récupérer toutes les images
  const allImages = await getAllImages(IMAGES_DIR);
  console.log(`📸 ${allImages.length} images trouvées\n`);

  // Générer les blur placeholders
  const placeholders = {};
  let count = 0;

  for (const imagePath of allImages) {
    const publicPath = getPublicPath(imagePath);
    const blurDataURL = await generateBlurPlaceholder(imagePath);

    if (blurDataURL) {
      placeholders[publicPath] = blurDataURL;
      count++;
      console.log(`✓ ${publicPath}`);
    }
  }

  // Créer le dossier de destination si nécessaire
  const outputDir = path.dirname(OUTPUT_FILE);
  await fs.mkdir(outputDir, { recursive: true });

  // Sauvegarder le fichier JSON
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(placeholders, null, 2));

  console.log(`\n✅ ${count} blur placeholders générés`);
  console.log(`📁 Fichier sauvegardé: ${OUTPUT_FILE}`);
}

// Exécuter le script
main().catch(console.error);

export { generateBlurPlaceholder };

