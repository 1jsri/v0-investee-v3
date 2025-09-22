import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get("auth")

  if (!authCookie || authCookie.value !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const mockPortfolios = [
    {
      id: 1,
      name: "Dividend Growth Portfolio",
      description: "Focus on dividend growth stocks",
      userId: 1,
    },
  ]

  return NextResponse.json(mockPortfolios)
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get("auth")

  if (!authCookie || authCookie.value !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await request.json()

  const mockPortfolio = {
    id: Date.now(),
    name: data.name,
    description: data.description,
    userId: 1,
  }

  return NextResponse.json(mockPortfolio)
}
