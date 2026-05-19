module.exports = {
  apps: [
    {
      name: "mon-application-api",
      script: "./www/app.js",
      instances: "max",
      exec_mode: "cluster",
      
      // CONFIGURATION DES LOGS (Point précédent)
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      
      // =========================================================================
      // LIMITATION DE LA MÉMOIRE (Demande de l'exercice)
      // =========================================================================
      max_memory_restart: "200M",          // Redémarre l'application si elle dépasse 200 Mo de RAM
      
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};