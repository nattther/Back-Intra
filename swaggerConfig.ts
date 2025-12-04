
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mon API",
      version: "1.0.0",
      description: "Documentation auto-générée de mon API",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
      // tu peux ajouter d'autres environnements
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Indique où trouver les fichiers pour analyser les commentaires JSDoc
  apis: ["./routes/**/*.ts"],  // à adapter selon ton arborescence
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
