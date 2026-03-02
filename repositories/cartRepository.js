import { getData, saveData } from "../data/db.js";
import { getNextId } from "../utils/db.js";

export async function find(id) {
  // id del carrito
  const data = await getData();

  if (!data.carts) {
    data.carts = [];
  }

  return data.carts.find((cart) => cart.id === id) || null;
}

// Crea una nueva función create() (sin argumentos). Esta función debe:

// Obtener el siguiente ID disponible usando getNextId("carts").
// Crear un nuevo objeto carrito: { id: nuevoId, items: [] }.
// Agregarlo al array db.carts.
// Guardar la base de datos.
// Retornar el nuevo carrito.

export async function create() {
  const data = await getData();

  const nextId = await getNextId("carts");

  const newCart = {
    id: nextId,
    items: [],
  };

  data.carts.push(newCart);

  await saveData(data);

  return newCart;
}

// Modifica update para que busque el índice del carrito a actualizar usando su id.

// Si lo encuentra, reemplaza el objeto en esa posición.
// Si no lo encuentra (caso raro, pero posible), agrégalo al final del array.

export async function update(cartData) {
  const data = await getData();

  const cartIndexFinded = data.carts.findIndex(
    (cart) => cart.id === cartData.id,
  );

  if (cartIndexFinded !== -1) {
    data.carts[cartIndexFinded] = cartData;
  } else {
    data.carts.push(cartData);
  }

  await saveData(data);

  return cartData;
}
