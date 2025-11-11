import { MongoClient, type Db } from "mongodb"
import { getConfig } from "./config"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const { MONGODB_URI: mongoUri, MONGODB_DB_NAME: dbName } = getConfig()

  const client = await MongoClient.connect(mongoUri)
  const db = client.db(dbName)

  cachedClient = client
  cachedDb = db

  return { client, db }
}

export async function getDatabase() {
  const { db } = await connectToDatabase()
  return db
}
