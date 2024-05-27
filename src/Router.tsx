import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MasterPage from "./pages/__layouts/master_page";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/welcome" index element={<LandingPage />} />
        <Route path="/" element={<MasterPage />}></Route>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
