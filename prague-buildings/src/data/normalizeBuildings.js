import { normalizeStyle } from "./styleNormalizer.js";
import { normalizeHeritage } from "./heritageNormalizer.js";

// convert raw SPARQL bindings into application-friendly objects
export function normalizeBuildings(sparqlJson) {
    return sparqlJson.results.bindings.map(b => ({
        id: b.building.value, // keep full URI for identification
        label: b.buildingLabel?.value ?? "Nameless Building",
        type: b.type?.value ?? "",
        heritage: normalizeHeritage(b.heritageLabel?.value),
        coords: b.coords?.value ?? null, // geo coordinates
        year: b.inception?.value ? Number(b.inception.value.slice(0, 4)) : null,
        architects: b.architects?.value ? b.architects.value.split(", ") : [],
        // normalize & dedupe styles
        styles: b.styles?.value ? Array.from(new Set(b.styles.value.split(", ").map(normalizeStyle))) : [],
        image: b.image?.value ?? null,
    }));
}
