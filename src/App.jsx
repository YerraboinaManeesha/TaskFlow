import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import MyTasks from "./pages/MyTasks";
import Projects from "./pages/Projects";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";

import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/my-tasks" element={<MyTasks />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;