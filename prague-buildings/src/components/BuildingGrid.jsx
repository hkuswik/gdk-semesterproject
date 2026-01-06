import BuildingDetailsCard from "./BuidingDetailsCard.jsx";

export default function BuildingGrid({ buildings }) {
    return (
        <div style={{
            display: "grid",
            width: "100%",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px"
        }}>
            {buildings.map(b => (
                <BuildingDetailsCard key={b.id} building={b} />
            ))}
        </div>
    );
}
