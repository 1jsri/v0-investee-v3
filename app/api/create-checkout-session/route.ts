import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { priceId, planName } = await request.json()

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("[v0] Stripe not configured - missing STRIPE_SECRET_KEY")
      return NextResponse.json(
        {
          error: "Payment system not configured. Please contact support.",
          fallbackUrl: `/auth/signin?plan=${planName}&payment_required=true`,
        },
        { status: 500 },
      )
    }

    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/?canceled=true`,
      metadata: {
        planName,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("[v0] Error creating checkout session:", error)
    const { planName } = await request.json().catch(() => ({ planName: "unknown" }))

    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        fallbackUrl: `/auth/signin?plan=${planName}&payment_error=true`,
      },
      { status: 500 },
    )
  }
}
