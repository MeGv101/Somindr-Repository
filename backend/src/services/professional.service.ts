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

export async function getMyProfessionalProfile(
  userId:number
){

  const professional =
    await repository.findProfessionalByUserIdIncludingInactive(
      userId
    );


  if(!professional){
    throw new Error(
      "NOT_PROFESSIONAL"
    );
  }


  const contacts =
    await repository.findProfessionalContacts(
      professional.id
    );


  return {
    ...professional,
    contacts,
  };

}

export async function updateMyProfessionalProfile(
  userId:number,
  data:{
    profession?:string;
    description?:string;
    pricePerHour?:number;
    acceptingClients?:boolean;

    contacts?:{
      type:string;
      value:string;
    }[];
  }
){

  const professional =
    await repository.findProfessionalByUserIdIncludingInactive(
      userId
    );


  if(!professional){
    throw new Error(
      "NOT_PROFESSIONAL"
    );
  }


  const updated =
    await repository.updateProfessionalProfile(
      professional.id,
      {
        profession:data.profession,
        description:data.description,
        pricePerHour:data.pricePerHour,
        acceptingClients:data.acceptingClients,
      }
    );


  if(data.contacts){

    await repository.deleteProfessionalContacts(
      professional.id
    );


    await repository.createProfessionalContacts(

      data.contacts.map(contact=>({

        professionalId:
          professional.id,

        type:
          contact.type,

        value:
          contact.value,

      }))

    );

  }


  return updated;

}


export async function deactivateMyProfessionalAccount(
  userId:number
){

  const professional =
    await repository.findProfessionalByUserIdIncludingInactive(
      userId
    );


  if(!professional){
    throw new Error(
      "NOT_PROFESSIONAL"
    );
  }


  return await repository.deactivateProfessional(
    userId
  );

}


export async function reactivateMyProfessionalAccount(
  userId:number
){

  const professional =
    await repository.findProfessionalByUserIdIncludingInactive(
      userId
    );


  if(!professional){
    throw new Error(
      "NOT_PROFESSIONAL"
    );
  }


  return await repository.reactivateProfessional(
    professional.id,
    {
      profession: professional.profession,
      description: professional.description ?? "",
      pricePerHour: professional.pricePerHour ?? 5,
    }
  );

}