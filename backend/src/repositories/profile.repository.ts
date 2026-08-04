import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { users, professionals, professionalContacts } from "../db/schema.js";

export async function getProfileByUserId(
  userId: number
) {
  const [result] = await db
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
  .where(eq(users.id, userId));

if (!result) {
  return null;
}

return {
  ...result,
  professional:
    result.professional?.id != null
      ? result.professional
      : null,
};
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
export async function findProfessionalByUsername(
  username: string
) {

  const professional =
    await db
      .select({
        id: professionals.id,
        profession:
          professionals.profession,
        description:
          professionals.description,
        verified:
          professionals.verified,
        pricePerHour:
          professionals.pricePerHour,
        acceptingClients:
          professionals.acceptingClients,
      })
      .from(professionals)
      .innerJoin(
        users,
        eq(
          professionals.userId,
          users.id
        )
      )
      .where(
        eq(
          users.username,
          username
        )
      );

  if (!professional.length) {
    return null;
  }
  const contacts =
    await db
      .select({
        type:
          professionalContacts.type,
        value:
          professionalContacts.value,
        visible:
          professionalContacts.visible,
      })
      .from(professionalContacts)
      .innerJoin(
        professionals,
        eq(
          professionalContacts.professionalId,
          professionals.id
        )
      )
      .innerJoin(
        users,
        eq(
          professionals.userId,
          users.id
        )
      )
      .where(
        eq(
          users.username,
          username
        )
      );
  return {
    ...professional[0],
    contacts,
  };

}