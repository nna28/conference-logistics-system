export default function PageHeader({
  title,
  subtitle,
  onCreate,
  createLabel = "Add New",
  showSearch = false,
  searchValue = "",
  onSearch,
}) {
  return (
    <div className="page-header">
      <div className="page-header-left">
        {subtitle && (
          <p className="page-subtitle">{subtitle}</p>
        )}
        <h1>{title}</h1>
      </div>

      <div className="page-header-actions">
        {showSearch && (
          <div className="search-bar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        )}

        {onCreate && (
          <button className="btn btn-primary" onClick={onCreate}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {createLabel}
          </button>
        )}
      </div>
    </div>
  );
}