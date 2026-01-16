import "./BuildingDetailsCard.css";
import "./FilterBar.css";
import FilterPill from "./FilterPill.jsx";
import { useEffect, useState } from "react";

const STYLE_ERA_MAP = {
    "Art Nouveau": "1895–1914",
    "Baroque": "17th–18th century",
    "Baroque Revival": "1890–1910",
    "Brutalism": "1950s–1980s",
    "Classicism": "late 18th–early 19th century",
    "Constructivism": "1920s–1930s",
    "Country Baroque": "17th–18th century",
    "Cubism": "1910–1925",
    "Deconstructivism": "1990s–present",
    "Eclecticism": "late 19th–early 20th century",
    "Empire Style": "early 19th century",
    "Functionalism": "1920s–1938",
    "Geometric Art Nouveau": "1900–1914",
    "Gothic": "13th–16th century",
    "Gothic Revival": "mid 19th–early 20th century",
    "Historicism": "19th century",
    "Mannerism": "16th–early 17th century",
    "Modernism": "1900s–1930s",
    "Neoclassicism": "late 18th–mid 19th century",
    "Renaissance": "16th–early 17th century",
    "Renaissance Revival": "late 19th–early 20th century",
    "Rococo": "1730–1770",
    "Romanesque": "11th–12th century",
    "Romanesque Revival": "mid–late 19th century",
    "Romantic": "late 18th–mid 19th century",
    "Rondocubism": "1920–1925",
    "Russian Revival": "late 19th–early 20th century",
};

function getYearLabel(building) {
    if (building.year) {
        return building.year;
    }

    if (building.styles && building.styles.length > 0) {
        for (const style of building.styles) {
            if (STYLE_ERA_MAP[style]) {
                return `unknown (approx. ${STYLE_ERA_MAP[style]})`;
            }
        }
    }

    return "unknown";
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function toggleFilterValue(key, value, setFilters, single = false) {
    setFilters(f => ({
        ...f,
        [key]: single
            ? (f[key].includes(value) ? [] : [value])
            : f[key].includes(value)
                ? f[key].filter(v => v !== value)
                : [...f[key], value],
    }));
}

export default function BuildingDetailsCard({ building, onPrev, onNext, selectedIndex, buildingsCount, filters, setFilters }) {
    const [imageLoaded, setImageLoaded] = useState(false);

    // reset img loading state as soon as new building is selected
    useEffect(() => {
        setImageLoaded(false);
    }, [building.image]);

    if (!building) return null;

    return (
        <div className="building-card-wrapper">
            <button
                className="nav-arrow left"
                onClick={onPrev}
            >
                ◀
            </button>

            <div className="building-card">
                <div>
                    <h2>{(building.label)}</h2>

                    {!imageLoaded && (
                        <div className="image-skeleton" />
                    )}
                    {building.image && (
                        <img
                            src={building.image}
                            alt={building.label}
                            onLoad={() => setImageLoaded(true)}
                            style={{
                                display: imageLoaded ? "block" : "none",
                            }}
                        />
                    )}
                </div>

                {<p><b>Year:</b> {getYearLabel(building)}</p>}

                {building.styles.length > 0 && (
                    <div className="filter-row">
                        <p><b>Style:</b></p>
                        <div>
                            {building.styles.map(style => (
                                <FilterPill
                                    key={style}
                                    label={style}
                                    variant="style"
                                    selected={filters.styles.includes(style)}
                                    onClick={() => toggleFilterValue("styles", style, setFilters)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {building.architects.length > 0 && (
                    <div className="filter-row">
                        <p><b>Architect:</b></p>
                        <div>
                            {building.architects.map(architect => (
                                <FilterPill
                                    key={architect}
                                    label={architect}
                                    variant="architect"
                                    selected={filters.architects.includes(architect)}
                                    onClick={() => toggleFilterValue("architects", architect, setFilters)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {building.type && (
                    <div className="filter-row">
                        <p><b>Type:</b></p>
                        <FilterPill
                            label={capitalize(building.type)}
                            variant="building-type"
                            selected={filters.buildingTypes.includes(building.type)}
                            onClick={() => toggleFilterValue("buildingTypes", building.type, setFilters, true)}
                        />
                    </div>
                )}

                <div className="last-row">
                    {building.heritage ? (
                        <p><b>Heritage:</b> {building.heritage}</p>
                    ) : <div></div>}
                    <p className="counter">
                        {selectedIndex + 1} / {buildingsCount}
                    </p>
                </div>
            </div>

            <button
                className="nav-arrow right"
                onClick={onNext}
            >
                ▶
            </button>
        </div>
    );
}
