import { FastifyReply, FastifyRequest } from "fastify";

import * as adminRepository from "../repositories/admin.repository.js";

export async function requireAdmin(
  request: FastifyRequest,
  reply: FastifyReply
) {

  try {

    const payload =
      await request.jwtVerify<{
        id: number;
      }>();

    const user =
      await adminRepository.findUserById(
        payload.id
      );

    if (!user) {

      return reply
        .status(401)
        .send({
          message: "No autorizado."
        });

    }

    if (user.role !== "ADMIN") {

      return reply
        .status(403)
        .send({
          message: "Acceso denegado."
        });

    }

  } catch {

    return reply
      .status(401)
      .send({
        message: "No autorizado."
      });

  }

}