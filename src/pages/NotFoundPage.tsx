import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <img
        className="mb-4"
        src="/static/images/website_logo.jpeg"
        alt="COMPANY LOGO"
        width="500"
        height="100"
        onClick={() => navigate("/welcome")}
      />
      <h1>404 Not Found</h1>
    </>
  );
};

export default NotFoundPage;
