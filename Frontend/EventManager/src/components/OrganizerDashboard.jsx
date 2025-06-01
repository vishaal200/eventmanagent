import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventForm from '../components/EventCreationForm';
import EventList from '../components/EventList';
import EditEvent from '../components/EditEvent';
import ParticipantsList from '../components/ParticipantsList';
import '../CSS/organizerDashboard.css';
import axios from 'axios';

const OrganizerDashboard = ({ email }) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [username,setUsername] = useState("");  
  // Fetch events from backend API
  useEffect(() => {
    

    const fetchUserData = async () => {
      if (email) {
      await axios
        .get(`http://localhost:8080/api/events/myevents?email=${email}`)
        .then((res) => {
          const sortedEvents = res.data.sort(
            (a, b) => new Date(a.startTime) - new Date(b.startTime)
          );
          setEvents(sortedEvents);
        })
        .catch((err) => console.error('Failed to fetch events:', err));
    } else {
      console.warn('No email found. Redirect to login?');
    }

    try {
        const res = await axios.get(
          `http://localhost:8080/api/auth/email/${email}`
        );
        setUsername(res.data.username)
    }catch (err) {
        console.error("Failed to fetch data", err);
      }
    }
    fetchUserData();
  }, [showEventForm, email, showEditModal]);

  const handleDeleteEvent = async (event) => {
    const confirm = window.confirm(
      `Are you sure you want to delete "${event.title}"?`
    );
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:8080/api/events/${event.eventId}`);
      setEvents(events.filter((e) => e.eventId !== event.eventId));
      alert('Event deleted successfully.');
    } catch (err) {
      console.error('Error deleting event:', err);
      alert('Failed to delete event.');
    }
  };

  const addEvent = (newEvent) => {
    setEvents((prev) => {
      const updated = [...prev, newEvent];
      return updated.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    });
    setShowEventForm(false);
  };

  const updateEvent = (updatedEvent) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.eventId === updatedEvent.eventId ? updatedEvent : event
      )
    );
    setShowEditModal(false);
  };

  return (
    <div className="dashboard-container">
      
      <div className="top-bar">
        <div className="greeting">Welcome, {username}!</div>
        <div className="profile-menu">
          <img
            src={`https://ui-avatars.com/api/?name=${username}`}
            alt="Profile"
            className="avatar"
          />
          <div className="profile-dropdown">
            <p className="username">{email}</p>
            <button
              className="logout-button"
              onClick={() => {
                localStorage.clear();
                navigate('/');
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <h2>Organizer Dashboard</h2>

      <button className="add-event-button" onClick={() => setShowEventForm(true)}>
        + Add New Event
      </button>

      <EventList
        events={events}
        onEdit={(event) => {
          setSelectedEvent(event);
          setShowEditModal(true);
        }}
        onViewParticipants={(event) => {
          setSelectedEvent(event);
          setShowParticipants(true);
        }}
        onDelete={handleDeleteEvent}
      />

      {showEventForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowEventForm(false)}>
              ✕
            </button>
            <EventForm email={email} setShowEventForm={setShowEventForm} />
          </div>
        </div>
      )}

      {showEditModal && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowEditModal(false)}>
              ✕
            </button>
            <EditEvent
              eventId={selectedEvent.eventId}
              setShowEditModal={setShowEditModal}
              onClose={() => setShowEditModal(false)}
              onSave={updateEvent}
            />
          </div>
        </div>
      )}

      {showParticipants && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setShowParticipants(false)}
            >
              ✕
            </button>
            <ParticipantsList
              eventId={selectedEvent.eventId}
              onClose={() => setShowParticipants(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;