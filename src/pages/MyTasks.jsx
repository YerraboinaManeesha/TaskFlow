
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function MyTasks() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedAction, setSelectedAction] = useState("");
  const [processing, setProcessing] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const getLoggedInUser = () => {
    const savedUser = localStorage.getItem("taskflowUser");

    if (!savedUser) return null;

    try {
      return JSON.parse(savedUser);
    } catch (error) {
      console.error("Error reading logged-in user:", error);
      return null;
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });

    setTimeout(() => {
      setNotification({ type: "", message: "" });
    }, 3000);
  };

  const fetchTasks = async () => {
    const loggedInUser = getLoggedInUser();

    if (!loggedInUser?.email) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const email = encodeURIComponent(loggedInUser.email);

      const response = await fetch(
        `${API_URL}/tasks?email=${email}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to fetch tasks."
        );
      }

      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch Tasks Error:", error);
      setTasks([]);

      showNotification(
        "error",
        error.message || "Failed to load tasks."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [navigate]);

  const openTaskMenu = (task) => {
    setSelectedTask(task);
    setSelectedAction("");
  };

  const closeTaskMenu = () => {
    if (processing) return;

    setSelectedTask(null);
    setSelectedAction("");
  };

  const handleSaveChanges = async () => {
    if (!selectedTask || !selectedAction) {
      showNotification("error", "Please select an option.");
      return;
    }

    const loggedInUser = getLoggedInUser();

    if (!loggedInUser?.email) {
      setSelectedTask(null);
      navigate("/login");
      return;
    }

    const taskId = selectedTask._id;
    const email = encodeURIComponent(loggedInUser.email);

    try {
      setProcessing(true);

      if (selectedAction === "completed") {
        const response = await fetch(
          `${API_URL}/tasks/${taskId}/complete?email=${email}`,
          {
            method: "PUT",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || "Failed to complete task."
          );
        }

        setTasks((previousTasks) =>
          previousTasks.map((task) =>
            String(task._id) === String(taskId)
              ? { ...task, status: "Completed" }
              : task
          )
        );

        setSelectedTask(null);
        setSelectedAction("");

        showNotification(
          "success",
          "Task completed successfully!"
        );
      }

      if (selectedAction === "delete") {
        const response = await fetch(
          `${API_URL}/tasks/${taskId}?email=${email}`,
          {
            method: "DELETE",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || "Failed to delete task."
          );
        }

        setTasks((previousTasks) =>
          previousTasks.filter(
            (task) =>
              String(task._id) !== String(taskId)
          )
        );

        setSelectedTask(null);
        setSelectedAction("");

        showNotification(
          "success",
          "Task deleted successfully!"
        );
      }
    } catch (error) {
      console.error("Task Action Error:", error);

      showNotification(
        "error",
        error.message || "Something went wrong."
      );
    } finally {
      setProcessing(false);
    }
  };

  const colors = {
    pageBackground: darkMode ? "#0f172a" : "#f8fafc",
    cardBackground: darkMode ? "#1e293b" : "#ffffff",
    textPrimary: darkMode ? "#f8fafc" : "#1e293b",
    textSecondary: darkMode ? "#cbd5e1" : "#64748b",
    border: darkMode ? "#334155" : "#e2e8f0",
    emptyBorder: darkMode ? "#475569" : "#cbd5e1",
    modalBackground: darkMode ? "#1e293b" : "#ffffff",
  };

  const styles = {
    page: {
      minHeight: "100vh",
      padding: "45px 70px",
      boxSizing: "border-box",
      fontFamily: "Arial, sans-serif",
      background: colors.pageBackground,
      color: colors.textPrimary,
    },

    header: {
      maxWidth: "1000px",
      margin: "0 auto 30px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "20px",
    },

    heading: {
      margin: "0 0 8px",
      fontSize: "32px",
      fontWeight: "800",
      color: colors.textPrimary,
    },

    subtitle: {
      margin: 0,
      fontSize: "15px",
      color: colors.textSecondary,
    },

    headerButtons: {
      display: "flex",
      gap: "10px",
    },

    headerButton: {
      border: "none",
      borderRadius: "10px",
      background: "#2563eb",
      color: "#ffffff",
      padding: "11px 17px",
      fontSize: "14px",
      fontWeight: "700",
      cursor: "pointer",
      transition:
        "transform 0.2s ease, box-shadow 0.2s ease",
    },

    card: {
      maxWidth: "1000px",
      margin: "0 auto",
      padding: "30px",
      borderRadius: "18px",
      background: colors.cardBackground,
      border: `1px solid ${colors.border}`,
      boxShadow: darkMode
        ? "0 5px 20px rgba(0,0,0,0.25)"
        : "0 5px 20px rgba(0,0,0,0.06)",
      boxSizing: "border-box",
    },

    taskList: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },

    taskItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "18px",
      borderRadius: "12px",
      background: colors.cardBackground,
      border: `1px solid ${colors.border}`,
      transition:
        "transform 0.2s ease, box-shadow 0.2s ease",
    },

    taskInfo: {
      flex: 1,
      minWidth: 0,
    },

    taskTitle: {
      margin: "0 0 6px",
      fontSize: "17px",
      fontWeight: "700",
    },

    taskDescription: {
      margin: "0 0 10px",
      fontSize: "14px",
      color: colors.textSecondary,
    },

    taskDetails: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      flexWrap: "wrap",
    },

    priority: {
      padding: "5px 10px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "700",
    },

    dueDate: {
      fontSize: "12px",
      color: colors.textSecondary,
    },

    status: {
      padding: "6px 12px",
      borderRadius: "8px",
      fontSize: "12px",
      fontWeight: "700",
    },

    actions: {
      display: "flex",
      alignItems: "center",
      marginLeft: "20px",
      flexShrink: 0,
    },

    menuButton: {
      width: "40px",
      height: "40px",
      border: "none",
      borderRadius: "9px",
      background: darkMode ? "#334155" : "#f1f5f9",
      color: colors.textPrimary,
      fontSize: "22px",
      fontWeight: "700",
      cursor: "pointer",
      transition: "transform 0.2s ease",
    },

    emptyState: {
      textAlign: "center",
      padding: "55px 20px",
      border: `1px dashed ${colors.emptyBorder}`,
      borderRadius: "14px",
    },

    emptyIcon: {
      width: "60px",
      height: "60px",
      margin: "0 auto 15px",
      borderRadius: "50%",
      background: "#eff6ff",
      color: "#2563eb",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "28px",
      fontWeight: "bold",
    },

    emptyTitle: {
      margin: "0 0 8px",
      fontSize: "20px",
      color: colors.textPrimary,
    },

    emptyText: {
      margin: "0 auto 20px",
      maxWidth: "420px",
      lineHeight: "1.5",
      color: colors.textSecondary,
    },

    notification: {
      position: "fixed",
      top: "25px",
      right: "25px",
      zIndex: 2000,
      minWidth: "280px",
      maxWidth: "400px",
      padding: "15px 18px",
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontSize: "14px",
      fontWeight: "700",
      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
    },

    modalOverlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(15, 23, 42, 0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1500,
      padding: "20px",
      boxSizing: "border-box",
    },

    modal: {
      width: "100%",
      maxWidth: "430px",
      background: colors.modalBackground,
      borderRadius: "18px",
      padding: "30px",
      boxSizing: "border-box",
      boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
    },

    modalTitle: {
      margin: "0 0 8px",
      textAlign: "center",
      fontSize: "22px",
      fontWeight: "800",
      color: colors.textPrimary,
    },

    modalText: {
      margin: "0 0 24px",
      textAlign: "center",
      color: colors.textSecondary,
      fontSize: "14px",
      lineHeight: "1.5",
    },

    options: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      marginBottom: "25px",
    },

    optionLabel: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "15px",
      borderRadius: "10px",
      cursor: "pointer",
      boxSizing: "border-box",
    },

    checkbox: {
      width: "18px",
      height: "18px",
      cursor: "pointer",
      accentColor: "#16a34a",
    },

    deleteCheckbox: {
      width: "18px",
      height: "18px",
      cursor: "pointer",
      accentColor: "#dc2626",
    },

    optionText: {
      fontSize: "15px",
      fontWeight: "700",
    },

    modalButtons: {
      display: "flex",
      gap: "10px",
    },

    modalCancelButton: {
      flex: 1,
      padding: "12px",
      borderRadius: "9px",
      border: `1px solid ${colors.border}`,
      background: darkMode ? "#334155" : "#ffffff",
      color: colors.textPrimary,
      fontSize: "14px",
      fontWeight: "700",
      cursor: "pointer",
    },

    modalSaveButton: {
      flex: 1,
      padding: "12px",
      borderRadius: "9px",
      border: "none",
      background: "#2563eb",
      color: "#ffffff",
      fontSize: "14px",
      fontWeight: "700",
      cursor: "pointer",
    },
  };

  return (
    <>
      <style>
        {`
          .task-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 18px rgba(0,0,0,0.08);
          }

          .hover-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(37,99,235,0.2);
          }

          .menu-button:hover {
            transform: scale(1.05);
          }

          @media (max-width: 700px) {
            .mytasks-page {
              padding: 25px 18px !important;
            }

            .mytasks-header {
              flex-direction: column;
              align-items: flex-start !important;
            }

            .mytasks-header-buttons {
              width: 100%;
            }

            .mytasks-header-buttons button {
              flex: 1;
            }

            .task-item {
              align-items: flex-start !important;
            }
          }
        `}
      </style>

      <div className="mytasks-page" style={styles.page}>
        {notification.message && (
          <div
            style={{
              ...styles.notification,
              background:
                notification.type === "success"
                  ? "#dcfce7"
                  : "#fee2e2",
              color:
                notification.type === "success"
                  ? "#166534"
                  : "#991b1b",
              border:
                notification.type === "success"
                  ? "1px solid #86efac"
                  : "1px solid #fca5a5",
            }}
          >
            <span style={{ fontSize: "18px" }}>
              {notification.type === "success" ? "✓" : "!"}
            </span>
            <span>{notification.message}</span>
          </div>
        )}

        <div
          className="mytasks-header"
          style={styles.header}
        >
          <div>
            <h1 style={styles.heading}>My Tasks</h1>

            <p style={styles.subtitle}>
              View and manage all your tasks.
            </p>
          </div>

          <div
            className="mytasks-header-buttons"
            style={styles.headerButtons}
          >
            <button
              className="hover-button"
              style={styles.headerButton}
              onClick={() => navigate("/dashboard")}
            >
              ← Dashboard
            </button>

            <button
              className="hover-button"
              style={styles.headerButton}
              onClick={() => navigate("/tasks")}
            >
              + Add Task
            </button>
          </div>
        </div>

        <div style={styles.card}>
          {loading && (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>
                Loading tasks...
              </p>
            </div>
          )}

          {!loading && tasks.length === 0 && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>✓</div>

              <h3 style={styles.emptyTitle}>
                No tasks yet
              </h3>

              <p style={styles.emptyText}>
                Create your first task and start
                organizing your work.
              </p>

              <button
                className="hover-button"
                style={styles.headerButton}
                onClick={() => navigate("/tasks")}
              >
                + Create Your First Task
              </button>
            </div>
          )}

          {!loading && tasks.length > 0 && (
            <div style={styles.taskList}>
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="task-item"
                  style={styles.taskItem}
                >
                  <div style={styles.taskInfo}>
                    <h3
                      style={{
                        ...styles.taskTitle,
                        color:
                          task.status === "Completed"
                            ? "#94a3b8"
                            : colors.textPrimary,
                        textDecoration:
                          task.status === "Completed"
                            ? "line-through"
                            : "none",
                      }}
                    >
                      {task.title}
                    </h3>

                    {task.description && (
                      <p style={styles.taskDescription}>
                        {task.description}
                      </p>
                    )}

                    <div style={styles.taskDetails}>
                      <span
                        style={{
                          ...styles.priority,
                          background:
                            task.priority === "High"
                              ? "#fee2e2"
                              : task.priority === "Medium"
                              ? "#fef3c7"
                              : "#dcfce7",
                          color:
                            task.priority === "High"
                              ? "#dc2626"
                              : task.priority === "Medium"
                              ? "#d97706"
                              : "#16a34a",
                        }}
                      >
                        {task.priority || "Normal"}
                      </span>

                      {task.dueDate && (
                        <span style={styles.dueDate}>
                          Due: {task.dueDate}
                        </span>
                      )}

                      <span
                        style={{
                          ...styles.status,
                          background:
                            task.status === "Completed"
                              ? "#dcfce7"
                              : "#dbeafe",
                          color:
                            task.status === "Completed"
                              ? "#16a34a"
                              : "#2563eb",
                        }}
                      >
                        {task.status || "Pending"}
                      </span>
                    </div>
                  </div>

                  <div style={styles.actions}>
                    <button
                      className="menu-button"
                      style={styles.menuButton}
                      onClick={() => openTaskMenu(task)}
                      title="Task options"
                    >
                      ⋮
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedTask && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h2 style={styles.modalTitle}>
                Task Options
              </h2>

              <p style={styles.modalText}>
                Choose an action for "{selectedTask.title}"
              </p>

              <div style={styles.options}>
                <label
                  style={{
                    ...styles.optionLabel,
                    border:
                      selectedAction === "completed"
                        ? "1px solid #16a34a"
                        : `1px solid ${colors.border}`,
                    background:
                      selectedAction === "completed"
                        ? darkMode
                          ? "#153c2a"
                          : "#f0fdf4"
                        : "transparent",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={
                      selectedAction === "completed"
                    }
                    onChange={() =>
                      setSelectedAction(
                        selectedAction === "completed"
                          ? ""
                          : "completed"
                      )
                    }
                    disabled={
                      selectedTask.status === "Completed"
                    }
                    style={styles.checkbox}
                  />

                  <span
                    style={{
                      ...styles.optionText,
                      color:
                        selectedTask.status === "Completed"
                          ? "#94a3b8"
                          : colors.textPrimary,
                    }}
                  >
                    Mark as Completed
                  </span>
                </label>

                <label
                  style={{
                    ...styles.optionLabel,
                    border:
                      selectedAction === "delete"
                        ? "1px solid #dc2626"
                        : `1px solid ${colors.border}`,
                    background:
                      selectedAction === "delete"
                        ? darkMode
                          ? "#451a1a"
                          : "#fef2f2"
                        : "transparent",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={
                      selectedAction === "delete"
                    }
                    onChange={() =>
                      setSelectedAction(
                        selectedAction === "delete"
                          ? ""
                          : "delete"
                      )
                    }
                    style={styles.deleteCheckbox}
                  />

                  <span
                    style={{
                      ...styles.optionText,
                      color:
                        selectedAction === "delete"
                          ? "#dc2626"
                          : colors.textPrimary,
                    }}
                  >
                    Delete Task
                  </span>
                </label>
              </div>

              <div style={styles.modalButtons}>
                <button
                  style={styles.modalCancelButton}
                  onClick={closeTaskMenu}
                  disabled={processing}
                >
                  Cancel
                </button>

                <button
                  style={{
                    ...styles.modalSaveButton,
                    opacity:
                      !selectedAction || processing
                        ? 0.6
                        : 1,
                    cursor:
                      !selectedAction || processing
                        ? "not-allowed"
                        : "pointer",
                  }}
                  onClick={handleSaveChanges}
                  disabled={
                    !selectedAction || processing
                  }
                >
                  {processing ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default MyTasks;
