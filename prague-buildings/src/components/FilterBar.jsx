/**
 * year from/to
 * styles
 * architects
 * --> generate options dynamically from data
 */
export default function FilterBar({ buildings, filters, setFilters }) {
    const styles = Array.from(
        new Set(buildings.flatMap(b => b.styles))
    ).sort();

    const architects = Array.from(
        new Set(buildings.flatMap(b => b.architects))
    ).sort();

    return (
        <div style={{ marginBottom: "20px", display: "flex", gap: "15px" }}>
            <div>
                <label>Year from</label><br />
                <input
                    type="number"
                    value={filters.yearFrom}
                    onChange={e => setFilters(f => ({
                        ...f,
                        yearFrom: Number(e.target.value)
                    }))}
                />
            </div>

            <div>
                <label>Year to</label><br />
                <input
                    type="number"
                    value={filters.yearTo}
                    onChange={e => setFilters(f => ({
                        ...f,
                        yearTo: Number(e.target.value)
                    }))}
                />
            </div>

            <div>
                <label>Style</label><br />
                <select
                    value={filters.style}
                    onChange={e => setFilters(f => ({
                        ...f,
                        style: e.target.value
                    }))}
                >
                    <option value="all">All</option>
                    {styles.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>

            <div>
                <label>Architect</label><br />
                <select
                    value={filters.architect}
                    onChange={e => setFilters(f => ({
                        ...f,
                        architect: e.target.value
                    }))}
                >
                    <option value="all">All</option>
                    {architects.map(a => (
                        <option key={a} value={a}>{a}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}
