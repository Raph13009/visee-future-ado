# 🚀 Démarrage Rapide - Génération PDF

## ⚠️ Important

Pour générer des PDFs, vous devez démarrer **deux serveurs** :

1. **Serveur Frontend (Vite)** - Port 8080
2. **Serveur PDF** - Port 3001

## 📋 Méthode 1 : Démarrer les deux serveurs ensemble (Recommandé)

```bash
npm run dev:all
```

Cette commande démarre automatiquement les deux serveurs.

## 📋 Méthode 2 : Démarrer les serveurs séparément

### Terminal 1 - Frontend
```bash
npm run dev
```

### Terminal 2 - Serveur PDF
```bash
npm run pdf-server
```

## ✅ Vérification

Une fois les serveurs démarrés, vous devriez voir :

**Frontend (Terminal 1):**
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:8080/
```

**PDF Server (Terminal 2):**
```
[PDF Server] Server running on port 3001
[PDF Server] Frontend URL: http://localhost:8080
[PDF Server] Health check: http://localhost:3001/health
[PDF Server] PDF endpoint: http://localhost:3001/api/generate-pdf
```

## 🧪 Test de santé du serveur PDF

Vous pouvez vérifier que le serveur PDF fonctionne en visitant :
```
http://localhost:3001/health
```

Vous devriez voir : `{"status":"ok","message":"PDF server is running"}`

## 🐛 Problèmes courants

### Erreur : "ERR_CONNECTION_REFUSED"

**Cause :** Le serveur PDF n'est pas démarré.

**Solution :** 
1. Ouvrez un nouveau terminal
2. Exécutez : `npm run pdf-server`
3. Attendez le message "Server running on port 3001"

### Erreur : "Port 3001 already in use"

**Cause :** Le port 3001 est déjà utilisé.

**Solution :**
1. Arrêtez le processus utilisant le port 3001
2. Ou changez le port dans `.env` : `PDF_SERVER_PORT=3002`
3. Mettez à jour `VITE_PDF_API_URL` dans `.env` aussi

### Le PDF ne se génère pas

**Vérifications :**
1. ✅ Les deux serveurs sont démarrés
2. ✅ Le serveur PDF répond à `/health`
3. ✅ Le frontend est accessible sur `http://localhost:8080`
4. ✅ Vérifiez la console du navigateur pour les erreurs

## 📝 Notes

- Le serveur PDF doit être démarré **avant** de cliquer sur "Télécharger PDF"
- Si vous fermez le terminal du serveur PDF, la génération de PDF ne fonctionnera plus
- En production, le serveur PDF doit être déployé séparément

## 🔧 Configuration

Vous pouvez configurer les URLs via des variables d'environnement :

Créer un fichier `.env` :
```env
VITE_PDF_API_URL=http://localhost:3001/api/generate-pdf
PDF_SERVER_PORT=3001
FRONTEND_URL=http://localhost:8080
```

