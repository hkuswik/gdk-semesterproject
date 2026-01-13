# Semestral Project in the course 'Graph Data & Knowledge'

## Prague Architectural Explorer

This project is a semester assignment for the Graph Data course, demonstrating the consumption of **Linked Open Data** in a practical web application. It visualizes historical buildings in **Prague**, allowing users to explore architectural styles, architects, building types, and heritage status interactively.

![AppScreenshot](/prague-buildings/public/AppScreenshot.png)

---

## Features

- Interactive map of historical buildings in Prague
- Filter buildings by:
    - Architectural style
    - Architect
    - Building type
    - Heritage status
- Detail card with:
    - Building image
    - Year of construction
    - Styles and architects
    - Heritage designation
- Navigation between buildings directly from the detail card
- Data sourced from **Wikidata**, leveraging SPARQL queries

---

## Data & Linked Data

- Uses **Wikidata SPARQL endpoint** to fetch buildings located in Prague
- Data includes:
    - Coordinates
    - Labels & descriptions
    - Architects & architectural styles
    - Images
    - Heritage status
    - Construction year
- Demonstrates the use of **graph data principles**:
    - Each building, architect, and style is an **entity with a URI**
    - SPARQL queries aggregate and normalize data for visualization
    - Semantic linking preserved in URIs (can be extended to other datasets)

---

## Implementation Details

The technical implementation of this project, including architecture, components, and data fetching, can be found in the [`prague-buildings`](/prague-buildings/README.md) folder.

---

## Live Demo

The application can be hosted using **GitHub Pages**:

- [GitHub Pages link when deployed]()
