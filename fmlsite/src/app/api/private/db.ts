import { MongoClient, type Db } from "mongodb"

let cachedDb: Db | null = null
let cachedClient: MongoClient | null = null

export async function connectToDatabase(): Promise<Db> {
  /*   if (cachedDb) {
    return cachedDb;
  } */

  const uri = "mongodb://127.0.0.1:27017/fml?directConnection=true&serverSelectionTimeoutMS=2000"
  const client = new MongoClient(uri)

  try {
    await client.connect()
    /* console.log("Connected to MongoDB") */
    cachedDb = client.db()
    cachedClient = client
    return cachedDb
  } catch (err) {
    console.error(err)
    throw new Error("Could not connect to MongoDB")
  }
}

export async function disconnectFromDatabase() {
  if (cachedClient) {
    await cachedClient.close()
    cachedDb = null
    cachedClient = null
  }
}

