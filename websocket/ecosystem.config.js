module.exports = {
  apps: [
    {
      name: "WS-PROD",
      script: "./dist/index.js",
      env: {
        PORT: 3001,
        CORS_ORIGINS:
          "https://data-list-collaborative-r54h7zfc9-romainbaslys-projects.vercel.app/,https://stingray-app-69yxe.ondigitalocean.app/api",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3001,
        CORS_ORIGINS:
          "https://data-list-collaborative-r54h7zfc9-romainbaslys-projects.vercel.app/,https://stingray-app-69yxe.ondigitalocean.app/api",
      },
    },
  ],
};
