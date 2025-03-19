import { useState } from "react";

function Inventory() {
  const [items, setItems] = useState([
    { id: 1, name: "Apples", quantity: 8, price: 2.5, weight: 0.1 },
    { id: 2, name: "Bananas", quantity: 7, price: 1.2, weight: 0.1 },
    { id: 3, name: "Tomatoes", quantity: 7, price: 3.0, weight: 0.1 },
  ]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", price: "", weight: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const storageLimit = 100;


  const [restockSuggestions, setRestockSuggestions] = useState([]);

  const knapsackBranchAndBound = (items, capacity) => {
    items.sort((a, b) => (b.price / b.weight) - (a.price / a.weight));
    let maxProfit = 0;
    let bestSet = [];
    const bound = (index, weight, profit) => {
      if (index >= items.length || weight >= capacity) return profit;
      let boundProfit = profit;
      let totalWeight = weight;
      for (let i = index; i < items.length; i++) {
        if (totalWeight + items[i].weight <= capacity) {
          boundProfit += items[i].price;
          totalWeight += items[i].weight;
        } else {
          boundProfit += (items[i].price / items[i].weight) * (capacity - totalWeight);
          break;
        }
      }
      return boundProfit;
    };
    
    const knapsack = (index, weight, profit, selected) => {
      if (weight > capacity) return;
      if (profit > maxProfit) {
        maxProfit = profit;
        bestSet = [...selected];
      }
      if (index >= items.length) return;
      if (bound(index + 1, weight, profit) > maxProfit) {
        knapsack(index + 1, weight + items[index].weight, profit + items[index].price, [...selected, items[index]]);
      }
      knapsack(index + 1, weight, profit, selected);
    };
    
    knapsack(0, 0, 0, []);
    return bestSet;
  };

  const generateRestockSuggestions = () => {
    const itemsNeedingRestock = items.filter(item => item.quantity < 10);
    const selectedItems = knapsackBranchAndBound(itemsNeedingRestock, remainingWeight);
    setRestockSuggestions(selectedItems.map(item => ({
      ...item,
      neededWeight: (10 - item.quantity) * item.weight,
    })));
  };


  const mergeSort = (arr) => {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    return merge(left, right);
  };

  const merge = (left, right) => {
    let sortedArray = [];
    while (left.length && right.length) {
      if (left[0].name.toLowerCase() < right[0].name.toLowerCase()) {
        sortedArray.push(left.shift());
      } else {
        sortedArray.push(right.shift());
      }
    }
    return [...sortedArray, ...left, ...right];
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.quantity || !newItem.price || !newItem.weight) return;
    let existingIndex = items.findIndex(item => item.name.toLowerCase() === newItem.name.toLowerCase());
    let updatedItems = [...items];
    if (existingIndex !== -1) {
      updatedItems[existingIndex].quantity += Number(newItem.quantity);
    } else {
      updatedItems.push({ ...newItem, id: Date.now(), quantity: Number(newItem.quantity), price: Number(newItem.price), weight: Number(newItem.weight) });
    }
    setItems(mergeSort(updatedItems));
    setNewItem({ name: "", quantity: "", price: "", weight: "" });
  };

  const filteredItems = searchQuery ? items.filter(item => item.name.toLowerCase().startsWith(searchQuery.toLowerCase())) : items;
  const currentWeight = items.reduce((sum, item) => sum + item.quantity * item.weight, 0);
  const remainingWeight = storageLimit - currentWeight;

  
  return (
    <div className="p-6 h-screen overflow-y-auto">
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
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.quantity}</td>
                <td className="p-2">${item.price.toFixed(2)}</td>
                <td className="p-2">{item.weight}</td>
                <td className="p-2">
                  <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-4 shadow rounded-lg mb-4">
        <h3 className="text-lg font-semibold mb-2">Restock Suggestions</h3>
        <button onClick={generateRestockSuggestions} className="bg-green-500 text-white p-2 rounded mb-2">Generate Suggestions</button>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">Item</th>
              <th className="p-2">Current Quantity</th>
              <th className="p-2">Needed Weight</th>
            </tr>
          </thead>
          <tbody>
            {restockSuggestions.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.quantity}</td>
                <td className="p-2">{item.neededWeight.toFixed(2)} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Inventory;