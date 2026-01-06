function titleCase(str) {
    return str
        .split(" ")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

function normalizeStyleBase(style) {
    return style
        .toLowerCase()
        .replace(" architecture", "")
        .trim();
}

const STYLE_OVERRIDES = {
    "baroque revival": "Baroque Revival",
    "czech baroque": "Baroque",
    "country baroque": "Country Baroque",
    "brutalist": "Brutalism",
    "constructivist": "Constructivism",
    "eclectic": "Eclecticism",
    "historicist": "Historicism",
    "modern": "Modernism",
    "neoclassical": "Neoclassicism",
    "renaissance revival": "Renaissance Revival",
    "romanesque revival": "Romanesque Revival",
    "russian revival": "Russian Revival",
};

export function normalizeStyle(style) {
    const base = normalizeStyleBase(style);

    if (STYLE_OVERRIDES[base]) {
        return STYLE_OVERRIDES[base];
    }

    return titleCase(base);
}
