import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CSS/MyEvents.css';
import { useNavigate } from 'react-router-dom';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/events/organizerId");
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events.");
      }
    };
    fetchEvents();
  }, []);

  const handleEdit = (eventId) => {
    navigate(`/edit-event/${eventId}`);
  };

  const handleViewParticipants = (eventId) => {
    navigate(`/participants/${eventId}`);
  };

  return (
    <div className="my-events-container">
      <h2>My Events</h2>
      {error && <p className="error">{error}</p>}
      {events.length === 0 ? (
        <p>No events posted yet.</p>
      ) : (
        <div className="events-list">
          {events.map((event) => (
            <div className="event-card" key={event.id}>
              <h3>{event.title}</h3>
              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Time:</strong> {event.startTime} - {event.endTime}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Capacity:</strong> {event.capacity}</p>
              <div className="btn-group">
                <button onClick={() => handleEdit(event.id)}>Edit</button>
                <button onClick={() => handleViewParticipants(event.id)}>Participants</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEvents;