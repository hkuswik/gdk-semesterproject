# Semestral Project in the course 'Graph Data & Knowledge'

## Prague Architectural Explorer

This project is a semester assignment for the GDK course, demonstrating the consumption of **Linked Open Data** (Wikidata) in a practical web application. It visualizes historical & architecturally interesting buildings in **Prague**, allowing users to explore architectural styles, architects, building types, and heritage status interactively.

![AppScreenshot](/prague-buildings/public/AppScreenshot.png)

Note: The application does not aim to display all buildings in Prague. Instead, it visualizes a curated subset of buildings selected based on architectural relevance, data completeness, and usability considerations (e.g., availability of images and geographic coordinates).

---

## Features

- Interactive map of historical buildings in Prague
- Filter buildings by:
    - Architectural style
    - Architect
    - Building type
    - Heritage status
- Detail card with:
    - Building name
    - Building image
    - Year of construction
    - Styles and architects
    - Building type
    - Heritage designation
- Navigation between buildings
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

---

## Implementation Details

The technical implementation of this project, including architecture, components, and data fetching, can be found in the [`prague-buildings`](/prague-buildings/README.md) folder.

---

## Live Demo

The application can be hosted using **GitHub Pages**:

- [GitHub Pages Link](https://hkuswik.github.io/gdk-semesterproject/)
