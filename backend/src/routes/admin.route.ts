import { FastifyInstance } from "fastify";

import * as service from "../services/admin.service.js";

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
            id: string;
          };

        return await service.suspendUser(
          Number(id)
        );

      } catch (error) {

        if (
          error instanceof Error &&
          error.message === "USER_NOT_FOUND"
        ) {

          return reply.status(404).send({
            message: "Usuario no encontrado.",
          });

        }

        if (
          error instanceof Error &&
          error.message === "CANNOT_MODIFY_ADMIN"
        ) {

          return reply.status(403).send({
            message: "No puedes modificar administradores.",
          });

        }

        return reply.status(500).send({
          message: "Error interno.",
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
            id: string;
          };

        return await service.unsuspendUser(
          Number(id)
        );

      } catch (error) {

        if (
          error instanceof Error &&
          error.message === "USER_NOT_FOUND"
        ) {

          return reply.status(404).send({
            message: "Usuario no encontrado.",
          });

        }

        if (
          error instanceof Error &&
          error.message === "CANNOT_MODIFY_ADMIN"
        ) {

          return reply.status(403).send({
            message: "No puedes modificar administradores.",
          });

        }

        return reply.status(500).send({
          message: "Error interno.",
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
            id: string;
          };

        return await service.deactivateProfessional(
          Number(id)
        );

      } catch (error) {

        if (
          error instanceof Error &&
          error.message === "USER_NOT_FOUND"
        ) {

          return reply.status(404).send({
            message: "Usuario no encontrado.",
          });

        }

        if (
          error instanceof Error &&
          error.message === "NOT_PROFESSIONAL"
        ) {

          return reply.status(400).send({
            message: "El usuario no es profesional.",
          });

        }

        if (
          error instanceof Error &&
          error.message === "PROFESSIONAL_ALREADY_INACTIVE"
        ) {

          return reply.status(409).send({
            message: "El profesional ya está desactivado.",
          });

        }

        if (
          error instanceof Error &&
          error.message === "CANNOT_MODIFY_ADMIN"
        ) {

          return reply.status(403).send({
            message: "No puedes modificar administradores.",
          });

        }

        return reply.status(500).send({
          message: "Error interno.",
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
            id: string;
          };

        return await service.reactivateProfessional(
          Number(id)
        );

      } catch (error) {

        if (
          error instanceof Error &&
          error.message === "USER_NOT_FOUND"
        ) {

          return reply.status(404).send({
            message: "Usuario no encontrado.",
          });

        }

        if (
          error instanceof Error &&
          error.message === "NOT_PROFESSIONAL"
        ) {

          return reply.status(400).send({
            message: "El usuario no es profesional.",
          });

        }

        if (
          error instanceof Error &&
          error.message === "PROFESSIONAL_ALREADY_ACTIVE"
        ) {

          return reply.status(409).send({
            message: "El profesional ya está activo.",
          });

        }

        if (
          error instanceof Error &&
          error.message === "CANNOT_MODIFY_ADMIN"
        ) {

          return reply.status(403).send({
            message: "No puedes modificar administradores.",
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

}