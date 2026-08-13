import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Tasks() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  // =========================
  // Logged-in User
  // =========================

  const savedUser = localStorage.getItem("taskflowUser");

  let currentUser = null;

  try {
    currentUser = savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error("Error reading user:", error);
  }

  // =========================
  // Task State
  // =========================

  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
  });

  const [loading, setLoading] = useState(false);

  // =========================
  // Handle Input
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setTask((previousTask) => ({
      ...previousTask,
      [name]: value,
    }));
  };

  // =========================
  // Create Task
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser || !currentUser.email) {
      navigate("/login");
      return;
    }

    if (!task.title.trim()) {
      alert("Please enter a task title.");
      return;
    }

    try {
      setLoading(true);

      const taskData = {
        title: task.title.trim(),
        description: task.description.trim(),
        priority: task.priority,
        dueDate: task.dueDate,
        email: currentUser.email,
      };

      const response = await fetch(
        "http://127.0.0.1:8000/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to create task."
        );
      }

      setTask({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Task creation error:", error);

      alert(
        error.message || "Backend connection failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Theme
  // =========================

  const colors = darkMode
    ? {
        pageBackground: "#0f172a",
        cardBackground: "#1e293b",
        primaryText: "#f8fafc",
        secondaryText: "#94a3b8",
        inputBackground: "#0f172a",
        inputText: "#f8fafc",
        inputBorder: "#475569",
        buttonBackground: "#2563eb",
        cancelBackground: "#334155",
        cancelText: "#f8fafc",
      }
    : {
        pageBackground: "#f8fafc",
        cardBackground: "#ffffff",
        primaryText: "#1e293b",
        secondaryText: "#64748b",
        inputBackground: "#ffffff",
        inputText: "#1e293b",
        inputBorder: "#cbd5e1",
        buttonBackground: "#2563eb",
        cancelBackground: "#ffffff",
        cancelText: "#334155",
      };

  // =========================
  // Styles
  // =========================

  const styles = {
    page: {
      minHeight: "100vh",
      padding: "45px 70px",
      boxSizing: "border-box",
      fontFamily: "Arial, sans-serif",
      background: colors.pageBackground,
      color: colors.primaryText,
      transition: "background 0.3s ease, color 0.3s ease",
    },

    container: {
      maxWidth: "800px",
      margin: "0 auto",
    },

    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "20px",
      marginBottom: "30px",
      animation: "taskflowFadeDown 0.45s ease",
    },

    heading: {
      margin: "0 0 7px",
      fontSize: "32px",
      fontWeight: "800",
      color: colors.primaryText,
    },

    subtitle: {
      margin: 0,
      fontSize: "15px",
      color: colors.secondaryText,
    },

    backButton: {
      border: "none",
      borderRadius: "10px",
      background: colors.buttonBackground,
      color: "#ffffff",
      padding: "11px 17px",
      fontSize: "14px",
      fontWeight: "700",
      cursor: "pointer",
      transition:
        "transform 0.2s ease, box-shadow 0.2s ease",
    },

    card: {
      padding: "32px",
      borderRadius: "18px",
      background: colors.cardBackground,
      boxShadow: darkMode
        ? "0 4px 16px rgba(0,0,0,0.18)"
        : "0 4px 16px rgba(0,0,0,0.05)",
      boxSizing: "border-box",
      animation: "taskflowFadeUp 0.5s ease",
      transition:
        "background 0.3s ease, box-shadow 0.3s ease",
    },

    label: {
      display: "block",
      marginTop: "19px",
      marginBottom: "8px",
      fontSize: "14px",
      fontWeight: "700",
      color: colors.primaryText,
    },

    optional: {
      color: colors.secondaryText,
      fontSize: "13px",
      fontWeight: "500",
    },

    input: {
      width: "100%",
      padding: "13px 14px",
      borderRadius: "10px",
      border: `1px solid ${colors.inputBorder}`,
      background: colors.inputBackground,
      color: colors.inputText,
      fontSize: "14px",
      boxSizing: "border-box",
      outline: "none",
      transition:
        "border-color 0.2s ease, box-shadow 0.2s ease, background 0.3s ease",
    },

    textarea: {
      width: "100%",
      padding: "13px 14px",
      borderRadius: "10px",
      border: `1px solid ${colors.inputBorder}`,
      background: colors.inputBackground,
      color: colors.inputText,
      fontSize: "14px",
      boxSizing: "border-box",
      outline: "none",
      resize: "vertical",
      fontFamily: "Arial, sans-serif",
      transition:
        "border-color 0.2s ease, box-shadow 0.2s ease, background 0.3s ease",
    },

    select: {
      width: "100%",
      padding: "13px 14px",
      borderRadius: "10px",
      border: `1px solid ${colors.inputBorder}`,
      background: colors.inputBackground,
      color: colors.inputText,
      fontSize: "14px",
      boxSizing: "border-box",
      outline: "none",
      cursor: "pointer",
      colorScheme: darkMode ? "dark" : "light",
      transition:
        "border-color 0.2s ease, background 0.3s ease",
    },

    dateInput: {
      width: "100%",
      padding: "13px 14px",
      borderRadius: "10px",
      border: `1px solid ${colors.inputBorder}`,
      background: colors.inputBackground,
      color: colors.inputText,
      fontSize: "14px",
      boxSizing: "border-box",
      outline: "none",
      colorScheme: darkMode ? "dark" : "light",
      transition:
        "border-color 0.2s ease, background 0.3s ease",
    },

    buttons: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "10px",
      marginTop: "28px",
    },

    cancelButton: {
      padding: "12px 21px",
      borderRadius: "10px",
      border: `1px solid ${colors.inputBorder}`,
      background: colors.cancelBackground,
      color: colors.cancelText,
      fontSize: "14px",
      fontWeight: "700",
      cursor: loading ? "not-allowed" : "pointer",
      transition:
        "transform 0.2s ease, background 0.2s ease",
    },

    createButton: {
      padding: "12px 21px",
      border: "none",
      borderRadius: "10px",
      background: colors.buttonBackground,
      color: "#ffffff",
      fontSize: "14px",
      fontWeight: "700",
      cursor: loading ? "not-allowed" : "pointer",
      opacity: loading ? 0.7 : 1,
      transition:
        "transform 0.2s ease, box-shadow 0.2s ease",
    },
  };

  // =========================
  // Input Focus
  // =========================

  const handleFocus = (e) => {
    e.currentTarget.style.borderColor = "#2563eb";
    e.currentTarget.style.boxShadow =
      "0 0 0 3px rgba(37, 99, 235, 0.08)";
  };

  const handleBlur = (e) => {
    e.currentTarget.style.borderColor =
      colors.inputBorder;

    e.currentTarget.style.boxShadow = "none";
  };

  // =========================
  // UI
  // =========================

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}

        <div style={styles.header}>
          <div>
            <h1 style={styles.heading}>
              Create New Task
            </h1>

            <p style={styles.subtitle}>
              Add a new task and keep your work organized.
            </p>
          </div>

          <button
            type="button"
            style={styles.backButton}
            onClick={() => navigate("/dashboard")}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 5px 12px rgba(37, 99, 235, 0.20)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translateY(0)";
              e.currentTarget.style.boxShadow =
                "none";
            }}
          >
            ← Dashboard
          </button>
        </div>

        {/* Form Card */}

        <div style={styles.card}>
          <form onSubmit={handleSubmit}>

            {/* Title */}

            <label style={styles.label}>
              Task Title
            </label>

            <input
              style={styles.input}
              type="text"
              name="title"
              placeholder="Enter task title"
              value={task.title}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              autoComplete="off"
              required
            />

            {/* Description */}

            <label style={styles.label}>
              Description{" "}
              <span style={styles.optional}>
                (Optional)
              </span>
            </label>

            <textarea
              style={styles.textarea}
              name="description"
              placeholder="Describe your task"
              value={task.description}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              rows={5}
            />

            {/* Priority */}

            <label style={styles.label}>
              Priority
            </label>

            <select
              style={styles.select}
              name="priority"
              value={task.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            {/* Due Date */}

            <label style={styles.label}>
              Due Date
            </label>

            <input
              style={styles.dateInput}
              type="date"
              name="dueDate"
              value={task.dueDate}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />

            {/* Buttons */}

            <div style={styles.buttons}>

              <button
                type="button"
                style={styles.cancelButton}
                onClick={() => navigate("/dashboard")}
                disabled={loading}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform =
                      "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0)";
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                style={styles.createButton}
                disabled={loading}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform =
                      "translateY(-1px)";
                    e.currentTarget.style.boxShadow =
                      "0 5px 12px rgba(37, 99, 235, 0.20)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "none";
                }}
              >
                {loading
                  ? "Creating..."
                  : "+ Create Task"}
              </button>

            </div>
          </form>
        </div>
      </div>

      {/* Subtle Animations */}

      <style>
        {`
          @keyframes taskflowFadeUp {
            from {
              opacity: 0;
              transform: translateY(8px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes taskflowFadeDown {
            from {
              opacity: 0;
              transform: translateY(-6px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}

export default Tasks;