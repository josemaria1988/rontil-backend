import pkg from 'swagger-jsdoc';
const { swaggerUi, swaggerJsdoc } = pkg;

/**
 * Opciones de configuración para Swagger
 */
export const getSwaggerOptions = () => {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API de Productos',
        version: '1.0.0',
        description: 'API para gestionar productos',
      },
      servers: [
        {
          url: 'http://localhost:8080',
          description: 'Servidor de desarrollo',
        },
      ],
    },
    apis: ['./routes/products.routes.js'], // Ruta al archivo que contiene las rutas y documentación de productos
  };

  return options;
};