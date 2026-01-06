// converts Wikidata's WKT Point into [Lat, Lon] Coordinates
export function parseWktPoint(wkt) {
    if (!wkt) return null;

    const match = wkt.match(/Point\(([^ ]+) ([^)]+)\)/);
    if (!match) return null;

    const lon = parseFloat(match[1]);
    const lat = parseFloat(match[2]);

    return [lat, lon];
}
