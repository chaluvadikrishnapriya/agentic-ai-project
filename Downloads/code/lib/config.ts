// Configuration for environment variables
// Validates that required variables are set at build/runtime

const requiredEnvVars = {
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || "cyclepredict",
  JWT_SECRET: process.env.JWT_SECRET,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
}

if (!requiredEnvVars.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is required")
}

if (!requiredEnvVars.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required")
}

export const config = requiredEnvVars
