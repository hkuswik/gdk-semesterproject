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

    // selected filter state
    const [filters, setFilters] = useState({
        styles: [],
        architects: [],
        buildingTypes: [],
        heritageOnly: false,
    });

    useEffect(() => {
        async function load() {
            setLoading(true);
            // SPARQL request to Wikidata for buildings
            const data = await fetchBuildings();
            // convert SPARQL JSON to app model
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
        heritageAvailable,
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
        {/* header with icon and title */}
        <div className="header">
            <img src="icons/prague-icon.png" alt="Prague Icon"/>
            <h1>Prague Architectural Explorer</h1>
        </div>

        {/* filter bar */}
        <div className="filters">
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
                    heritageAvailable={heritageAvailable}
                />
            )}
        </div>

        {/* main content: map + details */}
        <div className="main-content">
            {loading ? (
                <>
                    {/* placeholders while fetching */}
                    <div className="skeleton map-skeleton"/>
                    <div className="building-card-wrapper">
                        <button className="nav-arrow" disabled>◀</button>
                        <div className="skeleton card-skeleton"/>
                        <button className="nav-arrow" disabled>▶</button>
                    </div>
                </>
            ) : (
                <>
                    {/* leaflet-based map with markers */}
                    <MapView
                        buildings={filteredBuildings}
                        selectedBuildingId={selectedBuilding?.id || null}
                        onSelectBuilding={setSelectedBuildingId}
                    />
                    {/* details panel for current selection */}
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
