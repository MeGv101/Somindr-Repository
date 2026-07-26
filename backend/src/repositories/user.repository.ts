import { db } from "../db/index.js";
import { users } from "../db/schema.js";

import {
  eq,
} from "drizzle-orm";
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
      isProfessional: users.isProfessional,
    })
    .from(users)
    .where(
      eq(
        users.username,
        username
      )
    );
  return result[0] ?? null;
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
      biografia:users.biografia,
      fotoPerfil:users.fotoPerfil,
      isProfessional:users.isProfessional,
    })
    .from(users)
    .where(
      eq(
        users.id,
        id
      )
    )
  return result[0] ?? null;
}
export async function updateProfile(
  id:number,
  data:any
){

  await db
    .update(users)
    .set({
      nombre:data.nombre,
      apellido:data.apellido,
      genero:data.genero,
      fechaNacimiento:data.fechaNacimiento,
      pesoKg:data.pesoKg,
      estaturaCm:data.estaturaCm,
      nivelActividad:data.nivelActividad,
      biografia:data.biografia,
      fotoPerfil:data.fotoPerfil,
    })
    .where(
      eq(users.id,id)
    );

}


