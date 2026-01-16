import { useMemo } from "react";

function hasHeritage(b) {
    return Boolean(b.heritage);
}

/**
 * Checks whether a building matches the currently active filters.
 *
 * The 'ignore' parameter allows evaluating filter options independently
 * (e.g., to compute available styles without applying the style filter itself)
 */
function buildingMatchesFilters(b, filters, ignore = null) {
    // heritage filter (optional)
    if (ignore !== "heritageOnly" && filters.heritageOnly && !b.heritage) {
        return false;
    }

    // architectural styles (supports explicit "no style assigned" case)
    if (ignore !== "styles" && filters.styles.length > 0) {
        if (!filters.styles.some(s =>
            s === "__NO_STYLE__"
                ? b.styles.length === 0
                : b.styles.includes(s)
        )) return false;
    }

    // architects filter
    if (ignore !== "architects" && filters.architects.length > 0) {
        if (!filters.architects.some(a => b.architects.includes(a))) {
            return false;
        }
    }

    // building type filter
    if (ignore !== "buildingTypes" && filters.buildingTypes.length > 0) {
        if (!filters.buildingTypes.includes(b.type)) {
            return false;
        }
    }

    return true;
}

/**
 * Custom hook that:
 * - filters buildings based on user-selected criteria
 * - derives available filter options dynamically
 * - manages navigation through the filtered result set
 */
export function useBuildingFilters(buildings, filters, selectedBuildingId, setSelectedBuildingId) {
    // main filtered building list used for map markers and navigation.
    const filteredBuildings = useMemo(
        () => buildings.filter(b => buildingMatchesFilters(b, filters)),
        [buildings, filters]
    );

    /**
     * Currently selected building.
     * Falls back to the first filtered building if the previous selection is no longer valid due to filter changes
     */
    const selectedBuilding = useMemo(() => {
        if (filteredBuildings.length === 0) return null;

        const found = filteredBuildings.find(b => b.id === selectedBuildingId);
        return found || filteredBuildings[0];
    }, [filteredBuildings, selectedBuildingId]);

    // index of the selected building inside the filtered list used for prev / next navigation (cyclic)
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

    /* ============================
       STYLE FILTER OPTIONS
       ============================ */

    /**
     * Buildings used to compute available style options.
     * All filters are applied except the style filter itself
     */
    const buildingsForStyleOptions = useMemo(() => {
        return buildings.filter(b =>
            buildingMatchesFilters(b, filters, "styles")
        );
    }, [buildings, filters]);

    /**
     * Extract distinct architectural styles from the current result set.
     * Adds a special "__NO_STYLE__" option if applicable
     */
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

    /* ============================
       ARCHITECT FILTER OPTIONS
       ============================ */

    // buildings used to compute available architect options
    const buildingsForArchitectOptions = useMemo(() => {
        return buildings.filter(b =>
            buildingMatchesFilters(b, filters, "architects")
        );
    }, [buildings, filters]);

    // extract distinct architects from the current result set
    const availableArchitects = useMemo(() => {
        const set = new Set();

        buildingsForArchitectOptions.forEach(b =>
            b.architects.forEach(a => set.add(a))
        );

        return Array.from(set).sort();
    }, [buildingsForArchitectOptions]);

    /* ============================
       BUILDING TYPE FILTER OPTIONS
       ============================ */

    // buildings used to compute available building type options
    const buildingsForTypeOptions = useMemo(() => {
        return buildings.filter(b =>
            buildingMatchesFilters(b, filters, "buildingTypes")
        );
    }, [buildings, filters]);

    // extract distinct building types from the current result set
    const availableBuildingTypes = useMemo(() => {
        const set = new Set();

        buildingsForTypeOptions.forEach(b => {
            if (b.type) set.add(b.type);
        });

        return Array.from(set).sort();
    }, [buildingsForTypeOptions]);

    /* ============================
       HERITAGE AVAILABILITY
       ============================ */

    // determines whether the heritage filter is meaningful in the current context
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
