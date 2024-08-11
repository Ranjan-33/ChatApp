import React, { useState } from "react";
import "./Login.css";
import assets from "../../assets/assets";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  return (
    <div className=" login">
      <img src={assets.logo_big} alt="" className="logo" />
      <form className="login-form">
        <h2>{currentState}</h2>
        {currentState === "Sign Up" ? (
          <input
            type="text"
            placeholder="username"
            className="form-input"
            required
          ></input>
        ) : null}
        <input
          type="email"
          placeholder="Email-id"
          className="form-input"
          required
        ></input>
        <input
          type="password"
          placeholder="password"
          className="form-input"
          required
        ></input>
        <button type="submit" className="form-btn">
          {currentState === "Sign Up" ? "Create Account" : "Login now "}
        </button>
        <div className="login-term">
          <input type="checkbox" />
          <p>Agree to the terms n codition </p>
        </div>
        <div className="login-forgot">
          {currentState === "Sign Up" ? (
            <p className="login-toggle">
              All ready have an account?{" "}
              <span onClick={() => setCurrentState("Login")}>Login here</span>
            </p>
          ) : (
            <p className="login-toggle">
              Create account{" "}
              <span onClick={() => setCurrentState("Sign Up")}>click here</span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
