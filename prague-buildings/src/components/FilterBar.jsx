import "./FilterBar.css";
import FilterPill from "./FilterPill.jsx";

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * styles
 * architects
 * building types
 * heritage?
 * --> generate options dynamically from data
 */
export default function FilterBar({ filters, setFilters, availableStyles, availableArchitects, availableBuildingTypes }) {

    return (
        <div className="filter-bar">
            {/* ---------- STYLES ---------- */}
            <div className="filter-group styles">
                <label>Styles</label>

                <div className="pill-container">
                    {availableStyles.map(style => {
                        const label =
                            style === "__NO_STYLE__"
                                ? "No style assigned"
                                : style;

                        const isSelected = filters.styles.includes(style);

                        return (
                            <FilterPill
                                key={style}
                                label={label}
                                variant="style"
                                selected={isSelected}
                                onClick={() =>
                                    setFilters(f => ({
                                        ...f,
                                        styles: isSelected
                                            ? f.styles.filter(s => s !== style)
                                            : [...f.styles, style],
                                    }))
                                }
                            />
                        );
                    })}
                </div>
            </div>

            {/* ---------- ARCHITECTS ---------- */}
            <div className="filter-group architects">
                <label>Architects</label>

                {/* Dropdown */}
                <select
                    value=""
                    onChange={e => {
                        const value = e.target.value;
                        if (!value) return;

                        setFilters(f => ({
                            ...f,
                            architects: f.architects.includes(value)
                                ? f.architects
                                : [...f.architects, value],
                        }));
                    }}
                >
                    <option value="">Select architect…</option>
                    {availableArchitects
                        .filter(a => !filters.architects.includes(a))
                        .map(a => (
                            <option key={a} value={a}>
                                {a}
                            </option>
                        ))}
                </select>

                {/* Selected architect pills */}
                {filters.architects.length > 0 && (
                    <div className="pill-container">
                        {filters.architects.map(a => (
                            <FilterPill
                                key={a}
                                label={a}
                                variant="architect"
                                selected
                                onClick={() =>
                                    setFilters(f => ({
                                        ...f,
                                        architects: f.architects.filter(
                                            x => x !== a
                                        ),
                                    }))
                                }
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ---------- BUILDING TYPE ---------- */}
            <div className="filter-group building-types">
                <label>Building Types</label>

                <div className="pill-container">
                    {availableBuildingTypes.map(buildingType => {
                        const isSelected = filters.buildingTypes.includes(buildingType);

                        return (
                            <FilterPill
                                key={buildingType}
                                label={capitalize(buildingType)}
                                variant="building-type"
                                selected={isSelected}
                                onClick={() =>
                                    setFilters(f => ({
                                        ...f,
                                        buildingTypes: isSelected
                                            ? f.buildingTypes.filter(b => b !== buildingType)
                                            : [...f.buildingTypes, buildingType],
                                    }))
                                }
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
