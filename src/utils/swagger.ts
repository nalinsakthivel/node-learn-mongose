const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger-output.json";
const endpointsFiles = ["../app.ts"];
const doc = {
  info: {
    title: "My API",
    description: "Auto-generated API docs",
  },
  host: "localhost:3000",
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ bearerAuth: [] }],
  schemes: ["http"],
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("../app");
});
