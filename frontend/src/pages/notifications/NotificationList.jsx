import { useEffect, useState } from "react";

import PageHeader from "../../components/layout/PageHeader";

import notificationService from "../../services/notificationService";

export default function NotificationList() {
  const [notifications, setNotifications] =
    useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data =
        await notificationService.getAll();

      setNotifications(data);
    } catch (error) {
      alert(error.message);
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

  return (
    <>
      <PageHeader
        title="Notifications"
        subtitle="System notifications"
      />

      <div className="table-card">

        <table className="data-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Message</th>
              <th>Read</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {notifications.map((item) => (
              <tr key={item.id}>

                <td>
                  {item.id}
                </td>

                <td>
                  {item.title}
                </td>

                <td>
                  {item.message}
                </td>

                <td>
                  {item.is_read
                    ? "Yes"
                    : "No"}
                </td>

                <td>

                  {!item.is_read && (
                    <button
                      onClick={() =>
                        handleRead(item.id)
                      }
                    >
                      Mark Read
                    </button>
                  )}

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </>
  );
}