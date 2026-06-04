import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { requireUserOr401 } from "@/lib/authz";

export async function POST(req: NextRequest) {
  try {
    const userOrResponse = await requireUserOr401();
    if (userOrResponse instanceof Response) return userOrResponse;

    const headersList = await headers();
    const origin = headersList.get("origin");

    const { items } = await req.json();

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: items.map(
        (item: { stripePriceId: string; quantity: number }) => ({
          price: item.stripePriceId,
          quantity: item.quantity,
        }),
      ),
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart?canceled=true`,
    });

    if (session.url) {
      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json({ error: "Session URL is null" }, { status: 500 });
  } catch (err) {
    let message = "An unknown error occurred";
    let statusCode = 500;
    let errorCode = "unknown_error";

    if (err && typeof err === "object") {
      if ("message" in err) {
        message = (err as { message: string }).message;
      }
      if ("statusCode" in err) {
        statusCode = (err as { statusCode: number }).statusCode || 500;
      }
      if ("code" in err) {
        errorCode = (err as { code: string }).code;
      }
    }
    console.error(`Stripe error [${errorCode}]: ${message}`);
    return NextResponse.json(
      { error: message, code: errorCode }, 
      { status: statusCode });
  }
}
