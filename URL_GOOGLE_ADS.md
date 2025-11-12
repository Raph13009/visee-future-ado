# Configuration URL Professionnelle pour Google Ads

## ✅ URL Implémentée : `/quiz`

**Nouvelle URL principale :** `https://avenirea.com/quiz`

Cette URL est :
- ✅ **Courte et mémorable** - Parfait pour Google Ads
- ✅ **Professionnelle** - Facile à retenir et à partager
- ✅ **SEO-friendly** - Optimisée pour les moteurs de recherche

### Redirections Automatiques

Les anciennes URLs redirigent automatiquement vers `/quiz` :
- `/test-personnalite` → `/quiz`
- `/personality-test` → `/quiz`

## 🎯 Options Supplémentaires (Sous-domaines)

Si vous souhaitez une URL encore plus professionnelle pour vos campagnes Google Ads, vous pouvez configurer un **sous-domaine dédié** :

### Option 1 : Sous-domaine Simple
**URL :** `https://quiz.avenirea.com`

**Configuration DNS (chez votre registrar) :**
```
Type: CNAME
Nom: quiz
Valeur: cname.vercel-dns.com (ou l'adresse fournie par Vercel)
```

**Configuration Vercel :**
1. Allez dans votre projet Vercel
2. Settings → Domains
3. Ajoutez `quiz.avenirea.com`
4. Vercel vous donnera les instructions DNS à suivre
5. **IMPORTANT** : Assurez-vous que le sous-domaine est configuré pour servir l'application (pas de redirection vers le domaine principal)
6. Le code détecte automatiquement `quiz.avenirea.com` et redirige vers `/quiz` (page du test)

### Option 2 : Sous-domaine avec Landing Page
**URL :** `https://test.avenirea.com`

Même processus que ci-dessus, mais avec `test` au lieu de `quiz`.

## 📊 Avantages des Sous-domaines pour Google Ads

1. **Meilleure séparation** - Facile de tracker les performances
2. **URL ultra-courte** - `quiz.avenirea.com` est très mémorable
3. **Professionnalisme** - Montre que vous avez investi dans votre présence en ligne
4. **Flexibilité** - Vous pouvez créer des landing pages différentes par campagne

## 🔧 Configuration Actuelle

- ✅ Route principale : `/quiz`
- ✅ Redirections SEO : Toutes les anciennes URLs redirigent vers `/quiz`
- ✅ Sitemap mis à jour : `/quiz` a la priorité 1.0
- ✅ Meta tags optimisés : Canonical URL, Open Graph, Twitter Cards
- ✅ **Sous-domaine configuré** : `quiz.avenirea.com` redirige automatiquement vers `/quiz` (page du test)

## 📝 Notes pour Google Ads

1. **URL finale :** Utilisez `https://avenirea.com/quiz` dans vos annonces
2. **Tracking :** Vous pouvez ajouter des paramètres UTM :
   - `https://avenirea.com/quiz?utm_source=google&utm_medium=cpc&utm_campaign=personality_test`
3. **Landing Page :** La page `/quiz` est déjà optimisée pour les conversions

## 🚀 Prochaines Étapes

1. **Tester l'URL :** Vérifiez que `https://avenirea.com/quiz` fonctionne
2. **Mettre à jour les liens :** Si vous avez des liens internes, mettez-les à jour
3. **Configurer le sous-domaine (optionnel) :** Si vous voulez `quiz.avenirea.com`, suivez les instructions DNS ci-dessus

