import { db } from "../db/index.js";

import {
  professionalRequests,
} from "../db/schema.js";

import {
  eq,
  and,
  desc,
} from "drizzle-orm";

export async function findMyPendingRequest(
  userId: number
) {

  const [request] =
    await db
      .select()
      .from(professionalRequests)
      .where(
        and(
          eq(
            professionalRequests.userId,
            userId
          ),
          eq(
            professionalRequests.status,
            "PENDING"
          )
        )
      );

  return request ?? null;

}

export async function createRequest(
  data: {

    userId: number;

    profession: string;

    message: string;

  }
) {

  const [request] =
    await db
      .insert(professionalRequests)
      .values({

        userId: data.userId,

        profession: data.profession,

        message: data.message,

      })
      .returning();

  return request;

}

export async function findMyRequest(
  userId: number
) {

  const [request] =
    await db
      .select()
      .from(professionalRequests)
      .where(
        eq(
          professionalRequests.userId,
          userId
        )
      )
      .orderBy(
        desc(
          professionalRequests.createdAt
        )
      );

  return request ?? null;

}

export async function findPendingRequests() {

  return await db
    .select()
    .from(professionalRequests)
    .where(
      eq(
        professionalRequests.status,
        "PENDING"
      )
    );

}

export async function findRequestById(
  requestId: number
) {

  const [request] =
    await db
      .select()
      .from(professionalRequests)
      .where(
        eq(
          professionalRequests.id,
          requestId
        )
      );

  return request ?? null;

}

export async function approveRequest(
  requestId: number,
  adminId: number
) {

  await db
    .update(professionalRequests)
    .set({

      status: "APPROVED",

      reviewedBy: adminId,

      reviewedAt: new Date(),

      adminComment:null,

    })
    .where(
      eq(
        professionalRequests.id,
        requestId
      )
    );

}

export async function rejectRequest(
  requestId: number,
  adminId: number,
  adminComment?: string
  
) {

  await db
    .update(professionalRequests)
    .set({

      status: "REJECTED",

      reviewedBy: adminId,

      reviewedAt: new Date(),

      adminComment,

    })
    .where(
      eq(
        professionalRequests.id,
        requestId
      )
    );

}