import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setFormError("");

    if (name === "password") {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

      if (value && !passwordRegex.test(value)) {
        setPasswordError(
          "Password must contain 8+ characters with uppercase, lowercase, number and special character."
        );
      } else {
        setPasswordError("");
      }
    }

    if (name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");

    const cleanedName = formData.name.trim();
    const cleanedEmail = formData.email.trim();

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(formData.password)) {
      setPasswordError(
        "Password must contain 8+ characters with uppercase, lowercase, number and special character."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
       `${import.meta.env.VITE_API_URL || "https://taskflow-juo1.onrender.com"}/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: cleanedName,
            email: cleanedEmail,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setFormError(
          data.detail || "Signup failed. Please try again."
        );
        return;
      }

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setPasswordError("");
      setFormError("");

      navigate("/login");
    } catch (error) {
      console.error("Signup Error:", error);

      setFormError(
        "Backend connection failed. Please make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoBox}>
          <div style={styles.logoIcon}>✓</div>

          <h1 style={styles.brand}>TaskFlow</h1>
        </div>

        <h2 style={styles.title}>
          Create an Account
        </h2>

        <p style={styles.subtitle}>
          Sign up to start managing your tasks
        </p>

        {formError && (
          <p style={styles.formError}>
            {formError}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>
            Full Name
          </label>

          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            required
          />

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
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />

          {passwordError && (
            <p style={styles.error}>
              {passwordError}
            </p>
          )}

          <label style={styles.label}>
            Confirm Password
          </label>

          <input
            style={styles.input}
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />

          <button
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        <p style={styles.loginText}>
          Already have an account?{" "}
          <span
            style={styles.link}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg, #eff6ff, #dbeafe)",
    fontFamily: "Arial, sans-serif",
    padding: "40px",
    boxSizing: "border-box",
  },

  card: {
    width: "450px",
    padding: "45px 50px",
    background: "#ffffff",
    borderRadius: "22px",
    boxShadow:
      "0 15px 40px rgba(0,0,0,0.12)",
    boxSizing: "border-box",
    animation: "signupCardIn 0.6s ease-out",
    transition:
      "transform 0.25s ease, box-shadow 0.25s ease",
  },

  logoBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    marginBottom: "25px",
    animation: "logoIn 0.7s ease-out",
  },

  logoIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "13px",
    background: "#2563eb",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "27px",
    fontWeight: "bold",
    transition:
      "transform 0.25s ease, box-shadow 0.25s ease",
  },

  brand: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#2563eb",
    margin: "0",
  },

  title: {
    textAlign: "center",
    fontSize: "30px",
    fontWeight: "800",
    color: "#1e293b",
    margin: "0 0 10px",
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
    marginBottom: "18px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    boxSizing: "border-box",
    outline: "none",
    transition:
      "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
  },

  error: {
    color: "#dc2626",
    fontSize: "13px",
    marginTop: "-10px",
    marginBottom: "15px",
    lineHeight: "1.4",
    animation: "errorIn 0.25s ease-out",
  },

  formError: {
    background: "#fee2e2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "10px 12px",
    fontSize: "13px",
    lineHeight: "1.4",
    marginBottom: "20px",
    textAlign: "center",
    animation: "errorIn 0.25s ease-out",
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
    marginTop: "5px",
    transition:
      "transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease",
  },

  loginText: {
    textAlign: "center",
    marginTop: "25px",
    color: "#64748b",
  },

  link: {
    color: "#2563eb",
    fontWeight: "700",
    cursor: "pointer",
    transition: "color 0.2s ease",
  },
};

const animationStyle = document.createElement("style");

animationStyle.innerHTML = `
  @keyframes signupCardIn {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes logoIn {
    from {
      opacity: 0;
      transform: scale(0.92);
    }

    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes errorIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  input:focus {
    border-color: #2563eb !important;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.10);
    transform: translateY(-1px);
  }

  button:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.20);
  }

  button:not(:disabled):active {
    transform: translateY(0);
  }

  span[style*="cursor: pointer"]:hover {
    color: #1d4ed8 !important;
  }
`;

if (!document.head.contains(animationStyle)) {
  document.head.appendChild(animationStyle);
}

export default Signup;