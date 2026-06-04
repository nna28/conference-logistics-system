

export default function PageHeader({
  title,
  onCreate,
  createLabel,
  showSearch = false,
  searchValue = "",
  onSearch,
}) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
      </div>

      <div className="page-header-actions">
        {showSearch && (
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearch?.(e.target.value)}
          />
        )}

        {onCreate && (
          <button onClick={onCreate}>
            + {createLabel}
          </button>
        )}
      </div>
    </div>
  );
}