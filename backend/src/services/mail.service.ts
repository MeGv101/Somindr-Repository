
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


// ─────────────────────────────────────────────
// Colores Somindr
// ─────────────────────────────────────────────

const BG = "#0f0f0f";
const VERDE_OSCURO = "#285943";
const VERDE = "#72cb10";
const ROJO = "#dc2626";

const BLANCO = "#ffffff";
const TEXTO = "#f5f5f5";
const TEXTO_SECUNDARIO = "#b5b5b5";


// ─────────────────────────────────────────────
// Tokens
// ─────────────────────────────────────────────

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function generateExpirationDate(
  hours = TOKEN_EXPIRATION_HOURS
): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}


// ─────────────────────────────────────────────
// Envío de correo
// ─────────────────────────────────────────────

async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {

  if (process.env.EMAILS_ENABLED !== "true") {
    console.log(
      `[DEV] Correo de verificación omitido por motivos de testeo.`
    );
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


// ─────────────────────────────────────────────
// Auth tokens
// ─────────────────────────────────────────────

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
        isNull(authTokens.usedAt)
      )
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


// ─────────────────────────────────────────────
// Layout principal
// ─────────────────────────────────────────────

function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>

<html lang="es">

<head>
  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>Somindr</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background-color:${BG};
    font-family:Arial, Helvetica, sans-serif;
    color:${TEXTO};
  "
>

  <table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
      width:100%;
      background-color:${BG};
      margin:0;
      padding:0;
    "
  >

    <tr>

      <td
        align="center"
        style="
          padding:50px 20px;
        "
      >

        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width:560px;
            width:100%;
            margin:0 auto;
          "
        >

          <!-- LOGO -->

          <tr>

            <td
              align="center"
              style="
                padding-bottom:45px;
              "
            >

              <div
                style="
                  font-size:32px;
                  line-height:1;
                  font-weight:700;
                  color:${BLANCO};
                  letter-spacing:-1px;
                "
              >
                Somindr
              </div>

              <div
                style="
                  width:40px;
                  height:3px;
                  background-color:${VERDE};
                  margin:14px auto 0 auto;
                "
              ></div>

            </td>

          </tr>


          <!-- CONTENIDO -->

          <tr>

            <td
              align="center"
              style="
                padding:0 20px;
              "
            >

              ${content}

            </td>

          </tr>


          <!-- FOOTER -->

          <tr>

            <td
              align="center"
              style="
                padding-top:55px;
              "
            >

              <p
                style="
                  margin:0;
                  color:#666666;
                  font-size:12px;
                  line-height:1.5;
                "
              >
                Este es un correo automático de Somindr.
              </p>

              <p
                style="
                  margin:6px 0 0 0;
                  color:#444444;
                  font-size:11px;
                "
              >
                Por favor, no respondas a este correo.
              </p>

            </td>

          </tr>

        </table>

      </td>

    </tr>

  </table>

</body>

</html>
  `;
}


// ─────────────────────────────────────────────
// Componentes visuales
// ─────────────────────────────────────────────

function buttonHtml(
  url: string,
  label: string,
  color = VERDE
): string {

  return `
    <table
      role="presentation"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="
        margin:30px auto;
      "
    >

      <tr>

        <td
          align="center"
          style="
            background-color:${color};
            border-radius:6px;
          "
        >

          <a
            href="${url}"
            style="
              display:inline-block;
              padding:13px 30px;
              color:#ffffff;
              text-decoration:none;
              font-family:Arial, Helvetica, sans-serif;
              font-size:15px;
              font-weight:bold;
              border-radius:6px;
            "
          >
            ${label}
          </a>

        </td>

      </tr>

    </table>
  `;
}


function titleHtml(
  title: string,
  color = BLANCO
): string {

  return `
    <h1
      style="
        margin:0 0 20px 0;
        color:${color};
        font-size:30px;
        line-height:1.2;
        font-weight:700;
        letter-spacing:-0.5px;
      "
    >
      ${title}
    </h1>
  `;
}


function textHtml(
  text: string
): string {

  return `
    <p
      style="
        margin:0 0 14px 0;
        color:${TEXTO};
        font-size:15px;
        line-height:1.7;
      "
    >
      ${text}
    </p>
  `;
}


function infoBoxHtml(
  content: string,
  color = VERDE
): string {

  return `
    <div
      style="
        margin:25px 0;
        padding:16px 20px;
        background-color:#171717;
        border-left:3px solid ${color};
        text-align:left;
      "
    >
      ${content}
    </div>
  `;
}


// ─────────────────────────────────────────────
// Verificación de cuenta
// ─────────────────────────────────────────────

export async function sendVerificationEmail(
  user: MailUser
): Promise<void> {

  const token = await createToken(
    user.id,
    "VERIFY_EMAIL"
  );

  const verificationUrl =
    `${FRONTEND_URL}/verify-email?token=${token}`;

  const content = `

    ${titleHtml("Bienvenido a Somindr")}

    ${textHtml(
      `Hola <strong style="color:${VERDE}">${user.nombre}</strong>.`
    )}

    ${textHtml(
      `Gracias por registrarte en Somindr. Solo falta un pequeño paso para activar tu cuenta.`
    )}

    ${buttonHtml(
      verificationUrl,
      "Verificar cuenta"
    )}

    ${infoBoxHtml(`
      <p
        style="
          margin:0;
          color:${TEXTO_SECUNDARIO};
          font-size:13px;
          line-height:1.5;
        "
      >
        Este enlace expira en
        <strong style="color:${VERDE}">
          24 horas
        </strong>.
      </p>
    `)}

  `;

  await sendEmail(
    user.email,
    "Verifica tu cuenta en Somindr",
    emailWrapper(content)
  );
}


// ─────────────────────────────────────────────
// Restablecimiento de contraseña
// ─────────────────────────────────────────────

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

  const content = `

    ${titleHtml("Restablecer contraseña")}

    ${textHtml(
      `Hola <strong style="color:${VERDE}">${user.nombre}</strong>.`
    )}

    ${textHtml(
      `Recibimos una solicitud para cambiar la contraseña de tu cuenta de Somindr.`
    )}

    ${buttonHtml(
      resetUrl,
      "Restablecer contraseña"
    )}

    ${infoBoxHtml(`
      <p
        style="
          margin:0;
          color:${TEXTO_SECUNDARIO};
          font-size:13px;
          line-height:1.5;
        "
      >
        Este enlace expira en
        <strong style="color:${ROJO}">
          1 hora
        </strong>.
      </p>
    `, ROJO)}

    <p
      style="
        margin:22px 0 0 0;
        color:${TEXTO_SECUNDARIO};
        font-size:13px;
        line-height:1.6;
      "
    >
      Si no solicitaste este cambio, puedes ignorar este correo.
    </p>

  `;

  await sendEmail(
    user.email,
    "Restablece tu contraseña",
    emailWrapper(content)
  );
}


// ─────────────────────────────────────────────
// Profesional aprobado
// ─────────────────────────────────────────────

export async function sendProfessionalApprovedEmail(
  user: MailUser
): Promise<void> {

  const content = `

    ${titleHtml("Solicitud aprobada")}

    ${textHtml(
      `Hola <strong style="color:${VERDE}">${user.nombre}</strong>.`
    )}

    ${infoBoxHtml(`
      <p
        style="
          margin:0;
          color:${VERDE};
          font-size:15px;
          line-height:1.6;
          font-weight:bold;
        "
      >
        Tu solicitud para convertirte en especialista de Somindr fue aprobada.
      </p>
    `)}

    ${textHtml(
      `Ya puedes configurar tu perfil profesional desde la sección de configuración.`
    )}

  `;

  await sendEmail(
    user.email,
    "Tu solicitud de especialista fue aprobada",
    emailWrapper(content)
  );
}


// ─────────────────────────────────────────────
// Profesional rechazado
// ─────────────────────────────────────────────

export async function sendProfessionalRejectedEmail(
  user: MailUser,
  reason?: string
): Promise<void> {

  const reasonContent = reason
    ? `
      <p
        style="
          margin:0 0 8px 0;
          color:${ROJO};
          font-size:13px;
          font-weight:bold;
        "
      >
        Motivo
      </p>

      <p
        style="
          margin:0;
          color:${TEXTO};
          font-size:14px;
          line-height:1.6;
        "
      >
        ${reason}
      </p>
    `
    : `
      <p
        style="
          margin:0;
          color:${TEXTO_SECUNDARIO};
          font-size:14px;
          line-height:1.5;
        "
      >
        El administrador no dio más detalles.
      </p>
    `;

  const content = `

    ${titleHtml(
      "Solicitud no aprobada"
    )}

    ${textHtml(
      `Hola <strong style="color:${VERDE}">${user.nombre}</strong>.`
    )}

    ${textHtml(
      `Revisamos tu solicitud para convertirte en especialista de Somindr.`
    )}

    ${infoBoxHtml(
      reasonContent,
      ROJO
    )}

    ${textHtml(
      `En esta ocasión, la solicitud no fue aprobada. Puedes volver a enviar una solicitud cuando lo consideres.`
    )}

  `;

  await sendEmail(
    user.email,
    "Resultado de tu solicitud de especialista",
    emailWrapper(content)
  );
}

