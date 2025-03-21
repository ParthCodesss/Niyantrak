import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

  const navigate = useNavigate();
  // Inventory Categories Data
  const categories = [
    { name: 'All Items', icon: '📦' }, // New "All Items" card added here
    { name: 'Frozen Items', icon: '🥶' },
    { name: 'Veggies', icon: '🥦' },
    { name: 'Fruits', icon: '🍎' },
    { name: 'Electric Appliances', icon: '🔌' },
    { name: 'Dairy Products', icon: '🥛' },
    { name: 'Beverages', icon: '🥤' },
    { name: 'Snacks', icon: '🍿' },
    { name: 'Household Supplies', icon: '🧹' },
    { name: 'Clothing', icon: '👕' },
    { name: 'Bakery Items', icon: '🍞' },
    { name: 'Health & Beauty', icon: '💄' },
    { name: 'Stationery', icon: '📚' },
    { name: 'Frozen Desserts', icon: '🍨' },
    { name: 'Meat & Seafood', icon: '🍖' },
    { name: 'Canned Goods', icon: '🥫' },
    { name: 'Pet Supplies', icon: '🐾' },
  ];

  return (
    <div className="p-6 h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-semibold">Total Inventory</h3>
          <p className="text-2xl font-bold">1200</p>
        </div>
       
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-semibold">Revenue</h3>
          <p className="text-2xl font-bold">₹5000</p>
        </div>
      </div>

      {/* Inventory Categories Cards */}
      <h3 className="text-lg font-bold mb-4">Inventory Categories</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`bg-white p-4 shadow rounded-lg flex flex-col items-center justify-center transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${
              category.name === 'All Items' ? 'border-2 border-yellow-400' : ''
            }`}
            onClick={() => {
              if (category.name === 'All Items') {
                navigate('/inventory'); // Navigate to Inventory component
              }
            }}
          >
            <span className="text-4xl mb-2">{category.icon}</span>
            <h4 className="text-lg font-semibold">{category.name}</h4>
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default Dashboard;
