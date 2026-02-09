export const parsePriceToCents = (value) => {

  // Si es undefined o null, retornar null de inmediato
  if (value === undefined || value === null) return null;

  const trimmedValue = String(value).trim();

  // Si después del trim el string está vacío, es inválido
  if (trimmedValue === "") return null;

  const numberValue = Number(trimmedValue);

  // Validamos si es un número real y finito
  if (isNaN(numberValue) || !Number.isFinite(numberValue)) {
    return null;
  }

  // Retornamos centavos redondeados
  return Math.round(numberValue * 100);

};

export const validationMaxMinPrice= (minPrice, maxPrice) => {
    if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
        return false; // El precio mínimo no puede ser mayor que el máximo
    }   
    return true;
}
export const isString = (value) => {
    if(isNaN(Number(value))){
        return true;
    }
    return false;
}