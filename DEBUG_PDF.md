# 🔍 Debug PDF Generation - Logs Détaillés

## 📊 Logs Ajoutés

J'ai ajouté des logs **très détaillés** à chaque étape pour identifier exactement où le problème se produit :

### Serveur PDF (`server/pdf-server.js`)

1. **STEP 1: Navigation**
   - Log du début de navigation
   - Monitor de progression toutes les 5 secondes
   - Log en cas d'erreur avec état de la page
   - Vérification de l'URL actuelle
   - Vérification des scripts chargés
   - Vérification de React/ReactDOM

2. **STEP 2: Vérification du contenu**
   - État de la page après navigation
   - Vérification du container React
   - Vérification des pages rendues
   - Attente du rendu React (avec boucle de vérification)

3. **STEP 3: Attente des charts**
   - Log de début d'attente
   - Status des charts chargés
   - Vérification des images
   - Décision de continuer ou non

4. **STEP 4: Images**
   - Status des images
   - Images incomplètes
   - Temps de chargement

5. **STEP 5: Vérifications finales**
   - État final de la page
   - Nombre de pages
   - Charts prêts
   - Dimensions du body

### Page React (`src/lib/report/ReportPage.tsx`)

1. **Génération des charts**
   - Début de génération
   - Chaque chart généré
   - Temps de génération
   - Résultat de la course (timeout ou completion)
   - Nombre de charts réussis/échoués

2. **Marquage comme prêt**
   - Log quand les charts sont marqués comme prêts
   - Set de l'attribut `data-charts-ready`

### Charts (`src/lib/report/charts.ts`)

1. **Génération radar chart**
   - Création du canvas
   - Obtention du context
   - Conversion en data URL
   - Temps de génération
   - Taille du data URL

## 🎯 Comment Utiliser les Logs

### 1. Redémarrer le serveur PDF

```bash
npm run pdf-server
```

### 2. Tenter de générer un PDF

### 3. Analyser les logs

Les logs vont vous montrer **exactement** où ça bloque :

- **Si ça bloque à STEP 1** : La navigation échoue
  - Vérifier l'URL
  - Vérifier que le frontend est accessible
  - Vérifier les erreurs de réseau

- **Si ça bloque à STEP 2** : React ne se rend pas
  - Vérifier les erreurs JavaScript
  - Vérifier que React charge
  - Vérifier que le container existe

- **Si ça bloque à STEP 3** : Les charts ne se génèrent pas
  - Vérifier les logs des charts
  - Vérifier les timeouts
  - Vérifier les erreurs de canvas

- **Si ça bloque à STEP 4** : Les images ne se chargent pas
  - Vérifier les data URLs
  - Vérifier les timeouts d'images

## 🔍 Points de Vérification

### Vérifier que le frontend est accessible

```bash
curl http://localhost:8080/report/preview?answers=...
```

### Vérifier les logs du navigateur

Les logs du navigateur sont capturés et affichés avec le préfixe `[Browser ...]`

### Vérifier les erreurs

Toutes les erreurs sont loggées avec :
- Type d'erreur
- Message
- Stack trace
- État de la page

## 🚨 Solutions Possibles

### Si la navigation timeout

1. **Vérifier l'URL** : L'URL doit être accessible depuis le serveur PDF
2. **Vérifier le frontend** : Le serveur Vite doit être démarré
3. **Vérifier le réseau** : Pas de problème de firewall/proxy
4. **Augmenter le timeout** : Déjà à 90 secondes, peut être augmenté

### Si React ne se rend pas

1. **Vérifier les erreurs JavaScript** : Regarder les logs `[Browser ERROR]`
2. **Vérifier les scripts** : Les scripts doivent se charger
3. **Vérifier React** : React doit être disponible

### Si les charts timeout

1. **Réduire le nombre de charts** : Déjà limité à 3 traits
2. **Augmenter les timeouts** : Déjà à 30 secondes max
3. **Désactiver les charts** : Option pour générer sans charts

## 📝 Prochaines Étapes

1. **Lancer le serveur PDF** avec les nouveaux logs
2. **Tenter de générer un PDF**
3. **Copier les logs complets** du terminal
4. **Analyser où ça bloque exactement**
5. **Appliquer la solution appropriée**

Les logs vont maintenant vous dire **exactement** où et pourquoi ça bloque !

