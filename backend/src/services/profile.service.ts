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
    fotoPerfil: number;
  }
) {

  body.username = body.username.trim().toLowerCase();


  await repository.updateProfile(
    userId,
    body
  );
}

export async function getProfessionalByUsername(
  username: string
) {
  return await repository
    .findProfessionalByUsername(
      username
    );
}