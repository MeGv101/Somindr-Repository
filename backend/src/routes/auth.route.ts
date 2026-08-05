import { FastifyInstance } from "fastify";

import * as authService from "../services/auth.service.js";
import {
  RegisterBody,
  LoginBody,
  VerifyEmailBody,
  ForgotPasswordBody,
  ResetPasswordBody,
} from "../types/authVariables.js";

export async function authRoutes(
  fastify: FastifyInstance
) {

  // LOGIN
  fastify.post("/login", async (request, reply) => {

    try {

      const result =
        await authService.login(
          fastify,
          request.body as {
            email: string;
            password: string;
          }
        );

      return reply.send(result);

    } catch (error) {

      if (
        error instanceof Error &&
        error.message ===
          "EMAIL_NOT_VERIFIED"
      ) {

        return reply.status(403).send({
          code: "EMAIL_NOT_VERIFIED",
          message:
            "Debes verificar tu correo antes de iniciar sesión.",
        });

      }

      if (
        error instanceof Error &&
        error.message === "USER_SUSPENDED"
      ) {
        return reply.status(403).send({
          message: "Esta cuenta ha sido suspendida."
        });
      }

      return reply.status(401).send({
        message:
          "Credenciales inválidas",
      });

    }

  });

  // REGISTER

  fastify.post("/register", async (request, reply) => {

    try {

      const result =
        await authService.register(
          request.body as {
            nombre: string;
            apellido: string;
            username: string;
            email: string;
            password: string;
            genero: string;
            fechaNacimiento: string;
            pesoKg: number;
            estaturaCm: number;
            nivelActividad: string;
          }
        );
      return reply
        .status(201)
        .send(result);

    } catch (error) {

      if (!(error instanceof Error))
        throw error;

      switch (error.message) {

        case "EMAIL_EXISTS":

          return reply.status(409).send({
            message:
              "El correo ya está registrado",
          });

        case "USERNAME_EXISTS":

          return reply.status(409).send({
            message:
              "El nombre de usuario ya existe",
          });

        default:

          return reply.status(400).send({
            message:
              error.message,
          });

      }

    }

  });

  // LOGOUT

  fastify.post("/logout", async (request) => {

    const payload =
      await request.jwtVerify<{
        id: number;
        tokenId: string;
      }>();

    return authService.logout(
      payload.tokenId
    );

  });

  // VERIFY EMAIL (POST)

  fastify.post("/verify-email", async (request, reply) => {

    try {

      return await authService.verifyEmail(
        (
          request.body as {
            token: string;
          }
        ).token
      );

    } catch {

      return reply.status(400).send({
        message:
          "El enlace de verificación es inválido o ha expirado.",
      });

    }

  });

  // VERIFY EMAIL (GET)

  fastify.get("/verify-email", async (request, reply) => {

    const { token } =
      request.query as {
        token: string;
      };

    if (!token) {

      return reply.status(400).send({
        message:
          "Token inválido.",
      });

    }

    try {

      return await authService.verifyEmail(
        token
      );

    } catch {

      return reply.status(400).send({
        message:
          "El enlace es inválido o expiró.",
      });

    }

  });

  // RESEND VERIFICATION

  fastify.post(
    "/resend-verification",
    async (request, reply) => {

      try {

        return await authService.resendVerification(
          (
            request.body as {
              email: string;
            }
          ).email
        );

      } catch (error) {

        if (
          error instanceof Error &&
          error.message ===
            "USER_NOT_FOUND"
        ) {

          return reply.status(404).send({
            message:
              "Usuario no encontrado.",
          });

        }

        return reply.status(400).send({
          message:
            "El correo ya está verificado.",
        });

      }

    }
  );

  // FORGOT PASSWORD

  fastify.post(
    "/forgot-password",
    async (request) => {

      return authService.forgotPassword(
        (
          request.body as {
            email: string;
          }
        ).email
      );

    }
  );

  // RESET PASSWORD

  fastify.post(
    "/reset-password",
    async (request, reply) => {

      try {

        return await authService.resetPassword(
          request.body as {
            token: string;
            password: string;
          }
        );

      } catch {

        return reply.status(400).send({
          message:
            "El enlace es inválido o expiró.",
        });

      }

    }
  );

}