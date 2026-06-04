import { useEffect, useState } from "react";

import PageHeader from "../../components/layout/PageHeader";

import auditLogService from "../../services/auditLogService";

export default function AuditLogList() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const data =
        await auditLogService.getAll();

      setLogs(data);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <PageHeader
        title="Audit Logs"
        subtitle="System activity history"
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

            {logs.map((log) => (
              <tr key={log.id}>

                <td>
                  {log.id}
                </td>

                <td>
                  {log.user_id}
                </td>

                <td>
                  {log.action}
                </td>

                <td>
                  {log.description}
                </td>

                <td>
                  {log.created_at}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </>
  );
}