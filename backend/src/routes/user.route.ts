import { FastifyInstance } from "fastify";

import * as userService from "../services/user.service.js";

export async function userRoutes(
  fastify: FastifyInstance
) {

  fastify.get("/me", async (request, reply) => {
    try {
      const payload = await request.jwtVerify<{
        id: number;
      }>();

      return await userService.getMyProfile(payload.id);

    } catch {

      return reply.status(401).send({
        message: "No autorizado",
      });

    }
  });

  fastify.put("/me", async (request, reply) => {
    try {

      const payload = await request.jwtVerify<{
        id:number;
      }>();

      return await userService.updateMyProfile(
        payload.id,
        request.body
      );

    } catch {

      return reply.status(401).send({
        message:"No autorizado",
      });

    }
  });

  fastify.get("/:username", async (request, reply) => {

    try {

      const { username } =
        request.params as {
          username:string;
        };

      return await userService.getPublicProfile(
        username
      );

    } catch(error){

      if(
        error instanceof Error &&
        error.message==="USER_NOT_FOUND"
      ){

        return reply.status(404).send({
          message:"Usuario no encontrado"
        });

      }

      return reply.status(400).send({
        message:"Error al obtener perfil"
      });

    }

  });

}