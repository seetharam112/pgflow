import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PGFlow API',
      version: '1.0.0',
      description: 'Multi-tenant SaaS API for PG (Paying Guest) property management',
    },
    servers: [
      {
        url: 'http://localhost:3001/api/v1',
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/validators/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
