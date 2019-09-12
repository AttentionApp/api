const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

module.exports = (app) => {
  const options = {
    swaggerDefinition: {
      info: {
        title: 'Attention API',
        description: 'Web Service for Attention App',
        version: '1.0.0',
      }
    },
    apis: ['./server/routes/v1/*'],
  };
  const swaggerSpec = swaggerJSDoc(options);
  app.get('/api-docs.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};