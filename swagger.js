import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Quinn',
    description: 'API documentation for the Quinn E-commerce website',
  },
  host: 'localhost:5000',
  schemes: ['http'],
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Enter your JWT token. Example: <token>',
    },
  },
  security: [
    {
      apiKeyAuth: [],
    },
  ],
};

const outputFile = './swagger-output.json';  // Output file for generated swagger docs
const endpointsFiles = ['./index.js'];  // The main file where your routes are defined

swaggerAutogen()(outputFile, endpointsFiles, doc).then(async () => {
    await import('./index.js');  // Start your application after generating the docs
  });
