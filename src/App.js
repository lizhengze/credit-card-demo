import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import Home from "./Home";
import Admin from "./Admin";
import AddTransaction from "./AddTransaction";
import Navbar from "./Navbar";  


export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/add-transaction" element={<AddTransaction />} />
      </Routes>
    </Router>
  );
}