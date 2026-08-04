import { FastifyInstance } from "fastify";
import * as service from "../services/admin.service.js";

export async function adminRoutes(
  fastify: FastifyInstance
) {

  fastify.addHook(
    "preHandler",
    async (request, reply) => {

      const payload =
        await request.jwtVerify() as {
          id:number;
          role:string;
        };

      if(payload.role !== "admin"){
        return reply.status(403).send({
          message:"No autorizado."
        });
      }

    }
  );

  fastify.get(
    "/admin/dashboard",
    async () => {

      return await service.getDashboard();

    }
  );

}