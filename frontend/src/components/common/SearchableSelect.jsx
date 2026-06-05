import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

export default function SearchableSelect({ 
  options, 
  value, 
  onChange, 
  name,
  placeholder = "-- Select --", 
  disabled = false,
  required = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef(null);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => String(opt.value) === String(value));

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "100%" }}>
      {/* Hidden select to keep native form behavior/validation if needed */}
      <select 
        name={name} 
        value={value || ""} 
        onChange={(e) => onChange(e)} 
        required={required} 
        style={{ display: "none" }}
      >
        <option value="">{placeholder}</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "11px 16px",
          background: "var(--bg, #fff)",
          border: isOpen ? "1.5px solid var(--border-focus, #4b7bf5)" : "1.5px solid var(--border, #e2e8f0)",
          borderRadius: "var(--radius-sm, 6px)",
          fontSize: "14px",
          color: selectedOption ? "var(--text-primary, #1e293b)" : "var(--text-muted, #94a3b8)",
          cursor: disabled ? "not-allowed" : "pointer",
          boxShadow: isOpen ? "0 0 0 3px rgba(75, 123, 245, 0.1)" : "none",
          opacity: disabled ? 0.6 : 1,
          transition: "all 0.2s ease"
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={16} color="var(--text-secondary, #64748b)" />
      </div>

      {isOpen && !disabled && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "4px",
            background: "var(--surface, #fff)",
            border: "1px solid var(--border, #e2e8f0)",
            borderRadius: "var(--radius-sm, 6px)",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            zIndex: 50,
            display: "flex",
            flexDirection: "column",
            maxHeight: "250px"
          }}
        >
          <div style={{ padding: "8px", borderBottom: "1px solid var(--border, #e2e8f0)", display: "flex", alignItems: "center", gap: "8px" }}>
            <Search size={14} color="var(--text-muted, #94a3b8)" />
            <input
              type="text"
              autoFocus
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                width: "100%",
                background: "transparent",
                fontSize: "13px",
                color: "var(--text-primary, #1e293b)",
                padding: "4px"
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div style={{ overflowY: "auto" }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange({ target: { name, value: opt.value } });
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  style={{
                    padding: "10px 16px",
                    fontSize: "14px",
                    cursor: "pointer",
                    color: "var(--text-primary, #1e293b)",
                    background: String(value) === String(opt.value) ? "rgba(75, 123, 245, 0.05)" : "transparent",
                    borderBottom: "1px solid var(--border, #e2e8f0)"
                  }}
                  onMouseEnter={(e) => e.target.style.background = "rgba(75, 123, 245, 0.05)"}
                  onMouseLeave={(e) => e.target.style.background = String(value) === String(opt.value) ? "rgba(75, 123, 245, 0.05)" : "transparent"}
                >
                  {opt.label}
                </div>
              ))
            ) : (
              <div style={{ padding: "10px 16px", fontSize: "14px", color: "var(--text-muted, #94a3b8)", textAlign: "center" }}>
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
