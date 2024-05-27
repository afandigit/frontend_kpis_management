import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import httpClient from "../httpClient";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const registerUser = async () => {
    try {
      const resp = await httpClient.post(
        `${process.env.REACT_APP_FLASK_API_BASE_URL}/register`,
        {
          email,
          password,
        }
      );

      window.location.href = "/login";
    } catch (error: any) {
      if (error.response.status === 401) {
        alert("Invalid credentials");
      }
    }
  };

  return (
    <>
      <form>
        <img
          className="mb-4"
          src="/static/images/website_logo.jpeg"
          alt="COMPANY LOGO"
          width="500"
          height="100"
          onClick={() => navigate("/welcome")}
        />
        <h1 className="h3 mb-3 fw-normal">Register</h1>

        <div className="form-floating">
          <input
            type="email"
            className="form-control"
            id="floatingInput"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="floatingInput">Email address</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>

        <button
          className="btn btn-primary w-100 py-2"
          type="button"
          onClick={registerUser}
        >
          Register in
        </button>
        <p className="mt-5 mb-3 text-body-secondary">
          KPI Managements Platform &copy; 2024
        </p>
      </form>
    </>
  );
};

export default Register;
