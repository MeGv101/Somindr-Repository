import { FastifyInstance } from "fastify";

import * as moodService from "../services/mood.service.js";

export async function moodRoutes(
    fastify: FastifyInstance
) {

    fastify.get(
        "/mood/current",
        async (request) => {
            const payload =
                await request.jwtVerify<{
                    id: number;
                }>();
            return moodService.getCurrentMood(
                payload.id
            );
        }
    );

    fastify.post(
        "/mood",
        async (request) => {
            const payload =
                await request.jwtVerify<{
                    id: number;
                }>();
            return moodService.saveMood(
                payload.id,
                request.body as {
                    stress: number;
                    sleepQuality: number;
                    energy: number;
                    anxiety: number;
                    notes: string;
                }
            );
        }
    );

    fastify.get(
        "/mood/history",
        async (request) => {
            const payload =
                await request.jwtVerify<{
                    id: number;
                }>();
            return moodService.getHistory(
                payload.id
            );

        }
    );
}