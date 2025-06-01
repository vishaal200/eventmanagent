
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../CSS/EditEvent.css';

const EditEvent = ({ eventId , setShowEditModal}) => {
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    startTime: '',
    endTime: '',
    capacity: ''
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/events/${eventId}`);
        const data = res.data;
        console.log(res.data);

        // Extract date and time parts from ISO string
        const start = new Date(data.startTime);
        const end = new Date(data.endTime);

        setEventData({
          title: data.title,
          description: data.description,
          location: data.location,
          date: start.toISOString().split('T')[0],
          startTime: start.toTimeString().slice(0, 5),
          endTime: end.toTimeString().slice(0, 5),
          capacity: data.capacity
        });
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to load event.");
      }
    };
    if (eventId) fetchEvent();
  }, [eventId]);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const combineDateTime = (date, time) => {
    return `${date}T${time}:00`;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedEvent = {
        title: eventData.title,
        description: eventData.description,
        location: eventData.location,
        capacity: eventData.capacity,
        date:eventData.date,
        startTime: combineDateTime(eventData.date, eventData.startTime),
        endTime: combineDateTime(eventData.date, eventData.endTime),
      };

      await axios.put(`http://localhost:8080/api/events/${eventId}`, updatedEvent);
      alert("Event updated successfully!");
      setShowEditModal(false);
    } catch (err) {
      console.error("Error updating event:", err);
      setError("Failed to update event.");
    }
  };

  return (
    <div className="edit-event-container">
      <h2>Edit Event</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleUpdate}>
        <label>Title</label>
        <input type="text" name="title" value={eventData.title} onChange={handleChange} disabled />

        <label>Description</label>
        <textarea name="description" value={eventData.description} onChange={handleChange} disabled />

        <label>Location</label>
        <input type="text" name="location" value={eventData.location} onChange={handleChange} required />

       <input
        type="date"
        name="date"
        value={eventData.date}
        onChange={handleChange}
        required
        min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // sets min to tomorrow
      />

        <label>Start Time</label>
        <input type="time" name="startTime" value={eventData.startTime} onChange={handleChange} required />

        <label>End Time</label>
        <input type="time" name="endTime" value={eventData.endTime} onChange={handleChange} required />

        <label>Capacity</label>
        <input type="number" name="capacity" value={eventData.capacity} onChange={handleChange}  />
        <input
          type="number"
          name="capacity"
          value={eventData.capacity}
          onChange={handleChange}
          min="1" 
          required
        />

        <button type="submit">Update Event</button>
      </form>
    </div>
  );
};

export default EditEvent;
