import React, { useState, useEffect } from "react";
import { User } from "../types";
import httpClient from "../httpClient";

const LandingPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const logoutUser = async () => {
    await httpClient.post(`${process.env.REACT_APP_FLASK_API_BASE_URL}/logout`);
    window.location.href = "/welcome";
  };

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.get(
          `${process.env.REACT_APP_FLASK_API_BASE_URL}/@me`
        );

        setUser(resp.data);
      } catch (error) {
        console.log("Not authentificated");
      }
    })();
  }, []);

  return (
    <>
      <h1> KPI Managements Platform </h1>
      {user != null ? (
        <>
          <h2> Logged in</h2>
          <p>
            Welcome {user.id} : {user.email}
          </p>

          <button onClick={logoutUser}>Log out</button>
        </>
      ) : (
        <div>
          <h4>You're not logged in</h4>
          <a href="/login">
            <button>Login</button>
          </a>
          <a href="/register">
            <button>Register</button>
          </a>
        </div>
      )}
    </>
  );
};

export default LandingPage;
