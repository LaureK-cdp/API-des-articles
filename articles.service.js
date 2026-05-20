const Article = require("./articles.schema");

class ArticlesService {
  // Créer un article
  create(data) {
    const article = new Article(data);
    return article.save();
  }

  // Modifier un article
  update(id, data) {
    return Article.findByIdAndUpdate(id, data, { new: true });
  }

  // Supprimer un article
  delete(id) {
    return Article.deleteOne({ _id: id });
  }

  // RÉPONSE À LA ROUTE PUBLIQUE : Récupérer les articles d'un utilisateur
  getByUser(userId) {
    // Le .populate("user", "-password") permet de lier l'utilisateur à l'article tout en masquant son mot de passe par sécurité
    return Article.find({ user: userId }).populate("user", "-password");
  }
}

module.exports = new ArticlesService();
