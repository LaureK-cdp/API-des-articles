const articlesService = require("./articles.service");
const userService = require("../users/users.service"); // On remonte d'un dossier (../) puis on va dans users

class ArticlesController {
    // 1. Création d'un article (Utilisateur connecté requis)
    async create(req, res, next) {
        try {
            const articleData = {
                ...req.body,
                user: req.user._id // Récupéré automatiquement via votre auth middleware
            };
            const article = await articlesService.create(articleData);
            
            // Notification en temps réel
            req.io.emit("article:create", article);
            
            res.status(201).json(article);
        } catch (err) {
            next(err);
        }
    }

    // 2. Modification d'un article (Réservé aux administrateurs)
    async update(req, res, next) {
        try {
            if (req.user.role !== "admin") {
                throw new UnauthorizedError("Accès refusé : Seuls les administrateurs peuvent modifier un article");
            }
            const id = req.params.id;
            const articleModified = await articlesService.update(id, req.body);
            
            if (!articleModified) {
                throw new NotFoundError("Article introuvable");
            }
            
            req.io.emit("article:update", articleModified);
            res.json(articleModified);
        } catch (err) {
            next(err);
        }
    }

    // 3. Suppression d'un article (Réservé aux administrateurs)
    async delete(req, res, next) {
        try {
            if (req.user.role !== "admin") {
                throw new UnauthorizedError("Accès refusé : Seuls les administrateurs peuvent supprimer un article");
            }
            const id = req.params.id;
            const result = await articlesService.delete(id);
            
            if (result.deletedCount === 0) {
                throw new NotFoundError("Article introuvable");
            }
            
            req.io.emit("article:delete", { id });
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }

    // 4. Endpoint public : Afficher les articles d'un utilisateur spécifique
    async getByUser(req, res, next) {
        try {
            const userId = req.params.userId;
            const articles = await articlesService.getByUser(userId);
            res.json(articles);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ArticlesController();
