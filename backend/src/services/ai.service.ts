import * as aiRepository from "../repositories/ai.repository.js";
import { generateResponse } from "../providers/ai.provider.js";

export async function getMessages(
  userId: number
) {
  const chat =
    await aiRepository.findChatByUserId(
      userId
    );

  if (!chat) {
    return [];
  }

  return aiRepository.getMessages(
    chat.id
  );
}

export async function chat(
  userId: number,
  message: string
) {

  let chat =
    await aiRepository.findChatByUserId(
      userId
    );

  if (!chat) {
    chat =
      await aiRepository.createChat(
        userId
      );
  }

  const moods =
    await aiRepository.getMoodHistory(
      userId
    );

  const routines =
    await aiRepository.getRoutineHistory(
      userId
    );

  const history =
    await aiRepository.getRecentMessages(
      chat.id
    );

  const historyText =
    history
      .reverse()
      .map(
        message =>
          `${message.role}: ${message.content}`
      )
      .join("\n");

  const prompt = `
Eres un asistente que vela por la salud física y mental del usuario.

Procura responder de forma breve.

Mantén un tono humano y profesional.

Información del usuario:

Mood:
${JSON.stringify(moods)}

Fitness:
${JSON.stringify(routines)}

Últimos 20 mensajes:

${historyText}

Mensaje del usuario:

${message}

Si la información está vacía, indícale que complete primero la sección psicoemocional.
`;

  await aiRepository.saveMessage(
    chat.id,
    "user",
    message
  );

  const response =
    await generateResponse(
      prompt
    );

  if (!response) {
    throw new Error(
      "AI_ERROR"
    );
  }

  await aiRepository.saveMessage(
    chat.id,
    "assistant",
    response
  );

  await generateSummaryIfNeeded(
    userId,
    chat.id
  );

  return {
    response,
  };

}

async function generateSummaryIfNeeded(
  userId: number,
  chatId: number
) {

  const chatMessages =
    await aiRepository.getMessages(
      chatId
    );

  if (chatMessages.length <= 10) {
    return;
  }

  const summaries =
    await aiRepository.getSummaries(
      userId
    );

  const expected =
    Math.floor(
      chatMessages.length / 10
    );

  if (
    expected <=
    summaries.length
  ) {
    return;
  }

  const recent =
    await aiRepository.getRecentMessages(
      chatId,
      10
    );

  const conversation =
    recent
      .reverse()
      .map(
        message =>
          `${message.role}: ${message.content}`
      )
      .join("\n");

  const summary =
    await generateResponse(`
Resume la conversación.

Extrae:

- emociones importantes
- preocupaciones
- eventos relevantes
- hábitos mencionados

Sé breve.

Conversación:

${conversation}
`);

  if (!summary) {
    return;
  }

  await aiRepository.createSummary(
    userId,
    summary
  );

}