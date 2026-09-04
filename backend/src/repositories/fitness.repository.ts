import { db } from "../db/index.js";

import {
    exerciseCategories,
    exerciseRoutines,
    exercises,
    routineExercises,
    userRoutineExercises,
    userRoutines,
} from "../db/schema.js";

import { eq, desc } from "drizzle-orm";

export async function getCategories() {
    return db
        .select()
        .from(exerciseCategories);
}

export async function getRoutinesByCategory(
    categoryId: number
) {
    return db
        .select()
        .from(exerciseRoutines)
        .where(
            eq(
                exerciseRoutines.categoryId,
                categoryId
            )
        );
}

export async function getRoutine(
    routineId: number
) {
    const result = await db
        .select()
        .from(exerciseRoutines)
        .where(
            eq(
                exerciseRoutines.id,
                routineId
            )
        );
    return result[0] ?? null;
}

export async function getRoutineExercises(
    routineId: number
) {
    return db
        .select({
            exerciseId:
                exercises.id,
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
                routineId
            )
        );
}

export async function createSession(data: {
    userId: number;
    routineId: number;
    completionPercentage: number;
}) {
    const [session] =
        await db
            .insert(userRoutines)
            .values({
                ...data,
                completedAt: new Date(),
            })
            .returning();
    return session;
}

export async function getUserSessionHistory(
    userId: number
) {
    return db
        .select({
            id: userRoutines.id,
            routineId: userRoutines.routineId,
            routineName: exerciseRoutines.name,
            categoryId: exerciseCategories.id,
            categoryName: exerciseCategories.name,
            startedAt: userRoutines.startedAt,
            completedAt: userRoutines.completedAt,
            completionPercentage: userRoutines.completionPercentage,
        })
        .from(userRoutines)
        .innerJoin(
            exerciseRoutines,
            eq(
                userRoutines.routineId,
                exerciseRoutines.id
            )
        )
        .innerJoin(
            exerciseCategories,
            eq(
                exerciseRoutines.categoryId,
                exerciseCategories.id
            )
        )
        .where(
            eq(
                userRoutines.userId,
                userId
            )
        )
        .orderBy(
            desc(userRoutines.startedAt)
        );
}

export async function saveExercises(
    userRoutineId: number,
    exercisesCompleted: {
        exerciseId: number;
        completed: boolean;
    }[]
) {
    await db
        .insert(userRoutineExercises)
        .values(
            exercisesCompleted.map(
                exercise => ({
                    userRoutineId,
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
}