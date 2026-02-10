export function parsePriceToCents(value) {
    if (!value || isNaN(value) || value === "Infinity" || value.trim() === "") return null;
    return value * 100;
} 