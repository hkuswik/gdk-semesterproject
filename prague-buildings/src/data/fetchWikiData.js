export async function fetchBuildings() {
    const endpointUrl = "https://query.wikidata.org/sparql";

    const sparqlQuery = `
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX schema: <http://schema.org/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX wikibase: <http://wikiba.se/ontology#>
PREFIX bd: <http://www.bigdata.com/rdf#>

SELECT ?building ?buildingLabel ?buildingDescription ?coords ?inception ?architectLabel ?architectDescription ?styleLabel ?heritageLabel ?image
WHERE {
  VALUES ?type { wd:Q41176 wd:Q16970 wd:Q174782 wd:Q609162 }    # building, church, palace, historic house

  ?building wdt:P31 ?type .
  ?building wdt:P131 wd:Q1085 .         # located in Prague

  OPTIONAL { ?building wdt:P625 ?coords . }
  OPTIONAL { ?building wdt:P571 ?inception . }      # construction date
  OPTIONAL { ?building wdt:P84 ?architect . }
  OPTIONAL { ?building wdt:P149 ?style . }
  OPTIONAL { ?building wdt:P18 ?image . }
  OPTIONAL { ?building wdt:P1435 ?heritage . }

  OPTIONAL { 
    ?building schema:description ?buildingDescription .
    FILTER(LANG(?buildingDescription) = "en")
  }

  FILTER(BOUND(?inception) && ?inception < "2025-01-01T00:00:00Z"^^xsd:dateTime)        # constructed before 2025

  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT 300
`;

    const url = endpointUrl + "?query=" + encodeURIComponent(sparqlQuery);
    const headers = { "Accept": "application/sparql-results+json" };

    const response = await fetch(url, { headers });
    const data = await response.json();

    return data;
}
