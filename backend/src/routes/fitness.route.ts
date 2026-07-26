import { FastifyInstance } from "fastify";

import * as fitnessService
    from "../services/fitness.service.js";

export async function fitnessRoutes(
    fastify: FastifyInstance
) {
    fastify.get(
        "/fitness/categories",
        async () => {

            return fitnessService
                .getCategories();
        }
    );
    fastify.get(
        "/fitness/category/:id/routines",
        async (request) => {

            const params =
                request.params as {
                    id: string;
                };

            return fitnessService
                .getCategoryRoutines(
                    Number(params.id)
                );
        }
    );
    fastify.get(
        "/fitness/routine/:id",
        async (request, reply) => {
            const params =
                request.params as {
                    id: string;
                };
            try {
                return await fitnessService
                    .getRoutine(
                        Number(params.id)
                    );
            } catch {
                return reply
                    .status(404)
                    .send({
                        message:
                            "Rutina no encontrada",
                    });
            }
        }
    );
    fastify.post(
        "/fitness/session",
        async (request, reply) => {
            const payload =
                await request.jwtVerify<{
                    id: number;
                }>();
            try {
                return await fitnessService
                    .saveSession(
                        payload.id,
                        request.body as {
                            routineId: number;
                            exercises: {
                                exerciseId: number;
                                completed: boolean;
                            }[];
                        }
                    );
            } catch {
                return reply
                    .status(400)
                    .send({
                        message:
                            "No se recibieron ejercicios.",
                    });
            }
        }
    );
}