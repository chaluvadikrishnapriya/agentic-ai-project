// Configuration accessor for environment variables
// Do NOT throw at module import time (Next.js build may import server files).
// Call getConfig() at runtime (inside request handlers or startup) to validate.

export function getConfig() {
  const MONGODB_URI = process.env.MONGODB_URI
  const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "cyclepredict"
  const JWT_SECRET = process.env.JWT_SECRET
  const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is required at runtime")
  }

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required at runtime")
  }

  return {
    MONGODB_URI,
    MONGODB_DB_NAME,
    JWT_SECRET,
    NEXT_PUBLIC_APP_URL,
  }
}
