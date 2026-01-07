import "./App.css";
import "./components/BuildingDetailsCard.css";
import { useEffect, useMemo, useState } from "react";
import { fetchBuildings } from "./data/fetchWikidata";
import { normalizeBuildings } from "./data/normalizeBuildings";
import FilterBar from "./components/FilterBar";
import MapView from "./components/MapView";
import BuildingDetailsCard from "./components/BuildingDetailsCard.jsx";

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

    // filter buildings
    const filteredBuildings = useMemo(() => {
        return buildings.filter(b => {
            const matchesStyle =
                filters.styles.length === 0 ||
                filters.styles.some(s => {
                    if (s === "__NO_STYLE__") {
                        return b.styles.length === 0;
                    }
                    return b.styles.includes(s);
                });

            const matchesArchitect =
                filters.architects.length === 0 ||
                filters.architects.some(a => b.architects.includes(a));

            return matchesStyle && matchesArchitect;
        });
    }, [buildings, filters]);

    // calculate building to be displayed immediately
    const selectedBuilding = useMemo(() => {
        if (filteredBuildings.length === 0) return null;

        // search building the user clicked on
        const found = filteredBuildings.find(b => b.id === selectedBuildingId);

        // FALLBACK: if ID isn't in list anymore, take first building in filtered list
        return found || filteredBuildings[0];
    }, [filteredBuildings, selectedBuildingId]);

    // iterate over buildings
    const selectedIndex = useMemo(() => {
        if (!selectedBuilding) return -1;
        return filteredBuildings.findIndex(
            b => b.id === selectedBuilding.id
        );
    }, [filteredBuildings, selectedBuilding]);

    const selectPrev = () => {
        if (filteredBuildings.length === 0) return;

        const prevIndex =
            selectedIndex <= 0
                ? filteredBuildings.length - 1
                : selectedIndex - 1;

        setSelectedBuildingId(filteredBuildings[prevIndex].id);
    };

    const selectNext = () => {
        if (filteredBuildings.length === 0) return;

        const nextIndex =
            selectedIndex >= filteredBuildings.length - 1
                ? 0
                : selectedIndex + 1;

        setSelectedBuildingId(filteredBuildings[nextIndex].id);
    };

    const buildingsForStyleOptions = useMemo(() => {
        return buildings.filter(b => {
            return filters.architects.length === 0 ||
                filters.architects.some(a => b.architects.includes(a));
        });
    }, [buildings, filters.architects]);

    const availableStyles = useMemo(() => {
        const set = new Set();
        let hasNoStyle = false;

        buildingsForStyleOptions.forEach(b => {
            if (b.styles.length === 0) {
                hasNoStyle = true;
            } else {
                b.styles.forEach(s => set.add(s));
            }
        });

        const result = Array.from(set).sort();

        if (hasNoStyle) {
            result.push("__NO_STYLE__");
        }

        return result;
    }, [buildingsForStyleOptions]);

    const availableArchitects = useMemo(() => {
        const set = new Set();

        filteredBuildings.forEach(b =>
            b.architects.forEach(a => set.add(a))
        );

        return Array.from(set).sort();
    }, [filteredBuildings]);

    return (<div className="app">
        <div className="header">
            <h1>Prague Architectural Explorer</h1>
            {loading ? (
                <div className="spinner-container">
                    <div className="architect-loader"/>
                    <p>Loading buildings from Wikidata...</p>
                </div>
            ) : (
                <FilterBar
                    filters={filters}
                    setFilters={setFilters}
                    availableStyles={availableStyles}
                    availableArchitects={availableArchitects}
                />
            )}
        </div>
        <div className="main-content">
            {loading ? (
                <>
                    <div className="skeleton map-skeleton"/>
                    <div className="building-card-wrapper">
                        <button className="nav-arrow" disabled>◀</button>
                        <div className="skeleton card-skeleton"/>
                        <button className="nav-arrow" disabled>▶</button>
                    </div>
                </>
            ) : (
                <>
                    <MapView
                        buildings={filteredBuildings}
                        selectedBuildingId={selectedBuilding?.id || null}
                        onSelectBuilding={setSelectedBuildingId}
                    />
                    {selectedBuilding && (
                        <BuildingDetailsCard
                            building={selectedBuilding}
                            onPrev={selectPrev}
                            onNext={selectNext}
                            selectedIndex={selectedIndex}
                            buildingsCount={filteredBuildings.length}
                        />
                    )}
                </>
            )}
        </div>
    </div>);
}

export default App;
