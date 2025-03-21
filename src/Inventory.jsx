import { useState } from "react";

function Inventory() {
  const [items, setItems] = useState([
    { id: 1, name: "Apples", quantity: 8, price: 125, weight: 0.5 },
    { id: 2, name: "Bananas", quantity: 7, price: 30, weight: 0.5 },
    { id: 3, name: "Tomatoes", quantity: 7, price: 20, weight: 0.5 },
    { id: 4, name: "Potatoes", quantity: 10, price: 25, weight: 0.5 },
    { id: 5, name: "Onions", quantity: 6, price: 35, weight: 0.5 },
    { id: 6, name: "Carrots", quantity: 10, price: 40, weight: 0.5 },
    { id: 7, name: "Cabbage", quantity: 10, price: 50, weight: 0.5 },
   
    { id: 8, name: "Oranges", quantity: 6, price: 60, weight: 0.5 },
    { id: 9, name: "Grapes", quantity: 10, price: 90, weight: 0.5 },
    { id: 10, name: "Pineapple", quantity: 2, price: 150, weight: 0.5 },
    { id: 11, name: "Mangoes", quantity: 5, price: 100, weight: 0.5 },
    
    { id: 12, name: "Milk", quantity: 2, price: 60, weight: 1 },
    { id: 13, name: "Cheese", quantity: 10, price: 250, weight: 0.5 },
    { id: 14, name: "Butter", quantity: 10, price: 200, weight: 0.5 },
    { id: 15, name: "Yogurt", quantity: 3, price: 80, weight: 1 },
    
   
    
  ]
);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", price: "", weight: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const storageLimit = 100;


  const [restockSuggestions, setRestockSuggestions] = useState([]);


  //knapsack branch and bound for restocking
  class Node {
    constructor(index, weight, profit, bound) {
      this.index = index;
      this.weight = weight;
      this.profit = profit;
      this.bound = bound;
    }
  }
  
  // Max Heap comparator function
  const compareNodes = (a, b) => b.bound - a.bound;
  
  const knapsackBranchAndBound = (items, capacity) => {
    // Sort items by value-to-weight ratio (greedy heuristic)
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
      queue.sort(compareNodes); // Sort to prioritize highest bound first
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
  

  //restocking
  const generateRestockSuggestions = () => {
    const itemsNeedingRestock = items.filter(item => item.quantity < 10);
    const selectedItems = knapsackBranchAndBound(itemsNeedingRestock, remainingWeight);
    setRestockSuggestions(selectedItems.map(item => ({
      ...item,
      neededWeight: (10 - item.quantity) * item.weight,
    })));
  };


  //sorting the current inventory
  const mergeSort = (arr) => {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    return merge(left, right);
  };

  // merge sort
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

  // Binary search for search bar
  const binarySearch = (arr, query) => {
    let left = 0, right = arr.length - 1;
    query = query.toLowerCase();
    let startIndex = -1;
  
    while (left <= right) {
      let mid = Math.floor((left + right) / 2);
      let midName = arr[mid].name.toLowerCase();
  
      if (midName.startsWith(query)) {
        startIndex = mid;
        right = mid - 1; // Search further left for the first match
      } else if (midName < query) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  
    if (startIndex === -1) return []; // No matches found
  
    // Collect all matching elements starting from startIndex
    let results = [];
    for (let i = startIndex; i < arr.length && arr[i].name.toLowerCase().startsWith(query); i++) {
      results.push(arr[i]);
    }
    return results;
  };
  
  // Usage of Binary Search
  const filteredItems = searchQuery ? binarySearch(items, searchQuery) : items;
  
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
                <td className="p-2">₹{item.price.toFixed(2)}</td>
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
              <th className="p-2">Suggested Quantity To Restock</th>
              <th className="p-2">Needed Weight To Restock</th>
              

            </tr>
          </thead>
          <tbody>
            {restockSuggestions.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.quantity}</td>
                <td className="p-2">{10-item.quantity}</td>
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