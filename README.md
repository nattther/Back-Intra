# TechCampus-Back — Backend API (Node.js + Express + PostgreSQL)

## 📦 Description du projet

API simple en Node.js + Express + TypeScript + PostgreSQL pour gérer :  
- Utilisateurs (étudiants, professeurs)  
- Classes  
- Association utilisateur ↔ classes (un user peut avoir plusieurs classes)  
- Notes attribuées par un professeur à un étudiant pour une classe  
- Vérification de rôle utilisateur  

C’est un back “prototype” / “minimum viable” — sans sécurité, sans validation — idéal pour tester ou développer rapidement.

Disponible ici ---> https://back-intra.onrender.com/api-docs/
---

## 🚀 Installation & démarrage

```bash
git clone <url-de-ton-repo>
cd backend
npm install
# (optionnel) initialiser la base si elle est vide — npm run init-db
npm run dev

| Fonction                 | Méthode | URL                 | Body / Params                                                                       | Description                                         |
| ------------------------ | ------- | ------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------- |
| **Créer un utilisateur** | POST    | `/users`            | `{ "name": "...", "email": "...", "role": "...", "password": "...", "classId": 1 }` | Crée un user + associe optionnellement à une classe |
| **Lister utilisateurs**  | GET     | `/users`            | —                                                                                   | Retourne tous les users (sans password_hash)        |
| **Vérifier rôle**        | POST    | `/users/check-role` | `{ "userId": 1, "role": "student" }`                                                | Renvoie `{ ok: true/false }`                        |


| Fonction                      | Méthode | URL                            | Body / Params                   | Description                                 |
| ----------------------------- | ------- | ------------------------------ | ------------------------------- | ------------------------------------------- |
| **Créer une classe**          | POST    | `/classes`                     | `{ "label": "Classe X" }`       | Ajoute une classe                           |
| **Lister classes**            | GET     | `/classes`                     | —                               | Retourne toutes les classes                 |
| **Associer user ↔ classe**    | POST    | `/user-classes`                | `{ "userId": 1, "classId": 2 }` | Ajoute l’utilisateur dans la classe         |
| **Classes d’un user**         | GET     | `/user-classes/user/:userId`   | —                               | Retourne les classes d’un utilisateur       |
| **Users d’une classe**        | GET     | `/user-classes/class/:classId` | —                               | Retourne les users inscrits dans une classe |
| **Retirer user d’une classe** | DELETE  | `/user-classes`                | `{ "userId": 1, "classId": 2 }` | Supprime l’association                      |


| Fonction                    | Méthode | URL      | Body / Params                                                                   | Description               |
| --------------------------- | ------- | -------- | ------------------------------------------------------------------------------- | ------------------------- |
| **Ajouter une note**        | POST    | `/notes` | `{ "studentUserId":1, "teacherUserId":2, "classId":3, "value":14.5, "ects":6 }` | Ajoute une note           |
| **Lister toutes les notes** | GET     | `/notes` | —                                                                               | Retourne toutes les notes |


| Fonction                             | Méthode | URL                         | Body / Params                                                                                                                                        | Description                                              |
| ------------------------------------ | ------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| **Créer un créneau pour une classe** | POST    | `/planning`                 | `{ "classId": 1, "teacherUserId": 2, "label": "Programmation Web", "room": "B101", "date": "2025-01-06", "startTime": "09:00", "endTime": "11:00" }` | Ajoute un créneau pour une classe + un prof              |
| **Planning d’une classe**            | GET     | `/planning/class/:classId`  | `classId`                                                                                                                                            | Retourne tous les créneaux de la classe                  |
| **Planning d’un élève**              | GET     | `/planning/student/:userId` | `userId` (id du user étudiant)                                                                                                                       | Retourne les créneaux des classes où l'élève est inscrit |
| **Planning d’un professeur**         | GET     | `/planning/teacher/:userId` | `userId` (id du user professeur)                                                                                                                     | Retourne les créneaux où il enseigne                     |
| **Lister tous les créneaux (admin)** | GET     | `/planning`                 | —                                                                                                                                                    | Vue globale de tous les créneaux                         |


| Fonction                             | Méthode | URL                          | Body / Params                             | Description                                      |
| ------------------------------------ | ------- | ---------------------------- | ----------------------------------------- | ------------------------------------------------ |
| Uploader un document                 | POST    | `/documents`                 | `multipart/form-data` : `file`, `type`    | Upload un doc pour l’utilisateur connecté (`pending`) |
| Lister les documents en attente      | GET     | `/documents/pending`         | Header `Authorization: Bearer <token>`    | Pour le rôle `responsable_pedagogique`          |
| Valider un document                  | PATCH   | `/documents/:id/validate`    | Header `Authorization: Bearer <token>`    | Valide un document (`status = validated`)       |
