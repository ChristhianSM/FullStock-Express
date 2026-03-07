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

export async function updateUserIdByEmail(email, userId) {
  // email = christhian2524@gmail.com1
  const data = await getData();

  if (!data.orders) return null;

  data.orders = data.orders.map((order) => {
    if (email === order.shippingInfo.email) {
      return {
        ...order,
        userId,
      };
    }

    return order;
  });

  await saveData(data);
}
