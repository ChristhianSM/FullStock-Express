export function parsePriceToCents(value) {
    if (value === undefined) {
        return null;
    }

    const trimmedValue = value.trim();

    if (trimmedValue === "") {
        return null;
    }
    const numberValue = Number(trimmedValue);

    if (!Number.isFinite(numberValue)) {
        return null;
    }

    const priceInCents = Math.round(numberValue * 100);

    return priceInCents;
}
