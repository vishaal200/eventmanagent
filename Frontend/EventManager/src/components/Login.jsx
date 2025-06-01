import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import '../CSS/loginPage.css';

const Login = ({setEmail}) => {
  const [uname, setUname] = useState("");
  const [psd, setPsd] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("http://localhost:8080/api/auth/login", {
      email: uname,
      password: psd
    });

    const data = response.data;

   
    localStorage.setItem("email", data.email);
    setEmail(data.email);
    const user = await axios.get(`http://localhost:8080/api/auth/email/${data.email}`)
    console.log(user.data.role);
    const role = user.data.role;
    alert("Login successful!");
    if(role === "organiser"){
      navigate("/org-dash");
    }else{
      navigate("/part-dash")
    }
    
  } catch (error) {
    console.error("Login Failed:", error);
    if (error.response && error.response.data) {
      setError(error.response.data); // display error from backend
    } else {
      setError("Login failed");
    }
  }
};


  return (
    <>
      <h3 className="app-title">Event Management Application</h3>
      <div className='container'>
        <form onSubmit={handleSubmit}>
          <p id="loginHeader">Login</p>
          <hr />
          <input type="email" placeholder='Enter mail id' onChange={(e) => setUname(e.target.value)} required /><br />
          <input type="password" placeholder="Enter your password" onChange={(e) => setPsd(e.target.value)} required /><br />

          <input type="submit" id="submit" value="Login" /><br />
        </form>

        {error && <span>{error}</span>}

       
        <p>Don't have an account? 
          <a style={{background: "none", cursor: "pointer", textDecoration: "underline", paddingLeft: "5px" }} onClick={() => navigate("/signup")}>
            Sign up here
          </a>
        </p>
       
      </div>
    </>
  );
};

export default Login;

