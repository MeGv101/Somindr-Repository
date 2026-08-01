import { FastifyInstance } from "fastify";
import * as service from "../services/professional.service.js";

export async function professionalRoutes(
  fastify: FastifyInstance
) {

  fastify.post(
    "/professionals/:id/hire",
    async (request, reply) => {

      try {

        await request.jwtVerify();

        const { id } =
          request.params as {
            id: string;
          };

        const order =
          await service.createPaypalOrder(
            Number(id)
          );

        return order;

      } catch (err) {

        return reply
          .status(400)
          .send({
            message:
              "No se pudo crear la orden.",
          });

      }

    }
  );

  fastify.post(
    "/professionals/capture/:orderId",
    async (request, reply) => {
      try {
        const payload =
          await request.jwtVerify() as {
            id: number;
          };
        const { orderId } =
          request.params as {
            orderId: string;
          };
        const order =
          await service.capturePaypalOrder(
            orderId,
            payload.id
          );
        return order;
      } catch {

        return reply
          .status(400)
          .send({
            message:
              "No se pudo capturar el pago.",
          });
      }
    }
  );

  fastify.get(
    "/professionals/my",
    async (request, reply) => {
      try {
        const payload =
          await request.jwtVerify() as {
            id: number;
          };
        return await service.getPurchasedProfessionals(
          payload.id
        );

      } catch {
        return reply
          .status(400)
          .send({
            message:
              "No se pudieron obtener los profesionales.",
          });
      }
    }
  );

}