import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = "edge"

export async function POST(req: Request) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  try {
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: "MISSING_USER" }, { status: 400 })

    const { data, error } = await supabase.rpc("fn_consume_chat_prompt", { p_user: userId })
    if (error) throw error

    return NextResponse.json({ remaining: data }) // null = unlimited
  } catch (e: any) {
    if ((e.message || "").includes("CHAT_QUOTA_EXCEEDED")) {
      return NextResponse.json({ error: "CHAT_QUOTA_EXCEEDED" }, { status: 402 })
    }
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 })
  }
}
