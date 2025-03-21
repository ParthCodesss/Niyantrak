import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Categories state (matching the sidebar in the image)
  const [categories, setCategories] = useState([
    { name: "ALL ITEMS", icon: "📦" },
    { name: "Frozen Items", icon: "🥶" },
    { name: "Veggies", icon: "🥦" },
    { name: "Fruits", icon: "🍎" },
    { name: "Electric Appliances", icon: "🔌" },
    { name: "Dairy Products", icon: "🥛" },
    { name: "Beverages", icon: "🥤" },
    { name: "Snacks", icon: "🍿" },
    { name: "Household Supplies", icon: "🧹" },
    { name: "Clothing", icon: "👕" },
    { name: "Bakery Items", icon: "🍞" },
    { name: "Health & Beauty", icon: "💄" },
    { name: "Stationery", icon: "📚" },
    { name: "Frozen Desserts", icon: "🍨" },
    { name: "Meat & Seafood", icon: "🍖" },
    { name: "Canned Goods", icon: "🥫" },
    { name: "Pet Supplies", icon: "🐾" },
  ]);

  // Inventory items state
  const [inventoryItems, setInventoryItems] = useState([
    { id: 1, name: "Apples", quantity: 8, price: 125, weight: 0.5, category: "Fruits" },
    { id: 2, name: "Bananas", quantity: 7, price: 30, weight: 0.5, category: "Fruits" },
    { id: 3, name: "Tomatoes", quantity: 7, price: 20, weight: 0.5, category: "Veggies" },
    { id: 4, name: "Potatoes", quantity: 10, price: 25, weight: 0.5, category: "Veggies" },
    { id: 5, name: "Onions", quantity: 6, price: 35, weight: 0.5, category: "Veggies" },
    { id: 6, name: "Carrots", quantity: 10, price: 40, weight: 0.5, category: "Veggies" },
    { id: 7, name: "Cabbage", quantity: 10, price: 50, weight: 0.5, category: "Veggies" },
    { id: 8, name: "Oranges", quantity: 6, price: 60, weight: 0.5, category: "Fruits" },
    { id: 9, name: "Grapes", quantity: 10, price: 90, weight: 0.5, category: "Fruits" },
    { id: 10, name: "Pineapple", quantity: 2, price: 150, weight: 0.5, category: "Fruits" },
    { id: 11, name: "Mangoes", quantity: 5, price: 100, weight: 0.5, category: "Fruits" },
    { id: 12, name: "Milk", quantity: 2, price: 60, weight: 1, category: "Dairy Products" },
    { id: 13, name: "Cheese", quantity: 10, price: 250, weight: 0.5, category: "Dairy Products" },
    { id: 14, name: "Butter", quantity: 10, price: 200, weight: 0.5, category: "Dairy Products" },
    { id: 15, name: "Yogurt", quantity: 3, price: 80, weight: 1, category: "Dairy Products" },
    { id: 16, name: "Ice Cream", quantity: 5, price: 180, weight: 0.5, category: "Frozen Desserts" },
    { id: 17, name: "Frozen Peas", quantity: 8, price: 70, weight: 0.5, category: "Frozen Items" },
    { id: 18, name: "Chicken", quantity: 3, price: 250, weight: 1, category: "Meat & Seafood" },
    { id: 19, name: "Notebooks", quantity: 15, price: 40, weight: 0.2, category: "Stationery" },
    { id: 20, name: "Soap", quantity: 12, price: 30, weight: 0.1, category: "Household Supplies" },
  ]);

  return (
    <div className="flex min-h-screen font-['Montserrat']">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static w-64 min-h-screen bg-gray-900 text-white p-6 transform transition-transform duration-300 ease-in-out z-40 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="mb-8 border-b border-gray-700 pb-4">
          <h1 className="text-2xl font-bold uppercase tracking-wide">Niyantrak</h1>
          <p className="text-sm text-gray-400">Inventory Management</p>
        </div>

        {/* Close Button for Mobile */}
        <div className="flex justify-end lg:hidden mb-4">
          <button onClick={() => setSidebarOpen(false)} className="text-white">
            <FiX size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 ${
                isActive ? "bg-indigo-600" : "hover:bg-gray-800"
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <span>🏠</span>
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/inventory"
            className={({ isActive }) =>
              `flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 ${
                isActive ? "bg-indigo-600" : "hover:bg-gray-800"
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <span>📦</span>
            <span>Inventory</span>
          </NavLink>
          <NavLink
            to="/suppliers"
            className={({ isActive }) =>
              `flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 ${
                isActive ? "bg-indigo-600" : "hover:bg-gray-800"
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <span>🤝</span>
            <span>Suppliers</span>
          </NavLink>
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              `flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 ${
                isActive ? "bg-indigo-600" : "hover:bg-gray-800"
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <span>📋</span>
            <span>Manage Categories</span>
          </NavLink>
        </nav>

        {/* Categories Section */}
        <div className="mt-8">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Categories
          </h2>
          <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            {categories.map((category) => (
              <NavLink
                key={category.name}
                to={`/inventory/${encodeURIComponent(category.name)}`}
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-2 rounded-lg text-sm transition-all duration-200 ${
                    isActive ? "bg-indigo-600" : "hover:bg-gray-800"
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      {!isSidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 bg-indigo-600 text-white p-2 rounded-lg z-50 shadow-md hover:bg-indigo-700 transition-all duration-200"
        >
          <FiMenu size={20} />
        </button>
      )}

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 w-full overflow-y-auto">
        <Outlet context={{ inventoryItems, setInventoryItems, categories, setCategories }} />
      </main>
    </div>
  );
}

export default App;