// src/App.jsx
import React from 'react';
import { Home } from "./scene/Example_Scene";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter basename="/EduPath">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/example_route' element={<h1>This is element</h1>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;