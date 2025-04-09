import swaggerAutogen from "swagger-autogen";

const outputFile = "./swagger-output.json";
const endpointsFiles = ["../app.ts"];

const doc = {
  info: {
    title: "Task API",
    description: "Auto-generated API docs",
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

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
  require("../app");
});
