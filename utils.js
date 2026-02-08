export function parsePriceToCents(value) {
  // Parámetro ausente
  if (value === undefined) return null;

  // Limpiar espacios
  const trimmed = value.trim();

  // String vacío o solo espacios
  if (trimmed === "") return null;

  const number = Number(trimmed);

  // NaN, Infinity, -Infinity
  if (!Number.isFinite(number)) return null;

  // No se aceptan precios negativos
  if (number < 0) return null;

  // Convertir a centavos
  return Math.round(number * 100);
}
