import * as repository from "../repositories/admin.repository.js";

export async function getDashboard() {
  return await repository.getDashboardStats();
}