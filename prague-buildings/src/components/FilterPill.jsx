import "./FilterPill.css";

export default function FilterPill({ label, selected, onClick, variant = "default" }) {
    return (
        <button
            type="button"
            className={`pill pill-${variant} ${selected ? "selected" : ""}`}
            onClick={onClick}
        >
            <span className="pill-label">{label}</span>
            {selected && <span className="pill-x">×</span>}
        </button>
    );
}
