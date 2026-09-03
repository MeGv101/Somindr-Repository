import { db } from "../db/index.js";
import {
  users,
  posts,
  comments,
  postReactions,
  postReports,
} from "../db/schema.js";

import {
  eq,
  and,
  desc,
} from "drizzle-orm";



// POSTS

export async function getPosts() {
  return db
    .select({
      id: posts.id,
      title: posts.title,
      category: posts.category,
      content: posts.content,
      edited: posts.edited,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      authorId: users.id,
      username: users.username,
      nombre: users.nombre,
      role: users.role,
    })
    .from(posts)
    .innerJoin(
      users,
      eq(posts.userId, users.id)
    )
    .orderBy(desc(posts.createdAt));
}

export async function createPost(data: {
  userId: number;
  title: string;
  category: string;
  content: string;
}) {
  return db
    .insert(posts)
    .values(data)
    .returning();
}

export async function getPostById(id: number) {
  const result = await db
    .select()
    .from(posts)
    .where(eq(posts.id, id));

  return result[0] ?? null;
}

export async function updatePost(
  id: number,
  data: {
    title: string;
    category: string;
    content: string;
  }
) {
  await db
    .update(posts)
    .set({
      ...data,
      edited: true,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, id));
}

export async function deletePost(id: number) {
  await db
    .delete(posts)
    .where(eq(posts.id, id));
}



// COMMENTS

export async function createComment(data: {
  postId: number;
  userId: number;
  content: string;
}) {
  return db
    .insert(comments)
    .values(data)
    .returning();
}

export async function getCommentsByPost(
  postId: number
) {
  return db
    .select({
      id: comments.id,
      content: comments.content,
      edited: comments.edited,
      createdAt: comments.createdAt,
      updatedAt: comments.updatedAt,
      authorId: users.id,
      username: users.username,
      nombre: users.nombre,
      role: users.role,
    })
    .from(comments)
    .innerJoin(
      users,
      eq(comments.userId, users.id)
    )
    .where(eq(comments.postId, postId))
    .orderBy(comments.createdAt);
}

export async function getCommentById(
  id: number
) {
  const result = await db
    .select()
    .from(comments)
    .where(eq(comments.id, id));

  return result[0] ?? null;
}

export async function updateComment(
  id: number,
  content: string
) {
  await db
    .update(comments)
    .set({
      content,
      edited: true,
      updatedAt: new Date(),
    })
    .where(eq(comments.id, id));
}

export async function deleteComment(
  id: number
) {
  await db
    .delete(comments)
    .where(eq(comments.id, id));
}



// REACTIONS

export async function getReaction(
  postId: number,
  userId: number
) {
  const result = await db
    .select()
    .from(postReactions)
    .where(
      and(
        eq(postReactions.postId, postId),
        eq(postReactions.userId, userId)
      )
    );

  return result[0] ?? null;
}

export async function getPostReactions(
  postId: number
) {
  return db
    .select()
    .from(postReactions)
    .where(eq(postReactions.postId, postId));
}

export async function createReaction(
  data: {
    postId: number;
    userId: number;
    type: "LIKE" | "DISLIKE";
  }
) {
  await db
    .insert(postReactions)
    .values(data);
}

export async function updateReaction(
  id: number,
  type: "LIKE" | "DISLIKE"
) {
  await db
    .update(postReactions)
    .set({
      type,
    })
    .where(eq(postReactions.id, id));
}

export async function deleteReaction(
  id: number
) {
  await db
    .delete(postReactions)
    .where(eq(postReactions.id, id));
}

export async function findPostsByUsername(
  username: string
) {
  return await db
    .select({
      id: posts.id,
      title: posts.title,
      category: posts.category,
      content: posts.content,
      edited: posts.edited,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      author: users.username,
      avatar: users.fotoPerfil,
    })
    .from(posts)
    .innerJoin(
      users,
      eq(posts.userId, users.id)
    )
    .where(
      eq(users.username, username)
    )
    .orderBy(desc(posts.createdAt));
}

// REPORTES

export async function createPostReport(data: {
  postId: number;
  reporterId: number;
  reason: string;
  description?: string;
}) {
  return db
    .insert(postReports)
    .values({
      postId: data.postId,
      reporterId: data.reporterId,
      reason: data.reason,
      description: data.description ?? null,
    })
    .returning();
}

export async function getPostReport(
  postId: number,
  reporterId: number
) {
  const result = await db
    .select()
    .from(postReports)
    .where(
      and(
        eq(postReports.postId, postId),
        eq(postReports.reporterId, reporterId)
      )
    );

  return result[0] ?? null;
}

export async function getUserRole(userId: number) {
  const result = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, userId));

  return result[0]?.role ?? null;
}

export async function getPostsForAdmin() {
  return db
    .select({
      id: posts.id,
      title: posts.title,
      category: posts.category,
      content: posts.content,
      edited: posts.edited,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      authorId: users.id,
      username: users.username,
      nombre: users.nombre,
    })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .orderBy(desc(posts.createdAt));
}

export async function getReportsForPost(postId: number) {
  return db
    .select()
    .from(postReports)
    .where(eq(postReports.postId, postId));
}