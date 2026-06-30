import { FastifyInstance } from "fastify";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm"
import { exerciseCategories , exerciseRoutines , exercises , routineExercises, userRoutineExercises, userRoutines } from "../db/schema.js";

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
        exerciseId: exercises.id,

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

fastify.post(
    "/fitness/session",
    async (request, reply) => {

      const payload =
      await request.jwtVerify() as {
        id: number;
        tokenId: string;
      };

      const body =
      request.body as {

        routineId: number;

        exercises: {
          exerciseId: number;
          completed: boolean;
        }[];

      };

      if (
        !body.exercises ||
        body.exercises.length === 0
      ) {
        return reply.status(400).send({
          message:
            "No se recibieron ejercicios."
        });
      }

      const completedCount =
      body.exercises.filter(
        exercise =>
        exercise.completed
      ).length;

      const percentage =
      Math.round(
        (
          completedCount /
          body.exercises.length
        ) * 100
      );

      const session =
      await db
        .insert(userRoutines)
        .values({

          userId:
            payload.id,

          routineId:
            body.routineId,

          completionPercentage:
            percentage,

          completedAt:
            new Date(),

        })
        .returning();

      await db
        .insert(
          userRoutineExercises
        )
        .values(

          body.exercises.map(
            exercise => ({

              userRoutineId:
                session[0].id,

              exerciseId:
                exercise.exerciseId,

              completed:
                exercise.completed,

              completedAt:
                exercise.completed
                ? new Date()
                : null,

            })
          )

        );

      return {
        message:
          "Entrenamiento guardado correctamente.",

        completionPercentage:
          percentage,
      };

    }
  );

}