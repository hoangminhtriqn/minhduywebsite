const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Test Drive Booking API',
      version: '1.0.0',
      description: 'API documentation for Test Drive Booking System',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://minhduywebsite-backend.onrender.com/',
        description: 'Production server'
      }
    ]
  },
  apis: [
    path.join(__dirname, 'routes/*.js'),
    path.join(__dirname, 'controllers/*.js'),
    path.join(__dirname, 'models/*.js'),
    path.join(__dirname, 'docs/*.js')
  ]
};

const specs = swaggerJsdoc(options);



if (Object.keys(specs.paths || {}).length === 0) {
  // No paths found
} else {
  // Swagger configuration is working
} 