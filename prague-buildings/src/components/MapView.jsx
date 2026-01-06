import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { parseWktPoint } from "../data/geoUtils.js";
import "./MapView.css";

export default function MapView({ buildings, selectedBuildingId, onSelectBuilding }) {
    return (
        <MapContainer
            center={[50.087, 14.421]}
            zoom={13}
            className="map-container"
        >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {buildings.map(b => {
                const pos = parseWktPoint(b.coords);
                if (!pos) return null;

                const isSelected = b.id === selectedBuildingId;

                return (
                    <Marker
                        key={b.id}
                        position={pos}
                        eventHandlers={{
                            click: () => onSelectBuilding(b.id)
                        }}
                        opacity={isSelected ? 1 : 0.6}
                    >
                        <Popup>
                            <strong>{b.label}</strong>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}
