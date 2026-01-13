import { useMemo } from "react";

function hasHeritage(b) {
    return Boolean(b.heritage);
}

function buildingMatchesFilters(b, filters, ignore = null) {
    if (ignore !== "heritageOnly" && filters.heritageOnly && !b.heritage) {
        return false;
    }

    if (ignore !== "styles" && filters.styles.length > 0) {
        if (!filters.styles.some(s =>
            s === "__NO_STYLE__"
                ? b.styles.length === 0
                : b.styles.includes(s)
        )) return false;
    }

    if (ignore !== "architects" && filters.architects.length > 0) {
        if (!filters.architects.some(a => b.architects.includes(a))) {
            return false;
        }
    }

    if (ignore !== "buildingTypes" && filters.buildingTypes.length > 0) {
        if (!filters.buildingTypes.includes(b.type)) {
            return false;
        }
    }

    return true;
}

export function useBuildingFilters(
    buildings,
    filters,
    selectedBuildingId,
    setSelectedBuildingId
) {

    // filter buildings
    const filteredBuildings = useMemo(
        () => buildings.filter(b => buildingMatchesFilters(b, filters)),
        [buildings, filters]
    );

    // currently shown building
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

    // STYLES
    const buildingsForStyleOptions = useMemo(() => {
        return buildings.filter(b =>
            buildingMatchesFilters(b, filters, "styles")
        );
    }, [buildings, filters]);

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
        if (hasNoStyle) result.push("__NO_STYLE__");

        return result;
    }, [buildingsForStyleOptions]);

    // ARCHITECTS
    const buildingsForArchitectOptions = useMemo(() => {
        return buildings.filter(b =>
            buildingMatchesFilters(b, filters, "architects")
        );
    }, [buildings, filters]);

    const availableArchitects = useMemo(() => {
        const set = new Set();

        buildingsForArchitectOptions.forEach(b =>
            b.architects.forEach(a => set.add(a))
        );

        return Array.from(set).sort();
    }, [buildingsForArchitectOptions]);

    // BUILDING TYPE
    const buildingsForTypeOptions = useMemo(() => {
        return buildings.filter(b =>
            buildingMatchesFilters(b, filters, "buildingTypes")
        );
    }, [buildings, filters]);

    const availableBuildingTypes = useMemo(() => {
        const set = new Set();

        buildingsForTypeOptions.forEach(b => {
            if (b.type) set.add(b.type);
        });

        return Array.from(set).sort();
    }, [buildingsForTypeOptions]);

    // HERITAGE
    const heritageAvailable = useMemo(() => {
        return buildings.some(b => hasHeritage(b) && buildingMatchesFilters(b, filters, "heritageOnly"));
    }, [buildings, filters]);

    return {
        filteredBuildings,
        availableStyles,
        availableArchitects,
        availableBuildingTypes,
        heritageAvailable,
        selectedBuilding,
        selectedIndex,
        selectPrev,
        selectNext,
    };
}
