import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Dashboard() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // User
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  // Load logged-in user
  useEffect(() => {
    const savedUser = localStorage.getItem("taskflowUser");

    if (!savedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);

      setUser({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
      });
    } catch (error) {
      console.error("Error loading user:", error);
      localStorage.removeItem("taskflowUser");
      navigate("/login");
    }
  }, [navigate]);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      const savedUser = localStorage.getItem("taskflowUser");

      if (!savedUser) {
        setLoading(false);
        return;
      }

      try {
        const loggedInUser = JSON.parse(savedUser);

        if (!loggedInUser.email) {
          setLoading(false);
          return;
        }

        const response = await fetch(
           `${import.meta.env.VITE_API_URL}/tasks?email=${encodeURIComponent(
            loggedInUser.email
          )}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || "Failed to fetch tasks"
          );
        }

        setTasks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Task statistics
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

  // Logout
  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("taskflowUser");
    setShowLogoutConfirm(false);
    navigate("/login");
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // Hover animation
  const handleMouseMove = (e) => {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;

    element.style.transform = `
      perspective(700px)
      translateY(-4px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.01)
    `;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform =
      "perspective(700px) translateY(0) rotateX(0deg) rotateY(0deg) scale(1)";
  };

  // Theme colors
  const colors = {
    pageBackground: darkMode ? "#0f172a" : "#f8fafc",
    sidebarBackground: darkMode ? "#111827" : "#ffffff",
    cardBackground: darkMode ? "#1e293b" : "#ffffff",
    textPrimary: darkMode ? "#f8fafc" : "#1e293b",
    textSecondary: darkMode ? "#cbd5e1" : "#64748b",
    border: darkMode ? "#334155" : "#e2e8f0",
  };

  return (
    <div
      style={{
        ...styles.page,
        background: colors.pageBackground,
      }}
    >
      <style>
        {`
          @keyframes logoutModalIn {
            from {
              opacity: 0;
              transform: scale(0.96);
            }

            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .logout-cancel:hover {
            transform: translateY(-1px);
          }

          .logout-confirm:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 10px rgba(220, 38, 38, 0.25);
          }

          .logout-modal-button {
            transition:
              transform 0.2s ease,
              box-shadow 0.2s ease;
          }
        `}
      </style>

      {/* Sidebar */}
      <aside
        style={{
          ...styles.sidebar,
          background: colors.sidebarBackground,
          borderRight: `1px solid ${colors.border}`,
        }}
      >
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>✓</div>

          <h2 style={styles.logoText}>TaskFlow</h2>
        </div>

        <div style={styles.navigation}>
          <div
            style={{
              ...styles.navItem,
              background: darkMode ? "#1d4ed8" : "#eff6ff",
              color: darkMode ? "#ffffff" : "#2563eb",
              fontWeight: "700",
            }}
            onClick={() => navigate("/dashboard")}
          >
            <span style={styles.navIcon}>🏠</span>
            Dashboard
          </div>

          <div
            style={{
              ...styles.navItem,
              color: colors.textPrimary,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => navigate("/my-tasks")}
          >
            <span style={styles.navIcon}>✓</span>
            My Tasks
          </div>

          <div
            style={{
              ...styles.navItem,
              color: colors.textPrimary,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => navigate("/projects")}
          >
            <span style={styles.navIcon}>▣</span>
            Projects
          </div>

          <div
            style={{
              ...styles.navItem,
              color: colors.textPrimary,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => navigate("/settings")}
          >
            <span style={styles.navIcon}>⚙</span>
            Settings
          </div>
        </div>

        <div style={styles.logoutContainer}>
          <button
            style={styles.logoutButton}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1
              style={{
                ...styles.heading,
                color: colors.textPrimary,
              }}
            >
              Dashboard
            </h1>

            <p
              style={{
                ...styles.subtitle,
                color: colors.textSecondary,
              }}
            >
              Welcome back
              {user.name ? `, ${user.name}` : ""}! Here's your
              task overview.
            </p>
          </div>

          <button
            style={styles.addTaskButton}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => navigate("/tasks")}
          >
            + Add Task
          </button>
        </div>

        {/* Statistics */}
        <div style={styles.statsGrid}>
          <div
            style={{
              ...styles.statCard,
              background: colors.cardBackground,
              border: `1px solid ${colors.border}`,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div style={styles.statIconBlue}>✓</div>

            <div>
              <p
                style={{
                  ...styles.statLabel,
                  color: colors.textSecondary,
                }}
              >
                Total Tasks
              </p>

              <h2
                style={{
                  ...styles.statNumber,
                  color: colors.textPrimary,
                }}
              >
                {loading ? "..." : totalTasks}
              </h2>
            </div>
          </div>

          <div
            style={{
              ...styles.statCard,
              background: colors.cardBackground,
              border: `1px solid ${colors.border}`,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div style={styles.statIconOrange}>⏳</div>

            <div>
              <p
                style={{
                  ...styles.statLabel,
                  color: colors.textSecondary,
                }}
              >
                Pending
              </p>

              <h2
                style={{
                  ...styles.statNumber,
                  color: colors.textPrimary,
                }}
              >
                {loading ? "..." : pendingTasks}
              </h2>
            </div>
          </div>

          <div
            style={{
              ...styles.statCard,
              background: colors.cardBackground,
              border: `1px solid ${colors.border}`,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div style={styles.statIconGreen}>✓</div>

            <div>
              <p
                style={{
                  ...styles.statLabel,
                  color: colors.textSecondary,
                }}
              >
                Completed
              </p>

              <h2
                style={{
                  ...styles.statNumber,
                  color: colors.textPrimary,
                }}
              >
                {loading ? "..." : completedTasks}
              </h2>
            </div>
          </div>

          <div
            style={{
              ...styles.statCard,
              background: colors.cardBackground,
              border: `1px solid ${colors.border}`,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div style={styles.statIconPurple}>%</div>

            <div>
              <p
                style={{
                  ...styles.statLabel,
                  color: colors.textSecondary,
                }}
              >
                Progress
              </p>

              <h2
                style={{
                  ...styles.statNumber,
                  color: colors.textPrimary,
                }}
              >
                {progress}%
              </h2>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div
          style={{
            ...styles.card,
            background: colors.cardBackground,
            border: `1px solid ${colors.border}`,
          }}
        >
          <div style={styles.cardHeader}>
            <div>
              <h2
                style={{
                  ...styles.cardTitle,
                  color: colors.textPrimary,
                }}
              >
                Overall Progress
              </h2>

              <p
                style={{
                  ...styles.cardSubtitle,
                  color: colors.textSecondary,
                }}
              >
                Keep completing your tasks to reach your goals.
              </p>
            </div>

            <strong style={styles.progressPercentage}>
              {progress}%
            </strong>
          </div>

          <div
            style={{
              ...styles.progressBackground,
              background: darkMode ? "#334155" : "#e2e8f0",
            }}
          >
            <div
              style={{
                ...styles.progressBar,
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* Recent Tasks */}
        <div
          style={{
            ...styles.card,
            background: colors.cardBackground,
            border: `1px solid ${colors.border}`,
          }}
        >
          <div style={styles.cardHeader}>
            <div>
              <h2
                style={{
                  ...styles.cardTitle,
                  color: colors.textPrimary,
                }}
              >
                Recent Tasks
              </h2>

              <p
                style={{
                  ...styles.cardSubtitle,
                  color: colors.textSecondary,
                }}
              >
                Your latest tasks.
              </p>
            </div>

            <button
              style={styles.viewTasksButton}
              onClick={() => navigate("/my-tasks")}
            >
              View All
            </button>
          </div>

          {loading ? (
            <p style={{ color: colors.textSecondary }}>
              Loading tasks...
            </p>
          ) : tasks.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={{ color: colors.textSecondary }}>
                No tasks available yet.
              </p>

              <button
                style={styles.createTaskButton}
                onClick={() => navigate("/tasks")}
              >
                Create Your First Task
              </button>
            </div>
          ) : (
            <div>
              {tasks.slice(0, 5).map((task) => (
                <div
                  key={task._id}
                  style={{
                    ...styles.taskRow,
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  <div style={styles.taskInfo}>
                    <h3
                      style={{
                        ...styles.taskTitle,
                        color: colors.textPrimary,
                      }}
                    >
                      {task.title}
                    </h3>

                    <p
                      style={{
                        ...styles.taskDescription,
                        color: colors.textSecondary,
                      }}
                    >
                      {task.description || "No description"}
                    </p>
                  </div>

                  <div style={styles.taskRight}>
                    <span
                      style={{
                        ...styles.priorityBadge,
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

                    <span
                      style={{
                        ...styles.statusBadge,
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
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <div style={styles.logoutOverlay}>
          <div
            style={{
              ...styles.logoutModal,
              background: darkMode ? "#1e293b" : "#ffffff",
            }}
          >
            <div style={styles.logoutIcon}>!</div>

            <h2
              style={{
                ...styles.logoutTitle,
                color: colors.textPrimary,
              }}
            >
              Logout?
            </h2>

            <p
              style={{
                ...styles.logoutText,
                color: colors.textSecondary,
              }}
            >
              Are you sure you want to logout from TaskFlow?
            </p>

            <div style={styles.logoutActions}>
              <button
                className="logout-modal-button logout-cancel"
                style={{
                  ...styles.cancelLogoutButton,
                  background: darkMode ? "#334155" : "#ffffff",
                  color: colors.textPrimary,
                  border: `1px solid ${colors.border}`,
                }}
                onClick={cancelLogout}
              >
                Cancel
              </button>

              <button
                className="logout-modal-button logout-confirm"
                style={styles.confirmLogoutButton}
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    fontFamily: "Arial, sans-serif",
    transition: "background 0.3s ease",
  },

  sidebar: {
    width: "245px",
    minHeight: "100vh",
    padding: "25px 18px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    left: 0,
    top: 0,
    transition: "background 0.3s ease",
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "5px 8px",
    marginBottom: "40px",
  },

  logoIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#2563eb",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "800",
  },

  logoText: {
    margin: 0,
    fontSize: "25px",
    fontWeight: "800",
    color: "#2563eb",
  },

  navigation: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: "13px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
    transition:
      "transform 0.25s ease, background 0.25s ease, box-shadow 0.25s ease",
    willChange: "transform",
  },

  navIcon: {
    width: "22px",
    textAlign: "center",
    fontSize: "17px",
  },

  logoutContainer: {
    marginTop: "auto",
    padding: "10px 5px",
  },

  logoutButton: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #dc2626",
    background: "transparent",
    color: "#dc2626",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    transition:
      "transform 0.25s ease, background 0.25s ease",
    willChange: "transform",
  },

  main: {
    marginLeft: "245px",
    width: "calc(100% - 245px)",
    padding: "40px 45px",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  heading: {
    margin: "0 0 8px",
    fontSize: "34px",
    fontWeight: "800",
  },

  subtitle: {
    margin: 0,
    fontSize: "15px",
  },

  addTaskButton: {
    border: "none",
    borderRadius: "10px",
    background: "#2563eb",
    color: "#ffffff",
    padding: "12px 18px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    transition:
      "transform 0.25s ease, box-shadow 0.25s ease",
    willChange: "transform",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "18px",
    marginBottom: "22px",
  },

  statCard: {
    minHeight: "110px",
    padding: "20px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxSizing: "border-box",
    transition:
      "background 0.3s ease, transform 0.25s ease, box-shadow 0.25s ease",
    willChange: "transform",
    cursor: "default",
  },

  statIconBlue: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    background: "#dbeafe",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "800",
  },

  statIconOrange: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    background: "#ffedd5",
    color: "#ea580c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
  },

  statIconGreen: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    background: "#dcfce7",
    color: "#16a34a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "800",
  },

  statIconPurple: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    background: "#ede9fe",
    color: "#7c3aed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "800",
  },

  statLabel: {
    margin: "0 0 5px",
    fontSize: "13px",
  },

  statNumber: {
    margin: 0,
    fontSize: "25px",
    fontWeight: "800",
  },

  card: {
    padding: "25px",
    borderRadius: "17px",
    marginBottom: "22px",
    boxSizing: "border-box",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    transition:
      "background 0.3s ease, box-shadow 0.3s ease",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  cardTitle: {
    margin: "0 0 5px",
    fontSize: "20px",
    fontWeight: "800",
  },

  cardSubtitle: {
    margin: 0,
    fontSize: "14px",
  },

  progressPercentage: {
    color: "#2563eb",
    fontSize: "22px",
    fontWeight: "800",
  },

  progressBackground: {
    width: "100%",
    height: "12px",
    borderRadius: "20px",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    background: "#2563eb",
    borderRadius: "20px",
    transition: "width 0.6s ease",
  },

  viewTasksButton: {
    border: "none",
    background: "transparent",
    color: "#2563eb",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "14px",
    transition: "transform 0.2s ease",
  },

  taskRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    padding: "16px 14px",
  },

  taskInfo: {
    flex: 1,
    minWidth: 0,
  },

  taskTitle: {
    margin: "0 0 5px",
    fontSize: "15px",
    fontWeight: "700",
  },

  taskDescription: {
    margin: 0,
    fontSize: "13px",
  },

  taskRight: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexShrink: 0,
  },

  priorityBadge: {
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
  },

  statusBadge: {
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
  },

  emptyState: {
    textAlign: "center",
    padding: "20px",
  },

  createTaskButton: {
    border: "none",
    borderRadius: "9px",
    background: "#2563eb",
    color: "#ffffff",
    padding: "11px 16px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "transform 0.2s ease",
  },

  logoutOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    padding: "20px",
    boxSizing: "border-box",
  },

  logoutModal: {
    width: "100%",
    maxWidth: "390px",
    padding: "28px",
    borderRadius: "16px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
    textAlign: "center",
    animation: "logoutModalIn 0.2s ease",
  },

  logoutIcon: {
    width: "50px",
    height: "50px",
    margin: "0 auto 16px",
    borderRadius: "50%",
    background: "#fee2e2",
    color: "#dc2626",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
    fontWeight: "800",
  },

  logoutTitle: {
    margin: "0 0 8px",
    fontSize: "21px",
    fontWeight: "800",
  },

  logoutText: {
    margin: "0 0 24px",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  logoutActions: {
    display: "flex",
    gap: "10px",
  },

  cancelLogoutButton: {
    flex: 1,
    padding: "11px",
    borderRadius: "9px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },

  confirmLogoutButton: {
    flex: 1,
    padding: "11px",
    borderRadius: "9px",
    border: "none",
    background: "#dc2626",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default Dashboard;