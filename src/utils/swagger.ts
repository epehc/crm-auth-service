import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from "swagger-ui-express";
import {Express} from "express";

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CRM Auth Service API',
      version: '1.0.0',
      description: 'API Documentation for the Auth Service',
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts', './src/models/*.ts'], // files containing annotations as above
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerOptions = {
  swaggerOptions: {
    displayRequestDuration: true,
    docExpansion: 'none',
    operationsSorter: 'alpha',
    tagsSorter: 'alpha',
    showExtensions: true,
    showCommonExtensions: true,
    defaultModelsExpandDepth: -1,
    defaultModelExpandDepth: 10,
    defaultModelRendering: 'model',
    displayOperationId: true,
    filter: true,
    deepLinking: true,
    persistAuthorization: true,
    withCredentials: true,
    download: true, // Enable the download button
  },
};

/**
 * Sets up Swagger UI for the Express application.
 *
 * @param {Express} app - The Express application instance.
 */
export const setupSwagger = (app: Express) => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));
};