import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Password visibility
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    if (message) {
      setMessage("");
      setMessageType("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    if (formData.newPassword.length < 8) {
      setMessage("Password must be at least 8 characters.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch (error) {
        console.error("Invalid backend response:", error);
      }

      if (!response.ok) {
        setMessage(
          data.detail ||
            data.message ||
            "Password update failed."
        );
        setMessageType("error");
        return;
      }

      setMessage(
        data.message ||
          "Password updated successfully!"
      );
      setMessageType("success");

      setFormData({
        email: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (error) {
      console.error("Reset Password Error:", error);

      setMessage(
        "Unable to connect to the backend. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Eye icon
  const EyeIcon = ({ visible }) => (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />

      {!visible && (
        <line
          x1="3"
          y1="3"
          x2="21"
          y2="21"
        />
      )}
    </svg>
  );

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background:
        "linear-gradient(135deg, #eff6ff, #dbeafe)",
      fontFamily: "Arial, sans-serif",
      padding: "30px",
      boxSizing: "border-box",
    },

    card: {
      width: "430px",
      padding: "45px",
      background: "#ffffff",
      borderRadius: "20px",
      boxShadow:
        "0 15px 40px rgba(0, 0, 0, 0.12)",
      boxSizing: "border-box",
      animation: "cardEntrance 0.5s ease-out",
    },

    title: {
      margin: "0 0 10px",
      textAlign: "center",
      fontSize: "30px",
      fontWeight: "800",
      color: "#1e293b",
    },

    subtitle: {
      margin: "0 0 25px",
      textAlign: "center",
      color: "#64748b",
      fontSize: "14px",
      lineHeight: "1.5",
    },

    message: {
      padding: "12px 14px",
      marginBottom: "20px",
      borderRadius: "10px",
      fontSize: "14px",
      fontWeight: "600",
      lineHeight: "1.4",
      textAlign: "center",
      animation: "messageFade 0.3s ease-out",
    },

    successMessage: {
      background: "#dcfce7",
      color: "#166534",
      border: "1px solid #86efac",
    },

    errorMessage: {
      background: "#fee2e2",
      color: "#991b1b",
      border: "1px solid #fca5a5",
    },

    label: {
      display: "block",
      marginBottom: "8px",
      color: "#1e293b",
      fontSize: "14px",
      fontWeight: "700",
    },

    passwordWrapper: {
      position: "relative",
      width: "100%",
      marginBottom: "20px",
    },

    input: {
      width: "100%",
      padding: "13px 45px 13px 13px",
      boxSizing: "border-box",
      border: "1px solid #cbd5e1",
      borderRadius: "10px",
      fontSize: "15px",
      outline: "none",
      background: "#ffffff",
      color: "#1e293b",
      transition:
        "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
    },

    emailInput: {
      width: "100%",
      padding: "13px",
      marginBottom: "20px",
      boxSizing: "border-box",
      border: "1px solid #cbd5e1",
      borderRadius: "10px",
      fontSize: "15px",
      outline: "none",
      background: "#ffffff",
      color: "#1e293b",
      transition:
        "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
    },

    eyeButton: {
      position: "absolute",
      right: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      width: "28px",
      height: "28px",
      padding: "0",
      border: "none",
      background: "transparent",
      color: "#64748b",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
    },

    updateButton: {
      width: "100%",
      padding: "14px",
      border: "none",
      borderRadius: "10px",
      background: "#2563eb",
      color: "#ffffff",
      fontSize: "16px",
      fontWeight: "700",
      cursor: "pointer",
      transition:
        "transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease",
    },

    backButton: {
      width: "100%",
      padding: "14px",
      marginTop: "12px",
      border: "1px solid #cbd5e1",
      borderRadius: "10px",
      background: "#ffffff",
      color: "#334155",
      fontSize: "15px",
      fontWeight: "700",
      cursor: "pointer",
      transition:
        "transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
    },
  };

  return (
    <>
      <style>
        {`
          @keyframes cardEntrance {
            from {
              opacity: 0;
              transform: translateY(15px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes messageFade {
            from {
              opacity: 0;
              transform: translateY(-5px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .forgot-input:focus {
            border-color: #2563eb !important;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
            transform: translateY(-1px);
          }

          .update-button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(37, 99, 235, 0.22);
          }

          .back-button:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
          }

          .eye-button:hover:not(:disabled) {
            color: #2563eb;
          }

          .eye-button:focus {
            outline: none;
          }
        `}
      </style>

      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>
            Forgot Password
          </h1>

          <p style={styles.subtitle}>
            Enter your email and create a new password.
          </p>

          {message && (
            <div
              style={{
                ...styles.message,
                ...(messageType === "success"
                  ? styles.successMessage
                  : styles.errorMessage),
              }}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label style={styles.label}>
              Email Address
            </label>

            <input
              className="forgot-input"
              style={styles.emailInput}
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
              disabled={loading}
            />

            <label style={styles.label}>
              New Password
            </label>

            <div style={styles.passwordWrapper}>
              <input
                className="forgot-input"
                style={styles.input}
                type={
                  showNewPassword
                    ? "text"
                    : "password"
                }
                name="newPassword"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
                disabled={loading}
              />

              <button
                type="button"
                className="eye-button"
                style={styles.eyeButton}
                onClick={() =>
                  setShowNewPassword(
                    (previous) => !previous
                  )
                }
                disabled={loading}
                aria-label={
                  showNewPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                <EyeIcon visible={showNewPassword} />
              </button>
            </div>

            <label style={styles.label}>
              Confirm Password
            </label>

            <div style={styles.passwordWrapper}>
              <input
                className="forgot-input"
                style={styles.input}
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
                disabled={loading}
              />

              <button
                type="button"
                className="eye-button"
                style={styles.eyeButton}
                onClick={() =>
                  setShowConfirmPassword(
                    (previous) => !previous
                  )
                }
                disabled={loading}
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                <EyeIcon
                  visible={showConfirmPassword}
                />
              </button>
            </div>

            <button
              type="submit"
              className="update-button"
              style={{
                ...styles.updateButton,
                opacity: loading ? 0.7 : 1,
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
              }}
              disabled={loading}
            >
              {loading
                ? "Updating..."
                : "Update Password"}
            </button>

            <button
              type="button"
              className="back-button"
              style={{
                ...styles.backButton,
                opacity: loading ? 0.7 : 1,
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
              }}
              onClick={() => navigate("/login")}
              disabled={loading}
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;