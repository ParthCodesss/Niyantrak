import React, { useState } from "react";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useOutletContext } from "react-router-dom";

function CategoryView() {
  const { categories, setCategories } = useOutletContext(); // Access context
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedCategory, setEditedCategory] = useState("");

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error("Category name cannot be empty!");
      return;
    }
    if (categories.some(cat => cat.name === newCategory)) {
      toast.error("Category already exists!");
      return;
    }
    setCategories([...categories, { name: newCategory, icon: "📦" }]); // Default icon
    setNewCategory("");
    toast.success("Category added successfully!");
  };

  const handleDeleteCategory = (category) => {
    setCategories(categories.filter((cat) => cat.name !== category));
    toast.success("Category deleted successfully!");
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setEditedCategory(category);
  };

  const handleSaveEdit = () => {
    if (!editedCategory.trim()) {
      toast.error("Category name cannot be empty!");
      return;
    }
    if (categories.some(cat => cat.name === editedCategory && editedCategory !== editingCategory)) {
      toast.error("Category name already exists!");
      return;
    }
    setCategories(categories.map((cat) => 
      cat.name === editingCategory ? { ...cat, name: editedCategory } : cat
    ));
    setEditingCategory(null);
    toast.success("Category updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <div className="max-w-4xl mx-auto space-y-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Category Management
        </h2>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Add new category"
              className="flex-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all duration-200"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button
              onClick={handleAddCategory}
              className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
            >
              <FiPlus size={24} />
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          {categories.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              <p>No categories available. Add a new category to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
                >
                  {editingCategory === category.name ? (
                    <input
                      type="text"
                      value={editedCategory}
                      onChange={(e) => setEditedCategory(e.target.value)}
                      className="flex-1 p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                  ) : (
                    <span className="text-gray-800 font-medium">{category.name}</span>
                  )}
                  <div className="flex items-center gap-3">
                    {editingCategory === category.name ? (
                      <button
                        onClick={handleSaveEdit}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditCategory(category.name)}
                        className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                      >
                        <FiEdit size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteCategory(category.name)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryView;