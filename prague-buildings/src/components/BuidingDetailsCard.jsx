export default function BuildingCard({ building }) {
    return (
        <div style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "10px",
            width: "280px"
        }}>
            {building.image && (
                <img
                    src={building.image}
                    alt={building.label}
                    style={{ width: "100%", borderRadius: "6px" }}
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
