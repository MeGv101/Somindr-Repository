import { FastifyInstance } from "fastify";

import bcrypt from "bcrypt";
import { db } from "../db/index.js";
import { users, sessions } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import {
    sendVerificationEmail,
    sendPasswordResetEmail,
    verifyToken,
    consumeToken,
} from "../services/mail.js";


export async function authRoutes(fastify: FastifyInstance) {

  //login
  fastify.post("/login", async (request, reply) => {
    const body = request.body as {
      email: string;
      password: string;
    };

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, body.email));

    if (user.length === 0) {
      return reply.status(401).send({
        message: "Credenciales inválidas",
      });
    }

    const usuario = user[0];

    const validPassword = await bcrypt.compare(
      body.password,
      usuario.passwordHash
    );

    if (!validPassword) {
      return reply.status(401).send({
        message: "Credenciales inválidas",
      });
    }

    if (!usuario.emailVerified) {
      return reply.status(403).send({
        code: "EMAIL_NOT_VERIFIED",
        message: "Debes verificar tu correo antes de iniciar sesión.",
        email: usuario.email,
      });
    }
    
    const tokenId = uuidv4();

    await db.insert(sessions).values({
      userId: usuario.id,
      tokenId,
    });

    const token = fastify.jwt.sign({
      id: usuario.id,
      tokenId,
    });

    return {
      token,
      user: {
        id: usuario.id,
        username: usuario.username,
        email: usuario.email,
        nombre: usuario.nombre,
      },
    };
  });

  //registro
  fastify.post("/register", async (request, reply) => {
    try {
    const body = request.body as {
      nombre: string;
      apellido: string;
      username: string;
      email: string;
      password: string;
    };


    //validaciones
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(body.email)) {
      return reply.status(400).send({
        message: "Correo inválido",
      });
    }

    if (
      !body.nombre ||
      !body.apellido ||
      !body.username ||
      !body.email ||
      !body.password
    ) {
      return reply.status(400).send({
        message: "Todos los campos son obligatorios",
      });
    }

    if (body.password.length < 8) {
      return reply.status(400).send({
        message: "La contraseña debe tener al menos 8 caracteres",
      });
    }

    const existingEmail = await db
      .select()
      .from(users)
      .where(eq(users.email, body.email));

    if (existingEmail.length > 0) {
      return reply.status(409).send({
        message: "El correo ya está registrado",
      });
    }

    const existingUsername = await db
      .select()
      .from(users)
      .where(eq(users.username, body.username));

    if (existingUsername.length > 0) {
      return reply.status(409).send({
        message: "El nombre de usuario ya existe",
      });
    }

    const passwordHash = await bcrypt.hash(
      body.password,
      10
    );
    //insercion de datos
    const [newUser] = await db
    .insert(users)
    .values({
      nombre: body.nombre,
      apellido: body.apellido,
      username: body.username,
      email: body.email,
      passwordHash,
    })
    .returning();

  try {
    await sendVerificationEmail({
      id: newUser.id,
      nombre: newUser.nombre,
      email: newUser.email,
    });
  } catch (error) {
    console.error(error);

    return reply.status(201).send({
      message:
        "El usuario fue creado, pero ocurrió un error al enviar el correo de verificación.",
    });
  }

    return reply.code(201).send({
      message:
        "Usuario registrado. Revisa tu correo para verificar tu cuenta."
    });

    } catch (error) {
    console.error(error);
    throw error;
  }
  });
  

  fastify.post("/logout", async (request, reply) => {

    const payload = await request.jwtVerify() as {
      id: number;
      tokenId: string;
    };

    await db.delete(sessions).where(
      eq(sessions.tokenId, payload.tokenId)
    );

    return {
      message: "Sesión cerrada"
    };
  });
 
  //emails
  fastify.get("/verify-email", async (request, reply) => {
    const { token } = request.query as {
          token: string;
      };

      if (!token) {
          return reply.status(400).send({
              message: "Token inválido."
          });
      }

      const authToken = await verifyToken(
          token,
          "VERIFY_EMAIL"
      );

      if (!authToken) {
          return reply.status(400).send({
              message:
                  "El enlace es inválido o expiró."
          });
      }

      await db
          .update(users)
          .set({
              emailVerified: true,
          })
          .where(eq(users.id, authToken.userId));

      await consumeToken(authToken.id);

      return {
          message:
              "Correo verificado correctamente."
      };
  });

  fastify.post("/resend-verification", async (request, reply) => {
      const { email } = request.body as {
          email: string;
      };

      const result = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

      if (result.length === 0) {
          return reply.status(404).send({
              message:
                  "Usuario no encontrado."
          });
      }

      const user = result[0];

      if (user.emailVerified) {
          return reply.status(400).send({
              message:
                  "El correo ya está verificado."
          });
      }

      await sendVerificationEmail({
          id: user.id,
          nombre: user.nombre,
          email: user.email,
      });

      return {
          message:
              "Correo reenviado."
      };
  });

  fastify.post("/forgot-password", async (request, reply) => {
      const { email } = request.body as {
          email: string;
      };

      const result = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

      if (result.length === 0) {
          return {
              message:
                  "Si el correo existe, recibirás un enlace para restablecer la contraseña."
          };
      }

      const user = result[0];

      await sendPasswordResetEmail({
          id: user.id,
          nombre: user.nombre,
          email: user.email,
      });

      return {
          message:
              "Si el correo existe, recibirás un enlace para restablecer la contraseña."
      };
  });

  fastify.post("/reset-password", async (request, reply) => {
      const body = request.body as {
          token: string;
          password: string;
      };

      const authToken = await verifyToken(
          body.token,
          "RESET_PASSWORD"
      );

      if (!authToken) {
          return reply.status(400).send({
              message:
                  "El enlace es inválido o expiró."
          });
      }

      const passwordHash = await bcrypt.hash(
          body.password,
          10
      );

      await db
          .update(users)
          .set({
              passwordHash,
          })
          .where(eq(users.id, authToken.userId));

      await consumeToken(authToken.id);

      return {
          message:
              "Contraseña actualizada correctamente."
      };
  });

}

