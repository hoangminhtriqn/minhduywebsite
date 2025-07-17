const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');



const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Test API',
      version: '1.0.0',
    },
  },
  apis: [
    path.join(__dirname, 'routes/*.js'),
    path.join(__dirname, 'controllers/*.js'),
    path.join(__dirname, 'models/*.js'),
    path.join(__dirname, 'docs/*.js')
  ]
};

try {
  const specs = swaggerJsdoc(options);
  const paths = Object.keys(specs.paths || {});
  

  
  if (paths.length > 0) {
    
      } else {
      // No endpoints found
    }
  
} catch (error) {
  console.error('❌ Error loading Swagger configuration:', error.message);
} 