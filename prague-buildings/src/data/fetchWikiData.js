export async function fetchBuildings() {
    const endpointUrl = "https://query.wikidata.org/sparql";

    const sparqlQuery = `
PREFIX wd: <http://www.wikidata.org/entity/> 
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX schema: <http://schema.org/>
PREFIX bd: <http://www.bigdata.com/rdf#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT ?building
       (SAMPLE(?label) AS ?buildingLabel)
       (SAMPLE(?desc) AS ?buildingDescription)
       (SAMPLE(?typeLabel) AS ?type)
       (SAMPLE(?heritageLabel) AS ?heritageLabel)
       (SAMPLE(?coords) AS ?coords)
       (SAMPLE(?inception) AS ?inception)
       (GROUP_CONCAT(DISTINCT ?architectLabel; SEPARATOR=", ") AS ?architects)
       (GROUP_CONCAT(DISTINCT ?styleLabel; SEPARATOR=", ") AS ?styles)
       (SAMPLE(?image) AS ?image)  # Pick one of the pictures
WHERE {
  
  # Building Types
  VALUES ?buildingType {
      wd:Q16970      # church
      wd:Q23413      # castle
      wd:Q16560      # palace
      wd:Q44613      # monastery
      wd:Q163687     # basilica
      wd:Q108325     # chapel
      wd:Q33506      # museum building
      wd:Q12518      # tower
      wd:Q1021645    # office building
      wd:Q19844914   # university building
      wd:Q3950       # villa
      #wd:Q41176      # building (generic)
  }
  
  # Interesting architectural styles for Prague
  VALUES ?interestingStyle {
      wd:Q238255      # Deconstructivism
      wd:Q12720942    # Art Deco 
      wd:Q1295040     # Art Nouveau
      wd:Q595448      # Postmodern architecture
      wd:Q245188      # Modern architecture
      wd:Q47942       # Functionalism
      wd:Q42934       # Cubism
      wd:Q9322693     # Rondocubism
      wd:Q1148060     # Expressionist architecture
      wd:Q994776      # Brutalist architecture
      wd:Q845318      # High-tech architecture
  }

  # Located in Prague, correct Type, with Coordinates & Picture
  ?building wdt:P131* wd:Q1085 .
  ?building wdt:P31 ?buildingType .
  ?building wdt:P625 ?coords .
  ?building wdt:P18 ?image .

  # Optional metadata
  OPTIONAL { ?building wdt:P571 ?inception. }

  # Architects
  OPTIONAL { 
    ?building wdt:P84 ?architect .
    ?architect rdfs:label ?architectLabel FILTER(LANG(?architectLabel)="en") .
  }

  # Architectural style
  OPTIONAL {
    ?building wdt:P149 ?style .
    ?style rdfs:label ?styleLabel FILTER(LANG(?styleLabel)="en")
  }

  # Heritage designation
  OPTIONAL { 
      ?building wdt:P1435 ?heritage . 
      ?heritage rdfs:label ?heritageLabel FILTER(LANG(?heritageLabel)="en")
  }

  # Labels
  OPTIONAL { ?building schema:description ?desc FILTER(LANG(?desc)="en") }
  OPTIONAL { ?building rdfs:label ?label FILTER(LANG(?label)="en") }
  OPTIONAL { ?buildingType rdfs:label ?typeLabel FILTER(LANG(?typeLabel)="en") }

  # Logic
  BIND(YEAR(?inception) AS ?year)
  
  FILTER (
      # 1. Historic (before 1950)
      (BOUND(?year) && ?year < 1950)
      || 
      # 2. OR has heritage protection 
      BOUND(?heritage)
      || 
      # 3. OR interesting architectural style (also modern)
      (BOUND(?style) && ?style IN (?interestingStyle))
  )

  SERVICE wikibase:label { bd:serviceParam wikibase:language "en,cs". }
}

GROUP BY ?building
ORDER BY ASC(?inception)
LIMIT 1300
`;

    const url = endpointUrl + "?query=" + encodeURIComponent(sparqlQuery);
    const headers = { "Accept": "application/sparql-results+json" };

    const response = await fetch(url, { headers });
    return await response.json();
}
