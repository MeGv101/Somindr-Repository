import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import * as service from "../services/professional.service.js";

export async function professionalRoutes(
  fastify: FastifyInstance
) {

  fastify.post(
    "/professionals/:id/hire",
    {
      preHandler: validatePurchase,
    },
    async (request, reply) => {
      try {
        const { id } =
          request.params as {
            id: string;
          };
        const order =
          await service.createPaypalOrder(
            Number(id)
          );
        return order;
      } catch {
        return reply.status(400).send({
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
  fastify.get(
    "/professionals/clients",
    async (request) => {

      const payload =
        await request.jwtVerify() as {
          id:number;
        };

      return await service
        .getClients(
          payload.id
        );

    }
  );
  fastify.get(
    "/professionals",
    async () => {
      return await service.getProfessionals();
    }
  );
  fastify.get(
    "/professionals/:id/purchased",
    async (request) => {

      const payload =
        await request.jwtVerify() as {
          id: number;
        };

      const { id } =
        request.params as {
          id: string;
        };

      return {
        purchased:
          await service.validatePurchase(
            payload.id,
            Number(id)
          ),
      };

    }
  );

  async function validatePurchase(
    request: FastifyRequest,
    reply: FastifyReply
  ) {

    const payload =
      await request.jwtVerify() as {
        id: number;
      };

    const { id } =
      request.params as {
        id: string;
      };

    const purchased =
      await service.validatePurchase(
        payload.id,
        Number(id)
      );

    if (purchased) {
      return reply.status(409).send({
        message:
          "Ya has contratado a este profesional."
      });
    }

  }
}