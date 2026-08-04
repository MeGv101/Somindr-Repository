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

export async function isProfessional(
  userId: number
){
    return (
        await repository.findProfessionalByUserId(userId)
    ) !== null;
}

export async function getClients(
  userId:number
){
  return await repository
    .findClients(userId);
}
export async function getProfessionals(
  userId: number
) {
  return await repository.findAllProfessionals(
    userId
  );
}

export async function validatePurchase(
  userId: number,
  professionalId: number
) {

  return await repository.hasActivePurchase(
    userId,
    professionalId
  );

}

export async function validateSelfPurchase(
  userId: number,
  professionalId: number
) {

  const professional =
    await repository.findProfessionalById(
      professionalId
    );

  if (!professional) {
    throw new Error(
      "PROFESSIONAL_NOT_FOUND"
    );
  }

  return professional.userId === userId;

}

export async function getClientDashboard(
  professionalUserId: number,
  clientId: number
) {
  
  return await repository.findClientDashboard(
    professionalUserId,
    clientId
  );
}