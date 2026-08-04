import { getAccessToken, getPaypalBaseUrl } from "../providers/paypal.provider.js";
import { db } from "../db/index.js";
import { professionals, professionalClients, moodEntries, userRoutines, summaries, users } from "../db/schema.js";
import { eq, and, desc } from "drizzle-orm";

export async function createOrder(
  professionalId: number
) {

  const professional = await db
    .select()
    .from(professionals)
    .where(eq(professionals.id, professionalId));

  if (professional.length === 0) {
    throw new Error("Profesional no encontrado.");
  }

  const token = await getAccessToken();

  const response = await fetch(
    `${getPaypalBaseUrl()}/v2/checkout/orders`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: professionalId.toString(),
            amount: {
              currency_code: "USD",
              value: professional[0].pricePerHour.toString(),
            },
          },
        ],
        application_context: {
          return_url: `${process.env.FRONTEND_URL}/payment/success`,
          cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
          user_action: "PAY_NOW",
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();

}

export async function captureOrder(
  orderId: string
) {

  const token = await getAccessToken();

  const response = await fetch(
    `${getPaypalBaseUrl()}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();

}

export async function savePurchase(
  professionalId: number,
  userId: number
) {

  const startedAt = new Date();

  const expiresAt = new Date(startedAt);
  expiresAt.setMonth(expiresAt.getMonth() + 1);

  await db
    .insert(professionalClients)
    .values({
      professionalId,
      userId,
      startedAt,
      expiresAt,
      active: true,
    });

}

export async function findPurchasedProfessionals(
  userId: number
) {

  return await db
    .select()
    .from(professionalClients)
    .where(eq(professionalClients.userId, userId));

}

export async function findClients(
    professionalUserId: number
  ) {

    return await db
      .select({
        id: users.id,
        nombre: users.nombre,
        apellido: users.apellido,
        username: users.username,
        fotoPerfil: users.fotoPerfil,
        startedAt: professionalClients.startedAt,
        expiresAt: professionalClients.expiresAt,
        active: professionalClients.active,
      }).from(professionalClients)
      .innerJoin(
        professionals,
        eq(
          professionalClients.professionalId,
          professionals.id
        )
      )
      .innerJoin(
        users,
        eq(
          professionalClients.userId,
          users.id
        )
      ).where(
        eq(
          professionals.userId,
          professionalUserId
        )
      );

  }
  export async function findAllProfessionals() {
    return await db
      .select({
        id: professionals.id,
        nombre: users.nombre,
        apellido: users.apellido,
        username: users.username,
        fotoPerfil: users.fotoPerfil,
        profession: professionals.profession,
        description: professionals.description,
        pricePerHour: professionals.pricePerHour,
        verified: professionals.verified,
        acceptingClients: professionals.acceptingClients,
      }).from(professionals).innerJoin(
        users,
        eq(
          professionals.userId,
          users.id
        )
      ).where(
        eq(
          professionals.acceptingClients,
          true
        )
      );
  }
  export async function hasActivePurchase(
    userId: number,
    professionalId: number
  ) {

    const purchase = await db
      .select()
      .from(professionalClients)
      .where(
        and(
          eq(professionalClients.userId, userId),
          eq(
            professionalClients.professionalId,
            professionalId
          ),
          eq(professionalClients.active, true)
        )
      );

    return purchase.length > 0;

  }
  export async function findClientDashboard(
    professionalUserId: number,
    clientId: number
  ) {

    const relation = await db
      .select({
        startedAt: professionalClients.startedAt,
        expiresAt: professionalClients.expiresAt,
        active: professionalClients.active,
      })
      .from(professionalClients)
      .innerJoin(
        professionals,
        eq(
          professionalClients.professionalId,
          professionals.id
        )
      )
      .where(
        and(
          eq(
            professionals.userId,
            professionalUserId
          ),
          eq(
            professionalClients.userId,
            clientId
          ),
          eq(
            professionalClients.active,
            true
          )
        )
      );

    if (!relation.length) {
      throw new Error("No autorizado");
    }

    const profile = await db
      .select({
        id: users.id,
        nombre: users.nombre,
        apellido: users.apellido,
        username: users.username,
        fotoPerfil: users.fotoPerfil,
        genero: users.genero,
        fechaNacimiento: users.fechaNacimiento,
        pesoKg: users.pesoKg,
        estaturaCm: users.estaturaCm,
        nivelActividad: users.nivelActividad,
        biografia: users.biografia,
      })
      .from(users)
      .where(eq(users.id, clientId));

    const moods = await db
      .select()
      .from(moodEntries)
      .where(eq(moodEntries.userId, clientId))
      .orderBy(desc(moodEntries.weekStart));

    const routines = await db
      .select()
      .from(userRoutines)
      .where(eq(userRoutines.userId, clientId))
      .orderBy(desc(userRoutines.startedAt));

    const insights = await db
      .select()
      .from(summaries)
      .where(eq(summaries.userId, clientId))
      .orderBy(desc(summaries.createdAt));

    return {
      profile: profile[0],
      startedAt: relation[0].startedAt,
      expiresAt: relation[0].expiresAt,
      active: relation[0].active,
      moods,
      routines,
      insights,
    };

  }