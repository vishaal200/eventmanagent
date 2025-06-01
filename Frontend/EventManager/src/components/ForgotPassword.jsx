import React, { useState } from 'react';
import axios from 'axios';
import '../CSS/loginPage.css';
import {useNavigate,Link} from 'react-router-dom'

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
 
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.put('http://localhost:8080/api/auth/forgot', {
        email : email,
        password : newPassword,
      });
      
      setError('');
      alert("Password changed succesfully");
      navigate('/');

    } catch (err) {
      setError(err.response?.data || "Unable to process request.");
      
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleForgotPassword}>
         <p id="loginHeader">Forgot Password</p>
         <hr/>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <input type="submit" value="Change Password" />
      </form>

       {/* <p>Don't have an account? 
          <a style={{background: "none", cursor: "pointer", textDecoration: "underline", paddingLeft: "5px" }} onClick={() => navigate("/signup")}>
            sign-up
          </a>
        </p> */}
        
         <a
          style={{background: "none", cursor: "pointer", textDecoration: "underline"}}
          onClick={() => navigate("/")} 
        >
          Back
        </a>

      {error && <span style={{ color: 'red', display: 'block', marginTop: '10px' }}>{error}</span>}
    </div>
  );
}

export default ForgotPassword;