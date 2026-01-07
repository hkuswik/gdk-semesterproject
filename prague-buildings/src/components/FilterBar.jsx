import "./FilterBar.css";
import FilterPill from "./FilterPill.jsx";

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
        </div>
    );
}
