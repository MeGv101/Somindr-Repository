import { db } from "../db/index.js";
import { users, professionals } from "../db/schema.js";

import { eq } from "drizzle-orm";

export async function findPublicProfile(
  username: string
) {
  const result = await db
    .select({
      nombre: users.nombre,
      apellido: users.apellido,
      username: users.username,
      fotoPerfil: users.fotoPerfil,
      genero: users.genero,
      biografia: users.biografia,

      professional: {
        id: professionals.id,
        profession: professionals.profession,
        verified: professionals.verified,
        acceptingClients: professionals.acceptingClients,
      },
    })
    .from(users)
    .leftJoin(
      professionals,
      eq(professionals.userId, users.id)
    )
    .where(
      eq(users.username, username)
    );

  if (!result.length) {
    return null;
  }

  return {
    ...result[0],
    professional:
      result[0].professional?.id != null
        ? result[0].professional
        : null,
  };
}

export async function findMyProfile(
  id: number
) {
  const result = await db
    .select({
      id: users.id,
      nombre: users.nombre,
      apellido: users.apellido,
      username: users.username,
      email: users.email,
      genero: users.genero,
      biografia: users.biografia,
      fotoPerfil: users.fotoPerfil,

      professional: {
        id: professionals.id,
        profession: professionals.profession,
        verified: professionals.verified,
        acceptingClients: professionals.acceptingClients,
      },
    })
    .from(users)
    .leftJoin(
      professionals,
      eq(professionals.userId, users.id)
    )
    .where(
      eq(users.id, id)
    );

  if (!result.length) {
    return null;
  }

  return {
    ...result[0],
    professional:
      result[0].professional?.id != null
        ? result[0].professional
        : null,
  };
}

export async function updateProfile(
  id: number,
  data: any
) {
  await db
    .update(users)
    .set({
      nombre: data.nombre,
      apellido: data.apellido,
      genero: data.genero,
      fechaNacimiento: data.fechaNacimiento,
      pesoKg: data.pesoKg,
      estaturaCm: data.estaturaCm,
      nivelActividad: data.nivelActividad,
      biografia: data.biografia,
      fotoPerfil: data.fotoPerfil,
    })
    .where(eq(users.id, id));
}