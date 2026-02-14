import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ServiceDetails from "./pages/ServiceDetails";
import Navbar from "./components/Navbar";
import LenisScroll from "./components/LenisScroll";
import ProjectDetails from "./pages/ProjectDetails";
import Footer from "./components/Footer";

export default function App() {
  return (
    <Router>
      <LenisScroll />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/service-details/:id" element={<ServiceDetails />} />
        <Route path="/project-details/:id" element={<ProjectDetails />} />
      </Routes>
      <Footer />
    </Router>
  );
}
