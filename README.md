# TP CI/CD - API REST Étudiants

[![CI/CD Pipeline](https://github.com/Deo-Cell/ci_cd/actions/workflows/ci.yml/badge.svg)](https://github.com/Deo-Cell/ci_cd/actions/workflows/ci.yml)

Cette API gère des étudiants en mémoire et a été construite pour le TP CI/CD (Séance 1) avec Express, Jest, ESLint et GitHub Actions.

## 🌟 Fonctionnalités et Bonus implémentés
- **Validation stricte** des données (nom, prénom > 2 caractères, email défini et unique, note entre 0 et 20, etc).
- **Pagination (Bonus)** : La route `GET /students` supporte la pagination pour les longues listes via les paramètres `page` et `limit` (ex: `/students?page=1&limit=2`).
- **Documentation OpenAPI (Bonus)** : L'API est entièrement interactive et testable via l'interface Swagger UI.

## 🚀 Comment lancer et tester le projet en local

1. **Installer les dépendances**
```bash
npm install
```

2. **Démarrer le serveur API**
```bash
npm start
```
Le serveur démarrera sur [http://localhost:3000](http://localhost:3000).

3. **Consulter la documentation Swagger et tester l'API (Bonus)**
Une fois le serveur ouvert, accédez à la documentation interactive ici : **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**.

✅ **Comment tester la pagination dans Swagger ?**
- Cliquez sur la route `GET /students`.
- Cliquez sur le bouton en haut à droite **"Try it out"**.
- Remplissez les paramètres : tapez par exemple `1` dans le paramètre `page` et `2` dans le paramètre `limit`.
- Cliquez sur le gros bouton bleu **"Execute"** pour voir la réponse paginée de l'API !

## 🧪 Tests et Qualité

Le projet inclut les **15 tests automatisés** exigés par le TP.
```bash
npm test
```

Linter (zéro erreurs) :
```bash
npm run lint
```

## 🛠 Endpoints disponibles

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/health` | Statut de l'API |
| `GET` | `/students/stats` | Statistiques globales sur les notes et filières |
| `GET` | `/students/search?q=...` | Rechercher un étudiant par nom/prénom |
| `GET` | `/students` | Lister les étudiants (supporte la pagination) |
| `GET` | `/students/:id` | Récupérer un étudiant précis |
| `POST` | `/students` | Ajouter un étudiant avec validations strictes |
| `PUT` | `/students/:id` | Modifier les données d'un étudiant |
| `DELETE` | `/students/:id` | Supprimer un étudiant |