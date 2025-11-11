import { jwtVerify } from "jose"
import { config } from "./config"

const secret = new TextEncoder().encode(config.JWT_SECRET)

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload
  } catch (err) {
    return null
  }
}

export function getTokenFromCookie(cookieString: string | undefined): string | null {
  if (!cookieString) return null
  const cookies = cookieString.split("; ").reduce(
    (acc, cookie) => {
      const [key, value] = cookie.split("=")
      acc[key] = value
      return acc
    },
    {} as Record<string, string>,
  )
  return cookies.token || null
}
