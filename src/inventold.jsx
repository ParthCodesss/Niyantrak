import { useState } from "react";

function Inventory() {
  const [items, setItems] = useState([
    { id: 1, name: "Apples", quantity: 20, price: 2.5, weight: 0.1 },
    { id: 2, name: "Bananas", quantity: 15, price: 1.2, weight: 0.1 },
    { id: 3, name: "Tomatoes", quantity: 10, price: 3.0, weight: 0.1 },
  ]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", price: "", weight: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [restockSuggestions, setRestockSuggestions] = useState([]);
  const storageLimit = 100;

  const handleRestockSuggestion = () => {
    let remainingWeight = storageLimit - items.reduce((sum, item) => sum + item.quantity * item.weight, 0);
    let suggestions = [];
    
    const sortedItems = [...items].sort((a, b) => b.price / b.weight - a.price / a.weight);
    
    for (let item of sortedItems) {
      if (remainingWeight <= 0) break;
      let maxQuantity = Math.floor(remainingWeight / item.weight);
      if (maxQuantity > 0) {
        suggestions.push({ name: item.name, quantity: maxQuantity });
        remainingWeight -= maxQuantity * item.weight;
      }
    }
    setRestockSuggestions(suggestions);
  };

  const mergeSort = (arr) => {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    return merge(left, right);
  };

  const merge = (left, right) => {
    let sortedArr = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
      if (left[i].name.localeCompare(right[j].name) < 0) {
        sortedArr.push(left[i++]);
      } else {
        sortedArr.push(right[j++]);
      }
    }
    return [...sortedArr, ...left.slice(i), ...right.slice(j)];
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.quantity || !newItem.price || !newItem.weight) return;
    const totalWeight = items.reduce((sum, item) => sum + item.quantity * item.weight, 0) + (Number(newItem.quantity) * Number(newItem.weight));
    if (totalWeight > storageLimit) {
      alert("Cannot add item. Storage limit exceeded!");
      return;
    }
    let updatedItems = [...items];
    const existingItemIndex = updatedItems.findIndex(item => item.name.toLowerCase() === newItem.name.toLowerCase());
    if (existingItemIndex !== -1) {
      updatedItems[existingItemIndex].quantity += Number(newItem.quantity);
    } else {
      updatedItems.push({ ...newItem, id: Date.now(), quantity: Number(newItem.quantity), price: Number(newItem.price), weight: Number(newItem.weight) });
    }
    setItems(mergeSort(updatedItems));
    setNewItem({ name: "", quantity: "", price: "", weight: "" });
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const filteredItems = searchQuery ? items.filter(item => item.name.toLowerCase().startsWith(searchQuery.toLowerCase())) : items;
  const currentWeight = items.reduce((sum, item) => sum + item.quantity * item.weight, 0);
  const remainingWeight = storageLimit - currentWeight;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Item"
          className="border p-2 rounded w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="bg-white p-4 shadow rounded-lg mb-4">
        <h3 className="text-lg font-semibold mb-2">Add New Item</h3>
        <div className="grid grid-cols-4 gap-2">
          <input type="text" placeholder="Item Name" className="border p-2 rounded" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
          <input type="number" placeholder="Quantity" className="border p-2 rounded" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })} />
          <input type="number" placeholder="Price" className="border p-2 rounded" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} />
          <input type="number" placeholder="Weight" className="border p-2 rounded" value={newItem.weight} onChange={(e) => setNewItem({ ...newItem, weight: e.target.value })} />
          <button onClick={handleAddItem} className="bg-blue-500 text-white p-2 rounded mt-2">Add Item</button>
        </div>
      </div>
      <div className="bg-white p-4 shadow rounded-lg mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Current Inventory</h3>
          <span className="text-sm font-semibold bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow">Remaining Storage: {remainingWeight} kg</span>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">Item</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Price</th>
              <th className="p-2">Weight</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.quantity}</td>
                <td className="p-2">${item.price.toFixed(2)}</td>
                <td className="p-2">{item.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-white p-4 shadow rounded-lg mb-4">
        <h3 className="text-lg font-semibold mb-2">Restocking Suggestions</h3>
        <p className="text-sm text-gray-600 mb-2">Suggested items to restock based on storage availability.</p>
        <button onClick={handleRestockSuggestion} className="bg-green-500 text-white p-2 rounded mb-2">Get Restock Suggestions</button>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">Item</th>
              <th className="p-2">Suggested Quantity</th>
            </tr>
          </thead>
          <tbody>
            {restockSuggestions.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  );
}

export default Inventory;
