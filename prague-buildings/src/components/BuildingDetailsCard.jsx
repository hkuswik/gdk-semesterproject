import "./BuildingDetailsCard.css";

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

export default function BuildingDetailsCard({ building, onPrev, onNext, hasPrev, hasNext }) {
    if (!building) return null;

    return (
        <div className="building-card-wrapper">
            <button
                className="nav-arrow left"
                onClick={onPrev}
                disabled={!hasPrev}
                aria-label="Previous building"
            >
                ◀
            </button>

            <div className="building-card">
                <div>
                    {building.image && (
                        <img
                            src={building.image}
                            alt={building.label}
                        />
                    )}
                    <h2>{(building.label)}</h2>
                </div>

                {<p><b>Year:</b> {getYearLabel(building)}</p>}
                {building.styles.length > 0 && (
                    <p><b>Style:</b> {building.styles.join(", ")}</p>
                )}
                {building.architects.length > 0 && (
                    <p><b>Architect:</b> {building.architects.join(", ")}</p>
                )}
                {building.type.length > 0 && (
                    <p><b>Type:</b> {building.type}</p>
                )}
                {building.heritage && (
                    <p><b>Heritage:</b> {building.heritage}</p>
                )}
            </div>

            <button
                className="nav-arrow right"
                onClick={onNext}
                disabled={!hasNext}
                aria-label="Next building"
            >
                ▶
            </button>
        </div>
    );
}
