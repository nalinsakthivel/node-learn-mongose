import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017";
// const mongoUri = "mongodb://localhost:27017";

const client = new MongoClient(mongoUri, {
  tls: true,
  tlsAllowInvalidCertificates: false,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
  minPoolSize: 5,
  maxPoolSize: 50,
});

let taskDb: Db | null = null;
let usersDb: Db | null = null;

export async function connectTaskDB(): Promise<Db> {
  try {
    if (!taskDb) {
      await client.connect();
      taskDb = client.db("taskDB");
      console.log("TaskDB connected da!");
    }
    return taskDb;
  } catch (err) {
    console.error("TaskDB connection failed da!", err);
    throw err;
  }
}

export async function connectUsersDB(): Promise<Db> {
  try {
    if (!usersDb) {
      await client.connect();
      usersDb = client.db("users");
      console.log("UsersDB connected da!");
    }
    return usersDb;
  } catch (err) {
    console.error("UsersDB connection failed da!", err);
    throw err;
  }
}
