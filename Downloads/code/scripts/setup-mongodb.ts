import { MongoClient } from "mongodb"

async function setupDatabase() {
  const mongoUri = process.env.MONGODB_URI
  if (!mongoUri) {
    console.error("MONGODB_URI is not defined")
    process.exit(1)
  }

  const client = await MongoClient.connect(mongoUri)
  const db = client.db(process.env.MONGODB_DB_NAME || "cyclepredict")

  try {
    // Create collections
    await db.createCollection("users").catch(() => {})
    await db.createCollection("bills").catch(() => {})
    await db.createCollection("predictions").catch(() => {})
    await db.createCollection("messages").catch(() => {})

    // Create indexes
    const usersCollection = db.collection("users")
    await usersCollection.createIndex({ email: 1 }, { unique: true })

    const billsCollection = db.collection("bills")
    await billsCollection.createIndex({ userId: 1 })
    await billsCollection.createIndex({ createdAt: -1 })

    const predictionsCollection = db.collection("predictions")
    await predictionsCollection.createIndex({ userId: 1 })
    await predictionsCollection.createIndex({ billId: 1 })

    const messagesCollection = db.collection("messages")
    await messagesCollection.createIndex({ userId: 1 })
    await messagesCollection.createIndex({ timestamp: -1 })

    console.log("Database setup completed successfully")
  } catch (error) {
    console.error("Database setup failed:", error)
  } finally {
    await client.close()
  }
}

setupDatabase()
