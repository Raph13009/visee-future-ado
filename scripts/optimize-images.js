/**
 * Script pour optimiser toutes les images du projet
 * Convertit JPG/PNG en WebP et AVIF
 * Génère des versions optimisées dans /public/images/optimised/
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dossiers à traiter
const SOURCE_DIRS = [
  path.join(__dirname, '../public'),
];

const OUTPUT_DIR = path.join(__dirname, '../public/images/optimised');

// Qualités de compression
const WEBP_QUALITY = 80;
const AVIF_QUALITY = 75;

/**
 * Vérifie si un fichier est une image
 */
function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ['.jpg', '.jpeg', '.png'].includes(ext);
}

/**
 * Optimise une image en WebP et AVIF
 */
async function optimizeImage(inputPath, outputDir) {
  const filename = path.basename(inputPath);
  const nameWithoutExt = path.parse(filename).name;
  const ext = path.extname(filename).toLowerCase();

  console.log(`Optimisation de ${filename}...`);

  try {
    // Lire l'image
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Créer les noms de sortie
    const webpPath = path.join(outputDir, `${nameWithoutExt}.webp`);
    const avifPath = path.join(outputDir, `${nameWithoutExt}.avif`);

    // Convertir en WebP
    await image
      .clone()
      .webp({ quality: WEBP_QUALITY })
      .toFile(webpPath);

    console.log(`  ✓ WebP créé: ${path.basename(webpPath)}`);

    // Convertir en AVIF
    await image
      .clone()
      .avif({ quality: AVIF_QUALITY })
      .toFile(avifPath);

    console.log(`  ✓ AVIF créé: ${path.basename(avifPath)}`);

    return {
      original: inputPath,
      webp: webpPath,
      avif: avifPath,
      width: metadata.width,
      height: metadata.height,
    };
  } catch (error) {
    console.error(`  ✗ Erreur lors de l'optimisation de ${filename}:`, error.message);
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
      if (file === 'node_modules' || file === '.git' || file === 'images') {
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
 * Génère un placeholder blur (LQIP) en base64
 */
async function generateBlurPlaceholder(inputPath) {
  try {
    const buffer = await sharp(inputPath)
      .resize(20, 20, { fit: 'inside' })
      .jpeg({ quality: 50 })
      .blur(10)
      .toBuffer();

    const base64 = buffer.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error(`Erreur génération blur placeholder:`, error.message);
    return null;
  }
}

/**
 * Script principal
 */
async function main() {
  console.log('🚀 Début de l\'optimisation des images...\n');

  // Créer le dossier de sortie
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    console.log(`✓ Dossier de sortie créé: ${OUTPUT_DIR}\n`);
  } catch (error) {
    console.error('Erreur création dossier:', error.message);
    return;
  }

  // Récupérer toutes les images
  let allImages = [];
  for (const dir of SOURCE_DIRS) {
    try {
      const images = await getAllImages(dir);
      allImages = allImages.concat(images);
    } catch (error) {
      console.error(`Erreur lecture ${dir}:`, error.message);
    }
  }

  console.log(`📸 ${allImages.length} images trouvées\n`);

  // Optimiser chaque image
  const results = [];
  for (const imagePath of allImages) {
    // Ignorer les images déjà dans le dossier optimised
    if (imagePath.includes('images/optimised')) {
      continue;
    }

    const result = await optimizeImage(imagePath, OUTPUT_DIR);
    if (result) {
      results.push(result);
    }
  }

  console.log(`\n✅ Optimisation terminée: ${results.length} images optimisées`);
  console.log(`   → WebP: ${results.length} fichiers`);
  console.log(`   → AVIF: ${results.length} fichiers`);
  console.log(`\n📁 Images optimisées disponibles dans: ${OUTPUT_DIR}`);
}

// Exécuter le script
main().catch(console.error);

export { optimizeImage, generateBlurPlaceholder };

