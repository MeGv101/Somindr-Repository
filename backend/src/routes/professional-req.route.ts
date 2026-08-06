import { FastifyInstance } from "fastify";

import * as service from "../services/professional-req.service.js";

export async function professionalRequestRoutes(
  fastify: FastifyInstance
) {
  fastify.post(
    "/",
    async (request, reply) => {

      try {

        const payload =
          await request.jwtVerify<{
            id: number;
          }>();

        return await service.createRequest(
          payload.id,
          request.body as {
            profession: string;
            message: string;
          }
        );

      } catch (error) {

        if (
          error instanceof Error &&
          error.message === "PENDING_REQUEST_EXISTS"
        ) {

          return reply.status(409).send({
            message: "Ya tienes una solicitud pendiente.",
          });

        }

        if (
          error instanceof Error &&
          error.message === "ALREADY_PROFESSIONAL"
        ) {

          return reply.status(409).send({
            message: "Ya eres profesional.",
          });

        }

        return reply.status(500).send({
          message: "Error interno.",
        });

      }

    }
  );
  fastify.get(
    "/me",
    async (request, reply) => {

      try {

        const payload =
          await request.jwtVerify<{
            id: number;
          }>();

        return await service.getMyRequest(
          payload.id
        );

      } catch {

        return reply.status(401).send({
          message: "No autorizado.",
        });

      }

    }
  );

}