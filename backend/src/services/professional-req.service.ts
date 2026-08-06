import * as requestRepository from "../repositories/professional-req.repository.js";
import * as professionalRepository from "../repositories/professional.repository.js";

import { 
  sendProfessionalApprovedEmail,
  sendProfessionalRejectedEmail
} from "../services/mail.service.js";

import * as userRepository from "../repositories/user.repository.js";

export async function createRequest(
  userId: number,
  data: {
    profession: string;
    message: string;
  }
) {

  const pending =
    await requestRepository.findMyPendingRequest(
      userId
    );

  if (pending) {
    throw new Error(
      "PENDING_REQUEST_EXISTS"
    );
  }

  const professional =
    await professionalRepository.findProfessionalByUserIdIncludingInactive(
      userId
    );

  if (professional) {
    throw new Error(
      "ALREADY_PROFESSIONAL"
    );
  }

  await requestRepository.createRequest({

    userId,

    profession: data.profession,

    message: data.message,

  });

  return {
    message:
      "Solicitud enviada correctamente."
  };

}

export async function getMyRequest(
  userId: number
) {

  return await requestRepository.findMyRequest(
    userId
  );

}

export async function getPendingRequests() {

  return await requestRepository.findPendingRequests();

}

export async function getRequest(
  requestId: number
) {

  const request =
    await requestRepository.findRequestById(
      requestId
    );

  if (!request) {
    throw new Error(
      "REQUEST_NOT_FOUND"
    );
  }

  return request;

}

export async function approveRequest(
  requestId: number,
  adminId: number
) {

  const request =
    await requestRepository.findRequestById(
      requestId
    );

  if (!request) {
    throw new Error(
      "REQUEST_NOT_FOUND"
    );
  }

  if (
    request.status !== "PENDING"
  ) {
    throw new Error(
      "REQUEST_ALREADY_REVIEWED"
    );
  }


  await professionalRepository.createProfessional({

    userId: request.userId,

    profession: request.profession,

  });


  await requestRepository.approveRequest(
    request.id,
    adminId
  );


  const user =
    await userRepository.findMyProfile(
      request.userId
    );


  if (user) {

    await sendProfessionalApprovedEmail({

      id:user.id,

      nombre:user.nombre,

      email:user.email,

    });

  }


  return {
    message:"Solicitud aprobada."
  };

}
export async function rejectRequest(
  requestId: number,
  adminId: number,
  adminComment?: string
) {

  const request =
    await requestRepository.findRequestById(
      requestId
    );


  if (!request) {
    throw new Error(
      "REQUEST_NOT_FOUND"
    );
  }


  if (
    request.status !== "PENDING"
  ) {
    throw new Error(
      "REQUEST_ALREADY_REVIEWED"
    );
  }


  await requestRepository.rejectRequest(

    request.id,

    adminId,

    adminComment

  );


  const user =
    await userRepository.findMyProfile(
      request.userId
    );


  if (user) {

    await sendProfessionalRejectedEmail(

      {
        id:user.id,
        nombre:user.nombre,
        email:user.email,
      },

      adminComment

    );

  }


  return {

    message:
      "Solicitud rechazada."

  };

}