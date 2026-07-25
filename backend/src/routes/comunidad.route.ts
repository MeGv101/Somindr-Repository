import { FastifyInstance } from "fastify";

import * as communityService from "../services/comunidad.service.js";

export async function communityRoutes(
  fastify: FastifyInstance
) {



  // POSTS

  fastify.get("/posts", async (request) => {

    const payload =
      await request.jwtVerify<{
        id: number;
      }>();

    return communityService.getPosts(
      payload.id
    );

  });

  fastify.post("/posts", async (request) => {

    const payload =
      await request.jwtVerify<{
        id: number;
      }>();

    const body =
      request.body as {
        title: string;
        category: string;
        content: string;
      };

    return communityService.createPost(
      payload.id,
      body
    );

  });

  fastify.patch("/posts/:id", async (request) => {

    const payload =
      await request.jwtVerify<{
        id: number;
      }>();

    const params =
      request.params as {
        id: string;
      };

    const body =
      request.body as {
        title: string;
        category: string;
        content: string;
      };

    return communityService.updatePost(
      payload.id,
      Number(params.id),
      body
    );

  });

  fastify.delete("/posts/:id", async (request) => {

    const payload =
      await request.jwtVerify<{
        id: number;
      }>();

    const params =
      request.params as {
        id: string;
      };

    return communityService.deletePost(
      payload.id,
      Number(params.id)
    );

  });



  // COMMENTS

  fastify.post(
    "/posts/:id/comments",
    async (request) => {

      const payload =
        await request.jwtVerify<{
          id: number;
        }>();

      const params =
        request.params as {
          id: string;
        };

      const body =
        request.body as {
          content: string;
        };

      return communityService.createComment(
        payload.id,
        Number(params.id),
        body.content
      );

    }
  );

  fastify.get(
    "/posts/:id/comments",
    async (request) => {

      const params =
        request.params as {
          id: string;
        };

      return communityService.getComments(
        Number(params.id)
      );

    }
  );

  fastify.patch(
    "/comments/:id",
    async (request) => {

      const payload =
        await request.jwtVerify<{
          id: number;
        }>();

      const params =
        request.params as {
          id: string;
        };

      const body =
        request.body as {
          content: string;
        };

      return communityService.updateComment(
        payload.id,
        Number(params.id),
        body.content
      );

    }
  );

  fastify.delete(
    "/comments/:id",
    async (request) => {

      const payload =
        await request.jwtVerify<{
          id: number;
        }>();

      const params =
        request.params as {
          id: string;
        };

      return communityService.deleteComment(
        payload.id,
        Number(params.id)
      );

    }
  );



  // REACTIONS

  fastify.post(
    "/posts/:id/reaction",
    async (request) => {

      const payload =
        await request.jwtVerify<{
          id: number;
        }>();

      const params =
        request.params as {
          id: string;
        };

      const body =
        request.body as {
          type: "LIKE" | "DISLIKE";
        };

      return communityService.react(
        payload.id,
        Number(params.id),
        body.type
      );
    }
  );
}