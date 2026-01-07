import "./App.css";
import { useEffect, useMemo, useState } from "react";
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

    const filteredBuildings = useMemo(() => {
        return buildings.filter(b => {
            const matchesStyle =
                filters.styles.length === 0 ||
                filters.styles.some(s => b.styles.includes(s));

            const matchesArchitect =
                filters.architects.length === 0 ||
                filters.architects.some(a => b.architects.includes(a));

            return matchesStyle && matchesArchitect;
        });
    }, [buildings, filters]);

    const selectedBuilding = filteredBuildings.find(
        b => b.id === selectedBuildingId
    );

    const buildingsForStyleOptions = useMemo(() => {
        return buildings.filter(b => {
            return filters.architects.length === 0 ||
                filters.architects.some(a => b.architects.includes(a));
        });
    }, [buildings, filters.architects]);

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
                        <div className="spinner"/>
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
                <BuildingDetailsCard building={selectedBuilding}/>
            ) : (
                <p>No building selected</p>
            )}
        </div>
    </div>);
}

export default App;
