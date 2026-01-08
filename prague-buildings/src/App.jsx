import "./App.css";
import "./components/BuildingDetailsCard.css";
import { useEffect, useState } from "react";
import { fetchBuildings } from "./data/fetchWikidata";
import { normalizeBuildings } from "./data/normalizeBuildings";
import { useBuildingFilters } from "./hooks/useBuildingFilters.js";
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
        buildingTypes: [],
    });

    useEffect(() => {
        async function load() {
            setLoading(true);
            const data = await fetchBuildings();
            setBuildings(normalizeBuildings(data));
            setLoading(false);
        }

        load();
    }, []);

    const {
        filteredBuildings,
        availableStyles,
        availableArchitects,
        availableBuildingTypes,
        selectedBuilding,
        selectedIndex,
        selectPrev,
        selectNext,
    } = useBuildingFilters(
        buildings,
        filters,
        selectedBuildingId,
        setSelectedBuildingId
    );

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
                    availableBuildingTypes={availableBuildingTypes}
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
                            filters={filters}
                            setFilters={setFilters}
                        />
                    )}
                </>
            )}
        </div>
    </div>);
}

export default App;
