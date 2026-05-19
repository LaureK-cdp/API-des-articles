const { server } = require("../server"); // Ligne 1 déjà présente
const config = require("../config"); // Ligne 2 déjà présente
const mongoose = require("mongoose"); // Ligne 3 déjà présente
const usersRouter = require("../api/users/users.router"); // Déjà présent dans votre projet
const articlesRouter = require("../api/articles/articles.router"); // 

// ... (le reste de votre code avec mongoose.connect) ...

// ... (plus bas, là où Express gère les routes) ...
app.use("/api/users", usersRouter); 
app.use("/api/articles", articlesRouter); //

// ... (le code du server.listen tout en bas) ...
