import fs from "fs";
import { Collection, Item, Request, Header } from "postman-collection";

const BASE_URL = "http://localhost:3000";

const postmanCollection = new Collection({
  info: {
    name: "My API Collection",
    version: "1.0.0",
  },
  variable: [],
  item: apiEndpoints.map((endpoint) => {
    const request = new Request({
      method: endpoint.method,
      url: `${BASE_URL}${endpoint.path}`,
      header: [
        ...(endpoint.auth
          ? [new Header({ key: "Authorization", value: "Bearer YOUR_TOKEN" })]
          : []),
        ...(endpoint.method === "POST" || endpoint.method === "PUT"
          ? [new Header({ key: "Content-Type", value: "application/json" })]
          : []),
      ],
      body:
        endpoint.method === "POST" || endpoint.method === "PUT"
          ? {
              mode: "raw",
              raw: JSON.stringify(endpoint.body, null, 2),
            }
          : undefined,
    });

    return new Item({
      name: endpoint.name,
      request,
    });
  }),
});

fs.writeFileSync(
  "postman_collection.json",
  JSON.stringify(postmanCollection, null, 2)
);

console.log("✅ Postman Collection generated: postman_collection.json");
