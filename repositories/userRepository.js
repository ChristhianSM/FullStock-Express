import { getData, saveData } from "../data/db.js";
import { getNextId } from "../utils/db.js";

export async function findById(id) {
  const data = await getData();

  const user = data.users.find((user) => user.id === id);

  return user || null;
}

export async function findByEmail(email) {
  const data = await getData();

  const user = data.users.find((user) => user.email === email);

  return user || null;
}

export async function create(userData) {
  const data = await getData();

  const nextId = await getNextId("users");

  const newUser = {
    id: nextId,
    ...userData,
  };

  data.users.push(newUser);

  await saveData(data);

  return newUser;
}
