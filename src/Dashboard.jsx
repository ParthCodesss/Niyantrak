import React from 'react';

const Dashboard = () => {
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