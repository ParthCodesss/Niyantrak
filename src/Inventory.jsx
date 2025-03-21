import { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useOutletContext, useParams } from "react-router-dom";

function Inventory() {
  const { inventoryItems, setInventoryItems, categories } = useOutletContext();
  const { category } = useParams();
  const [newItem, setNewItem] = useState({ name: "", quantity: "", price: "", weight: "", category: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [restockSuggestions, setRestockSuggestions] = useState([]);
  const storageLimit = 100;

  const filteredItemsByCategory = category && category !== "ALL ITEMS"
    ? inventoryItems.filter(item => item.category === category)
    : inventoryItems;

  class Node {
    constructor(index, weight, profit, bound) {
      this.index = index;
      this.weight = weight;
      this.profit = profit;
      this.bound = bound;
    }
  }
  
  const compareNodes = (a, b) => b.bound - a.bound;
  
  const knapsackBranchAndBound = (items, capacity) => {
    items.sort((a, b) => (b.price / b.weight) - (a.price / a.weight));
    let maxProfit = 0;
    let bestSet = [];
  
    const bound = (index, weight, profit) => {
      if (weight >= capacity) return 0;
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
  
    let queue = [];
    let root = new Node(0, 0, 0, bound(0, 0, 0));
    queue.push(root);
  
    while (queue.length > 0) {
      queue.sort(compareNodes);
      let current = queue.shift();
  
      if (current.bound > maxProfit && current.index < items.length) {
        let nextIndex = current.index;
        let includedNode = new Node(
          nextIndex + 1,
          current.weight + items[nextIndex].weight,
          current.profit + items[nextIndex].price,
          bound(nextIndex + 1, current.weight + items[nextIndex].weight, current.profit + items[nextIndex].price)
        );
  
        if (includedNode.weight <= capacity && includedNode.profit > maxProfit) {
          maxProfit = includedNode.profit;
          bestSet = [...bestSet, items[nextIndex]];
        }
  
        if (includedNode.bound > maxProfit) queue.push(includedNode);
  
        let excludedNode = new Node(
          nextIndex + 1,
          current.weight,
          current.profit,
          bound(nextIndex + 1, current.weight, current.profit)
        );
  
        if (excludedNode.bound > maxProfit) queue.push(excludedNode);
      }
    }
    
    return bestSet;
  };

  const generateRestockSuggestions = () => {
    const itemsNeedingRestock = filteredItemsByCategory.filter(item => item.quantity < 10);
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
    setInventoryItems(inventoryItems.filter((item) => item.id !== id));
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setNewItem({
      name: item.name,
      quantity: item.quantity.toString(),
      price: item.price.toString(),
      weight: item.weight.toString(),
      category: item.category
    });
  };

  const handleUpdateItem = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.quantity || !newItem.price || !newItem.weight || !newItem.category) return;
    
    const updatedItems = inventoryItems.map(item => 
      item.id === editItem.id 
        ? { 
            ...item, 
            name: newItem.name,
            quantity: Number(newItem.quantity),
            price: Number(newItem.price),
            weight: Number(newItem.weight),
            category: newItem.category 
          }
        : item
    );
    
    setInventoryItems(mergeSort(updatedItems));
    setNewItem({ name: "", quantity: "", price: "", weight: "", category: "" });
    setEditItem(null);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.quantity || !newItem.price || !newItem.weight || !newItem.category) return;
    let existingIndex = inventoryItems.findIndex(item => item.name.toLowerCase() === newItem.name.toLowerCase());
    let updatedItems = [...inventoryItems];
    if (existingIndex !== -1 && !editItem) {
      updatedItems[existingIndex].quantity += Number(newItem.quantity);
    } else if (!editItem) {
      updatedItems.push({ 
        ...newItem, 
        id: Date.now(), 
        quantity: Number(newItem.quantity), 
        price: Number(newItem.price), 
        weight: Number(newItem.weight),
        category: newItem.category 
      });
    }
    setInventoryItems(mergeSort(updatedItems));
    setNewItem({ name: "", quantity: "", price: "", weight: "", category: "" });
  };

  const binarySearch = (arr, query) => {
    let left = 0, right = arr.length - 1;
    query = query.toLowerCase();
    let startIndex = -1;
  
    while (left <= right) {
      let mid = Math.floor((left + right) / 2);
      let midName = arr[mid].name.toLowerCase();
  
      if (midName.startsWith(query)) {
        startIndex = mid;
        right = mid - 1;
      } else if (midName < query) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  
    if (startIndex === -1) return [];
  
    let results = [];
    for (let i = startIndex; i < arr.length && arr[i].name.toLowerCase().startsWith(query); i++) {
      results.push(arr[i]);
    }
    return results;
  };

  const filteredItems = searchQuery ? binarySearch(filteredItemsByCategory, searchQuery) : filteredItemsByCategory;
  const currentWeight = filteredItems.reduce((sum, item) => sum + item.quantity * item.weight, 0);
  const remainingWeight = storageLimit - currentWeight;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {category ? `${category} Inventory` : "Inventory Dashboard"}
        </h2>

        <div className="relative">
          <input
            type="text"
            placeholder="Search items..."
            className="w-full p-4 pl-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            {editItem ? "Edit Item" : "Add New Item"}
          </h3>
          <form onSubmit={editItem ? handleUpdateItem : handleAddItem} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Item Name"
              className="p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all duration-200"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Quantity"
              className="p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all duration-200"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price (₹)"
              className="p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all duration-200"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            />
            <input
              type="number"
              placeholder="Weight (kg)"
              className="p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all duration-200"
              value={newItem.weight}
              onChange={(e) => setNewItem({ ...newItem, weight: e.target.value })}
            />
            <select
              className="p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all duration-200"
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            >
              <option value="">Select Category</option>
              {categories
                .filter(cat => cat.name !== "ALL ITEMS") // Optionally exclude "ALL ITEMS" since it's not a real category for items
                .map(cat => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
            </select>
            <button
              type="submit"
              className="md:col-span-5 bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium"
            >
              {editItem ? "Update Item" : "Add Item"}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="text-xl font-semibold text-gray-800">Current Inventory</h3>
            <span className="bg-indigo-50 text-indigo-700 px-4 py-1 rounded-full text-sm font-medium shadow-sm">
              Remaining Storage: {remainingWeight.toFixed(2)} kg
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 text-gray-600">
                  <th className="p-4 font-semibold">Item</th>
                  <th className="p-4 font-semibold">Quantity</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Weight</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                    <td className="p-4">{item.name}</td>
                    <td className="p-4">{item.quantity}</td>
                    <td className="p-4">₹{item.price.toFixed(2)}</td>
                    <td className="p-4">{item.weight} kg</td>
                    <td className="p-4">{item.category}</td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="text-xl font-semibold text-gray-800">Restock Suggestions</h3>
            <button
              onClick={generateRestockSuggestions}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium"
            >
              Generate Suggestions
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 text-gray-600">
                  <th className="p-4 font-semibold">Item</th>
                  <th className="p-4 font-semibold">Current Qty</th>
                  <th className="p-4 font-semibold">Suggested Restock</th>
                  <th className="p-4 font-semibold">Needed Weight</th>
                </tr>
              </thead>
              <tbody>
                {restockSuggestions.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                    <td className="p-4">{item.name}</td>
                    <td className="p-4">{item.quantity}</td>
                    <td className="p-4">{10 - item.quantity}</td>
                    <td className="p-4">{item.neededWeight.toFixed(2)} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inventory;