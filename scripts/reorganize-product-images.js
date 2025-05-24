const fs = require('fs');
const path = require('path');

// Chemins importants
const PRODUCTS_JSON_PATH = path.join(process.cwd(), 'src/data/products.json');
const IMAGES_DIR = path.join(process.cwd(), 'public/images/products');

// Fonction pour lire les produits
function getProducts() {
  try {
    if (!fs.existsSync(PRODUCTS_JSON_PATH)) {
      console.error('Fichier products.json non trouvé!');
      return [];
    }
    const fileContent = fs.readFileSync(PRODUCTS_JSON_PATH, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Erreur lors de la lecture des produits:', error);
    return [];
  }
}

// Fonction pour sauvegarder les produits
function saveProducts(products) {
  try {
    fs.writeFileSync(PRODUCTS_JSON_PATH, JSON.stringify(products, null, 2), 'utf8');
    console.log('Produits mis à jour avec succès');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des produits:', error);
  }
}

// Fonction pour extraire l'UUID d'un chemin d'image
function extractUuid(imagePath) {
  // Extrait l'UUID du chemin /images/products/uuid.ext ou /images/products/folder/uuid.ext
  const matches = imagePath.match(/\/images\/products\/(?:[^\/]+\/)?([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.[a-zA-Z]+$/i);
  console.log(`Extraction UUID depuis ${imagePath} -> ${matches ? matches[1] : 'non trouvé'}`);
  return matches ? matches[1] : null;
}

// Fonction pour extraire l'UUID du nom de fichier
function extractUuidFromFilename(filename) {
  const matches = filename.match(/^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.[a-zA-Z]+$/i);
  return matches ? matches[1] : null;
}

// Fonction pour vérifier si un fichier existe dans le système de fichiers
function fileExists(filePath) {
  try {
    const absolutePath = path.join(process.cwd(), 'public', filePath);
    return fs.existsSync(absolutePath);
  } catch (error) {
    console.error(`Erreur lors de la vérification du fichier ${filePath}:`, error);
    return false;
  }
}

// Fonction principale pour réorganiser les images
async function reorganizeProductImages() {
  console.log('Démarrage de la réorganisation des images de produits...');
  
  // Lire les produits
  const products = getProducts();
  if (!products.length) {
    console.log('Aucun produit trouvé');
    return;
  }
  
  console.log(`${products.length} produits trouvés`);
  
  // Pour suivre les modifications
  let productsUpdated = 0;
  let imagesProcessed = 0;
  let imagesSkipped = 0;
  let errors = 0;
  
  // Créer le dossier principal s'il n'existe pas
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }
  
  // Récupérer tous les fichiers d'images dans le dossier products
  const allImageFiles = fs.readdirSync(IMAGES_DIR)
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      const isDirectory = fs.statSync(path.join(IMAGES_DIR, file)).isDirectory();
      return !isDirectory && ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext);
    });
  
  console.log(`Images trouvées à la racine du dossier products: ${allImageFiles.length}`);
  console.log('Images:', allImageFiles);
  
  // Construire un mapping des UUID d'images aux produits
  const uuidToProductMap = new Map();
  
  // Parcourir chaque produit
  for (const product of products) {
    if (!product.slug) {
      console.log(`Produit ${product.id} n'a pas de slug, ignoré`);
      continue;
    }
    
    console.log(`Traitement du produit: ${product.name} (${product.slug})`);
    console.log(`Images du produit:`, product.images);
    
    // Créer le dossier du produit s'il n'existe pas
    const productDir = path.join(IMAGES_DIR, product.slug);
    if (!fs.existsSync(productDir)) {
      fs.mkdirSync(productDir, { recursive: true });
      console.log(`Dossier créé: ${product.slug}`);
    }
    
    let productUpdated = false;
    
    // Traiter les images principales
    if (product.images && product.images.length > 0) {
      const updatedImages = [];
      
      for (const image of product.images) {
        try {
          if (typeof image !== 'string') {
            // Si c'est un objet avec url, traiter l'url
            if (image.url) {
              // Ajouter au mapping UUID -> produit
              const uuid = extractUuid(image.url);
              if (uuid) {
                uuidToProductMap.set(uuid, product.slug);
              }
              
              const processedUrl = await processImage(image.url, product.slug);
              if (processedUrl !== image.url) {
                updatedImages.push({ ...image, url: processedUrl });
                productUpdated = true;
                imagesProcessed++;
              } else {
                updatedImages.push(image);
                imagesSkipped++;
              }
            } else {
              updatedImages.push(image);
              console.log(`Image sans URL ignorée dans ${product.slug}`);
              imagesSkipped++;
            }
          } else {
            // C'est une chaîne
            // Ajouter au mapping UUID -> produit
            const uuid = extractUuid(image);
            if (uuid) {
              uuidToProductMap.set(uuid, product.slug);
            }
            
            console.log(`Traitement de l'image ${image} pour le produit ${product.slug}`);
            const processedUrl = await processImage(image, product.slug);
            if (processedUrl !== image) {
              updatedImages.push(processedUrl);
              productUpdated = true;
              imagesProcessed++;
              console.log(`URL mise à jour: ${image} -> ${processedUrl}`);
            } else {
              updatedImages.push(image);
              imagesSkipped++;
              console.log(`URL non modifiée: ${image}`);
            }
          }
        } catch (error) {
          console.error(`Erreur lors du traitement de l'image pour ${product.slug}:`, error);
          updatedImages.push(image); // Conserver l'image originale en cas d'erreur
          errors++;
        }
      }
      
      product.images = updatedImages;
    }
    
    // Traiter les images de description
    if (product.descriptionImages && product.descriptionImages.length > 0) {
      const updatedDescImages = [];
      
      for (const image of product.descriptionImages) {
        try {
          // Ajouter au mapping UUID -> produit
          const uuid = extractUuid(image);
          if (uuid) {
            uuidToProductMap.set(uuid, product.slug);
          }
          
          const processedUrl = await processImage(image, product.slug);
          if (processedUrl !== image) {
            updatedDescImages.push(processedUrl);
            productUpdated = true;
            imagesProcessed++;
          } else {
            updatedDescImages.push(image);
            imagesSkipped++;
          }
        } catch (error) {
          console.error(`Erreur lors du traitement de l'image de description pour ${product.slug}:`, error);
          updatedDescImages.push(image); // Conserver l'image originale en cas d'erreur
          errors++;
        }
      }
      
      product.descriptionImages = updatedDescImages;
    }
    
    if (productUpdated) {
      productsUpdated++;
    }
  }
  
  // Traiter les images orphelines
  console.log('\nTraitement des images orphelines:');
  for (const imageFile of allImageFiles) {
    const uuid = extractUuidFromFilename(imageFile);
    if (!uuid) {
      console.log(`L'image ${imageFile} n'a pas d'UUID reconnaissable, ignorée`);
      continue;
    }
    
    // Vérifier si l'UUID est associé à un produit
    const productSlug = uuidToProductMap.get(uuid);
    if (productSlug) {
      console.log(`Image orpheline ${imageFile} (UUID: ${uuid}) appartient au produit ${productSlug}`);
      
      try {
        // Déplacer l'image dans le dossier du produit
        const sourceFilePath = path.join(IMAGES_DIR, imageFile);
        const targetDir = path.join(IMAGES_DIR, productSlug);
        const targetFilePath = path.join(targetDir, imageFile);
        
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
          console.log(`Dossier créé: ${productSlug}`);
        }
        
        if (fs.existsSync(targetFilePath)) {
          console.log(`L'image existe déjà à la destination: ${targetFilePath}`);
        } else {
          fs.copyFileSync(sourceFilePath, targetFilePath);
          console.log(`Image orpheline copiée: ${sourceFilePath} -> ${targetFilePath}`);
          fs.unlinkSync(sourceFilePath);
          console.log(`Image orpheline d'origine supprimée: ${sourceFilePath}`);
          imagesProcessed++;
        }
      } catch (error) {
        console.error(`Erreur lors du déplacement de l'image orpheline ${imageFile}:`, error);
        errors++;
      }
    } else {
      console.log(`Image orpheline ${imageFile} (UUID: ${uuid}) n'est associée à aucun produit connu`);
      
      // Option: créer un dossier "unknown" pour ces images
      try {
        const unknownDir = path.join(IMAGES_DIR, 'unknown');
        if (!fs.existsSync(unknownDir)) {
          fs.mkdirSync(unknownDir, { recursive: true });
          console.log(`Dossier "unknown" créé pour les images non associées`);
        }
        
        const sourceFilePath = path.join(IMAGES_DIR, imageFile);
        const targetFilePath = path.join(unknownDir, imageFile);
        
        if (fs.existsSync(targetFilePath)) {
          console.log(`L'image existe déjà dans le dossier unknown: ${targetFilePath}`);
        } else {
          fs.copyFileSync(sourceFilePath, targetFilePath);
          console.log(`Image orpheline copiée vers unknown: ${sourceFilePath} -> ${targetFilePath}`);
          fs.unlinkSync(sourceFilePath);
          console.log(`Image orpheline d'origine supprimée: ${sourceFilePath}`);
          imagesProcessed++;
        }
      } catch (error) {
        console.error(`Erreur lors du déplacement de l'image orpheline ${imageFile} vers unknown:`, error);
        errors++;
      }
    }
  }
  
  // Sauvegarder les produits mis à jour
  saveProducts(products);
  
  console.log('\nRécapitulatif:');
  console.log(`- Produits mis à jour: ${productsUpdated}/${products.length}`);
  console.log(`- Images traitées: ${imagesProcessed}`);
  console.log(`- Images ignorées: ${imagesSkipped}`);
  console.log(`- Erreurs: ${errors}`);
}

// Fonction pour traiter une image
async function processImage(imagePath, productSlug) {
  console.log(`Début du traitement de ${imagePath} pour ${productSlug}`);
  
  // Ignorer les URL externes ou les chemins d'image de placeholder
  if (!imagePath.startsWith('/images/products/') || imagePath.includes('placeholder')) {
    console.log(`Image ignorée (externe ou placeholder): ${imagePath}`);
    return imagePath;
  }
  
  // Vérifier si l'image existe déjà dans le dossier du produit
  if (imagePath.includes(`/products/${productSlug}/`)) {
    console.log(`L'image est déjà dans le bon dossier: ${imagePath}`);
    return imagePath;
  }
  
  // Extraire le nom du fichier et l'UUID
  const fileName = path.basename(imagePath);
  const uuid = extractUuid(imagePath);
  
  if (!uuid) {
    console.log(`UUID non trouvé dans le chemin ${imagePath}, ignoré`);
    return imagePath;
  }
  
  // Chemins de fichiers
  const sourceFilePath = path.join(process.cwd(), 'public', imagePath);
  const targetDir = path.join(IMAGES_DIR, productSlug);
  const targetFilePath = path.join(targetDir, fileName);
  const newImagePath = `/images/products/${productSlug}/${fileName}`;
  
  console.log(`Source: ${sourceFilePath}`);
  console.log(`Cible: ${targetFilePath}`);
  console.log(`Nouveau chemin: ${newImagePath}`);
  
  // Vérifier si le fichier source existe
  if (!fs.existsSync(sourceFilePath)) {
    console.log(`Fichier source non trouvé: ${sourceFilePath}, ignoré`);
    return imagePath;
  }
  
  try {
    // Vérifier si le fichier cible existe déjà
    if (fs.existsSync(targetFilePath)) {
      console.log(`Le fichier existe déjà à la destination: ${targetFilePath}`);
      // Supprimer le fichier original si ce n'est pas le même que la cible
      if (sourceFilePath !== targetFilePath) {
        fs.unlinkSync(sourceFilePath);
        console.log(`Fichier original supprimé: ${sourceFilePath}`);
      }
      return newImagePath;
    }
    
    // Copier le fichier vers le dossier du produit
    fs.copyFileSync(sourceFilePath, targetFilePath);
    console.log(`Image copiée: ${sourceFilePath} -> ${targetFilePath}`);
    
    // Supprimer le fichier original si ce n'est pas le même que la cible
    if (sourceFilePath !== targetFilePath) {
      fs.unlinkSync(sourceFilePath);
      console.log(`Fichier original supprimé: ${sourceFilePath}`);
    }
    
    return newImagePath;
  } catch (error) {
    console.error(`Erreur lors du déplacement de l'image ${imagePath}:`, error);
    return imagePath; // Retourner le chemin original en cas d'erreur
  }
}

// Exécuter le script
reorganizeProductImages().then(() => {
  console.log('Réorganisation des images terminée');
}).catch(error => {
  console.error('Erreur lors de la réorganisation des images:', error);
}); 