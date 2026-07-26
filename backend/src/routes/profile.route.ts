import { FastifyInstance } from "fastify";

import * as service from "../services/profile.service.js";

export async function profileRoutes(
  fastify: FastifyInstance
) {

  fastify.get(
    "/profile",
    async (request) => {

      const payload =
        await request.jwtVerify() as {
          id: number;
        };

      return await service.getProfile(
        payload.id
      );

    }
  );

  fastify.patch(
    "/profile",
    async (request, reply) => {

      const payload =
        await request.jwtVerify() as {
          id: number;
        };

      const body =
        request.body as {
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
        };

      await service.editProfile(
        payload.id,
        body
      );

      return {
        message:
          "Perfil actualizado."
      };

    }
  );

}