import React, { useState } from 'react';
import '../CSS/EventForm.css';
import axios from 'axios';

const EventCreationForm = ({ email, setShowEventForm }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    startTime: '',
    endTime: '',
    capacity: '',
    email: email,
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { date, startTime, endTime } = formData;

    const startDateTime = `${date}T${startTime}:00`;
    const endDateTime = `${date}T${endTime}:00`;

    if (new Date(endDateTime) <= new Date(startDateTime)) {
      setError('End time must be after start time.');
      return;
    }

    const eventData = {
      ...formData,
      startTime: startDateTime,
      endTime: endDateTime,
    };

    try {
      await axios.post('http://localhost:8080/api/events/organiser', eventData);
      alert('Event created successfully!');
      setFormData({
        title: '',
        description: '',
        location: '',
        date: '',
        startTime: '',
        endTime: '',
        capacity: '',
        email: email,
      });
      setShowEventForm(false);
    } catch (err) {
      console.error('Failed to create event:', err);
      setError('Error creating event. Try again.');
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <p id="loginHeader">Create Event</p>
        <hr />

        <input
          type="text"
          name="title"
          placeholder="Title of the Event"
          value={formData.title}
          onChange={handleChange}
          required
        /><br />

        <textarea
          name="description"
          placeholder="Description of the Event"
          value={formData.description}
          onChange={handleChange}
          required
        /><br />

        <input
          type="text"
          name="location"
          placeholder="Location of the Event"
          value={formData.location}
          onChange={handleChange}
          required
        /><br />

        <input
          type="date"
          name="date"
          min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // tomorrow's date
          value={formData.date}
          onChange={handleChange}
          required
        /><br />

        <input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          required
        /><br />

        <input
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          required
        /><br />

        <input
          type="number"
          name="capacity"
          placeholder="Capacity (Min 1)"
          min="1"
          value={formData.capacity}
          onChange={handleChange}
          required
        /><br />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <input type="submit" value="Create Event" id="submit" /><br />
      </form>
    </div>
  );
};

export default EventCreationForm;