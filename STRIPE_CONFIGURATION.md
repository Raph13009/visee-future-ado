# Configuration Stripe pour le Test de Personnalité

## ✅ Configuration Actuelle

**Lien de paiement Stripe :** `https://buy.stripe.com/dRm28safGcX7fU00nY7IY02`

**Prix :** $1.99 USD

## 🔧 URL de Redirection Après Paiement

### URL à configurer dans Stripe :

```
https://avenirea.com/personality-payment-success
```

### Comment configurer dans Stripe :

1. **Via le Dashboard Stripe :**
   - Allez sur https://dashboard.stripe.com/products
   - Trouvez votre produit (ou créez-en un nouveau)
   - Dans les paramètres du produit, cherchez "Success URL" ou "Redirect after payment"
   - Entrez : `https://avenirea.com/personality-payment-success`

2. **Via l'URL du lien de paiement :**
   - Le code ajoute automatiquement le paramètre `success_url` à l'URL Stripe
   - L'URL complète devient : 
     ```
     https://buy.stripe.com/dRm28safGcX7fU00nY7IY02?success_url=https%3A%2F%2Favenirea.com%2Fpersonality-payment-success%3Fanswers%3D...
     ```
   - Les réponses du test sont automatiquement encodées dans l'URL pour permettre la génération du PDF

## 📋 Fonctionnement

1. **Utilisateur complète le test** → Arrive sur la page de résultats
2. **Clique sur "Get My Report - $1.99 USD"** → Redirigé vers Stripe
3. **Effectue le paiement** → Stripe redirige vers `/personality-payment-success` avec les réponses encodées
4. **Page de succès** → Génère automatiquement le PDF et le télécharge
5. **Bouton de téléchargement** → Disponible pour télécharger à nouveau si nécessaire

## 🔒 Sécurité

- Les réponses sont encodées en base64 dans l'URL
- Le PDF est généré uniquement après confirmation du paiement
- Aucune donnée sensible n'est stockée localement

## 🧪 Test

Pour tester le flux complet :
1. Complétez le test sur `/quiz`
2. Cliquez sur "Get My Report - $1.99 USD"
3. Utilisez une carte de test Stripe (4242 4242 4242 4242)
4. Vérifiez que vous êtes redirigé vers `/personality-payment-success`
5. Vérifiez que le PDF se génère et se télécharge automatiquement

## 📝 Notes

- Le prix est fixé à **$1.99 USD** dans le bouton
- Le lien Stripe doit être configuré pour accepter ce montant
- Assurez-vous que le produit Stripe correspond au bon montant

