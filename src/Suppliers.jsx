import React, { useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const inventoryItems = [
  { label: "Rice", value: "Rice" },
  { label: "Wheat", value: "Wheat" },
  { label: "Sugar", value: "Sugar" },
  { label: "Salt", value: "Salt" },
  { label: "Lentils", value: "Lentils" },
  { label: "Chicken", value: "Chicken" },
  { label: "Fish", value: "Fish" },
  { label: "Eggs", value: "Eggs" },
  { label: "Apples", value: "Apples" },
  { label: "Corn", value: "Corn" },
];

const vendors = [
  {
    name: "Vendor A",
    prices: { Rice: 40, Wheat: 35, Sugar: 50, Salt: 20, Lentils: 60, Chicken: 180, Fish: 200, Eggs: 6, Apples: 150, Corn: 70 },
  },
  {
    name: "Vendor B",
    prices: { Rice: 38, Wheat: 37, Sugar: 48, Salt: 22, Lentils: 58, Chicken: 170, Fish: 190, Eggs: 7, Apples: 140, Corn: 75 },
  },
  {
    name: "Vendor C",
    prices: { Rice: 42, Wheat: 34, Sugar: 55, Salt: 18, Lentils: 65, Chicken: 185, Fish: 195, Eggs: 5, Apples: 145, Corn: 72 },
  },
];

const VendorList = ({ vendors }) => {
  return (
    <div className="flex flex-wrap gap-6">
      {vendors.map((vendor, index) => (
        <div key={index} className="bg-white shadow-md rounded-2xl p-6 w-full sm:w-80 border border-gray-100 hover:shadow-lg transition-shadow duration-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{vendor.name}</h2>
          <ul className="space-y-3">
            {vendor.prices &&
              Object.entries(vendor.prices).map(([item, price], idx) => (
                <li key={idx} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{item}</span>
                  <span className="font-semibold text-indigo-600">₹{price}</span>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const maxStorage = 100; // Maximum storage limit in kg

const Suppliers = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [bestVendors, setBestVendors] = useState([]);
  const [totalWeight, setTotalWeight] = useState(0);

  const handleItemSelection = (selected) => {
    setSelectedItems(selected || []);
    setQuantities({});
    setTotalWeight(0);
  };

  const handleQuantityChange = (item, value) => {
    const qty = Math.min(Number(value), maxStorage);
    const updatedQuantities = { ...quantities, [item]: qty || 0 };
    const newTotalWeight = Object.values(updatedQuantities).reduce((sum, val) => sum + val, 0);
    
    if (newTotalWeight <= maxStorage) {
      setQuantities(updatedQuantities);
      setTotalWeight(newTotalWeight);
    }
  };

  const findBestVendors = (budget) => {
    let bestCombination = null;
    let minCost = Infinity;
  
    const backtrack = (index, currentVendors, currentCost) => {
      if (index === selectedItems.length) {
        if (currentCost < minCost) {
          minCost = currentCost;
          bestCombination = [...currentVendors];
        }
        return;
      }
  
      let item = selectedItems[index].value;
  
      for (let vendor of vendors) {
        if (vendor.prices[item] !== undefined) {
          let newCost = currentCost + vendor.prices[item] * (quantities[item] || 1);
  
          if (budget !== undefined && newCost > budget) continue;
  
          currentVendors.push({ item, vendor: vendor.name, price: vendor.prices[item], quantity: quantities[item] || 1 });
          backtrack(index + 1, currentVendors, newCost);
          currentVendors.pop();
        }
      }
    };
  
    backtrack(0, [], 0);
    setBestVendors(bestCombination || []);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Vendor Comparison</h2>

        <VendorList vendors={vendors} />

        {/* Dropdown for item selection */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <label className="block text-lg font-semibold text-gray-800 mb-3">Select Items:</label>
          <Select
            options={inventoryItems}
            isMulti
            closeMenuOnSelect={false}
            components={makeAnimated()}
            value={selectedItems}
            onChange={handleItemSelection}
            className="basic-multi-select"
            classNamePrefix="select"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: '0.5rem',
                borderColor: '#e5e7eb',
                boxShadow: 'none',
                '&:hover': { borderColor: '#a5b4fc' },
              }),
              menu: (base) => ({
                ...base,
                borderRadius: '0.5rem',
                marginTop: '0.25rem',
              }),
            }}
          />
        </div>

        {/* Quantity Input */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <label className="block text-lg font-semibold text-gray-800 mb-3">Enter Quantity (Max {maxStorage} kg):</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {selectedItems.map(({ value: item }) => (
              <div key={item} className="flex items-center space-x-3">
                <span className="text-gray-600 font-medium">{item}:</span>
                <input
                  type="number"
                  value={quantities[item] || ""}
                  min="1"
                  max={maxStorage}
                  onChange={(e) => handleQuantityChange(item, e.target.value)}
                  className="w-20 p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Get Best Value Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={findBestVendors}
            disabled={totalWeight === 0}
            className={`px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
              totalWeight === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            }`}
          >
            Get Best Value
          </button>
          {totalWeight === 0 && (
            <span className="text-sm text-red-500 font-medium">1 quantity = 1 kg</span>
          )}
        </div>

        {/* Results Table */}
        {bestVendors.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Best Vendor Selection:</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-600">
                    <th className="p-4 font-semibold">Item</th>
                    <th className="p-4 font-semibold">Vendor</th>
                    <th className="p-4 font-semibold">Price (per kg)</th>
                    <th className="p-4 font-semibold">Quantity</th>
                    <th className="p-4 font-semibold">Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {bestVendors.map(({ item, vendor, price, quantity }) => (
                    <tr key={item} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                      <td className="p-4">{item}</td>
                      <td className="p-4">{vendor}</td>
                      <td className="p-4">₹{price}</td>
                      <td className="p-4">{quantity} kg</td>
                      <td className="p-4 font-medium text-indigo-600">₹{price * quantity}</td>
                    </tr>
                  ))}
                  <tr className="border-b border-gray-200 font-bold text-gray-800">
                    <td className="p-4" colSpan="3">Total Weight</td>
                    <td className="p-4">{totalWeight} kg</td>
                    <td className="p-4">₹{bestVendors.reduce((sum, { price, quantity }) => sum + price * quantity, 0)}</td>
                  </tr>
                  <tr className="font-bold text-gray-800">
                    <td className="p-4" colSpan="3">Remaining Storage</td>
                    <td className="p-4" colSpan="2">{Math.max(maxStorage - totalWeight, 0)} kg</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Suppliers;