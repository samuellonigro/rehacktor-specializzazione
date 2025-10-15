// src/routes/Routing.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import HomePage from "../pages/HomePage";
import GamePage from "../pages/GamePage";
import SearchPage from "../pages/SearchPage";
import ErrorPage from "../pages/ErrorPage";
import RegisterPage from "../pages/RegisterPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import AccountPage from "../pages/AccountPage.jsx";


export default function Routing() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/game/:id" element={<GamePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
