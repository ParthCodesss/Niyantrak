import React from 'react';

const Dashboard = () => {
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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-semibold">Total Inventory</h3>
          <p className="text-2xl font-bold">1200</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-semibold">Orders Today</h3>
          <p className="text-2xl font-bold">45</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-semibold">Revenue</h3>
          <p className="text-2xl font-bold">$5,200</p>
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
          >
            <span className="text-4xl mb-2">{category.icon}</span>
            <h4 className="text-lg font-semibold">{category.name}</h4>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Order ID</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">#001</td>
              <td className="p-2">John Doe</td>
              <td className="p-2">$120</td>
              <td className="p-2 text-green-600">Completed</td>
            </tr>
            <tr className="border-b">
              <td className="p-2">#002</td>
              <td className="p-2">Jane Smith</td>
              <td className="p-2">$85</td>
              <td className="p-2 text-yellow-600">Pending</td>
            </tr>
            <tr>
              <td className="p-2">#003</td>
              <td className="p-2">Michael Brown</td>
              <td className="p-2">$200</td>
              <td className="p-2 text-red-600">Canceled</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
