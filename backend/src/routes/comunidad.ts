import { FastifyInstance } from "fastify";

import {
  and,
  desc,
  eq,
} from "drizzle-orm";

import { db } from "../db/index.js";

import {
  users,
  posts,
  comments,
  postReactions,
} from "../db/schema.js";

export async function communityRoutes(
  fastify: FastifyInstance
) {

    fastify.get("/posts", async (
    request,
    reply
    ) => {

    const payload =
        await request.jwtVerify() as {
        id: number;
        };

    const rawPosts = await db
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
        .orderBy(
        desc(posts.createdAt)
        );

    const result = await Promise.all(

        rawPosts.map(async (post) => {

        const reactions = await db
            .select()
            .from(postReactions)
            .where(
            eq(
                postReactions.postId,
                post.id
            )
            );

        const commentsList = await db
        .select({
          id: comments.id,
          content: comments.content,
          createdAt: comments.createdAt,
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
        .where(
          eq(comments.postId, post.id)
        )
        .orderBy(comments.createdAt);

        const myReaction =
            reactions.find(
            reaction =>
                reaction.userId === payload.id
            );

        return {

            ...post,

            likes:
            reactions.filter(
                reaction =>
                reaction.type === "LIKE"
            ).length,

            dislikes:
            reactions.filter(
                reaction =>
                reaction.type === "DISLIKE"
            ).length,
            comments: commentsList,

            userReaction: myReaction?.type ?? null,

        };

        })

    );

    return result;

    });
  fastify.post("/posts", async (
    request,
    reply
  ) => {

    const payload =
      await request.jwtVerify() as {
        id: number;
      };

    const body =
      request.body as {
      title: string;
      category: string;
      content: string;
    };

    if (
      !body.title ||
      !body.category ||
      !body.content
    ) {

      return reply
        .status(400)
        .send({
          message:
            "Todos los campos son obligatorios.",
        });

    }

    const [post] =
      await db
        .insert(posts)
        .values({
          userId: payload.id,
          title: body.title,
          category: body.category,
          content: body.content,
        })
        .returning();

    return reply
      .status(201)
      .send(post);

  });

  fastify.patch("/posts/:id", async (
    request,
    reply
  ) => {

    const payload =
      await request.jwtVerify() as {
        id: number;
      };

    const { id } =
      request.params as {
        id: string;
      };

    const body =
      request.body as {
        title: string;
        category: string;
        content: string;
      };

    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.id, Number(id)));

    if (post.length === 0) {
      return reply.status(404).send({
        message: "Publicación no encontrada."
      });
    }

    if (post[0].userId !== payload.id) {
      return reply.status(403).send({
        message: "No puedes editar esta publicación."
      });
    }

    await db
      .update(posts)
      .set({
        title: body.title,
        category: body.category,
        content: body.content,
        edited: true,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, Number(id)));

    return {
      message: "Publicación actualizada."
    };

  });

  fastify.delete("/posts/:id", async (
    request,
    reply
  ) => {

    const payload =
      await request.jwtVerify() as {
        id: number;
      };

    const { id } =
      request.params as {
        id: string;
      };

    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.id, Number(id)));

    if (post.length === 0) {
      return reply.status(404).send({
        message: "Publicación no encontrada."
      });
    }

    if (post[0].userId !== payload.id) {
      return reply.status(403).send({
        message: "No puedes eliminar esta publicación."
      });
    }

    await db
      .delete(posts)
      .where(eq(posts.id, Number(id)));

    return {
      message: "Publicación eliminada."
    };

  });


  fastify.post("/posts/:id/comments", async (
    request,
    reply
  ) => {

    const payload =
      await request.jwtVerify() as {
        id: number;
      };

    const { id } =
      request.params as {
        id: string;
      };

    const body =
      request.body as {
        content: string;
      };

    if (!body.content) {
      return reply.status(400).send({
        message: "El comentario está vacío."
      });
    }

    const [comment] = await db
      .insert(comments)
      .values({
        postId: Number(id),
        userId: payload.id,
        content: body.content,
      })
      .returning();

    return reply
      .status(201)
      .send(comment);

  });


  fastify.get("/posts/:id/comments", async (
    request
  ) => {

    const { id } =
      request.params as {
        id: string;
      };

    const result = await db
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
      .where(
        eq(comments.postId, Number(id))
      )
      .orderBy(comments.createdAt);

    return result;

  });

  fastify.patch("/comments/:id", async (
    request,
    reply
  ) => {

    const payload =
      await request.jwtVerify() as {
        id: number;
      };

    const { id } =
      request.params as {
        id: string;
      };

    const body =
      request.body as {
        content: string;
      };

    const comment = await db
      .select()
      .from(comments)
      .where(eq(comments.id, Number(id)));

    if (comment.length === 0) {
      return reply.status(404).send({
        message: "Comentario no encontrado.",
      });
    }

    if (comment[0].userId !== payload.id) {
      return reply.status(403).send({
        message: "No puedes editar este comentario.",
      });
    }

    await db
      .update(comments)
      .set({
        content: body.content,
        edited: true,
        updatedAt: new Date(),
      })
      .where(eq(comments.id, Number(id)));

    return {
      message: "Comentario actualizado.",
    };

  });

  fastify.delete("/comments/:id", async (
    request,
    reply
  ) => {

    const payload =
      await request.jwtVerify() as {
        id: number;
      };

    const { id } =
      request.params as {
        id: string;
      };

    const comment = await db
      .select()
      .from(comments)
      .where(eq(comments.id, Number(id)));

    if (comment.length === 0) {
      return reply.status(404).send({
        message: "Comentario no encontrado.",
      });
    }

    if (comment[0].userId !== payload.id) {
      return reply.status(403).send({
        message: "No puedes eliminar este comentario.",
      });
    }

    await db
      .delete(comments)
      .where(eq(comments.id, Number(id)));

    return {
      message: "Comentario eliminado.",
    };

  });

  fastify.post("/posts/:id/reaction", async (
    request,
    reply
  ) => {

    const payload =
      await request.jwtVerify() as {
        id: number;
      };

    const { id } =
      request.params as {
        id: string;
      };

    const body =
      request.body as {
        type: "LIKE" | "DISLIKE";
      };

    if (
      body.type !== "LIKE" &&
      body.type !== "DISLIKE"
    ) {
      return reply.status(400).send({
        message: "Reacción inválida.",
      });
    }

    const reaction =
      await db
        .select()
        .from(postReactions)
        .where(
          and(
            eq(postReactions.postId, Number(id)),
            eq(postReactions.userId, payload.id),
          )
        );

    if (reaction.length === 0) {

      await db
        .insert(postReactions)
        .values({
          postId: Number(id),
          userId: payload.id,
          type: body.type,
        });

      return {
        message: "Reacción agregada.",
      };

    }

    if (reaction[0].type === body.type) {

      await db
        .delete(postReactions)
        .where(eq(postReactions.id, reaction[0].id));

      return {
        message: "Reacción eliminada.",
      };

    }

    await db
      .update(postReactions)
      .set({
        type: body.type,
      })
      .where(eq(postReactions.id, reaction[0].id));

    return {
      message: "Reacción actualizada.",
    };

  });

}