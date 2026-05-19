const Article = require("./articles.schema");

class ArticlesService {
  // 1. Création d'un article (Point 7 précédent)
  async create(data) {
    const article = new Article(data);
    return await article.save();
  }

  // 2. Mise à jour d'un article (Point 6 précédent)
  async update(id, data) {
    return await Article.findByIdAndUpdate(id, data, { new: true });
  }

  // 3. Suppression d'un article (Point 6 précédent)
  async delete(id) {
    return await Article.deleteOne({ _id: id });
  }

  // =========================================================================
  // EXERCICE 4 : Récupérer tous les articles d'un utilisateur avec POPULATE
  // =========================================================================
  async getByUser(userId) {
    return await Article.find({ user: userId })
      .populate({
        path: "user",          // 1. On cible la propriété "user" de l'article
        select: "-password"    // 2. Le signe "-" signifie "EXCLURE". On masque le mot de passe !
      });
  }
}

module.exports = new ArticlesService();