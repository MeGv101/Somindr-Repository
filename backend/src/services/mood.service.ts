import * as moodRepository from "../repositories/mood.repository.js";

function formatDateLocal(date: Date) {
    const year = date.getFullYear();
    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
        date.getDate()
    ).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function getPreviousWeekStart() {
    const today = new Date();
    const day = today.getDay();
    const diff =
        day === 0
            ? -6
            : 1 - day;
    today.setDate(
        today.getDate() + diff
    );
    today.setDate(
        today.getDate() - 7
    );
    return formatDateLocal(today);
}

export async function getCurrentMood(
    userId: number
) {
    return moodRepository.findCurrentMood(
        userId,
        getPreviousWeekStart()
    );
}

export async function saveMood(
    userId: number,
    body: {
        stress: number;
        sleepQuality: number;
        energy: number;
        anxiety: number;
        notes: string;
    }
) {
    const weekStart =
        getPreviousWeekStart();
    const existingMood =
        await moodRepository.findCurrentMood(
            userId,
            weekStart
        );
    const notes =
        body.notes.trim() ||
        "Sin observaciones adicionales.";
    if (existingMood) {
        await moodRepository.updateMood(
            existingMood.id,
            {
                stress: body.stress,
                sleepQuality:
                    body.sleepQuality,
                energy: body.energy,
                anxiety: body.anxiety,
                notes,
            }
        );
        return {
            message:
                "Mood actualizado",
        };
    }

    await moodRepository.createMood({
        userId,
        weekStart,
        stress: body.stress,
        sleepQuality:
            body.sleepQuality,
        energy: body.energy,

        anxiety: body.anxiety,
        notes,
    });
    return {
        message:
            "Mood recibido",
    };
}

export async function getHistory(
    userId: number
) {
    return moodRepository.findHistory(
        userId
    );
}