import { getData } from "../data/db.js";

export async function getNextId(collectionName) {
  const data = await getData();
  const collection = data[collectionName] || [];

  if (collection.length === 0) return 1;

  const ids = collection.map((item) => item.id); // [1, 2, 3]

  const valueMax = Math.max(...ids);

  return valueMax + 1;
}
