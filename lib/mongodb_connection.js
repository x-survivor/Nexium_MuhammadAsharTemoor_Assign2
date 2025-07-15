import { MongoClient, ServerApiVersion } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Mongo URI not found!");
}

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function getDB(dbName) {
  try {
    await client.connect();
    return client.db(dbName);
  } catch (err) {
    console.log(err);
  }
}

export async function getText(fullText) {
  const db = await getDB("Blogs");
  if (db) return db.collection(fullText);

  return null;
}
