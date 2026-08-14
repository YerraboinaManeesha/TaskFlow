import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Projects() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const API_URL = import.meta.env.VITE_API_URL;

  const savedUser = localStorage.getItem("taskflowUser");

  let currentUser = null;

  try {
    currentUser = savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error("Error reading user:", error);
  }

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [project, setProject] = useState({
    name: "",
    description: "",
    url: "",
  });

  const fetchProjects = async () => {
    if (!currentUser?.email) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/projects?email=${encodeURIComponent(
          currentUser.email
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to fetch projects."
        );
      }

      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProject((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser?.email) {
      navigate("/login");
      return;
    }

    if (!project.name.trim() || !project.url.trim()) {
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: project.name.trim(),
          description: project.description.trim(),
          url: project.url.trim(),
          email: currentUser.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to create project."
        );
      }

      setProject({
        name: "",
        description: "",
        url: "",
      });

      await fetchProjects();
    } catch (error) {
      console.error("Project creation error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (!currentUser?.email) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/projects/${projectId}?email=${encodeURIComponent(
          currentUser.email
        )}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to delete project."
        );
      }

      setProjects((previous) =>
        previous.filter(
          (item) => String(item._id) !== String(projectId)
        )
      );
    } catch (error) {
      console.error("Delete project error:", error);
    }
  };

  const colors = darkMode
    ? {
        pageBackground: "#0f172a",
        cardBackground: "#1e293b",
        itemBackground: "#172033",
        text: "#f8fafc",
        secondaryText: "#94a3b8",
        labelText: "#e2e8f0",
        border: "#334155",
        inputBorder: "#475569",
        inputBackground: "#0f172a",
        iconBackground: "#172554",
        iconColor: "#60a5fa",
        buttonBackground: "#2563eb",
        openBackground: "#172554",
        openText: "#60a5fa",
        deleteBackground: "#451a1a",
      }
    : {
        pageBackground: "#f8fafc",
        cardBackground: "#ffffff",
        itemBackground: "#ffffff",
        text: "#1e293b",
        secondaryText: "#64748b",
        labelText: "#334155",
        border: "#e2e8f0",
        inputBorder: "#cbd5e1",
        inputBackground: "#ffffff",
        iconBackground: "#eff6ff",
        iconColor: "#2563eb",
        buttonBackground: "#2563eb",
        openBackground: "#eff6ff",
        openText: "#2563eb",
        deleteBackground: "#fee2e2",
      };

  const styles = {
    page: {
      minHeight: "100vh",
      background: colors.pageBackground,
      padding: "40px 60px",
      boxSizing: "border-box",
      fontFamily: "Arial, sans-serif",
      color: colors.text,
    },

    header: {
      maxWidth: "1050px",
      margin: "0 auto 30px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "20px",
    },

    heading: {
      margin: "0 0 8px",
      fontSize: "34px",
      fontWeight: "800",
    },

    subtitle: {
      margin: 0,
      color: colors.secondaryText,
      fontSize: "15px",
    },

    dashboardButton: {
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
      maxWidth: "1050px",
      margin: "0 auto 25px",
      background: colors.cardBackground,
      padding: "30px",
      borderRadius: "18px",
      boxShadow: darkMode
        ? "0 4px 15px rgba(0,0,0,0.25)"
        : "0 4px 15px rgba(0,0,0,0.05)",
      boxSizing: "border-box",
    },

    sectionTitle: {
      margin: "0 0 6px",
      fontSize: "22px",
      fontWeight: "800",
    },

    sectionSubtitle: {
      margin: "0 0 20px",
      color: colors.secondaryText,
      fontSize: "14px",
    },

    label: {
      display: "block",
      margin: "18px 0 8px",
      fontSize: "14px",
      fontWeight: "700",
      color: colors.labelText,
    },

    optional: {
      color: colors.secondaryText,
      fontSize: "13px",
      fontWeight: "500",
    },

    input: {
      width: "100%",
      padding: "12px 14px",
      border: `1px solid ${colors.inputBorder}`,
      borderRadius: "10px",
      fontSize: "14px",
      boxSizing: "border-box",
      outline: "none",
      background: colors.inputBackground,
      color: colors.text,
      transition:
        "border-color 0.2s ease, box-shadow 0.2s ease",
    },

    textarea: {
      width: "100%",
      padding: "12px 14px",
      border: `1px solid ${colors.inputBorder}`,
      borderRadius: "10px",
      fontSize: "14px",
      boxSizing: "border-box",
      resize: "vertical",
      fontFamily: "Arial, sans-serif",
      outline: "none",
      background: colors.inputBackground,
      color: colors.text,
      transition:
        "border-color 0.2s ease, box-shadow 0.2s ease",
    },

    addButton: {
      marginTop: "20px",
      border: "none",
      borderRadius: "10px",
      background: colors.buttonBackground,
      color: "#ffffff",
      padding: "12px 22px",
      fontSize: "14px",
      fontWeight: "700",
      cursor: saving ? "not-allowed" : "pointer",
      opacity: saving ? 0.7 : 1,
      transition:
        "transform 0.2s ease, box-shadow 0.2s ease",
    },

    emptyState: {
      textAlign: "center",
      padding: "55px 20px",
      border: `1px dashed ${colors.border}`,
      borderRadius: "14px",
    },

    emptyIcon: {
      width: "60px",
      height: "60px",
      margin: "0 auto 15px",
      borderRadius: "50%",
      background: colors.iconBackground,
      color: colors.iconColor,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "28px",
      fontWeight: "bold",
    },

    emptyTitle: {
      margin: "0 0 8px",
      fontSize: "20px",
    },

    emptyText: {
      margin: "0 auto",
      color: colors.secondaryText,
      maxWidth: "450px",
      lineHeight: "1.5",
    },

    projectList: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },

    projectItem: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      padding: "18px",
      border: `1px solid ${colors.border}`,
      borderRadius: "12px",
      background: colors.itemBackground,
      transition:
        "transform 0.2s ease, box-shadow 0.2s ease",
    },

    projectIcon: {
      width: "48px",
      height: "48px",
      flexShrink: 0,
      borderRadius: "11px",
      background: colors.iconBackground,
      color: colors.iconColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "21px",
      fontWeight: "bold",
    },

    projectInfo: {
      flex: 1,
      minWidth: 0,
    },

    projectName: {
      margin: "0 0 6px",
      fontSize: "17px",
      fontWeight: "700",
    },

    projectDescription: {
      margin: "0 0 7px",
      color: colors.secondaryText,
      fontSize: "14px",
    },

    projectUrl: {
      margin: 0,
      color: "#3b82f6",
      fontSize: "13px",
      wordBreak: "break-all",
    },

    projectActions: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      flexShrink: 0,
    },

    openButton: {
      border: "none",
      borderRadius: "8px",
      background: colors.openBackground,
      color: colors.openText,
      padding: "9px 14px",
      fontSize: "13px",
      fontWeight: "700",
      cursor: "pointer",
      transition:
        "transform 0.2s ease, box-shadow 0.2s ease",
    },

    deleteButton: {
      width: "36px",
      height: "36px",
      border: "none",
      borderRadius: "8px",
      background: colors.deleteBackground,
      color: "#dc2626",
      fontSize: "16px",
      fontWeight: "700",
      cursor: "pointer",
      transition: "transform 0.2s ease",
    },
  };

  return (
    <div style={styles.page}>
      <style>
        {`
          input:focus,
          textarea:focus {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
          }

          .dashboard-button:hover,
          .add-project-button:hover,
          .open-project-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 12px rgba(37, 99, 235, 0.18);
          }

          .delete-project-button:hover {
            transform: scale(1.05);
          }

          .project-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
          }
        `}
      </style>

      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Projects</h1>

          <p style={styles.subtitle}>
            Save and access your projects in one place.
          </p>
        </div>

        <button
          className="dashboard-button"
          style={styles.dashboardButton}
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>
          Add New Project
        </h2>

        <p style={styles.sectionSubtitle}>
          Add your project name, description and project
          link.
        </p>

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>
            Project Name
          </label>

          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="Enter project name"
            value={project.name}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>
            Description{" "}
            <span style={styles.optional}>
              (Optional)
            </span>
          </label>

          <textarea
            style={styles.textarea}
            name="description"
            placeholder="Describe your project"
            value={project.description}
            onChange={handleChange}
            rows="4"
          />

          <label style={styles.label}>
            Project URL
          </label>

          <input
            style={styles.input}
            type="url"
            name="url"
            placeholder="https://github.com/username/project"
            value={project.url}
            onChange={handleChange}
            required
          />

          <button
            className="add-project-button"
            type="submit"
            style={styles.addButton}
            disabled={saving}
          >
            {saving ? "Adding..." : "+ Add Project"}
          </button>
        </form>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>
          My Projects
        </h2>

        <p style={styles.sectionSubtitle}>
          Your saved project links will appear here.
        </p>

        {loading && (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>
              Loading projects...
            </p>
          </div>
        )}

        {!loading && projects.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>▣</div>

            <h3 style={styles.emptyTitle}>
              No projects yet
            </h3>

            <p style={styles.emptyText}>
              Add your first project and save its link
              here.
            </p>
          </div>
        )}

        {!loading && projects.length > 0 && (
          <div style={styles.projectList}>
            {projects.map((item) => (
              <div
                key={item._id}
                className="project-item"
                style={styles.projectItem}
              >
                <div style={styles.projectIcon}>
                  ▣
                </div>

                <div style={styles.projectInfo}>
                  <h3 style={styles.projectName}>
                    {item.name}
                  </h3>

                  {item.description && (
                    <p style={styles.projectDescription}>
                      {item.description}
                    </p>
                  )}

                  <p style={styles.projectUrl}>
                    {item.url}
                  </p>
                </div>

                <div style={styles.projectActions}>
                  <button
                    className="open-project-button"
                    style={styles.openButton}
                    onClick={() => {
                      let projectUrl = item.url;

                      if (
                        !projectUrl.startsWith(
                          "http://"
                        ) &&
                        !projectUrl.startsWith(
                          "https://"
                        )
                      ) {
                        projectUrl =
                          "https://" + projectUrl;
                      }

                      window.open(
                        projectUrl,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                  >
                    Open Project ↗
                  </button>

                  <button
                    className="delete-project-button"
                    style={styles.deleteButton}
                    onClick={() =>
                      handleDelete(item._id)
                    }
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;