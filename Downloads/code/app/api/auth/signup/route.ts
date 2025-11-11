import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { config } from "@/lib/config"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const db = await getDatabase()
    const usersCollection = db.collection("users")

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // TODO: Implement password hashing (bcrypt)
    // Create new user
    const result = await usersCollection.insertOne({
      name,
      email,
      password, // TODO: Hash this password
      createdAt: new Date(),
      bills: [],
      predictions: [],
    })

    const userId = result.insertedId.toString()

    // Generate JWT token
    const token = jwt.sign({ userId, email }, config.JWT_SECRET, { expiresIn: "7d" })

    return NextResponse.json({
      token,
      user: { id: userId, email, name },
    })
  } catch (error) {
    return NextResponse.json({ error: "Signup failed" }, { status: 500 })
  }
}
