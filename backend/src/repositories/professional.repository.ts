import { getAccessToken, getPaypalBaseUrl } from "../providers/paypal.provider.js";
import { db } from "../db/index.js";
import { professionals, professionalClients } from "../db/schema.js";
import { eq } from "drizzle-orm";

export async function createOrder(
  professionalId: number
) {

  const professional = await db
    .select()
    .from(professionals)
    .where(eq(professionals.id, professionalId));

  if (professional.length === 0) {
    throw new Error("Profesional no encontrado.");
  }

  const token = await getAccessToken();

  const response = await fetch(
    `${getPaypalBaseUrl()}/v2/checkout/orders`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: professionalId.toString(),
            amount: {
              currency_code: "USD",
              value: professional[0].pricePerHour.toString(),
            },
          },
        ],
        application_context: {
          return_url: `${process.env.FRONTEND_URL}/payment/success`,
          cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
          user_action: "PAY_NOW",
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();

}

export async function captureOrder(
  orderId: string
) {

  const token = await getAccessToken();

  const response = await fetch(
    `${getPaypalBaseUrl()}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();

}

export async function savePurchase(
  professionalId: number,
  userId: number
) {

  const startedAt = new Date();

  const expiresAt = new Date(startedAt);
  expiresAt.setMonth(expiresAt.getMonth() + 1);

  await db
    .insert(professionalClients)
    .values({
      professionalId,
      userId,
      startedAt,
      expiresAt,
      active: true,
    });

}

export async function findPurchasedProfessionals(
  userId: number
) {

  return await db
    .select()
    .from(professionalClients)
    .where(eq(professionalClients.userId, userId));

}