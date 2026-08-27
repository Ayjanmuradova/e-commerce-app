import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type Stripe from "stripe";
import {
  decrementProductStock,
  getProductByStripePriceId,
} from "@/services/products/data";

export type OrderItemRecord = {
  title: string;
  quantity: number;
  amount: number;
  productId?: string;
};

export async function createOrder(data: {
  stripeSessionId: string;
  userEmail?: string | null;
  userId?: string | null;
  status: string;
  totalAmount: number;
  currency: string;
  items: OrderItemRecord[];
}) {
  return prisma.order.create({
    data: {
      stripeSessionId: data.stripeSessionId,
      userEmail: data.userEmail ?? undefined,
      userId: data.userId ?? undefined,
      status: data.status,
      totalAmount: data.totalAmount,
      currency: data.currency,
      items: data.items as Prisma.InputJsonValue,
    },
  });
}

export async function getOrderBySessionId(stripeSessionId: string) {
  return prisma.order.findUnique({
    where: { stripeSessionId },
  });
}

export async function getOrders() {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrdersByEmail(email: string) {
  return prisma.order.findMany({
    where: { userEmail: email },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrdersForUser(params: {
  userId?: string | null;
  email?: string | null;
}) {
  const userId = params.userId?.trim();
  const email = params.email?.trim();

  if (userId) {
    return prisma.order.findMany({
      where: {
        OR: [
          { userId },
          ...(email ? [{ userEmail: email }] : []),
        ],
      },
      orderBy: { createdAt: "desc" },
    });
  }

  if (email) {
    return getOrdersByEmail(email);
  }

  return [];
}

export async function getOrderCount() {
  return prisma.order.count();
}

export async function recordPaidCheckoutSession(
  session: Stripe.Checkout.Session,
) {
  const existing = await getOrderBySessionId(session.id);
  if (existing) return existing;

  const lineItems = session.line_items?.data ?? [];
  const orderItems: OrderItemRecord[] = [];

  for (const item of lineItems) {
    const priceId =
      typeof item.price === "object" && item.price ? item.price.id : undefined;
    const product = priceId ? await getProductByStripePriceId(priceId) : null;
    if (product && item.quantity) {
      await decrementProductStock(product.id, item.quantity);
    }
    orderItems.push({
      title: item.description ?? product?.title ?? "Item",
      quantity: item.quantity ?? 1,
      amount: (item.amount_total ?? 0) / 100,
      productId: product?.id,
    });
  }

  return createOrder({
    stripeSessionId: session.id,
    userEmail: session.customer_details?.email ?? session.metadata?.userEmail,
    userId: session.metadata?.userId ?? session.client_reference_id,
    status: "paid",
    totalAmount: (session.amount_total ?? 0) / 100,
    currency: (session.currency ?? "sek").toUpperCase(),
    items: orderItems,
  });
}
