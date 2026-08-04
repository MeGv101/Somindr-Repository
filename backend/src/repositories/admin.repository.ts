import { db } from "../db/index.js";
import {
  users,
  professionals,
  professionalClients,
  posts,
} from "../db/schema.js";
import { count, eq } from "drizzle-orm";

export async function getDashboardStats() {
  const [usersCount] = await db
    .select({
      total: count(),
    })
    .from(users);

  const [professionalsCount] = await db
    .select({
      total: count(),
    })
    .from(professionals);

  const [clientsCount] = await db
    .select({
      total: count(),
    })
    .from(professionalClients)
    .where(
      eq(
        professionalClients.active,
        true
      )
    );

  const [postsCount] = await db
    .select({
      total: count(),
    })
    .from(posts);

  return {
    users: usersCount.total,
    professionals: professionalsCount.total,
    activeClients: clientsCount.total,
    posts: postsCount.total,
  };
}