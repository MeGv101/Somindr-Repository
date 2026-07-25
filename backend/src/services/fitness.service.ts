import * as fitnessRepository
    from "../repositories/fitness.repository.js";

export async function getCategories() {
    return fitnessRepository.getCategories();

}
export async function getCategoryRoutines(
    categoryId: number
) {
    return fitnessRepository
        .getRoutinesByCategory(
            categoryId
        );
}

export async function getRoutine(
    routineId: number
) {
    const routine =
        await fitnessRepository
            .getRoutine(
                routineId
            );
    if (!routine) {
        throw new Error(
            "ROUTINE_NOT_FOUND"
        );
    }
    const exercises =
        await fitnessRepository
            .getRoutineExercises(
                routineId
            );
    return {
        ...routine,
        exercises,
    };
}
export async function saveSession(
    userId: number,
    body: {
        routineId: number;
        exercises: {
            exerciseId: number;
            completed: boolean;
        }[];
    }
) {
    if (
        !body.exercises ||
        body.exercises.length === 0
    ) {

        throw new Error(
            "NO_EXERCISES"
        );

    }
    const completed =
        body.exercises.filter(
            exercise =>
                exercise.completed
        ).length;
    const percentage =
        Math.round(
            completed /
            body.exercises.length *
            100
        );
    const session =
        await fitnessRepository
            .createSession({

                userId,

                routineId:
                    body.routineId,

                completionPercentage:
                    percentage,

            });
    await fitnessRepository
        .saveExercises(
            session.id,
            body.exercises
        );
    return {
        message:
            "Entrenamiento guardado correctamente.",
        completionPercentage:
            percentage,
    };
}