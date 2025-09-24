import { createClient } from "@supabase/supabase-js"

// Cache the connection
let cached = (global as any).supabase

if (!cached) {
  cached = (global as any).supabase = { conn: null, promise: null }
}

export async function getDb() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error(
        "[v0] Supabase configuration missing. Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY",
      )
      return null
    }

    console.log("[v0] Connecting to Supabase database...")
    try {
      cached.promise = createClient(supabaseUrl, supabaseKey)
      cached.conn = cached.promise
    } catch (error) {
      console.error("[v0] Supabase connection failed:", error)
      return null
    }
  }

  return cached.conn
}

export async function getDbInstance() {
  return await getDb()
}

export const db = getDb()
