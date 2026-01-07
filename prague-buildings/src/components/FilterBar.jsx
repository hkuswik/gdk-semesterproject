import "./FilterBar.css";

/**
 * year from/to
 * styles
 * architects
 * building types
 * heritage?
 * --> generate options dynamically from data
 */
export default function FilterBar({ filters, setFilters, availableStyles, availableArchitects }) {

    return (
        <div className="filter-bar">
            <div className="filter-group">
                <label>Year from</label><br />
                <input
                    type="number"
                    placeholder="e.g., 1800"
                    value={filters.yearRange[0]}
                    onChange={e => {
                        const value = Number(e.target.value);
                        setFilters(f => ({
                            ...f,
                            yearRange: [value, f.yearRange[1]],
                        }));
                    }}
                />
            </div>

            <div className="filter-group">
                <label>Year to</label><br />
                <input
                    type="number"
                    placeholder="e.g., 2026"
                    value={filters.yearRange[1]}
                    onChange={e => {
                        const value = Number(e.target.value);
                        setFilters(f => ({
                            ...f,
                            yearRange: [f.yearRange[0], value],
                        }));
                    }}
                />
            </div>

            <div className="filter-group">
                <label>Styles</label>
                <div className="pill-container">
                    {availableStyles.map(style => {
                        const isSelected = filters.styles.includes(style);

                        return (
                            <button
                                key={style}
                                className={`pill ${isSelected ? "selected" : ""}`}
                                onClick={() =>
                                    setFilters(f => ({
                                        ...f,
                                        styles: isSelected
                                            ? f.styles.filter(s => s !== style)
                                            : [...f.styles, style],
                                    }))
                                }
                            >
                                {style}
                                {isSelected && <span className="pill-x">×</span>}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
