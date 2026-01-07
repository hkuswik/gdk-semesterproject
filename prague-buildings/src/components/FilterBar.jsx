import "./FilterBar.css";

/**
 * styles
 * architects
 * building types
 * heritage?
 * --> generate options dynamically from data
 */
export default function FilterBar({ filters, setFilters, availableStyles }) {

    return (
        <div className="filter-bar">
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
