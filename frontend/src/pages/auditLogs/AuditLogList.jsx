import { useEffect, useState } from "react";

import PageHeader from "../../components/layout/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import auditLogService from "../../services/auditLogService";

export default function AuditLogList() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await auditLogService.getAll();
      setLogs(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = logs.filter((log) =>
    (log.action + (log.description || "") + String(log.user_id))
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <PageHeader
        title="Audit Logs"
        subtitle="System activity history"
        showSearch
        searchValue={search}
        onSearch={setSearch}
      />

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Action</th>
              <th>Description</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                  No audit logs found
                </td>
              </tr>
            ) : (
              filtered.map((log) => (
                <tr key={log.id}>
                  <td style={{ color: "var(--text-muted)", fontSize: "13px" }}>#{log.id}</td>
                  <td>
                    <span className="badge badge-draft">User #{log.user_id}</span>
                  </td>
                  <td style={{ fontWeight: 600, color: "var(--primary)" }}>{log.action}</td>
                  <td style={{ color: "var(--text-secondary)", maxWidth: "300px" }}>{log.description || "—"}</td>
                  <td style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                    {log.created_at
                      ? new Date(log.created_at).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}