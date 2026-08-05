import { db } from "../db/index.js";

import {
  users,
  professionals,
  professionalClients,
} from "../db/schema.js";

import {
  eq,
  and,
  count,
} from "drizzle-orm";

export async function getDashboard() {

  const [{ totalUsers }] =
    await db
      .select({
        totalUsers: count(),
      })
      .from(users);

  const [{ totalProfessionals }] =
    await db
      .select({
        totalProfessionals: count(),
      })
      .from(professionals)
      .where(
        eq(
          professionals.active,
          true
        )
      );

  const [{ suspendedUsers }] =
    await db
      .select({
        suspendedUsers: count(),
      })
      .from(users)
      .where(
        eq(
          users.suspended,
          true
        )
      );

  return {

    totalUsers,

    totalProfessionals,

    suspendedUsers,

  };

}

export async function findUsers() {

  return await db
    .select({

      id: users.id,

      nombre: users.nombre,

      apellido: users.apellido,

      username: users.username,

      email: users.email,

      role: users.role,

      suspended: users.suspended,

      professionalId:
        professionals.id,

      verified:
        professionals.verified,

      active:
        professionals.active,

    })
    .from(users)
    .leftJoin(
      professionals,
      eq(
        professionals.userId,
        users.id
      )
    );

}

export async function findUserById(
  userId: number
) {

  const [user] =
    await db
      .select()
      .from(users)
      .where(
        eq(
          users.id,
          userId
        )
      );

  return user ?? null;

}

export async function suspendUser(
  userId: number
) {

  await db
    .update(users)
    .set({
      suspended: true,
    })
    .where(
      eq(
        users.id,
        userId
      )
    );

}

export async function unsuspendUser(
  userId: number
) {

  await db
    .update(users)
    .set({
      suspended: false,
    })
    .where(
      eq(
        users.id,
        userId
      )
    );

}
export async function findProfessional(
  userId: number
) {

  const [professional] =
    await db
      .select({
        id: professionals.id,
        active: professionals.active,
      })
      .from(professionals)
      .where(
        eq(
          professionals.userId,
          userId
        )
      );

  return professional ?? null;

}

export async function deactivateProfessional(
  userId: number
) {

  const professional =
    await findProfessional(
      userId
    );

  if (
    !professional ||
    !professional.active
  ) {
    return;
  }

  await db
    .update(professionals)
    .set({

      active: false,

      verified: false,

      acceptingClients: false,

      deactivatedAt: new Date(),

    })
    .where(
      eq(
        professionals.id,
        professional.id
      )
    );

  await db
    .update(
      professionalClients
    )
    .set({
      active: false,
    })
    .where(
      eq(
        professionalClients.professionalId,
        professional.id
      )
    );

}

export async function reactivateProfessional(
  userId: number
) {

  const professional =
    await findProfessional(
      userId
    );

  if (
    !professional ||
    professional.active
  ) {
    return;
  }

  await db
    .update(professionals)
    .set({

      active: true,

      acceptingClients: true,

      deactivatedAt: null,

    })
    .where(
      eq(
        professionals.id,
        professional.id
      )
    );

}