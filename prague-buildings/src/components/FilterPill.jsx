import "./FilterPill.css";

export default function FilterPill({ label, selected, onClick }) {
    return (
        <button
            type="button"
            className={`pill ${selected ? "selected" : ""}`}
            onClick={onClick}
        >
            <span className="pill-label">{label}</span>
            {selected && <span className="pill-x">×</span>}
        </button>
    );
}
