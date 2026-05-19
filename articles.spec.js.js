const request = require("supertest");
const { app, server } = require("../server"); // Importation de l'application
const jwt = require("jsonwebtoken");
const mockingoose = require("mockingoose"); // Importation du module de mock
const Article = require("../api/articles/articles.schema");

describe("Tests unitaires avec Mocks - Endpoints des Articles", () => {
  let adminToken;
  let userToken;
  const fakeArticleId = "65f8c2b3c4d5e6f7g8h9i0a1";

  beforeAll(() => {
    // Génération des faux tokens pour passer les middlewares de sécurité
    userToken = jwt.sign(
      { _id: "65f1a2b3c4d5e6f7g8h9i0j1", role: "user" },
      process.env.JWT_SECRET || "votre_cle_secrete"
    );

    adminToken = jwt.sign(
      { _id: "65f1a2b3c4d5e6f7g8h9i0j2", role: "admin" },
      process.env.JWT_SECRET || "votre_cle_secrete"
    );
  });

  beforeEach(() => {
    // Reset les mocks avant chaque test pour éviter les interférences
    mockingoose.resetAll();
  });

  afterAll(() => {
    server.close(); // Fermeture propre du serveur HTTP
  });

  // =========================================================================
  // 1. MOCK & TEST DE CRÉATION
  // =========================================================================
  it("POST /api/articles - Devrait créer un article (Mocké)", async () => {
    const newArticle = {
      title: "Article de Test Spec",
      content: "Ceci est le contenu du test unitaire.",
    };

    // Définition du MOCK : Quand le code appelle .save(), Mongoose renvoie cet objet fictif
    mockingoose(Article).toReturn({
      _id: fakeArticleId,
      title: newArticle.title,
      content: newArticle.content,
      user: "65f1a2b3c4d5e6f7g8h9i0j1" // ID issu du token
    }, "save");

    const response = await request(app)
      .post("/api/articles")
      .set("Authorization", `Bearer ${userToken}`)
      .send(newArticle);

    expect(response.statusCode).toBe(201); //
    expect(response.body).toHaveProperty("_id", fakeArticleId);
    expect(response.body.user).toBe("65f1a2b3c4d5e6f7g8h9i0j1"); // Vérifie le Point 7
  });

  // =========================================================================
  // 2. MOCK & TEST DE MISE À JOUR
  // =========================================================================
  it("PUT /api/articles/:id - Devrait modifier l'article (Mocké)", async () => {
    const updatedData = { title: "Titre modifié par le test" };

    // Définition du MOCK : Quand le code fait un findByIdAndUpdate (ou findOneAndUpdate)
    mockingoose(Article).toReturn({
      _id: fakeArticleId,
      title: updatedData.title,
      content: "Contenu original inchangé",
      user: "65f1a2b3c4d5e6f7g8h9i0j1"
    }, "findOneAndUpdate");

    const response = await request(app)
      .put(`/api/articles/${fakeArticleId}`)
      .set("Authorization", `Bearer ${adminToken}`) //
      .send(updatedData);

    expect(response.statusCode).toBe(200); //
    expect(response.body.title).toBe(updatedData.title);
  });

  // =========================================================================
  // 3. MOCK & TEST DE SUPPRESSION
  // =========================================================================
  it("DELETE /api/articles/:id - Devrait supprimer l'article (Mocké)", async () => {
    // Définition du MOCK : Quand le code fait un deleteOne
    mockingoose(Article).toReturn({
      deletedCount: 1
    }, "deleteOne");

    const response = await request(app)
      .delete(`/api/articles/${fakeArticleId}`)
      .set("Authorization", `Bearer ${adminToken}`); //

    expect(response.statusCode).toBe(204); //
  });
});