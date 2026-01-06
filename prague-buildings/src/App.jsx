import { useEffect, useState } from "react";
import { fetchBuildings } from "./data/fetchWikidata";
import { normalizeBuildings } from "./data/normalizeBuildings";
import FilterBar from "./components/FilterBar";
import BuildingGrid from "./components/BuildingGrid";

function App() {
    const [loading, setLoading] = useState(true);
    const [buildings, setBuildings] = useState([]);
    const [filtered, setFiltered] = useState([]);

    const [filters, setFilters] = useState({
        yearFrom: "",
        yearTo: "",
        style: "all",
        architect: "all",
    });

    useEffect(() => {
        async function load() {
            setLoading(true);
            const data = await fetchBuildings();
            const normalized = normalizeBuildings(data);
            setBuildings(normalized);
            setFiltered(normalized);
            setLoading(false);
        }
        load();
    }, []);

    // set build years to oldest/youngest build year of actual data
    useEffect(() => {
        if (buildings.length === 0) return;

        const years = buildings
            .map(b => b.year)
            .filter(Boolean);

        if (years.length === 0) return;

        setFilters(f => ({
            ...f,
            yearFrom: Math.min(...years).toString(),
            yearTo: Math.max(...years).toString(),
        }));
    }, [buildings]);

    useEffect(() => {
        let result = buildings;

        const yearFrom = filters.yearFrom !== "" ? Number(filters.yearFrom) : null;
        const yearTo = filters.yearTo !== "" ? Number(filters.yearTo) : null;

        result = result.filter(b => {
            if (!b.year) return true;
            if (yearFrom !== null && b.year < yearFrom) return false;
            return !(yearTo !== null && b.year > yearTo);
        });

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
        {loading && (
            <div style={{ textAlign: "center", marginTop: "40px" }}>
                <div className="spinner" />
                <p>Loading buildings from Wikidata…</p>
            </div>
        )}
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
