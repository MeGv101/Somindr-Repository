import { db } from "../db/index.js";
import { users, sessions, authTokens, } from "../db/schema.js";

import {
    eq,
    and,
    gt,
    isNull,
} from "drizzle-orm";

export async function findUserByEmail(email: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  return result[0] ?? null;
}

export async function findUserByUsername(username: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, username));

  return result[0] ?? null;
}

export async function findUserById(id: number) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id));

  return result[0] ?? null;
}

export async function createUser(data: {
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  passwordHash: string;
  genero: string;
  fechaNacimiento: string;
  pesoKg: number;
  estaturaCm: number;
  nivelActividad: string;
}) {
  const [user] = await db
    .insert(users)
    .values(data)
    .returning();

  return user;
}

export async function createSession(
  userId: number,
  tokenId: string
) {
  await db.insert(sessions).values({
    userId,
    tokenId,
  });
}

export async function deleteSession(
  tokenId: string
) {
  await db
    .delete(sessions)
    .where(eq(sessions.tokenId, tokenId));
}

export async function verifyUserEmail(
  userId: number
) {
  await db
    .update(users)
    .set({
      emailVerified: true,
    })
    .where(eq(users.id, userId));
}

export async function updatePassword(
  userId: number,
  passwordHash: string
) {
  await db
    .update(users)
    .set({
      passwordHash,
    })
    .where(eq(users.id, userId));
}
export async function consumeToken(
  tokenId: number
): Promise<void> {
  await db
    .update(authTokens)
    .set({
      usedAt: new Date(),
    })
    .where(eq(authTokens.id, tokenId));
}
export async function verifyToken(
    token: string,
    type: string
) {

    const result = await db
        .select()
        .from(authTokens)
        .where(
            and(
                eq(authTokens.token, token),
                eq(authTokens.type, type),
                gt(
                    authTokens.expiresAt,
                    new Date()
                ),
                isNull(authTokens.usedAt)
            )
        );

    return result[0] ?? null;

}