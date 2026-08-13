import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Settings() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  const [taskReminders, setTaskReminders] = useState(true);

  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    const savedReminders = localStorage.getItem(
      "taskflowTaskReminders"
    );

    const savedUser = localStorage.getItem("taskflowUser");

    if (!savedUser) {
      navigate("/login");
      return;
    }

    if (savedReminders === "false") {
      setTaskReminders(false);
    }

    try {
      const parsedUser = JSON.parse(savedUser);

      if (!parsedUser.email) {
        navigate("/login");
        return;
      }

      setUser({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
      });
    } catch (error) {
      console.error("Error loading user:", error);
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const savedUser = localStorage.getItem("taskflowUser");

        if (!savedUser) {
          navigate("/login");
          return;
        }

        const loggedInUser = JSON.parse(savedUser);

        if (!loggedInUser.email) {
          navigate("/login");
          return;
        }

        const email = encodeURIComponent(
          loggedInUser.email
        );

        const response = await fetch(
          `http://127.0.0.1:8000/tasks?email=${email}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || "Failed to fetch tasks."
          );
        }

        setTasks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchTasks();
  }, [navigate]);

  const handleTaskReminders = () => {
    const newValue = !taskReminders;

    setTaskReminders(newValue);

    localStorage.setItem(
      "taskflowTaskReminders",
      String(newValue)
    );
  };

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status !== "Completed"
  ).length;

  const progress =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  const colors = {
    pageBackground: darkMode
      ? "#0f172a"
      : "#f8fafc",

    cardBackground: darkMode
      ? "#1e293b"
      : "#ffffff",

    textPrimary: darkMode
      ? "#f8fafc"
      : "#1e293b",

    textSecondary: darkMode
      ? "#cbd5e1"
      : "#64748b",

    border: darkMode
      ? "#334155"
      : "#e2e8f0",

    progressBackground: darkMode
      ? "#334155"
      : "#e2e8f0",

    statBackground: darkMode
      ? "#172033"
      : "#f8fafc",
  };

  const styles = {
    page: {
      minHeight: "100vh",
      padding: "40px 60px",
      boxSizing: "border-box",
      fontFamily: "Arial, sans-serif",
      background: colors.pageBackground,
      color: colors.textPrimary,
      transition: "background 0.3s ease, color 0.3s ease",
    },

    container: {
      maxWidth: "1000px",
      margin: "0 auto",
    },

    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "20px",
      marginBottom: "30px",
      animation: "settingsFade 0.4s ease",
    },

    heading: {
      margin: "0 0 8px",
      fontSize: "34px",
      fontWeight: "800",
      color: colors.textPrimary,
    },

    subtitle: {
      margin: "0",
      fontSize: "15px",
      color: colors.textSecondary,
    },

    dashboardButton: {
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
      marginBottom: "20px",
      padding: "28px",
      borderRadius: "18px",
      background: colors.cardBackground,
      border: `1px solid ${colors.border}`,
      boxShadow: darkMode
        ? "0 5px 20px rgba(0,0,0,0.22)"
        : "0 5px 20px rgba(0,0,0,0.05)",
      boxSizing: "border-box",
      transition:
        "background 0.3s ease, border 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease",
    },

    sectionTitle: {
      margin: "0 0 6px",
      fontSize: "21px",
      fontWeight: "800",
      color: colors.textPrimary,
    },

    sectionSubtitle: {
      margin: "0 0 22px",
      fontSize: "14px",
      color: colors.textSecondary,
    },

    profileContainer: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
    },

    avatar: {
      width: "58px",
      height: "58px",
      borderRadius: "50%",
      background: "#2563eb",
      color: "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "23px",
      fontWeight: "800",
      flexShrink: 0,
    },

    profileInfo: {
      flex: 1,
      minWidth: 0,
    },

    profileName: {
      margin: "0 0 5px",
      fontSize: "17px",
      fontWeight: "700",
      color: colors.textPrimary,
    },

    profileEmail: {
      margin: "0",
      fontSize: "14px",
      color: colors.textSecondary,
      wordBreak: "break-word",
    },

    settingRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "20px",
    },

    settingTitle: {
      margin: "0 0 5px",
      fontSize: "16px",
      fontWeight: "700",
      color: colors.textPrimary,
    },

    settingDescription: {
      margin: "0",
      fontSize: "14px",
      lineHeight: "1.5",
      color: colors.textSecondary,
    },

    themeLabel: {
      marginTop: "15px",
      fontSize: "13px",
      color: colors.textSecondary,
    },

    toggle: {
      width: "50px",
      height: "28px",
      border: "none",
      borderRadius: "20px",
      padding: "3px",
      cursor: "pointer",
      position: "relative",
      flexShrink: 0,
      transition:
        "background 0.25s ease, transform 0.2s ease",
    },

    toggleCircle: {
      display: "block",
      width: "22px",
      height: "22px",
      borderRadius: "50%",
      background: "#ffffff",
      transition: "transform 0.25s ease",
      boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
    },

    progressHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px",
    },

    progressText: {
      fontSize: "14px",
      fontWeight: "600",
      color: colors.textPrimary,
    },

    progressPercentage: {
      color: "#2563eb",
      fontSize: "17px",
      fontWeight: "800",
    },

    progressBackground: {
      width: "100%",
      height: "12px",
      borderRadius: "20px",
      overflow: "hidden",
      background: colors.progressBackground,
    },

    progressBar: {
      height: "100%",
      background: "#2563eb",
      borderRadius: "20px",
      transition: "width 0.7s ease",
    },

    progressStats: {
      display: "flex",
      gap: "12px",
      marginTop: "18px",
      flexWrap: "wrap",
    },

    statBox: {
      flex: "1 1 150px",
      padding: "14px",
      borderRadius: "12px",
      border: `1px solid ${colors.border}`,
      background: colors.statBackground,
      textAlign: "center",
      transition:
        "transform 0.2s ease, background 0.3s ease",
    },

    statNumber: {
      margin: "0 0 5px",
      fontSize: "22px",
      fontWeight: "800",
      color: colors.textPrimary,
    },

    statLabel: {
      margin: "0",
      fontSize: "12px",
      color: colors.textSecondary,
    },

    emptyText: {
      margin: "14px 0 0",
      fontSize: "14px",
      lineHeight: "1.5",
      color: colors.textSecondary,
    },
  };

  return (
    <>
      <style>
        {`
          @keyframes settingsFade {
            from {
              opacity: 0;
              transform: translateY(8px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .settings-card {
            animation: settingsFade 0.45s ease both;
          }

          .settings-card:nth-child(2) {
            animation-delay: 0.05s;
          }

          .settings-card:nth-child(3) {
            animation-delay: 0.1s;
          }

          .settings-card:nth-child(4) {
            animation-delay: 0.15s;
          }

          .settings-card:nth-child(5) {
            animation-delay: 0.2s;
          }

          .settings-card:hover {
            transform: translateY(-2px);
          }

          .settings-button:hover {
            transform: translateY(-2px);
            box-shadow:
              0 5px 12px rgba(37, 99, 235, 0.2);
          }

          .settings-button:active {
            transform: translateY(0);
          }

          .toggle-button:hover {
            transform: scale(1.04);
          }

          .stat-box:hover {
            transform: translateY(-2px);
          }

          @media (max-width: 768px) {
            .settings-page {
              padding: 25px 20px !important;
            }

            .settings-header {
              flex-direction: column;
              align-items: flex-start !important;
            }

            .setting-row {
              align-items: flex-start !important;
            }
          }
        `}
      </style>

      <div
        className="settings-page"
        style={styles.page}
      >
        <div style={styles.container}>
          <div
            className="settings-header"
            style={styles.header}
          >
            <div>
              <h1 style={styles.heading}>
                Settings
              </h1>

              <p style={styles.subtitle}>
                Manage your TaskFlow preferences.
              </p>
            </div>

            <button
              className="settings-button"
              style={styles.dashboardButton}
              onClick={() => navigate("/dashboard")}
            >
              ← Dashboard
            </button>
          </div>

          <div
            className="settings-card"
            style={styles.card}
          >
            <h2 style={styles.sectionTitle}>
              👤 Profile
            </h2>

            <p style={styles.sectionSubtitle}>
              Your TaskFlow account information.
            </p>

            <div style={styles.profileContainer}>
              <div style={styles.avatar}>
                {user.name
                  ? user.name.charAt(0).toUpperCase()
                  : "T"}
              </div>

              <div style={styles.profileInfo}>
                <h3 style={styles.profileName}>
                  {user.name || "User"}
                </h3>

                <p style={styles.profileEmail}>
                  {user.email || "Email not available"}
                </p>
              </div>
            </div>
          </div>

          <div
            className="settings-card"
            style={styles.card}
          >
            <h2 style={styles.sectionTitle}>
              🎨 Appearance
            </h2>

            <p style={styles.sectionSubtitle}>
              Choose how TaskFlow looks on your screen.
            </p>

            <div
              className="setting-row"
              style={styles.settingRow}
            >
              <div>
                <h3 style={styles.settingTitle}>
                  Dark Mode
                </h3>

                <p style={styles.settingDescription}>
                  Use a darker appearance for TaskFlow.
                </p>
              </div>

              <button
                className="toggle-button"
                style={{
                  ...styles.toggle,
                  background: darkMode
                    ? "#2563eb"
                    : "#cbd5e1",
                }}
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
              >
                <span
                  style={{
                    ...styles.toggleCircle,
                    transform: darkMode
                      ? "translateX(22px)"
                      : "translateX(0)",
                  }}
                />
              </button>
            </div>

            <div style={styles.themeLabel}>
              Current theme:{" "}
              <strong>
                {darkMode ? "Dark" : "Light"}
              </strong>
            </div>
          </div>

          <div
            className="settings-card"
            style={styles.card}
          >
            <h2 style={styles.sectionTitle}>
              🔔 Notifications
            </h2>

            <p style={styles.sectionSubtitle}>
              Control your task reminder preference.
            </p>

            <div
              className="setting-row"
              style={styles.settingRow}
            >
              <div>
                <h3 style={styles.settingTitle}>
                  Task Reminders
                </h3>

                <p style={styles.settingDescription}>
                  Receive reminders for tasks with upcoming
                  due dates.
                </p>
              </div>

              <button
                className="toggle-button"
                style={{
                  ...styles.toggle,
                  background: taskReminders
                    ? "#2563eb"
                    : "#cbd5e1",
                }}
                onClick={handleTaskReminders}
                aria-label="Toggle task reminders"
              >
                <span
                  style={{
                    ...styles.toggleCircle,
                    transform: taskReminders
                      ? "translateX(22px)"
                      : "translateX(0)",
                  }}
                />
              </button>
            </div>

            <div style={styles.themeLabel}>
              Task reminders:{" "}
              <strong>
                {taskReminders ? "ON" : "OFF"}
              </strong>
            </div>
          </div>

          <div
            className="settings-card"
            style={styles.card}
          >
            <h2 style={styles.sectionTitle}>
              📊 Task Progress
            </h2>

            <p style={styles.sectionSubtitle}>
              See how many of your tasks are completed.
            </p>

            {loadingTasks ? (
              <p style={styles.settingDescription}>
                Loading task progress...
              </p>
            ) : (
              <>
                <div style={styles.progressHeader}>
                  <span style={styles.progressText}>
                    {completedTasks} of {totalTasks} tasks
                    completed
                  </span>

                  <span style={styles.progressPercentage}>
                    {progress}%
                  </span>
                </div>

                <div style={styles.progressBackground}>
                  <div
                    style={{
                      ...styles.progressBar,
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <div style={styles.progressStats}>
                  <div
                    className="stat-box"
                    style={styles.statBox}
                  >
                    <p style={styles.statNumber}>
                      {totalTasks}
                    </p>

                    <p style={styles.statLabel}>
                      Total Tasks
                    </p>
                  </div>

                  <div
                    className="stat-box"
                    style={styles.statBox}
                  >
                    <p
                      style={{
                        ...styles.statNumber,
                        color: "#16a34a",
                      }}
                    >
                      {completedTasks}
                    </p>

                    <p style={styles.statLabel}>
                      Completed
                    </p>
                  </div>

                  <div
                    className="stat-box"
                    style={styles.statBox}
                  >
                    <p
                      style={{
                        ...styles.statNumber,
                        color: "#2563eb",
                      }}
                    >
                      {pendingTasks}
                    </p>

                    <p style={styles.statLabel}>
                      Pending
                    </p>
                  </div>
                </div>

                {totalTasks === 0 && (
                  <p style={styles.emptyText}>
                    No tasks available yet. Create a task
                    to start tracking your progress.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;