import * as repository from "../repositories/admin.repository.js";

export async function getDashboard() {

  return await repository.getDashboard();

}

export async function getUsers() {

  const users =
    await repository.findUsers();

  return users;

}

export async function suspendUser(
  userId: number
) {

  const user =
    await repository.findUserById(
      userId
    );

  if (!user) {
    throw new Error(
      "USER_NOT_FOUND"
    );
  }

  if (user.role === "ADMIN") {
    throw new Error(
      "CANNOT_MODIFY_ADMIN"
    );
  }

  await repository.suspendUser(
    userId
  );

  return {
    message:
      "Usuario suspendido."
  };

}

export async function unsuspendUser(
  userId: number
) {

  const user =
    await repository.findUserById(
      userId
    );

  if (!user) {
    throw new Error(
      "USER_NOT_FOUND"
    );
  }

  if (user.role === "ADMIN") {
    throw new Error(
      "CANNOT_MODIFY_ADMIN"
    );
  }

  await repository.unsuspendUser(
    userId
  );

  return {
    message:
      "Usuario reactivado."
  };

}

export async function deactivateProfessional(
  userId: number
) {

  const user =
    await repository.findUserById(
      userId
    );

  if (!user) {
    throw new Error(
      "USER_NOT_FOUND"
    );
  }

  if (user.role === "ADMIN") {
    throw new Error(
      "CANNOT_MODIFY_ADMIN"
    );
  }

  const professional =
    await repository.findProfessional(
      userId
    );

  if (!professional) {
    throw new Error(
      "NOT_PROFESSIONAL"
    );
  }

  if (!professional.active) {
    throw new Error(
      "PROFESSIONAL_ALREADY_INACTIVE"
    );
  }

  await repository.deactivateProfessional(
    userId
  );

  return {
    message:
      "Profesional desactivado."
  };

}

export async function reactivateProfessional(
  userId: number
) {

  const user =
    await repository.findUserById(
      userId
    );

  if (!user) {
    throw new Error(
      "USER_NOT_FOUND"
    );
  }

  if (user.role === "ADMIN") {
    throw new Error(
      "CANNOT_MODIFY_ADMIN"
    );
  }

  const professional =
    await repository.findProfessional(
      userId
    );

  if (!professional) {
    throw new Error(
      "NOT_PROFESSIONAL"
    );
  }

  if (professional.active) {
    throw new Error(
      "PROFESSIONAL_ALREADY_ACTIVE"
    );
  }

  await repository.reactivateProfessional(
    userId
  );

  return {
    message:
      "Profesional reactivado."
  };

}

export async function getMe(
  userId: number
) {

  const user =
    await repository.findUserById(
      userId
    );

  if (!user) {
    throw new Error(
      "USER_NOT_FOUND"
    );
  }

  return {

    id: user.id,

    nombre: user.nombre,

    apellido: user.apellido,

    username: user.username,

    role: user.role,

  };

}