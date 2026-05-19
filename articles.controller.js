const userService = require("./users.service");
const articlesService = require("../articles/articles.service"); // Importation nécessaire pour chercher les articles
const UnauthorizedError = require("../../errors/unauthorized");

class UsersController {
  async getAll(req, res, next) {
    try {
      const users = await userService.getAll();
      res.json(users);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const id = req.params.id;
      const user = await userService.get(id);
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const user = await userService.create(req.body);
      user.password = undefined;
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const id = req.params.id;
      const data = req.body;
      const userModified = await userService.update(id, data);
      userModified.password = undefined;
      res.json(userModified);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;
      await userService.delete(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await userService.login(email, password);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  // =========================================================================
  // EXERCICE 4 - NOUVELLE MÉTHODE PUBLIQUE : Récupérer les articles d'un utilisateur
  // =========================================================================
  async getUserArticles(req, res, next) {
    try {
      const userId = req.params.userId; // Récupère l'ID depuis l'URL (:userId)
      
      // Appel au service des articles pour récupérer uniquement ceux du membre
      const articles = await articlesService.getByUser(userId); 
      
      res.json(articles);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UsersController();