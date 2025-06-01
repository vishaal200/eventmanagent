import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../CSS/availableEvents.css';
import '../../CSS/calenderStyle.css'; // Optional: your own CSS for calendar

const RegisteredEvents = ({ email }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name } = useParams();
  const userId = location.state?.userId;
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/registrations/user/${userId}`);
        setRegisteredEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch registered events", err);
      }
    };

    if (userId) {
      fetchRegisteredEvents();
    }
  }, [userId]);

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

  const getEventDates = () => {
    return registeredEvents.map((event) => new Date(event.date).toDateString());
  };

  const handleDateClick = (date) => {
    const clickedDate = date.toDateString();
    const eventsOnDate = registeredEvents.filter(
      (event) => new Date(event.date).toDateString() === clickedDate
    );
    setSelectedDateEvents(eventsOnDate);
    setPopupVisible(true);
  };

  return (
    <>
      <div className="top-bar">
        <div className="greeting">Hello!, <strong>{name}</strong></div>
        <div className="profile-menu">
          <img
            src={`https://ui-avatars.com/api/?name=${name}`}
            alt="Profile"
            className="avatar"
          />
          <div className="profile-dropdown">
            <p className="username">{email}</p>
            <button className="logout-button" onClick={() => {
              localStorage.clear();
              navigate('/');
            }}>Logout</button>
          </div>
        </div>
      </div>

      <div className="available-events-container">
        <div className="filters">
          <button
            className="register-button"
            onClick={() => navigate('/part-dash')}
          >
            View Upcoming Events
          </button>
        </div>

        <h2>Registered Events</h2>

        <div className="highlight-section">
          <h3 className="section-heading">YOUR EVENTS</h3>
          <div className="calendar-container">
            <Calendar
              onClickDay={handleDateClick}
              tileClassName={({ date }) =>
                getEventDates().includes(date.toDateString()) ? "highlighted-date" : null
              }
            />
          </div>

          <div className="events-grid">
            {registeredEvents.length === 0 ? (
              <p>No events registered.</p>
            ) : (
              registeredEvents.map(event => (
                <div className="event-card" key={event.eventId}>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <p><strong>Date:</strong> {formatDate(event.date)}</p>
                  <p><strong>Time:</strong> {formatTime(event.startTime)} - {formatTime(event.endTime)}</p>
                  <p><strong>Location:</strong> {event.location}</p>
                  <p><strong>Capacity:</strong> {event.capacity}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {popupVisible && (
          <div className="popup-overlay" onClick={() => setPopupVisible(false)}>
            <div className="popup" onClick={(e) => e.stopPropagation()}>
              <h4>Events on Selected Date</h4>
              {selectedDateEvents.map((event) => (
                <div key={event.eventId}>
                  <strong>{event.title}</strong>
                  <p>Time: {formatTime(event.startTime)} - {formatTime(event.endTime)}</p>
                </div>
              ))}
              <button onClick={() => setPopupVisible(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RegisteredEvents;
