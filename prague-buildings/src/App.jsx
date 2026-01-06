import { useEffect, useState } from "react";
import { fetchBuildings } from "./data/fetchWikidata";
import { normalizeBuildings } from "./data/normalizeBuildings";
import FilterBar from "./components/FilterBar";
import BuildingGrid from "./components/BuildingGrid";

function App() {
    const [buildings, setBuildings] = useState([]);
    const [filtered, setFiltered] = useState([]);

    const [filters, setFilters] = useState({
        yearFrom: 0,
        yearTo: 2026,
        style: "all",
        architect: "all",
    });

    const [results, setResults] = useState(null);

    useEffect(() => {
        async function load() {
            const data = await fetchBuildings();
            const normalized = normalizeBuildings(data);
            setBuildings(normalized);
            setFiltered(normalized);
        }
        load();
    }, []);

    useEffect(() => {
        let result = buildings;

        result = result.filter(b =>
            (!b.year || (b.year >= filters.yearFrom && b.year <= filters.yearTo))
        );

        if (filters.style !== "all") {
            result = result.filter(b =>
                b.styles.includes(filters.style)
            );
        }

        if (filters.architect !== "all") {
            result = result.filter(b =>
                b.architects.includes(filters.architect)
            );
        }

        setFiltered(result);
    }, [filters, buildings]);

    return (<div style={{ padding: "20px" }}>
        <h2>Prague Architectural Explorer</h2>

        <FilterBar
            buildings={buildings}
            filters={filters}
            setFilters={setFilters}
        />

        <BuildingGrid buildings={filtered} />
    </div>);
}

export default App;
