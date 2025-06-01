import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../CSS/availableEvents.css";
import { Bell } from "lucide-react";

const AvailableEvents = () => {
  const [events, setEvents] = useState([])
  const [registeredEventIds, setRegisteredEventIds] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [userId, setUserId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [username,setUsername] = useState("");  
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const email = localStorage.getItem("email");
      if (!email) {
        console.error("User email not found in localStorage");
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:8080/api/auth/email/${email}`
        );
        const id = res.data.id;
        setUsername(res.data.username)
        setUserId(id);

        const eventsRes = await axios.get(
          "http://localhost:8080/api/events/all"
        );
        setEvents(eventsRes.data);

        const regRes = await axios.get(
          `http://localhost:8080/api/registrations/user/${id}`
        );
        const eventIds = regRes.data.map((reg) => reg.eventId);
        setRegisteredEventIds(eventIds);

        const notifRes = await axios.get(
          `http://localhost:8080/api/notifications/user/${id}`
        );
        setNotifications(notifRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };

    fetchUserData();
  }, []);

  const now = new Date();
  const upcomingEvents = events.filter(
    (event) => new Date(event.startTime) > now
  );

  const filteredEvents = upcomingEvents.filter(
    (event) =>
      !registeredEventIds.includes(event.eventId) &&
      event.title.toLowerCase().includes(search.toLowerCase()) &&
      event.location.toLowerCase().includes(location.toLowerCase())
  );

  const handleRegister = async (eventId) => {
    try {
      if (!userId) {
        alert("User ID not loaded yet.");
        return;
      }

      await axios.post("http://localhost:8080/api/registrations/register", {
        userId,
        eventId,
      });

      setEvents((prev) => prev.filter((event) => event.eventId !== eventId));
      setRegisteredEventIds((prev) => [...prev, eventId]);
      alert("Registration successful!");
    } catch (err) {
      console.error("Registration failed", err);
      alert("Failed to register for the event.");
    }
  };

  const handleViewRegisteredEvents = () => {
    if (!userId) return alert("User ID not loaded.");
    navigate(`/registered-events/${username}`, { state: { userId } });
  };

  // Updated: Delete notification API call
  const handleDeleteNotification = async (notifId) => {
    try {
      await axios.delete(`http://localhost:8080/api/notifications/${notifId}`, {
        params: { userId },
      });
      setNotifications((prev) => prev.filter((notif) => notif.id !== notifId));
    } catch (err) {
      console.error("Failed to delete notification", err);
      alert("Failed to delete notification");
    }
  };

  const formatDate = (isoDateStr) => {
    if (!isoDateStr) return "";
    const dateObj = new Date(isoDateStr);
    if (isNaN(dateObj.getTime())) return "";
    return dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (isoDateTimeStr) => {
    if (!isoDateTimeStr) return "";
    const dateObj = new Date(isoDateTimeStr);
    if (isNaN(dateObj.getTime())) return "";
    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  return (
    <>
      <div className="top-bar">
        <div className="greeting">
          Hello!, <strong>{username}</strong>
        </div>

        <div className="profile-area">
          <div
            className="notification-icon"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={24} />
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </div>

          {showNotifications && (
            <div className="notification-dropdown">
              <h4>Notifications</h4>
              {notifications.length === 0 ? (
                <p>No notifications</p>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`notification-item ${notif.read ? "read" : ""}`}
                  >
                    <strong>{notif.title}</strong>
                    <p>{notif.message}</p>
                    <button onClick={() => handleDeleteNotification(notif.id)}>
                      Dismiss
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="profile-menu">
            <img
              src={`https://ui-avatars.com/api/?name=${username}`}
              alt="Profile"
              className="avatar"
            />
            <div className="profile-dropdown">
              <p className="username">{localStorage.getItem("email")}</p>
             
              
              <button className="logout-button" onClick={() => {
                localStorage.clear();
                navigate('/');
              }}>Logout</button>
            </div>
          </div>
        </div>
      </div>

      <div className="available-events-container">
        {/* <h2>Available Events</h2> */}

        <button
          className="register-button"
          onClick={handleViewRegisteredEvents}
        >
          View Registered Events
        </button>

        <div className="filters">
          <input
            type="text"
            placeholder="Search by title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="highlight-section">
          <h3 className="section-heading">Upcoming Events</h3>
          <div className="events-grid">
            {filteredEvents.length === 0 ? (
              <p>No events found.</p>
            ) : (
              filteredEvents.map((event) => (
                <div className="event-card" key={event.eventId}>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <p>
                    <strong>Date:</strong> {formatDate(event.date)}
                  </p>
                  <p>
                    <strong>Time:</strong> {formatTime(event.startTime)} -{" "}
                    {formatTime(event.endTime)}
                  </p>
                  <p>
                    <strong>Location:</strong> {event.location}
                  </p>
                  <p>
                    <strong>Capacity:</strong> {event.capacity}
                  </p>
                  <button
                    className="register-button"
                    onClick={() => handleRegister(event.eventId)}
                  >
                    Register
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AvailableEvents;
