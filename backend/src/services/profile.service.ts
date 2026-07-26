import * as repository from "../repositories/profile.repository.js";

export async function getProfile(
  userId: number
) {
  return await repository.getProfileByUserId(
    userId
  );
}

export async function editProfile(
  userId: number,
  body: {
    nombre: string;
    apellido: string;
    username: string;
    genero: string;
    fechaNacimiento: string;
    pesoKg: number;
    estaturaCm: number;
    nivelActividad: string;
    biografia: string | null;
  }
) {
  await repository.updateProfile(
    userId,
    body
  );
}

export async function changeProfilePicture(
  userId: number,
  profilePicture: number
) {
  if (
    profilePicture < 1 ||
    profilePicture > 8
  ) {
    throw new Error(
      "Foto inválida."
    );
  }

  await repository.updateProfilePicture(
    userId,
    profilePicture
  );
}