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

  const findBestVendors = () => {
    let result = selectedItems.map(({ value: item }) => {
      let bestVendor = vendors.reduce((best, vendor) => {
        return vendor.prices[item] < best.price
          ? { name: vendor.name, price: vendor.prices[item] }
          : best;
      }, { name: "", price: Infinity });

      return { item, vendor: bestVendor.name, price: bestVendor.price, quantity: quantities[item] || 1 };
    });

    setBestVendors(result);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Suppliers</h2>

      {/* Dropdown for item selection */}
      <div className="mb-4">
        <label className="font-semibold">Select Items:</label>
        <Select
          options={inventoryItems}
          isMulti
          closeMenuOnSelect={false}
          components={makeAnimated()}
          value={selectedItems}
          onChange={handleItemSelection}
          className="border p-2 rounded-lg"
        />
      </div>

      {/* Quantity Input */}
      <div className="mb-4">
        <label className="font-semibold">Enter Quantity (Max {maxStorage} kg):</label>
        <div className="grid grid-cols-2 gap-2">
          {selectedItems.map(({ value: item }) => (
            <div key={item} className="flex items-center space-x-2">
              <span>{item}:</span>
              <input
                type="number"
                value={quantities[item] || ""}
                min="1"
                max={maxStorage}
                onChange={(e) => handleQuantityChange(item, e.target.value)}
                className="border p-1 w-16"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Get Best Value Button */}
      <button
        onClick={findBestVendors}
        disabled={totalWeight === 0}
        className={`px-4 py-2 rounded-lg ${
          totalWeight === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        Get Best Value
      </button>
      {totalWeight === 0 && <span className="ml-2 text-red-500">1 quantity = 1 kg</span>}

      {/* Results Table */}
      {bestVendors.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Best Vendor Selection:</h3>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Item</th>
                <th className="p-2 border">Vendor</th>
                <th className="p-2 border">Price (per kg)</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {bestVendors.map(({ item, vendor, price, quantity }) => (
                <tr key={item} className="border">
                  <td className="p-2 border">{item}</td>
                  <td className="p-2 border">{vendor}</td>
                  <td className="p-2 border">₹{price}</td>
                  <td className="p-2 border">{quantity} kg</td>
                  <td className="p-2 border">₹{price * quantity}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className="p-2 border" colSpan="3">Total Weight</td>
                <td className="p-2 border">{totalWeight} kg</td>
                <td className="p-2 border">₹{bestVendors.reduce((sum, { price, quantity }) => sum + price * quantity, 0)}</td>
              </tr>
              <tr className="font-bold">
                <td className="p-2 border" colSpan="3">Remaining Storage</td>
                <td className="p-2 border" colSpan="2">{Math.max(maxStorage - totalWeight, 0)} kg</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
