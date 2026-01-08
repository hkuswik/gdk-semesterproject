import { useMemo } from "react";

export function useBuildingFilters(
    buildings,
    filters,
    selectedBuildingId,
    setSelectedBuildingId
) {

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

    // ARCHITECTS
    const availableArchitects = useMemo(() => {
        const set = new Set();

        filteredBuildings.forEach(b =>
            b.architects.forEach(a => set.add(a))
        );

        return Array.from(set).sort();
    }, [filteredBuildings]);

    return {
        filteredBuildings,
        availableStyles,
        availableArchitects,
        selectedBuilding,
        selectedIndex,
        selectPrev,
        selectNext,
    };
}