import { useEffect, useState } from "react";
import axios from "axios";

function Notifications() {
  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchNotifications =
      async () => {
        try {
          const token =
            localStorage.getItem(
              "token"
            );

          const res =
            await axios.get(
              "http://localhost:5000/api/notifications",
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            );

          setNotifications(
            res.data
          );
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      await axios.put(
        `http://localhost:5000/api/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setNotifications(
        notifications.map((n) =>
          n._id === id
            ? { ...n, read: true }
            : n
        )
      );
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <h1 className="text-3xl p-10">
        Loading...
      </h1>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-8">
        Notifications
      </h1>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          No Notifications
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-5 rounded-2xl shadow ${
                n.read
                  ? "bg-gray-100"
                  : "bg-white border-l-4 border-blue-500"
              }`}
            >
              <p>{n.message}</p>

              <p className="text-sm text-gray-500 mt-2">
                {new Date(
                  n.createdAt
                ).toLocaleString()}
              </p>

              {!n.read && (
                <button
                  onClick={() =>
                    markAsRead(
                      n._id
                    )
                  }
                  className="mt-3 px-4 py-2 rounded-lg bg-blue-500 text-white"
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;