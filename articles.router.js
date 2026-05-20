const express = require("express");
const articlesController = require("./articles.controller");
const auth = require("../../middlewares/auth"); // Vérifiez bien le nombre de "../" pour remonter au dossier middlewares !
const router = express.Router();

router.post("/", auth, articlesController.create);
router.put("/:id", auth, articlesController.update);
router.delete("/:id", auth, articlesController.delete);

module.exports = router;
