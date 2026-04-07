import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { GUEST_FALLBACK_NAME } from "@/lib/platform-access"

export const authOptions = {
  session: {
    strategy: "jwt" as const,
  },
  providers: [],
  callbacks: {
    session: ({ session, token }: any) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
    jwt: ({ token, user }: any) => {
      if (user) {
        return {
          ...token,
        }
      }
      return token
    },
  },
  pages: {
    signIn: "/virtual-labs/auth/signin",
    signUp: "/virtual-labs/auth/signup",
  },
}

// Simplified auth without NextAuth for compatibility
export async function authenticateUser(email: string, password: string) {
  try {
    const user = await db.user.findUnique({
      where: { email },
      include: {
        memberships: {
          include: {
            organization: true,
          },
        },
      },
    })

    if (!user || !user.hashedPassword) {
      return null
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword)

    if (!isPasswordValid) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      activeOrgId: user.activeOrgId,
    }
  } catch (error) {
    console.log("[v0] Auth error:", error)
    return null
  }
}

export async function createUser(email: string, password: string, name: string) {
  try {
    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await db.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    })

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    }
  } catch (error) {
    console.log("[v0] User creation error:", error)
    return null
  }
}

// Placeholder functions for compatibility
export const auth = async () => null
export const signIn = async () => {}
export const signOut = async () => {}
export const handlers = { GET: () => {}, POST: () => {} }

export type AuthTokenPayload = {
  id: string
  email?: string
  name?: string
  activeOrgId?: string
  guest?: boolean
  role?: "guest" | "user"
  exp?: number
}

export function createGuestPayload(): AuthTokenPayload {
  return {
    id: "guest-user",
    email: "guest@local.test",
    name: GUEST_FALLBACK_NAME,
    guest: true,
    role: "guest",
  }
}

export function generateToken(payload: any): string {
  // Simple JWT-like token for demo purposes
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const body = btoa(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }))
  const signature = btoa(`${header}.${body}.${process.env.JWT_SECRET || "fallback-secret"}`)
  return `${header}.${body}.${signature}`
}

export function verifyToken(token: string): any {
  try {
    const [header, body, signature] = token.split(".")
    const payload = JSON.parse(atob(body))

    // Check expiration
    if (payload.exp < Date.now()) {
      return null
    }

    // Verify signature (simplified)
    const expectedSignature = btoa(`${header}.${body}.${process.env.JWT_SECRET || "fallback-secret"}`)
    if (signature !== expectedSignature) {
      return null
    }

    return payload
  } catch (error) {
    return null
  }
}
