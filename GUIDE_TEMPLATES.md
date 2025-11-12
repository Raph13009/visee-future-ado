# 📚 Guide Complet des Templates de Rapport

## 🎯 Comment le système fonctionne

### 1. **Personnalisation automatique selon les réponses**

Chaque rapport est **unique** car il est généré à partir des réponses de l'utilisateur :

1. **Calcul des scores** : Les 100 réponses sont converties en scores (0-100%) pour chaque trait
2. **Sélection du contenu** : Selon le score, le système choisit automatiquement :
   - Descriptions appropriées (very_high, high, moderate, low, very_low)
   - Forces correspondantes
   - Domaines de croissance
   - Carrières recommandées
3. **Génération dynamique** : Le PDF est construit avec le contenu adapté aux scores

### 2. **Structure des Templates**

#### 📄 **Templates Markdown** (`.md`) - Sections du rapport

Ces fichiers définissent la structure et le texte de chaque page :

- **`cover.md`** → Page 1 : Page de couverture
- **`executive_summary.md`** → Page 2 : Résumé exécutif
- **`strengths_and_growth.md`** → Page 9 : Forces et domaines de croissance
- **`paths_and_careers.md`** → Page 11 : Chemins de carrière
- **`relationships.md`** → Page 12 : Relations et communication
- **`development_plan.md`** → Page 13 : Plan de développement
- **`resources.md`** → Page 14 : Ressources
- **`footer.md`** → Page 15 : Footer

**Placeholders disponibles** : `{{date}}`, `{{dominantTrait1}}`, `{{dominantTrait2}}`, etc.

#### 📊 **Templates JSON** (`.json`) - Données dynamiques

Ces fichiers contiennent le contenu qui change selon les scores :

- **`trait_descriptions.json`** : Descriptions pour chaque trait selon le score
  - `very_high` (90-100%)
  - `high` (70-89%)
  - `moderate` (50-69%)
  - `low` (30-49%)
  - `very_low` (0-29%)

- **`trait_strengths.json`** : Liste des forces pour chaque trait
- **`trait_growth_areas.json`** : Domaines de croissance
- **`trait_careers.json`** : Carrières recommandées
- **`trait_quotes.json`** : Citations inspirantes
- **`trait_work_examples.json`** : Exemples de travail/études
- **`trait_actions.json`** : Actions recommandées

### 3. **Comment modifier le rapport**

#### ✏️ Modifier le texte d'une section

**Exemple : Modifier la page de couverture**

1. Ouvrir `src/lib/report/content-templates/cover.md`
2. Modifier le texte
3. Utiliser `{{date}}` pour la date dynamique
4. Sauvegarder
5. Le changement apparaît dans le prochain PDF généré

#### ✏️ Modifier les descriptions des traits

**Exemple : Modifier la description pour "Precision & Organization"**

1. Ouvrir `src/lib/report/content-templates/trait_descriptions.json`
2. Trouver `"Precision & Organization"`
3. Modifier le texte pour `"high"`, `"moderate"`, etc.
4. Sauvegarder (vérifier la syntaxe JSON)
5. Le changement apparaît dans le prochain PDF

#### ✏️ Ajouter des forces ou carrières

**Exemple : Ajouter une carrière pour "Creativity & Expression"**

1. Ouvrir `src/lib/report/content-templates/trait_careers.json`
2. Trouver `"Creativity & Expression"`
3. Ajouter une nouvelle carrière dans le tableau `"high"` ou `"moderate"`
4. Sauvegarder
5. La nouvelle carrière apparaît dans le PDF

### 4. **Structure des 15 pages**

```
Page 1  : Cover (cover.md)
Page 2  : Executive Summary (executive_summary.md) + Graphiques
Page 3  : Trait 1 - Precision & Organization (trait_descriptions.json)
Page 4  : Trait 2 - Empathy & Altruism
Page 5  : Trait 3 - Leadership & Confidence
Page 6  : Trait 4 - Creativity & Expression
Page 7  : Trait 5 - Logic & Reflection
Page 8  : Trait 6 - Harmony & Cooperation
Page 9  : Strengths & Growth (strengths_and_growth.md)
Page 10 : Work Examples (trait_work_examples.json)
Page 11 : Career Paths (paths_and_careers.md)
Page 12 : Relationships (relationships.md)
Page 13 : Development Plan (development_plan.md)
Page 14 : Resources (resources.md)
Page 15 : Footer (footer.md)
```

### 5. **Personnalisation selon les scores**

Le système choisit automatiquement le contenu selon les scores :

```javascript
// Exemple : Score de 75% pour "Precision & Organization"
if (score >= 70) {
  // Utilise trait_descriptions.json["Precision & Organization"]["high"]
  // Utilise trait_strengths.json["Precision & Organization"]["high"]
  // Utilise trait_careers.json["Precision & Organization"]["high"]
} else if (score >= 50) {
  // Utilise "moderate"
} else {
  // Utilise "low" ou "very_low"
}
```

### 6. **Fichiers à modifier**

#### Pour changer le style/design :
- `src/lib/report/simplePDF.ts` → Fonctions de dessin (couleurs, polices, layout)

#### Pour changer le contenu texte :
- `src/lib/report/content-templates/*.md` → Sections du rapport
- `src/lib/report/content-templates/*.json` → Données dynamiques

#### Pour changer la logique :
- `src/lib/report/templateLoader.ts` → Chargement et remplacement des placeholders
- `src/lib/report/templates.ts` → Logique de construction du rapport

### 7. **Exemple concret**

**Scénario** : Un utilisateur a un score de 80% en "Leadership & Confidence"

1. Le système lit `trait_descriptions.json`
2. Trouve `"Leadership & Confidence"` → `"high"` (car 80% >= 70%)
3. Affiche : *"You are confident and assertive, naturally taking charge..."*
4. Lit `trait_strengths.json` → Affiche les forces pour "high"
5. Lit `trait_careers.json` → Affiche les carrières pour "high"
6. Génère la page avec ce contenu personnalisé

**Résultat** : Chaque utilisateur voit un rapport unique basé sur ses réponses !

### 8. **Bonnes pratiques**

✅ **Modifier les templates** plutôt que le code
✅ **Tester après chaque modification** en générant un PDF
✅ **Utiliser les placeholders** (`{{date}}`, `{{traitName}}`, etc.)
✅ **Respecter la syntaxe JSON** (virgules, guillemets)
✅ **Garder le texte concis** (les PDFs ont un espace limité)

### 9. **Support**

- 📁 Tous les templates : `src/lib/report/content-templates/`
- 📖 Documentation : `src/lib/report/content-templates/README.md`
- 🔧 Code de génération : `src/lib/report/simplePDF.ts`

---

**🎉 Maintenant vous savez tout !** Modifiez les templates pour personnaliser le rapport selon vos besoins.

