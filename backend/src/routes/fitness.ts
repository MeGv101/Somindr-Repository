import { FastifyInstance } from "fastify";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm"
import { exerciseCategories , exerciseRoutines , exercises , routineExercises } from "../db/schema.js";

export async function fitnessRoutes(
  fastify: FastifyInstance
) {

  fastify.get(
    "/fitness/categories",
    async () => {

      const categories =
      await db.select()
      .from(exerciseCategories);

      return categories;
    }
  );

    fastify.get(
    "/fitness/category/:id/routines",
        async (request) => {
            const params =
            request.params as {
            id: string;
            };

            return await db
            .select()
            .from(exerciseRoutines)
            .where(
                eq(
                exerciseRoutines.categoryId,
                Number(params.id)
                )
            );
        }
    );

    fastify.get(
  "/fitness/routine/:id",
  async (request, reply) => {

    const params = request.params as {
      id: string;
    };

    const routine = await db
      .select()
      .from(exerciseRoutines)
      .where(
        eq(
          exerciseRoutines.id,
          Number(params.id)
        )
      );

    if (routine.length === 0) {
      return reply.status(404).send({
        message: "Rutina no encontrada"
      });
    }

    const routineExercisesData =
      await db
      .select({
        orderIndex:
          routineExercises.orderIndex,

        recommendedReps:
          routineExercises.recommendedReps,

        recommendedMinutes:
          routineExercises.recommendedMinutes,

        exerciseName:
          exercises.name,

        description:
          exercises.description,
      })
      .from(routineExercises)
      .innerJoin(
        exercises,
        eq(
          routineExercises.exerciseId,
          exercises.id
        )
      )
      .where(
        eq(
          routineExercises.routineId,
          Number(params.id)
        )
      );

    return {
      ...routine[0],
      exercises:
        routineExercisesData,
    };
  }
);

}