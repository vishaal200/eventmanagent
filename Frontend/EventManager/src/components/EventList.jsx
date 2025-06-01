import React from "react";
import "../CSS/EventList.css";

const EventList = ({ events, onEdit, onViewParticipants, onDelete }) => {
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
      <h3>Your Events</h3>
      <div className="event-list">
        {events.length === 0 ? (
          <p>No events created yet.</p>
        ) : (
          events.map((event) => (
            <div className="event-card" key={event.eventId || event.id}>
              <h4>{event.title}</h4>
              <p className="event-description">
                <em>{event.description}</em>
              </p>
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
              <div className="event-actions">
                <button onClick={() => onEdit(event)}>Edit</button>
                <button onClick={() => onViewParticipants(event)}>View Participants</button>
                <p  id = "dustBin" onClick={() => onDelete(event)}>🗑️</p>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default EventList;
