import crypto from "node:crypto";

import { eq, and, isNull } from "drizzle-orm";
import { Resend } from "resend";

import { db } from "../db/index.js";
import { authTokens } from "../db/schema.js";

import type {
  AuthTokenType,
  MailUser,
} from "../types/authTokens.js";

const resend = new Resend(process.env.RESEND_API_KEY);

const FRONTEND_URL = process.env.FRONTEND_URL!;
const TOKEN_EXPIRATION_HOURS = 24;


function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function generateExpirationDate(
  hours = TOKEN_EXPIRATION_HOURS
): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  const { error } = await resend.emails.send({
    from: "Somindr <onboarding@resend.dev>",
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }
}

async function createToken(
  userId: number,
  type: AuthTokenType,
  hours = TOKEN_EXPIRATION_HOURS
): Promise<string> {
  const token = generateToken();

  await db
    .update(authTokens)
    .set({
      usedAt: new Date(),
    })
    .where(
      and(
        eq(authTokens.userId, userId),
        eq(authTokens.type, type),
        isNull(authTokens.usedAt))
    );

  await db.insert(authTokens).values({
    userId,
    token,
    type,
    expiresAt: generateExpirationDate(hours),
  });

  return token;
}

async function findValidToken(
  token: string,
  type: AuthTokenType
) {
  const result = await db
    .select()
    .from(authTokens)
    .where(
      and(
        eq(authTokens.token, token),
        eq(authTokens.type, type),
        isNull(authTokens.usedAt)
      )
    );

  if (result.length === 0) {
    return null;
  }

  const authToken = result[0];

  if (authToken.expiresAt < new Date()) {
    return null;
  }

  return authToken;
}

async function consumeToken(
  tokenId: number
): Promise<void> {
  await db
    .update(authTokens)
    .set({
      usedAt: new Date(),
    })
    .where(eq(authTokens.id, tokenId));
}

export async function sendVerificationEmail(
  user: MailUser
): Promise<void> {
  const token = await createToken(
    user.id,
    "VERIFY_EMAIL"
  );

  const verificationUrl =
    `${FRONTEND_URL}/verify-email?token=${token}`;

  await sendEmail(
    user.email,
    "Verifica tu cuenta en Somindr",
    `
      <h2>Hola ${user.nombre}</h2>

      <p>Gracias por registrarte en Somindr.</p>

      <p>Haz clic en el siguiente enlace para activar tu cuenta.</p>

      <a href="${verificationUrl}">
        Verificar cuenta
      </a>
    `
  );
}

export async function sendPasswordResetEmail(
  user: MailUser
): Promise<void> {
  const token = await createToken(
    user.id,
    "RESET_PASSWORD",
    1
  );

  const resetUrl =
    `${FRONTEND_URL}/reset-password?token=${token}`;

  await sendEmail(
    user.email,
    "Restablece tu contraseña",
    `
      <h2>Hola ${user.nombre}</h2>

      <p>Recibimos una solicitud para cambiar tu contraseña.</p>

      <p>Haz clic en el siguiente enlace.</p>

      <a href="${resetUrl}">
        Restablecer contraseña
      </a>

      <p>Si no fuiste tú, ignora este correo.</p>
    `
  );
}

export async function verifyToken(
  token: string,
  type: AuthTokenType
): Promise<(typeof authTokens.$inferSelect) | null> {
  return findValidToken(token, type);
}

export { consumeToken };