# Prague Architectural Explorer – Technical Implementation

This document describes the technical implementation of the **Prague Architectural Explorer** web application.

---

## Project Structure

prague-buildings/
├── src/
│ ├── components/
│ │ ├── BuildingDetailsCard.jsx
│ │ ├── FilterBar.jsx
│ │ ├── FilterPill.jsx
│ │ └── MapView.jsx
│ ├── data/
│ │ ├── fetchWikidata.js
│ │ ├── normalizeBuildings.js
│ │ ├── styleNormalizer.js
│ │ └── heritageNormalizer.js
│ ├── hooks/
│ │ └── useBuildingFilters.js
│ ├── App.jsx
│ └── main.jsx
├── public/
│ └── icons/...
├── package.json
└── vite.config.js

---

## Technologies Used

- **React** + **Vite** for fast frontend development
- **Leaflet.js** for interactive map visualization
- **Wikidata SPARQL endpoint** as the data source
- CSS modules for component styling
- Modern JavaScript

---

## Data Fetching

- `fetchWikidata.js` contains the SPARQL query to fetch buildings in Prague.
- Query retrieves:
    - Coordinates (`P625`)
    - Images (`P18`)
    - Architects (`P84`)
    - Architectural styles (`P149`)
    - Heritage status (`P1435`)
    - Construction year (`P571`)
- Query uses:
    - `OPTIONAL` statements for missing data
    - `FILTER` to select architecturally interesting or historic buildings
    - `VALUES` to limit building types and styles
    - `GROUP_CONCAT` to combine multiple architects or styles

- Data is returned as **JSON** and normalized in `normalizeBuildings.js`:
    - Splits multiple styles/architects
    - Normalizes style names (`styleNormalizer.js`)
    - Processes heritage labels (`heritageNormalizer.js`)
    - Extracts year from `inception` property

---

## State Management & Filtering

- Custom hook `useBuildingFilters.js` handles:
    - Filtering by styles, architects, building type, and heritage
    - Available filter options based on current selection
    - Selected building and navigation (`next` / `prev`)
- Filtering logic is optimized using `useMemo` for performance.

---

## Components Overview

- **App.jsx**
    - Loads data and manages global state
    - Renders `FilterBar`, `MapView`, and `BuildingDetailsCard`

- **FilterBar.jsx**
    - Displays interactive filters
    - Uses `FilterPill` for multi-select and clickable tags

- **MapView.jsx**
    - Shows building markers on a Leaflet map
    - Syncs selection with detail card

- **BuildingDetailsCard.jsx**
    - Displays building info in a card
    - Allows toggling filters directly from card
    - Uses `FilterPill` to select more filters and keep filter-design consistent
    - Navigates between buildings

---

## Styling & UX

- Responsive layout with map and detail card side by side
- Skeleton loaders while fetching data
- Clear filter hierarchy:
    - Styles → Architects → Building Types → Heritage
- Detail card includes year, style, architect, type and heritage

---

## Deployment

- Build the app using:

```bash
npm install
npm run build