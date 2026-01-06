import "./BuildingDetailsCard.css";

export default function BuildingCard({ building }) {
    return (
        <div className="building-card">
            {building.image && (
                <img
                    src={building.image}
                    alt={building.label}
                />
            )}

            <h4>{building.label}</h4>

            {building.year && <p><b>Year:</b> {building.year}</p>}
            {building.styles.length > 0 && (
                <p><b>Style:</b> {building.styles.join(", ")}</p>
            )}
            {building.architects.length > 0 && (
                <p><b>Architect:</b> {building.architects.join(", ")}</p>
            )}
            {building.heritage && (
                <p><b>Heritage:</b> {building.heritage}</p>
            )}
        </div>
    );
}
