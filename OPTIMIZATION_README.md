# Optimisation des Images - Avenirea

Ce document décrit les optimisations mises en place pour améliorer le chargement et le rendu des images du site Avenirea.

## 🚀 Optimisations Implémentées

### 1. **Composant OptimizedImage**
- **Lazy loading intelligent** : Utilise Intersection Observer pour charger uniquement les images visibles (ou 50px avant)
- **Support WebP/AVIF** : Chargement automatique des formats modernes avec fallback
- **Blur placeholder (LQIP)** : Affichage d'une version floue pendant le chargement
- **Dimensions fixes** : width/height obligatoires pour éviter CLS (Cumulative Layout Shift)
- **Priority loading** : Support de `priority={true}` pour les images hero critiques

### 2. **Conversion WebP/AVIF**
Script automatique pour convertir toutes les images JPG/PNG en WebP et AVIF :
```bash
npm run optimize:images
```

Les images optimisées sont générées dans `/public/images/optimised/`

### 3. **Blur Placeholders (LQIP)**
Génération automatique de placeholders flous en base64 :
```bash
npm run optimize:blur
```

Le fichier `src/data/blur-placeholders.json` contient les mappings image → blurDataURL

### 4. **Cache Headers**
Configuration dans `vercel.json` :
- Cache-Control: `public, max-age=31536000, immutable` pour les images optimisées
- Cache-Control: `public, max-age=86400` pour les autres images

### 5. **Dimensions Fixes**
Toutes les images ont désormais des `width` et `height` explicites pour éviter les sauts de layout.

## 📋 Utilisation

### Remplacement d'une balise `<img>` par `<OptimizedImage>`

**Avant :**
```tsx
<img 
  src="/seo/reconversion.jpg" 
  alt="Reconversion professionnelle"
  className="w-full h-64 object-cover"
  loading="lazy"
  width={800}
  height={600}
/>
```

**Après :**
```tsx
<OptimizedImage 
  src="/seo/reconversion.jpg" 
  alt="Reconversion professionnelle"
  className="w-full h-64"
  width={800}
  height={600}
  priority={false} // true pour images hero
/>
```

### Props disponibles

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `src` | `string` | **requis** | Chemin de l'image originale |
| `alt` | `string` | **requis** | Texte alternatif |
| `width` | `number` | **requis** | Largeur en pixels |
| `height` | `number` | **requis** | Hauteur en pixels |
| `priority` | `boolean` | `false` | Si `true`, chargement immédiat (hero images) |
| `lazy` | `boolean` | `false` | Force lazy loading même si priority=true |
| `placeholder` | `'blur' \| 'empty'` | `'blur'` | Type de placeholder |
| `blurDataURL` | `string` | - | Blur placeholder custom (optionnel) |
| `className` | `string` | `''` | Classes CSS |
| `style` | `CSSProperties` | - | Styles inline |
| `onError` | `function` | - | Callback d'erreur |

## 🔧 Scripts NPM

```bash
# Optimiser toutes les images (WebP + AVIF)
npm run optimize:images

# Générer les blur placeholders
npm run optimize:blur

# Tout faire en une fois
npm run optimize:all
```

## 📊 Résultats Attendus

Après ces optimisations, vous devriez observer :
- ✅ **LCP (Largest Contentful Paint)** < 2.5s
- ✅ **CLS (Cumulative Layout Shift)** = 0
- ✅ **Score Lighthouse Performance** > 90
- ✅ Images qui "pop" moins (chargement progressif avec blur)
- ✅ Réduction de la taille des images (WebP/AVIF ≈ 30-50% plus léger)

## 🔍 Vérification

### Lighthouse Audit
1. Ouvrez Chrome DevTools
2. Onglet "Lighthouse"
3. Lancez un audit Performance
4. Vérifiez que :
   - **Performance Score** > 90
   - **LCP** < 2.5s
   - **CLS** = 0
   - Pas d'avertissements sur les images

### Vérification Manuelle
1. Ouvrez le site en mode "Slow 3G" dans Chrome DevTools
2. Observez le chargement progressif des images (blur → net)
3. Vérifiez dans l'onglet Network que les formats WebP/AVIF sont utilisés

## 📝 Fichiers Modifiés

- ✅ `src/components/OptimizedImage.tsx` - Nouveau composant
- ✅ `scripts/optimize-images.js` - Script de conversion
- ✅ `scripts/generate-blur-placeholders.js` - Script de blur
- ✅ `vercel.json` - Headers de cache
- ✅ `package.json` - Scripts npm ajoutés
- ✅ `src/pages/Index.tsx` - Images remplacées
- ✅ `src/pages/Ressources.tsx` - Images remplacées
- 🔄 Autres pages - En cours de migration

## 🎯 Prochaines Étapes

1. Exécuter `npm run optimize:all` pour générer les versions optimisées
2. Remplacer les balises `<img>` restantes par `<OptimizedImage>`
3. Vérifier avec Lighthouse
4. Déployer et tester en production

