import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Dashboard from "./Dashboard.jsx";
import Inventory from "./Inventory.jsx";
import Suppliers from "./Suppliers.jsx";
import CategoryView from "./CategoryView.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="inventory/:category" element={<Inventory />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="categories" element={<CategoryView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);