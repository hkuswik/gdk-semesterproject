import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { parseWktPoint } from "../data/geoUtils.js";

export default function MapView({ buildings }) {
    return (
        <MapContainer
            center={[50.087, 14.421]}
            zoom={13}
            style={{ height: "500px", width: "100%", marginBottom: "30px" }}
        >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {buildings.map(b => {
                const pos = parseWktPoint(b.coords);
                if (!pos) return null;

                return (
                    <Marker key={b.id} position={pos}>
                        <Popup>
                            <strong>{b.label}</strong><br />
                            {b.year && <>Year: {b.year}<br /></>}
                            {b.styles.join(", ")}
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}
