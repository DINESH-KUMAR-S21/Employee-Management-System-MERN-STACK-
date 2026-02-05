import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/authContext.jsx";
import API_BASE_URL from "../config/api";


const Login = () => {
  const navigate = useNavigate();
  const [email , setEmail] = useState('');
  const [error, setError] = useState(null)
  const [password , setPassword] = useState('');
  const {login} = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {email, password})
      console.log("Login response:", response.data)
      
      // Check if response has token and user (success indicators)
      if(response.data && response.data.token && response.data.user){
        // Normalize the user shape so both login and verify provide _id consistently
        const normalizedUser = { ...response.data.user, _id: response.data.user._id || response.data.user.id }
        login(normalizedUser)
        localStorage.setItem("token", response.data.token)
        console.log("User role:", normalizedUser.role)
        if(normalizedUser.role === 'admin'){
          console.log("Navigating to admin dashboard")
          navigate('/admin-dashboard')
        }else{
          console.log("Navigating to employee dashboard")
          navigate("/employee-dashboard")
        }
      } else {
        setError("Login failed: Invalid response from server")
      }
    } catch(error){
      console.log("Login error:", error)
      if(error.response && error.response.data){
        setError(error.response.data.message || "Login failed")
      } else {
        setError("Server Error or Connection Issue")
      }
    }
  }

  const styles = {
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      minHeight: '100vh',
      margin: 0,
      padding: 0,
      backgroundColor: '#e6e9ea',  // light gray background below
    },
    headerSection: {
      backgroundColor: '#199473', // #199473 is the green in the screenshot
      height: '250px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontSize: '1.8rem',
      fontWeight: '500',
    },
    formContainer: {
      backgroundColor: 'white',
      width: '400px',
      padding: '40px 40px 50px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      margin: 'auto',
      marginTop: '-60px',  // overlap with header
      position: 'relative',
      zIndex: 1,
    },
    formTitle: {
      fontWeight: '700',
      fontSize: '1.5rem',
      marginBottom: '25px',
      textAlign: 'center',
      color: '#222',
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontWeight: '600',
      color: '#444',
      fontSize: '0.9rem',
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      marginBottom: '20px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      fontSize: '1rem',
      boxSizing: 'border-box',
      outline: 'none',
    },
    rememberForgot: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      fontSize: '0.9rem',
      color: '#199473',
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      cursor: 'pointer',
      fontWeight: '500',
    },
    checkbox: {
      width: '16px',
      height: '16px',
      cursor: 'pointer',
    },
    forgotPassword: {
      cursor: 'pointer',
      textDecoration: 'none',
      color: '#199473',
      fontWeight: '500',
    },
    button: {
      width: '100%',
      backgroundColor: '#199473',
      border: 'none',
      color: 'white',
      fontWeight: '600',
      fontSize: '1rem',
      padding: '12px 0',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      letterSpacing: '0.5px',
    },
    buttonHover: {
      backgroundColor: '#157158',
    },
    errorMessage: {
      color: '#e74c3c',
      fontSize: '0.9rem',
      marginBottom: '20px',
      textAlign: 'center',
      fontWeight: '500',
    },
  };

  const [hover, setHover] = React.useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.headerSection}>
        Employee Management System
      </div>
      <div style={styles.formContainer}>
        <form onSubmit = {handleSubmit}>
          <div style={styles.formTitle}>Login</div>
          {error && <div style={styles.errorMessage}>{error}</div>}

          <label htmlFor="email" style={styles.label}>Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}  
            style={styles.input}
          />

          <label htmlFor="password" style={styles.label}>Password</label>
          <input
            id="password"
            type="password"
            placeholder="*****"
              onChange={(e) => setPassword(e.target.value)} 
            style={styles.input}
          />

          <div style={styles.rememberForgot}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                style={styles.checkbox}
              />
              Remember me
            </label>
            <span style={styles.forgotPassword}>Forgot password?</span>
          </div>

          <button
            type="submit"
            style={hover ? { ...styles.button, ...styles.buttonHover } : styles.button}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
