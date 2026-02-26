import { getData, saveData } from "../data/db.js";
import { getNextId } from "../utils/db.js";

export async function create(order) {
  const data = await getData();

  if (!data.orders) {
    data.orders = [];
  }

  const nextId = await getNextId("orders"); // 1

  const newOrder = {
    id: nextId,
    ...order,
    status: "pending",
    createAt: new Date().toISOString(),
  };

  data.orders.push(newOrder);

  await saveData(data);

  return newOrder;
}

export async function findById(id) {
  const data = await getData();

  if (!data.orders) return null;

  const orderFinded = data.orders.find((order) => order.id === id) || null;

  return orderFinded;
}
