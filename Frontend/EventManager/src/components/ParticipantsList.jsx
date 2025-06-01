import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../CSS/ParticipantsList.css';
import * as XLSX from 'xlsx';

const ParticipantsList = ({eventId}) => {
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState("");
  console.log(eventId);
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/registrations/event/${eventId}`);
        setParticipants(res.data);
      } catch (err) {
        console.error("Error fetching participants:", err);
        setError("Failed to load participants.");
      }
    };
    fetchParticipants();

  //   const dummy = [
  //   { name: "Alice Johnson", email: "alice@example.com", registeredAt: "2025-06-01T09:15:00Z" },
  //   { name: "Bob Smith", email: "bob@example.com", registeredAt: "2025-06-01T10:30:00Z" },
  //   { name: "Charlie Davis", email: "charlie@example.com", registeredAt: "2025-06-01T11:45:00Z" },
  //   { name: "Diana Prince", email: "diana@example.com", registeredAt: "2025-06-01T13:00:00Z" },
  //   { name: "Ethan Hunt", email: "ethan@example.com", registeredAt: "2025-06-01T14:15:00Z" },
  //   { name: "Fiona Glenanne", email: "fiona@example.com", registeredAt: "2025-06-01T15:30:00Z" },
  //   { name: "George Lopez", email: "george@example.com", registeredAt: "2025-06-01T16:45:00Z" },
  //   { name: "Hannah Wells", email: "hannah@example.com", registeredAt: "2025-06-01T18:00:00Z" }
  // ];
  //   setParticipants(dummy);

  }, [eventId]);

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(participants);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Participants');
    XLSX.writeFile(workbook, 'participants.xlsx');
};

  return (
    <div className="participants-container">
      <h2>Participants </h2>
      
      <button className="excel-button" onClick={handleExportToExcel}>Export to Excel</button>
      {error && <p className="error">{error}</p>}
      {participants.length === 0 ? (
        <p>No participants registered yet.</p>
      ) : (
         <div className="table-wrapper">

       
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  {/* <th>Registered On</th> */}
                </tr>
              </thead>
              <tbody>
                {participants.map((p, index) => (
                  <tr key={index}>
                    <td>{p.username}</td>
                    <td>{p.email}</td>
                    {/* <td>{new Date(p.registeredAt).toLocaleString()}</td> */}
                  </tr>
                ))}
              </tbody>
            </table>

        </div>
      )}
    </div>
  );
};

export default ParticipantsList;