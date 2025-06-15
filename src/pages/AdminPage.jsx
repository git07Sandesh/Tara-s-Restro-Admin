import React, { useEffect, useState, useRef } from 'react';
import { useMenuStore } from '../store/menu.js';

const AdminPage = () => {
  const fileInputRef = useRef(null);
  const editImageInputRef = useRef(null);
  const { dishes, createDish, fetchDishes, deleteDish, toggleFeaturedDish, updateDish } = useMenuStore();

  const [menuData, setMenuData] = useState({ dishName: "", price: "", description: "" });
  const [imageFile, setImageFile] = useState(null);
  const [editingDish, setEditingDish] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);

  useEffect(() => {
    fetchDishes();
  }, []);

  const handleAddDish = (e) => {
    e.preventDefault();
    const { dishName, price, description } = menuData;
    if (!dishName || !price || !description || !imageFile) {
      alert("All fields and an image are required!");
      return;
    }

    const formData = new FormData();
    formData.append("dishName", dishName);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("image", imageFile);

    createDish(formData);
    setMenuData({ dishName: "", price: "", description: "" });
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveDish = (dishId) => {
    deleteDish(dishId);
  };

  const handleSaveEdit = async () => {
    const { _id, dishName, price, description } = editingDish;
    const formData = new FormData();
    formData.append("dishName", dishName);
    formData.append("price", price);
    formData.append("description", description);
    if (editImageFile) {
      formData.append("image", editImageFile);
    }

    await updateDish(_id, formData);
    await fetchDishes();
    setEditingDish(null);
    setEditImageFile(null);
  };

  const handleToggleFeature = async () => {
    await toggleFeaturedDish(editingDish._id, editingDish.featured);
    setEditingDish({ ...editingDish, featured: !editingDish.featured });
  };

  return (
    <div className="px-6 py-10 max-w-5xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center text-amber-600">Admin Menu Manager</h1>

      <form 
        onSubmit={handleAddDish}
        className="bg-white shadow-xl rounded-2xl p-6 mb-10 space-y-6 border border-amber-200"
        encType="multipart/form-data"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Dish Name"
            value={menuData.dishName}
            onChange={(e) => setMenuData({ ...menuData, dishName: e.target.value })}
            className="border border-amber-400 rounded-xl p-3 w-full focus:ring-2 focus:ring-amber-500"
          />
          <input
            type="number"
            placeholder="Price"
            value={menuData.price}
            onChange={(e) => setMenuData({ ...menuData, price: Number(e.target.value) })}
            className="border border-amber-400 rounded-xl p-3 w-full focus:ring-2 focus:ring-amber-500"
          />
          <input
            type="text"
            placeholder="Description"
            value={menuData.description}
            onChange={(e) => setMenuData({ ...menuData, description: e.target.value })}
            className="border border-amber-400 rounded-xl p-3 w-full md:col-span-2 focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {imageFile ? imageFile.name : "Upload Image"}
          </button>
          <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-xl transition">
            Add Dish
          </button>
        </div>
      </form>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Current Dishes</h2>
      {dishes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dishes.map((dish) => (
            <div
              key={dish._id}
              className={`bg-white shadow-md rounded-xl p-4 flex gap-4 items-center border relative hover:shadow-lg transition ${
                dish.featured ? "border-amber-500" : "border-gray-200"
              }`}
            >
              {dish.featured && (
                <span className="absolute top-2 right-2 text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">
                  Featured
                </span>
              )}
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}/api/menu/${dish._id}/image`}
                alt={dish.dishName}
                className="w-20 h-20 rounded-md object-cover border border-amber-300"
              />
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-gray-700">{dish.dishName}</h3>
                <p className="text-sm text-gray-500 mb-1">{dish.description}</p>
                <span className="font-semibold text-amber-600">Nrs. {dish.price}</span>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <button
                  onClick={() => setEditingDish(dish)}
                  className="text-blue-500 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleRemoveDish(dish._id)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No dishes found.</p>
      )}

      {/* Edit Modal */}
      {editingDish && (
        console.log(editingDish),
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-lg">
            <h2 className="text-xl font-bold text-gray-700">Edit Dish</h2>
            <div className="flex justify-center">
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}/api/menu/${editingDish._id}/image`}
                alt={editingDish.dishName}
                className="w-56 h-48 rounded-md object-cover border border-amber-300"
              />
            </div>
            <input
              type="text"
              value={editingDish.dishName}
              onChange={(e) => setEditingDish({ ...editingDish, dishName: e.target.value })}
              className="border border-gray-300 w-full p-2 rounded"
              placeholder="Dish Name"
            />
            <input
              type="number"
              value={editingDish.price}
              onChange={(e) => setEditingDish({ ...editingDish, price: Number(e.target.value) })}
              className="border border-gray-300 w-full p-2 rounded"
              placeholder="Price"
            />
            <input
              type="text"
              value={editingDish.description}
              onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
              className="border border-gray-300 w-full p-2 rounded"
              placeholder="Description"
            />
            <div className="flex items-center gap-4">
              <input
                ref={editImageInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => setEditImageFile(e.target.files[0])}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => editImageInputRef.current?.click()}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                {editImageFile ? editImageFile.name : "Change Image"}
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleToggleFeature}
                className={`text-sm px-4 py-1 rounded-full font-semibold transition ${
                  editingDish.featured ? "bg-green-500 text-white" : "bg-gray-300 text-gray-800"
                }`}
              >
                {editingDish.featured ? "Unfeature" : "Feature"}
              </button>
              <button
                onClick={handleSaveEdit}
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditingDish(null)}
                className="text-gray-500 hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
