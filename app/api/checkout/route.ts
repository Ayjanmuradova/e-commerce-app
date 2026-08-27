import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { requireUserOr401 } from "@/lib/authz";
import { getProductById, getProductByStripePriceId } from "@/services/products/data";
import { getDisplayPrice } from "@/lib/pricing";
import { summarizeCartPricing } from "@/lib/checkout-pricing";

type IncomingItem = {
  id?: string;
  stripePriceId?: string;
  quantity?: number;
};

export async function POST(req: NextRequest) {
  try {
    const userOrResponse = await requireUserOr401();
    if (userOrResponse instanceof Response) return userOrResponse;

    const headersList = await headers();
    const origin = headersList.get("origin");

    const { items } = (await req.json()) as { items?: IncomingItem[] };

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const lines = [];
    for (const item of items) {
      const quantity = Math.max(0, Math.floor(Number(item.quantity) || 0));
      if (!quantity) {
        return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
      }

      const product = item.id
        ? await getProductById(item.id)
        : item.stripePriceId
          ? await getProductByStripePriceId(item.stripePriceId)
          : null;

      if (!product?.stripePriceId) {
        return NextResponse.json(
          { error: "A product in your cart is no longer available." },
          { status: 400 },
        );
      }

      const pricing = getDisplayPrice(
        product.price,
        product.discountAmount,
        product.discountType,
      );

      lines.push({
        stripePriceId: product.stripePriceId,
        quantity,
        original: pricing.original,
        current: pricing.current,
        percentOff: pricing.hasDiscount ? pricing.percentOff : 0,
      });
    }

    const summary = summarizeCartPricing(lines);
    const sessionParams: Parameters<typeof stripe.checkout.sessions.create>[0] = {
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: userOrResponse.email,
      client_reference_id: userOrResponse.sub,
      metadata: {
        userEmail: userOrResponse.email ?? "",
        userId: userOrResponse.sub ?? "",
        originalTotal: String(summary.originalTotal),
        discountAmount: String(summary.savings),
        percentOff: summary.percentOff ? String(summary.percentOff) : "",
      },
      line_items: lines.map((line) => ({
        price: line.stripePriceId,
        quantity: line.quantity,
      })),
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart?canceled=true`,
    };

    if (summary.savingsMinor > 0) {
      const coupon = await stripe.coupons.create(
        summary.percentOff
          ? {
              percent_off: summary.percentOff,
              duration: "once",
              max_redemptions: 1,
              name: `-${summary.percentOff}%`,
            }
          : {
              amount_off: summary.savingsMinor,
              currency: "sek",
              duration: "once",
              max_redemptions: 1,
              name: "Discount",
            },
      );
      sessionParams.discounts = [{ coupon: coupon.id }];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

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
      { status: statusCode },
    );
  }
}
