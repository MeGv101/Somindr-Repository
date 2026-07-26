import * as repository from "../repositories/comunidad.repository.js";



// POSTS

export async function getPosts(userId: number) {

  const rawPosts =
    await repository.getPosts();

  const result = await Promise.all(
    rawPosts.map(async (post) => {
      const reactions =
        await repository.getPostReactions(
          post.id
        );

      const comments =
        await repository.getCommentsByPost(
          post.id
        );

      const myReaction =
        reactions.find(
          reaction =>
            reaction.userId === userId
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
            reaction => reaction.type === "DISLIKE"
          ).length,
        comments,
        userReaction:
          myReaction?.type ?? null,
      };
    })
  );
  return result;
}

export async function createPost(
  userId: number,
  body: {
    title: string;
    category: string;
    content: string;
  }
) {

  if (
    !body.title ||
    !body.category ||
    !body.content
  ) {
    throw new Error(
      "Todos los campos son obligatorios."
    );
  }

  const [post] =
    await repository.createPost({
      userId,
      title: body.title,
      category: body.category,
      content: body.content,
    });
  return post;
}

export async function updatePost(
  userId: number,
  postId: number,
  body: {
    title: string;
    category: string;
    content: string;
  }

) {

  const post =
    await repository.getPostById(
      postId
    );

  if (!post) {
    throw new Error(
      "POST_NOT_FOUND"
    );
  }

  if (
    post.userId !== userId
  ) {
    throw new Error(
      "FORBIDDEN"
    );
  }

  await repository.updatePost(
    postId,
    body
  );

  return {
    message:
      "Publicación actualizada."
  };

}

export async function deletePost(
  userId: number,
  postId: number

) {

  const post =
    await repository.getPostById(
      postId
    );

  if (!post) {
    throw new Error(
      "POST_NOT_FOUND"
    );
  }

  if (
    post.userId !== userId
  ) {
    throw new Error(
      "FORBIDDEN"
    );
  }

  await repository.deletePost(
    postId
  );

  return {
    message:
      "Publicación eliminada."
  };
}



// COMMENTS

export async function createComment(
  userId: number,
  postId: number,
  content: string
) {

  if (!content) {

    throw new Error(
      "EMPTY_COMMENT"
    );

  }

  const [comment] =
    await repository.createComment({
      postId,
      userId,
      content,
    });
  return comment;
}

export async function getComments(
  postId: number
) {

  return repository.getCommentsByPost(
    postId
  );

}

export async function updateComment(
  userId: number,
  commentId: number,
  content: string

) {

  const comment =
    await repository.getCommentById(
      commentId
    );

  if (!comment) {
    throw new Error(
      "COMMENT_NOT_FOUND"
    );

  }

  if (
    comment.userId !== userId
  ) {

    throw new Error(
      "FORBIDDEN"
    );

  }

  await repository.updateComment(
    commentId,
    content
  );

  return {
    message:
      "Comentario actualizado."
  };

}

export async function deleteComment(
  userId: number,
  commentId: number

) {

  const comment =
    await repository.getCommentById(
      commentId
    );

  if (!comment) {

    throw new Error(
      "COMMENT_NOT_FOUND"
    );

  }

  if (
    comment.userId !== userId
  ) {

    throw new Error(
      "FORBIDDEN"
    );
  }

  await repository.deleteComment(
    commentId
  );
  return {
    message:
      "Comentario eliminado."
  };

}


// REACTIONS

export async function react(
  userId: number,
  postId: number,
  type: "LIKE" | "DISLIKE"

) {

  if (
    type !== "LIKE" &&
    type !== "DISLIKE"
  ) {

    throw new Error(
      "INVALID_REACTION"
    );

  }

  const reaction =
    await repository.getReaction(
      postId,
      userId
    );

  if (!reaction) {

    await repository.createReaction({
      postId,
      userId,
      type,
    });

    return {
      message:
        "Reacción agregada."
    };
  }
  if (
    reaction.type === type
  ) {
    await repository.deleteReaction(
      reaction.id
    );
    return {
      message:
        "Reacción eliminada."
    };
  }

  await repository.updateReaction(
    reaction.id,
    type
  );
  return {
    message:
      "Reacción actualizada."
  };

}

export async function getPostsByUsername(
  username: string
) {
  return await repository
    .findPostsByUsername(username);
}