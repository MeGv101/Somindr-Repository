import { FastifyInstance } from "fastify";

import bcrypt from "bcrypt";
import { db } from "../db/index.js";
import { users, sessions } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";


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
    await db.insert(users).values({
      nombre: body.nombre,
      apellido: body.apellido,
      username: body.username,
      email: body.email,
      passwordHash,
    });

    return reply.code(201).send({
      message: "Usuario registrado"
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

}