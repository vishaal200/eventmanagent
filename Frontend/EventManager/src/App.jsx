import { useState, useEffect } from 'react';
import './App.css';

import Login from "./components/Login.jsx";
import ForgotPassword from './components/ForgotPassword.jsx';
import Signup from './components/Signup.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventForm from "./components/EventCreationForm.jsx";
import MyEvents from './components/MyEvents';
import EditEvent from './components/EditEvent';
import ParticipantsList from './components/ParticipantsList';
import OrganizerDashboard from './components/OrganizerDashboard.jsx';
import AvailableEvents from './components/Participants/AvailableEvents.jsx';
import RegisteredEvents from './components/Participants/RegisteredEvents.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx'; // ✅ import this

function App() {
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  
  useEffect(() => {
    const handleStorageChange = () => {
      setEmail(localStorage.getItem("email") || "");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login setEmail={setEmail} />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}

        {/* Protected Routes */}
        <Route
          path="/org-dash"
          element={
            <ProtectedRoute email={email}>
              <OrganizerDashboard email={email} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/part-dash"
          element={
            <ProtectedRoute email={email}>
              <AvailableEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registered-events/:name"
          element={
            <ProtectedRoute email={email}>
              <RegisteredEvents email={email} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
