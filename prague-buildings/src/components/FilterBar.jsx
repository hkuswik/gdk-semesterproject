import "./FilterBar.css";
import FilterPill from "./FilterPill.jsx";

/**
 * styles
 * architects
 * building types
 * heritage?
 * --> generate options dynamically from data
 */
export default function FilterBar({ filters, setFilters, availableStyles, availableArchitects }) {

    return (
        <div className="filter-bar">
            {/* ---------- STYLES ---------- */}
            <div className="filter-group">
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
            <div className="filter-group">
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
        </div>
    );
}
