import * as repository from "../repositories/professional.repository.js";

export async function createPaypalOrder(
  professionalId: number
) {
  return await repository.createOrder(
    professionalId
  );
}

export async function capturePaypalOrder(
  orderId: string,
  userId: number
) {
  const order =
    await repository.captureOrder(
      orderId
    );

  if (order.status !== "COMPLETED") {
    throw new Error(
      "El pago no fue completado."
    );
  }

  await repository.savePurchase(
    Number(
      order.purchase_units[0].reference_id
    ),
    userId
  );

  return order;
}

export async function getPurchasedProfessionals(
  userId: number
) {
  return await repository.findPurchasedProfessionals(
    userId
  );
}