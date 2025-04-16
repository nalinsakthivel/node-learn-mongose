import swaggerAutogen from "swagger-autogen";

const swaggerDocument = {
  info: {
    version: "1.0.0",
    title: "Task API",
    description: "Auto-generated API docs",
    contact: {
      name: "Nalin",
      email: "nalinssn@gmail.com",
    },
  },
  host: "localhost:3000",
  schemes: ["http"],
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
};

const swaggerFile = "../../swagger-output.json";
const apiRouteFile = ["../app.ts"];

swaggerAutogen()(swaggerFile, apiRouteFile, swaggerDocument);
