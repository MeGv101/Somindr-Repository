import { db } from "../db/index.js";

import {
  users,
  professionals,
  professionalClients,
  posts,
  postReports,
} from "../db/schema.js";

import {
  eq,
  and,
  count,
  desc,
} from "drizzle-orm";

import { alias } from "drizzle-orm/pg-core";

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

export async function promoteToAdmin(
  userId: number
) {

  await db
    .update(users)
    .set({
      role: "ADMIN",
    })
    .where(
      eq(
        users.id,
        userId
      )
    );

}

export async function findPostsWithReportCounts() {

  return await db
    .select({

      id: posts.id,

      title: posts.title,

      category: posts.category,

      content: posts.content,

      createdAt: posts.createdAt,

      authorId: users.id,

      authorUsername: users.username,

      reportCount: count(postReports.id),

    })
    .from(posts)
    .innerJoin(
      users,
      eq(posts.userId, users.id)
    )
    .leftJoin(
      postReports,
      eq(postReports.postId, posts.id)
    )
    .groupBy(
      posts.id,
      users.id
    )
    .orderBy(desc(posts.createdAt));

}

export async function deletePostAsAdmin(
  postId: number
) {

  await db
    .delete(posts)
    .where(
      eq(posts.id, postId)
    );

}

export async function findReports() {

  const reporter = alias(users, "reporter");
  const author = alias(users, "author");

  return await db
    .select({

      id: postReports.id,

      postId: postReports.postId,

      postTitle: posts.title,

      reason: postReports.reason,

      description: postReports.description,

      status: postReports.status,

      createdAt: postReports.createdAt,

      reporterUsername: reporter.username,

      authorUsername: author.username,

    })
    .from(postReports)
    .innerJoin(
      posts,
      eq(postReports.postId, posts.id)
    )
    .innerJoin(
      reporter,
      eq(postReports.reporterId, reporter.id)
    )
    .innerJoin(
      author,
      eq(posts.userId, author.id)
    )
    .orderBy(desc(postReports.createdAt));

}

export async function findReportById(
  reportId: number
) {

  const [report] =
    await db
      .select()
      .from(postReports)
      .where(
        eq(postReports.id, reportId)
      );

  return report ?? null;

}

export async function updateReportStatus(
  reportId: number,
  status: "resolved" | "dismissed"
) {

  await db
    .update(postReports)
    .set({ status })
    .where(
      eq(postReports.id, reportId)
    );

}

export function deletePost(postId: number) {
  throw new Error("Function not implemented.");
}
