import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

// Cache the connection
let cached = (global as any).db

if (!cached) {
  cached = (global as any).db = { conn: null, promise: null }
}

export async function getDb() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const databaseUrl =
      process.env.NEON_NEON_DATABASE_URL ||
      process.env.NEON_POSTGRES_URL ||
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL

    if (!databaseUrl) {
      console.error(
        "[v0] No database URL found. Available Neon env vars:",
        Object.keys(process.env).filter((key) => key.includes("NEON") || key.includes("POSTGRES")),
      )
      return null
    }

    console.log("[v0] Connecting to Neon database...")
    try {
      const sql = neon(databaseUrl)
      cached.promise = drizzle(sql, { schema })
      cached.conn = cached.promise
    } catch (error) {
      console.error("[v0] Database connection failed:", error)
      return null
    }
  }

  return cached.conn
}

export async function getDbInstance() {
  return await getDb()
}

export const db = getDb()
