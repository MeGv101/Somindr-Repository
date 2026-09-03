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


  fastify.patch(
    "/users/:id/deactivate-professional",
    {
      preHandler: requireAdmin,
    },
    async (request, reply) => {

      try {

        const { id } =
          request.params as {
            id:string;
          };

        return await service.deactivateProfessional(
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

        if(
          error instanceof Error &&
          error.message === "NOT_PROFESSIONAL"
        ){

          return reply.status(400).send({
            message:"El usuario no es profesional.",
          });

        }

        if(
          error instanceof Error &&
          error.message === "PROFESSIONAL_ALREADY_INACTIVE"
        ){

          return reply.status(409).send({
            message:"El profesional ya está inactivo.",
          });

        }

        return reply.status(500).send({
          message:"Error interno.",
        });

      }

    }
  );


  fastify.patch(
    "/users/:id/reactivate-professional",
    {
      preHandler: requireAdmin,
    },
    async (request, reply) => {

      try {

        const { id } =
          request.params as {
            id:string;
          };

        return await service.reactivateProfessional(
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

        if(
          error instanceof Error &&
          error.message === "NOT_PROFESSIONAL"
        ){

          return reply.status(400).send({
            message:"El usuario no es profesional.",
          });

        }

        if(
          error instanceof Error &&
          error.message === "PROFESSIONAL_ALREADY_ACTIVE"
        ){

          return reply.status(409).send({
            message:"El profesional ya está activo.",
          });

        }

        return reply.status(500).send({
          message:"Error interno.",
        });

      }

    }
  );


  fastify.patch(
    "/users/:id/promote",
    {
      preHandler: requireAdmin,
    },
    async (request, reply) => {

      try {

        const { id } =
          request.params as {
            id:string;
          };

        return await service.promoteUser(
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
          error.message === "USER_ALREADY_ADMIN"
        ){

          return reply.status(409).send({
            message:"El usuario ya es administrador.",
          });

        }

        return reply.status(500).send({
          message:"Error interno.",
        });

      }

    }
  );


  fastify.get(
    "/posts",
    {
      preHandler: requireAdmin,
    },
    async () => {

      return await service.getPostsForModeration();

    }
  );


  fastify.delete(
    "/posts/:id",
    {
      preHandler: requireAdmin,
    },
    async (request) => {

      const { id } =
        request.params as {
          id:string;
        };

      return await service.deletePostAsAdmin(
        Number(id)
      );

    }
  );


  fastify.get(
    "/reports",
    {
      preHandler: requireAdmin,
    },
    async () => {

      return await service.getReports();

    }
  );


  fastify.patch(
    "/reports/:id/resolve",
    {
      preHandler: requireAdmin,
    },
    async (request, reply) => {

      try {

        const { id } =
          request.params as {
            id:string;
          };

        const { status } =
          request.body as {
            status:"resolved" | "dismissed";
          };

        return await service.resolveReport(
          Number(id),
          status
        );

      } catch(error) {

        if(
          error instanceof Error &&
          error.message === "REPORT_NOT_FOUND"
        ){

          return reply.status(404).send({
            message:"Reporte no encontrado.",
          });

        }

        if(
          error instanceof Error &&
          error.message === "INVALID_STATUS"
        ){

          return reply.status(400).send({
            message:"Estado inválido.",
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