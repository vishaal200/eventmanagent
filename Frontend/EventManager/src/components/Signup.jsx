
import React, { useState } from 'react';
import axios from 'axios';
import '../CSS/loginPage.css';
import {useNavigate,Link} from 'react-router-dom'

const Signup = () => {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("http://localhost:8080/api/auth/signup", {
        username : name,
        email : email,
        password : password,
        role : role
      });
      alert("Signup successful!");
      navigate('/');
      
    } catch (err) {
      console.error("Signup Failed:", err);
      setError(err.response?.data || "Signup failed.");
    }
  };

  return (
    <>
      <h3 className="app-title">Event Management Application</h3>
      <div className='container'>
        <form onSubmit={handleSubmit}>
          <p id="loginHeader">Sign Up</p>
          <hr />
          <input type="text" name="name" placeholder='Enter your name' onChange={(e) => setName(e.target.value)} required /><br />
          <input type="email" name="email" placeholder='Enter mail id' onChange={(e) => setEmail(e.target.value)} required /><br />
          <input type="password" name="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} required /><br />

          <label><input type="radio" name="role" value="participant" onChange={(e) => setRole(e.target.value)} checked={role === "participant"} />Participant</label>

          <label><input type="radio" name="role" value="organiser" onChange={(e) => setRole(e.target.value)} checked={role === "organiser"} />Organiser</label><br />

          <input type="submit" id="submit" value="Sign Up" /><br />
        </form>
        
         <a
          style={{background: "none", cursor: "pointer", textDecoration: "underline" }}
          onClick={() => navigate("/")}
        >
          Existing User?
        </a>

        {error && <span>{error}</span>}
      </div>
    </>
  );
};

export default Signup;