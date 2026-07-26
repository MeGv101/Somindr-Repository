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

const EMAILS_ENABLED = process.env.EMAILS_ENABLED === "true";

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

  if (!EMAILS_ENABLED) {
    console.log(`[DEV] Correo de verificación omitido por motivos de testeo.`);
    return;
  }

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

function emailWrapper(content: string): string {
  return `
  <div style="background-color:#f4f4f7; padding:40px 0; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px; margin:0 auto; background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
      <tr>
        <td style="background-color:#111827; padding:24px; text-align:center;">
          <span style="color:#fffff; font-size:20px; font-weight:700; letter-spacing:0.5px;">Somindr</span>
        </td>
      </tr>
      <tr>
        <td style="padding:32px;">
          ${content}
        </td>
      </tr>
      <tr>
        <td style="padding:20px 32px; background-color:#f9fafb; text-align:center;">
          <p style="margin:0; color:#9ca3af; font-size:12px;">
            Este es un correo automático, por favor no respondas.
          </p>
        </td>
      </tr>
    </table>
  </div>
  `;
}

function buttonHtml(url: string, label: string, color = "#72cb10"): string {
  return `
    <div style="text-align:center; margin:28px 0;">
      <a href="${url}" style="background-color:${color}; color:#ffffff; text-decoration:none; padding:12px 28px; border-radius:6px; font-size:15px; font-weight:600; display:inline-block;">
        ${label}
      </a>
    </div>
  `;
}

export async function sendVerificationEmail(
  user: MailUser
): Promise<void> {
  const token = await createToken(user.id, "VERIFY_EMAIL");
  const verificationUrl = `${FRONTEND_URL}/verify-email?token=${token}`;

  const content = `
    <h2 style="margin:0 0 12px; color:#111827; font-size:20px;">Hola ${user.nombre} </h2>
    <p style="margin:0 0 8px; color:#374151; font-size:15px; line-height:1.5;">
      Gracias por registrarte en Somindr.
    </p>
    <p style="margin:0; color:#374151; font-size:15px; line-height:1.5;">
      Haz clic en el botón para activar tu cuenta.
    </p>
    ${buttonHtml(verificationUrl, "Verificar cuenta")}
    <p style="margin:0; color:#9ca3af; font-size:13px; text-align:center;">
      Este enlace expira en 24 horas.
    </p>
  `;

  await sendEmail(user.email, "Verifica tu cuenta en Somindr", emailWrapper(content));
}

export async function sendPasswordResetEmail(
  user: MailUser
): Promise<void> {
  const token = await createToken(user.id, "RESET_PASSWORD", 1);
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;

  const content = `
    <h2 style="margin:0 0 12px; color:#111827; font-size:20px;">Hola ${user.nombre}</h2>
    <p style="margin:0 0 8px; color:#374151; font-size:15px; line-height:1.5;">
      Recibimos una solicitud para cambiar tu contraseña.
    </p>
    ${buttonHtml(resetUrl, "Restablecer contraseña", "#dc2626")}
    <p style="margin:0; color:#9ca3af; font-size:13px; text-align:center;">
      Si no fuiste tú, ignora este correo. Este enlace expira en 1 hora.
    </p>
  `;

  await sendEmail(user.email, "Restablece tu contraseña", emailWrapper(content));
}

