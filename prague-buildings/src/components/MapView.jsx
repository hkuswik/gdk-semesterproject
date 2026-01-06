import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { defaultIcon, selectedIcon } from "../data/leafletIcons";
import { parseWktPoint } from "../data/geoUtils.js";
import "./MapView.css";
import { useMap } from "react-leaflet";
import { useEffect } from "react";

function MapAutoCenter({ position }) {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom(), {
                duration: 0.6,
            });
        }
    }, [position, map]);

    return null;
}

export default function MapView({ buildings, selectedBuildingId, onSelectBuilding }) {
    const selectedBuilding = buildings.find(
        b => b.id === selectedBuildingId
    );

    const selectedPos = selectedBuilding
        ? parseWktPoint(selectedBuilding.coords)
        : null;

    return (
        <MapContainer
            center={[50.087, 14.421]}
            zoom={13}
            className="map-container"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapAutoCenter position={selectedPos} />

            {buildings.map(b => {
                const pos = parseWktPoint(b.coords);
                if (!pos) return null;

                const isSelected = b.id === selectedBuildingId;

                return (
                    <Marker
                        key={b.id}
                        position={pos}
                        icon={isSelected ? selectedIcon : defaultIcon}
                        opacity={isSelected ? 1 : 0.6}
                        eventHandlers={{
                            click: () => onSelectBuilding(b.id)
                        }}
                    />
                );
            })}
        </MapContainer>
    );
}
