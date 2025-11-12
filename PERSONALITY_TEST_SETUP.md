# Configuration du Test de Personnalité - Supabase

## 📋 Étape 1 : Créer la table dans Supabase

1. Ouvrez votre projet Supabase
2. Allez dans **SQL Editor** (éditeur SQL)
3. Copiez-collez le contenu du fichier `supabase_personality_test_table.sql`
4. Exécutez la requête

## 📊 Structure de la table

La table `personality_test_results` stocke :
- **Informations utilisateur** : nom, email, genre
- **6 scores de traits** (0-100) :
  - `precision_organization_score`
  - `empathy_altruism_score`
  - `creativity_expression_score`
  - `logic_reflection_score`
  - `leadership_confidence_score`
  - `harmony_cooperation_score`
- **Réponses détaillées** : JSONB avec toutes les réponses
- **Statut de paiement** : pour la génération PDF (futur)
- **Métadonnées** : dates de création, complétion, etc.

## 🔒 Permissions (RLS)

Par défaut, les RLS (Row Level Security) sont désactivées. Si vous souhaitez les activer :

1. Décommentez les lignes RLS dans le fichier SQL
2. Ajustez les policies selon vos besoins de sécurité
3. Ré-exécutez les commandes RLS

## ✅ Vérification

Après avoir créé la table, vous pouvez vérifier dans Supabase :

1. Allez dans **Table Editor**
2. Vous devriez voir la table `personality_test_results`
3. Testez en complétant un test de personnalité
4. Vérifiez que les données sont bien enregistrées

## 🔍 Requêtes utiles

### Voir tous les résultats
```sql
SELECT * FROM personality_test_results 
ORDER BY created_at DESC;
```

### Compter les tests complétés
```sql
SELECT COUNT(*) as total_tests 
FROM personality_test_results;
```

### Moyenne des scores par trait
```sql
SELECT 
  AVG(precision_organization_score) as avg_precision,
  AVG(empathy_altruism_score) as avg_empathy,
  AVG(creativity_expression_score) as avg_creativity,
  AVG(logic_reflection_score) as avg_logic,
  AVG(leadership_confidence_score) as avg_leadership,
  AVG(harmony_cooperation_score) as avg_harmony
FROM personality_test_results;
```

## 🚀 Intégration

Le code est déjà intégré dans `TestPersonnalite.tsx`. Quand un utilisateur termine le test :

1. Les scores sont calculés automatiquement
2. Les données sont enregistrées dans Supabase
3. L'ID du résultat est stocké dans `localStorage` (`personalityTestResultId`)
4. L'utilisateur peut continuer vers l'écran de résultats

## 📝 Notes

- Les erreurs d'enregistrement n'empêchent pas l'utilisateur de voir ses résultats
- Les données sont enregistrées même si l'email/nom ne sont pas fournis
- Le champ `payment` est prévu pour la génération PDF payante (futur)
- Les réponses détaillées sont stockées en JSONB pour flexibilité

