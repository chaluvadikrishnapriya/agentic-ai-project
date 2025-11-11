import { MongoClient, type Db } from "mongodb"
import { config } from "./config"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const mongoUri = config.MONGODB_URI
  const dbName = config.MONGODB_DB_NAME

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
