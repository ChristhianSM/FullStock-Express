import { getData } from "../data/db.js";

export async function getNextId(collectionName) {
  const data = await getData();

  const collection = data[collectionName] || []; // data["carts"] = [{ "id": 1, "items": [] }, { "id": 5, "items": [] }]

  if (collection.length === 0) return 1;

  const ids = collection.map((item) => item.id); // [1, 5]

  const valueMax = Math.max(...ids); // 5

  return valueMax + 1; // 6
}
