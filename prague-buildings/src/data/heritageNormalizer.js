const HERITAGE_MAP = [
    {
        match: /cultural monument of the czech republic/i,
        short: "Cultural monument",
    },
    {
        match: /part of cultural heritage site in the czech republic/i,
        short: "Part of cultural heritage site",
    },
];

export function normalizeHeritage(label) {
    if (!label) return null;

    const entry = HERITAGE_MAP.find(e => e.match.test(label));
    if (entry) return entry.short;

    return label
}
