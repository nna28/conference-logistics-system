import { useEffect, useState } from "react";

import PageHeader from "../../components/layout/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import notificationService from "../../services/notificationService";

export default function NotificationList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getAll();
      setNotifications(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      loadNotifications();
    } catch (error) {
      alert(error.message);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <PageHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
      />

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Message</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {notifications.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                  No notifications
                </td>
              </tr>
            ) : (
              notifications.map((item) => (
                <tr
                  key={item.id}
                  style={{ opacity: item.is_read ? 0.6 : 1 }}
                >
                  <td style={{ color: "var(--text-muted)", fontSize: "13px" }}>#{item.id}</td>
                  <td style={{ fontWeight: item.is_read ? 400 : 700 }}>{item.title}</td>
                  <td style={{ color: "var(--text-secondary)", maxWidth: "320px" }}>{item.message}</td>
                  <td>
                    <span className={`badge ${item.is_read ? "badge-completed" : "badge-pending"}`}>
                      {item.is_read ? "Read" : "Unread"}
                    </span>
                  </td>
                  <td>
                    {!item.is_read && (
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleRead(item.id)}
                      >
                        ✓ Mark Read
                      </button>
                    )}
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