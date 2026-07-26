import type { FastifyInstance } from "fastify";
import * as aiService from "../services/ai.service.js";
export async function aiRoutes(
  fastify: FastifyInstance
) {
  fastify.get(
    "/messages",
    async (request) => {

      const payload =
        await request.jwtVerify<{
          id: number;
          tokenId: string;
        }>();

      return aiService.getMessages(
        payload.id
      );
    }
  );
  fastify.post(
    "/chat",
    async (request, reply) => {
      try {
        const payload =
          await request.jwtVerify<{
            id: number;
            tokenId: string;
          }>();
        const body =
          request.body as {
            message: string;
          };
        return await aiService.chat(
          payload.id,
          body.message
        );
      } catch (error) {
        console.error(error);
        return reply
          .status(500)
          .send({
            message:
              "Ocurrió un error al generar la respuesta de la IA."
          });
      }
    }
  );
}