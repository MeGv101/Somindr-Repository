import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { users } from "../db/schema.js";

export async function getProfileByUserId(
  userId: number
) {
  const result = await db
    .select({
      nombre: users.nombre,
      apellido: users.apellido,
      username: users.username,
      email: users.email,
      genero: users.genero,
      fechaNacimiento: users.fechaNacimiento,
      pesoKg: users.pesoKg,
      estaturaCm: users.estaturaCm,
      nivelActividad: users.nivelActividad,
      biografia: users.biografia,
      fotoPerfil: users.fotoPerfil,
      isProfessional: users.isProfessional,
    })
    .from(users)
    .where(eq(users.id, userId));

  return result[0] ?? null;
}

export async function updateProfile(
  userId: number,
  data: {
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
  await db
    .update(users)
    .set({
      nombre: data.nombre,
      apellido: data.apellido,
      username: data.username,
      genero: data.genero,
      fechaNacimiento: data.fechaNacimiento,
      pesoKg: data.pesoKg,
      estaturaCm: data.estaturaCm,
      nivelActividad: data.nivelActividad,
      biografia: data.biografia,
      fotoPerfil: data.fotoPerfil,
    })
    .where(eq(users.id, userId));
}
