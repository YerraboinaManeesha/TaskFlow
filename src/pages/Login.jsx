import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      console.log("Backend Response:", data);

      if (!response.ok) {
        setErrorMessage(
          data.detail || "Invalid email or password."
        );
        return;
      }

      if (data.message === "Login successful") {
        const loggedInUser = {
          name: data.name,
          email: data.email,
        };

        localStorage.setItem(
          "taskflowUser",
          JSON.stringify(loggedInUser)
        );

        navigate("/dashboard");
      } else {
        setErrorMessage(
          data.message || "Login failed."
        );
      }
    } catch (error) {
      console.error("Login Error:", error);

      setErrorMessage(
        "Backend connection failed. Make sure FastAPI is running."
      );
    }
  };

  const handleInputFocus = (e) => {
    e.currentTarget.style.border =
      "1px solid #2563eb";
    e.currentTarget.style.boxShadow =
      "0 0 0 3px rgba(37, 99, 235, 0.10)";
  };

  const handleInputBlur = (e) => {
    e.currentTarget.style.border =
      "1px solid #cbd5e1";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <div style={styles.page}>
      <div style={styles.leftSection}>
        <div style={styles.logoBox}>
          <div style={styles.logoIcon}>✓</div>

          <h1 style={styles.brand}>
            TaskFlow
          </h1>
        </div>

        <h2 style={styles.heading}>
          Organize Your Work.
          <br />
          Achieve Your Goals.
        </h2>

        <p style={styles.text}>
          Manage your tasks, track your progress, and stay productive
          with a simple and powerful task management system.
        </p>

        <div style={styles.features}>
          <div style={styles.featureItem}>
            <span style={styles.tick}>✓</span>
            Create and manage tasks easily
          </div>

          <div style={styles.featureItem}>
            <span style={styles.tick}>✓</span>
            Track your daily progress
          </div>

          <div style={styles.featureItem}>
            <span style={styles.tick}>✓</span>
            Stay organized and productive
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.title}>
          Welcome to{" "}
          <span style={styles.blueText}>
            TaskFlow
          </span>
        </h2>

        <p style={styles.subtitle}>
          Login to manage your tasks and stay productive
        </p>

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>
            Email Address
          </label>

          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            autoComplete="email"
            required
          />

          <label style={styles.label}>
            Password
          </label>

          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            autoComplete="current-password"
            required
          />

          {errorMessage && (
            <div style={styles.errorMessage}>
              {errorMessage}
            </div>
          )}

          <div
            style={styles.forgot}
            onClick={() =>
              navigate("/forgot-password")
            }
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translateY(0)";
            }}
          >
            Forgot Password?
          </div>

          <button
            style={styles.button}
            type="submit"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(37, 99, 235, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translateY(0)";
              e.currentTarget.style.boxShadow =
                "none";
            }}
          >
            Login
          </button>
        </form>

        <p style={styles.signup}>
          Don't have an account?{" "}

          <span
            style={styles.link}
            onClick={() =>
              navigate("/signup")
            }
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translateY(0)";
            }}
          >
            Create an Account
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "90px",
    background:
      "linear-gradient(135deg, #eff6ff, #dbeafe)",
    fontFamily: "Arial, sans-serif",
    padding: "40px 70px",
    boxSizing: "border-box",
  },

  leftSection: {
    width: "50%",
    animation: "loginLeft 0.6s ease",
  },

  logoBox: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "35px",
  },

  logoIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "14px",
    background: "#2563eb",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "30px",
    fontWeight: "bold",
    transition:
      "transform 0.25s ease, box-shadow 0.25s ease",
  },

  brand: {
    fontSize: "40px",
    fontWeight: "800",
    color: "#2563eb",
    margin: "0",
  },

  heading: {
    fontSize: "44px",
    lineHeight: "1.2",
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: "20px",
  },

  text: {
    width: "470px",
    fontSize: "18px",
    lineHeight: "1.6",
    color: "#64748b",
  },

  features: {
    marginTop: "30px",
    fontSize: "17px",
    lineHeight: "2.3",
    color: "#334155",
  },

  featureItem: {
    transition:
      "transform 0.2s ease",
  },

  tick: {
    display: "inline-flex",
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    background: "#2563eb",
    color: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "12px",
    fontSize: "14px",
    fontWeight: "bold",
  },

  card: {
    width: "450px",
    padding: "50px",
    background: "#ffffff",
    borderRadius: "22px",
    boxShadow:
      "0 15px 40px rgba(0, 0, 0, 0.12)",
    boxSizing: "border-box",
    animation: "loginCard 0.6s ease",
    transition:
      "transform 0.3s ease, box-shadow 0.3s ease",
  },

  title: {
    textAlign: "center",
    fontSize: "32px",
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: "15px",
    whiteSpace: "nowrap",
  },

  blueText: {
    color: "#2563eb",
    fontWeight: "800",
  },

  subtitle: {
    textAlign: "center",
    color: "#1e293b",
    fontWeight: "700",
    marginBottom: "30px",
    lineHeight: "1.5",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "700",
    color: "#1e293b",
  },

  input: {
    width: "100%",
    padding: "13px",
    marginBottom: "20px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    boxSizing: "border-box",
    outline: "none",
    backgroundColor: "#ffffff",
    color: "#1e293b",
    transition:
      "border 0.2s ease, box-shadow 0.2s ease",
  },

  errorMessage: {
    width: "100%",
    padding: "11px 12px",
    marginBottom: "15px",
    boxSizing: "border-box",
    borderRadius: "8px",
    background: "#fee2e2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    fontSize: "14px",
    fontWeight: "600",
    textAlign: "center",
    animation: "errorAppear 0.25s ease",
  },

  forgot: {
    textAlign: "right",
    color: "#2563eb",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "20px",
    cursor: "pointer",
    transition:
      "transform 0.2s ease",
  },

  button: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#2563eb",
    color: "white",
    fontSize: "17px",
    fontWeight: "700",
    cursor: "pointer",
    transition:
      "transform 0.2s ease, box-shadow 0.2s ease",
  },

  signup: {
    textAlign: "center",
    marginTop: "25px",
    color: "#64748b",
  },

  link: {
    color: "#2563eb",
    fontWeight: "700",
    cursor: "pointer",
    display: "inline-block",
    transition:
      "transform 0.2s ease",
  },
};

const animationStyles = `
@keyframes loginLeft {
  from {
    opacity: 0;
    transform: translateX(-12px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes loginCard {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes errorAppear {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

if (
  typeof document !== "undefined" &&
  !document.getElementById("taskflow-login-animations")
) {
  const styleElement =
    document.createElement("style");

  styleElement.id =
    "taskflow-login-animations";

  styleElement.innerHTML = animationStyles;

  document.head.appendChild(styleElement);
}

export default Login;