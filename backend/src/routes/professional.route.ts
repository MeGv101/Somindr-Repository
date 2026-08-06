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
    async (request) => {

      const payload =
        await request.jwtVerify() as {
          id: number;
        };

      return await service.getProfessionals(
        payload.id
      );

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

  const professionalId = Number(id);

  const selfPurchase =
    await service.validateSelfPurchase(
      payload.id,
      professionalId
    );

    if (selfPurchase) {

      return reply.status(400).send({
        message:
          "No puedes contratarte a ti mismo."
      });

    }

    const purchased =
      await service.validatePurchase(
        payload.id,
        professionalId
      );

    if (purchased) {

      return reply.status(409).send({
        message:
          "Ya has contratado a este profesional."
      });

    }

  }

  fastify.get(
    "/client/:id/dashboard",
    async (request, reply) => {
      
      try {

        const payload =
          await request.jwtVerify() as {
            id: number;
          };

        const { id } =
          request.params as {
            id: string;
          };

        return await service.getClientDashboard(
          payload.id,
          Number(id)
        );
        
      } catch {

        return reply.status(403).send({
          message:
            "No tienes acceso a este cliente.",
        });

      }

    }
  );

  fastify.get(
  "/professionals/me",
  async(request)=>{

    const payload =
      await request.jwtVerify() as {
        id:number;
      };


    return await service.getMyProfessionalProfile(
      payload.id
    );

  }
);


fastify.patch(
  "/professionals/me",
  async(request)=>{

    const payload =
      await request.jwtVerify() as {
        id:number;
      };


    return await service.updateMyProfessionalProfile(
      payload.id,
      request.body as any
    );

  }
);


fastify.patch(
  "/professionals/me/deactivate",
  async(request)=>{

    const payload =
      await request.jwtVerify() as {
        id:number;
      };


    return await service.deactivateMyProfessionalAccount(
      payload.id
    );

  }
);


  fastify.patch(
    "/professionals/me/reactivate",
    async(request)=>{

      const payload =
        await request.jwtVerify() as {
          id:number;
        };


      return await service.reactivateMyProfessionalAccount(
        payload.id
      );

    }
  );
}

