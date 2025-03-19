import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import Dashboard from "./Dashboard";
import Inventory from "./Inventory";
import Orders from "./Orders";
import Suppliers from "./Suppliers";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className={`fixed lg:relative w-64 min-h-screen bg-gray-900 text-white p-4 transform transition-transform duration-300 ease-in-out z-40 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
  {/* Sidebar Header - Always Visible at Top */}
  <div className="mb-6 text-center border-b border-gray-700 pb-4">
    <h1 className="text-xl font-bold uppercase tracking-wide">Niyantrak</h1>
  </div>

  {/* Close Button for Mobile View */}
  <div className="flex justify-end lg:hidden">
    <button onClick={() => setSidebarOpen(false)} className="text-white">
      <FiX size={24} />
    </button>
  </div>

  {/* Navigation Menu */}
  <nav>
    <ul className="space-y-4">
      <li><Link to="/" onClick={() => setSidebarOpen(false)}>Dashboard</Link></li>
      <li><Link to="/inventory" onClick={() => setSidebarOpen(false)}>Inventory</Link></li>
      <li><Link to="/orders" onClick={() => setSidebarOpen(false)}>Orders</Link></li>
      <li><Link to="/suppliers" onClick={() => setSidebarOpen(false)}>Suppliers</Link></li>
    </ul>
  </nav>
</aside>


        {/* Mobile Menu Button (Only shows when sidebar is closed) */}
        {/* Sidebar Toggle Button (Only when sidebar is closed) */}
        {!isSidebarOpen && (
  <button 
    onClick={() => setSidebarOpen(true)} 
    className="lg:hidden fixed top-3 left-3 bg-gray-900 text-white p-1 rounded-md z-50 shadow-md"
  >
    <FiMenu size={20} />
  </button>
)}


        {/* Main Content */}
        <main className={`flex-1 p-6 bg-gray-100 w-full transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>


          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/suppliers" element={<Suppliers />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
