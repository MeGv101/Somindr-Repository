import { FastifyInstance } from "fastify";

import * as service from "../services/admin.service.js";
import * as professionalRequestService from "../services/professional-req.service.js";

import { requireAdmin } from "../middleware/admin.middleware.js";

export async function adminRoutes(
  fastify: FastifyInstance
) {

  fastify.get(
    "/dashboard",
    {
      preHandler: requireAdmin,
    },
    async () => {

      return await service.getDashboard();

    }
  );


  fastify.get(
    "/users",
    {
      preHandler: requireAdmin,
    },
    async () => {

      return await service.getUsers();

    }
  );


  fastify.patch(
    "/users/:id/suspend",
    {
      preHandler: requireAdmin,
    },
    async (request, reply) => {

      try {

        const { id } =
          request.params as {
            id:string;
          };


        return await service.suspendUser(
          Number(id)
        );


      } catch(error) {

        if(
          error instanceof Error &&
          error.message === "USER_NOT_FOUND"
        ){

          return reply.status(404).send({
            message:"Usuario no encontrado.",
          });

        }


        if(
          error instanceof Error &&
          error.message === "CANNOT_MODIFY_ADMIN"
        ){

          return reply.status(403).send({
            message:"No puedes modificar administradores.",
          });

        }


        return reply.status(500).send({
          message:"Error interno.",
        });

      }

    }
  );


  fastify.patch(
    "/users/:id/unsuspend",
    {
      preHandler: requireAdmin,
    },
    async (request, reply) => {

      try {

        const { id } =
          request.params as {
            id:string;
          };


        return await service.unsuspendUser(
          Number(id)
        );


      } catch(error) {

        if(
          error instanceof Error &&
          error.message === "USER_NOT_FOUND"
        ){

          return reply.status(404).send({
            message:"Usuario no encontrado.",
          });

        }


        if(
          error instanceof Error &&
          error.message === "CANNOT_MODIFY_ADMIN"
        ){

          return reply.status(403).send({
            message:"No puedes modificar administradores.",
          });

        }


        return reply.status(500).send({
          message:"Error interno.",
        });

      }

    }
  );


  fastify.get(
    "/me",
    {
      preHandler: requireAdmin,
    },
    async (request) => {

      const payload =
        await request.jwtVerify<{
          id:number;
        }>();


      return await service.getMe(
        payload.id
      );

    }
  );

  fastify.get(
    "/professional-requests",
    {
      preHandler: requireAdmin,
    },
    async () => {

      return await professionalRequestService.getPendingRequests();

    }
  );


  fastify.get(
    "/professional-requests/:id",
    {
      preHandler: requireAdmin,
    },
    async (request, reply) => {

      try {

        const { id } =
          request.params as {
            id:string;
          };


        return await professionalRequestService.getRequest(
          Number(id)
        );


      } catch(error) {


        if(
          error instanceof Error &&
          error.message === "REQUEST_NOT_FOUND"
        ){

          return reply.status(404).send({
            message:"Solicitud no encontrada.",
          });

        }


        return reply.status(500).send({
          message:"Error interno.",
        });

      }

    }
  );


  fastify.patch(
    "/professional-requests/:id/approve",
    {
      preHandler: requireAdmin,
    },
    async (request, reply) => {

      try {

        const payload =
          await request.jwtVerify<{
            id:number;
          }>();


        const { id } =
          request.params as {
            id:string;
          };


        return await professionalRequestService.approveRequest(
          Number(id),
          payload.id
        );


      } catch(error) {

        


        if(
          error instanceof Error &&
          error.message === "REQUEST_NOT_FOUND"
        ){

          return reply.status(404).send({
            message:"Solicitud no encontrada.",
          });

        }


        if(
          error instanceof Error &&
          error.message === "REQUEST_ALREADY_REVIEWED"
        ){

          return reply.status(409).send({
            message:"La solicitud ya fue revisada.",
          });

        }


        return reply.status(500).send({
          message:"Error interno.",
        });

      }

    }
  );


  fastify.patch(
    "/professional-requests/:id/reject",
    {
      preHandler: requireAdmin,
    },
    async (request, reply) => {

      try {

        const payload =
          await request.jwtVerify<{
            id:number;
          }>();


        const { id } =
          request.params as {
            id:string;
          };


        const body =
          request.body as {
            adminComment?:string;
          } ?? {};


        return await professionalRequestService.rejectRequest(
          Number(id),
          payload.id,
          body.adminComment
        );


      } catch(error) {


        if(
          error instanceof Error &&
          error.message === "REQUEST_NOT_FOUND"
        ){

          return reply.status(404).send({
            message:"Solicitud no encontrada.",
          });

        }


        if(
          error instanceof Error &&
          error.message === "REQUEST_ALREADY_REVIEWED"
        ){

          return reply.status(409).send({
            message:"La solicitud ya fue revisada.",
          });

        }


        return reply.status(500).send({
          message:"Error interno.",
        });

      }

    }
  );


}