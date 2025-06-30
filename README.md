# API Node.js avec Express, Prisma, MySQL et Zod

Ce projet est une API REST de base utilisant **Express** pour le serveur web, **Prisma** comme ORM connecté à une base **MySQL**, et **Zod** pour la validation des données.

## ⚙️ Étape 1 – Initialisation du projet

```bash
npm init -y
```
## 📦 Étape 2 – Installation des dépendances
```bash
npm install express prisma @prisma/client zod dotenv
npm install --save-dev nodemon
```

Ajoute dans package.json :

```json
"scripts": {
  "dev": "nodemon index.js"
}
```

## 🌐 Étape 3 – Configuration MySQL (Wamp/phpMyAdmin)

Crée une base de données dans phpMyAdmin
```bash
mysql -u user_name -p
password
>create Database Room;
exit
```

Fichier .env à la racine :
```js
JWT_SECRET=une_grosse_cle_ultra_secrete
// changer user_name et user_password avec les vrais infos
DATABASE_URL="mysql://user_name:user_password@localhost:3306/Room"

```
