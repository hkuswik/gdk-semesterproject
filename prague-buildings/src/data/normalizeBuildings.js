import { normalizeStyle } from "./styleNormalizer.js";

export function normalizeBuildings(sparqlJson) {
    return sparqlJson.results.bindings.map(b => ({
        id: b.building.value,
        label: b.buildingLabel?.value ?? "Nameless Building",
        description: b.buildingDescription?.value ?? "",
        type: b.type?.value ?? "",
        heritage: b.heritageLabel?.value ?? null,
        coords: b.coords?.value ?? null,
        year: b.inception?.value
            ? new Date(b.inception.value).getFullYear()
            : null,
        architects: b.architects?.value
            ? b.architects.value.split(", ")
            : [],
        styles: b.styles?.value
            ? Array.from(new Set(
                b.styles.value
                    .split(", ")
                    .map(normalizeStyle)
            ))
            : [],
        image: b.image?.value ?? null,
    }));
}
