/**
 * Renders payable months as tappable chips. Selection is enforced to be a
 * contiguous run starting from the first (oldest due) month, matching the
 * backend validation - so tapping a later chip auto-selects everything
 * before it, and tapping the last-selected chip again deselects it.
 */
export default function MonthSelector({ months, selectedCount, onChange }) {
  const handleTap = (index) => {
    if (index + 1 === selectedCount) {
      onChange(index);
    } else {
      onChange(index + 1);
    }
  };

  return (
    <div className="month-grid">
      {months.map((m, i) => {
        const selected = i < selectedCount;
        return (
          <button
            type="button"
            key={`${m.month}-${m.year}`}
            className={`month-chip ${selected ? "selected" : ""}`}
            onClick={() => handleTap(i)}
          >
            {selected && <span className="check">✓</span>}
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
