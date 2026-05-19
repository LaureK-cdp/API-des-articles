const jwt = require("jsonwebtoken");
const config = require("../config");
const usersService = require("../api/users/users.service");
const UnauthorizedError = require("../errors/unauthorized");

module.exports = async (req, res, next) => {
  try {
    // 1. Récupération du token JWT dans les entêtes (headers) de la requête HTTP
    const token = req.headers["x-access-token"] || req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      throw new UnauthorizedError("Token d'authentification manquant");
    }
    
    // 2. Vérification de la validité du token avec la clé secrète de l'application
    const decoded = jwt.verify(token, config.secretJwtToken);
    
    // 3. Point 5 de l'exercice : Récupération de TOUTES les informations de l'utilisateur en base de données
    const user = await usersService.get(decoded.userId);
    if (!user) {
      throw new UnauthorizedError("Utilisateur introuvable ou compte inexistant");
    }

    // 4. On injecte l'objet utilisateur complet (contenant son rôle, son id, etc.) dans l'objet "req"
    req.user = user; 
    
    // 5. Tout est OK, on autorise Express à passer à la suite (le contrôleur)
    next();
  } catch (err) {
    // Si le token est expiré ou invalide, on renvoie une erreur d'authentification
    next(new UnauthorizedError("Token invalide ou expiré"));
  }
};