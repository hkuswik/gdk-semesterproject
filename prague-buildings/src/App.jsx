import "./App.css";
import { useEffect, useState, useMemo } from "react";
import { fetchBuildings } from "./data/fetchWikidata";
import { normalizeBuildings } from "./data/normalizeBuildings";
import FilterBar from "./components/FilterBar";
import MapView from "./components/MapView";
import BuildingDetailsCard from "./components/BuidingDetailsCard.jsx";

function App() {
    const [loading, setLoading] = useState(true);
    const [buildings, setBuildings] = useState([]);
    const [selectedBuildingId, setSelectedBuildingId] = useState(null);

    const [filters, setFilters] = useState({
        styles: [],
        architects: [],
        yearRange: [0, 2026],
    });

    useEffect(() => {
        async function load() {
            setLoading(true);
            const data = await fetchBuildings();
            const normalized = normalizeBuildings(data);
            setBuildings(normalized);
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
            yearRange: [Math.min(...years), Math.max(...years)],
        }));
    }, [buildings]);

    const filteredBuildings = useMemo(() => {
        return buildings.filter(b => {
            const matchesStyle =
                filters.styles.length === 0 ||
                filters.styles.some(s => b.styles.includes(s));

            const matchesArchitect =
                filters.architects.length === 0 ||
                filters.architects.some(a => b.architects.includes(a));

            const matchesYear =
                !b.year ||
                (b.year >= filters.yearRange[0] &&
                    b.year <= filters.yearRange[1]);

            return matchesStyle && matchesArchitect && matchesYear;
        });
    }, [buildings, filters]);

    const selectedBuilding = filteredBuildings.find(
        b => b.id === selectedBuildingId
    );

    const buildingsForStyleOptions = useMemo(() => {
        return buildings.filter(b => {
            const matchesArchitect =
                filters.architects.length === 0 ||
                filters.architects.some(a => b.architects.includes(a));

            const matchesYear =
                !b.year ||
                (b.year >= filters.yearRange[0] &&
                    b.year <= filters.yearRange[1]);

            return matchesArchitect && matchesYear;
        });
    }, [buildings, filters.architects, filters.yearRange]);

    const buildingsForYearRange = useMemo(() => {
        return buildings.filter(b => {
            const matchesStyle =
                filters.styles.length === 0 ||
                filters.styles.some(s => b.styles.includes(s));

            const matchesArchitect =
                filters.architects.length === 0 ||
                filters.architects.some(a => b.architects.includes(a));

            return matchesStyle && matchesArchitect;
        });
    }, [buildings, filters.styles, filters.architects]);

    useEffect(() => {
        const years = buildingsForYearRange
            .map(b => b.year)
            .filter(Boolean);

        if (years.length === 0) return;

        const min = Math.min(...years);
        const max = Math.max(...years);

        setFilters(f => {
            const [currentMin, currentMax] = f.yearRange;

            // Clamp nur wenn nötig (wichtig!)
            return {
                ...f,
                yearRange: [
                    Math.max(currentMin, min),
                    Math.min(currentMax, max),
                ],
            };
        });
    }, [buildingsForYearRange]);

    const availableStyles = useMemo(() => {
        const set = new Set();

        buildingsForStyleOptions.forEach(b =>
            b.styles.forEach(s => set.add(s))
        );

        return Array.from(set).sort();
    }, [buildingsForStyleOptions]);

    const availableArchitects = useMemo(() => {
        const set = new Set();

        filteredBuildings.forEach(b =>
            b.architects.forEach(a => set.add(a))
        );

        return Array.from(set).sort();
    }, [filteredBuildings]);

    useEffect(() => {
        if (filteredBuildings.length > 0) {
            setSelectedBuildingId(filteredBuildings[0].id);
        } else {
            setSelectedBuildingId(null);
        }
    }, [filteredBuildings]);

    return (<div className="app">
        <div className="header">
            <h1>Prague Architectural Explorer</h1>
            <div className="filter-row">
                <FilterBar
                    filters={filters}
                    setFilters={setFilters}
                    availableStyles={availableStyles}
                    availableArchitects={availableArchitects}
                />
                {loading && (
                    <div className="spinner-container">
                        <div className="spinner" />
                        <p>Loading buildings from Wikidata…</p>
                    </div>
                )}
            </div>
        </div>
        <div className="main-content">
            <MapView
                buildings={filteredBuildings}
                selectedBuildingId={selectedBuildingId}
                onSelectBuilding={setSelectedBuildingId}
            />
            {selectedBuilding ? (
                <BuildingDetailsCard building={selectedBuilding} />
            ) : (
                <p>No building selected</p>
            )}
        </div>
    </div>);
}

export default App;
