const express = require("express");
const articlesController = require("./articles.controller");
const auth = require("../../middlewares/auth"); // Ajustez le chemin selon l'emplacement exact de votre dossier middlewares
const router = express.Router();

// L'utilisateur doit être connecté (auth) pour pouvoir créer un article
router.post("/", auth, articlesController.create);

// L'utilisateur doit être connecté et admin (géré dans le contrôleur) pour mettre à jour
router.put("/:id", auth, articlesController.update);

// L'utilisateur doit être connecté et admin (géré dans le contrôleur) pour supprimer
router.delete("/:id", auth, articlesController.delete);

module.exports = router;