import L from "leaflet";

const commonOptions = {
    iconSize: [35, 35],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
};

export const defaultIcon = new L.Icon({
    ...commonOptions,
    iconUrl: "icons/housePin_light.svg",
});

export const selectedIcon = new L.Icon({
    ...commonOptions,
    iconUrl: "icons/housePin_dark.svg",
    iconSize: [40, 40],     // slightly bigger when selected
    iconAnchor: [20, 40],
});
