import React, { useEffect, useState, useRef } from 'react';
import { useMenuStore } from '../store/menu.js'; // relative to your new project

const AdminPage = () => {
  const fileInputRef = useRef(null);
  const { dishes, createDish, fetchDishes, deleteDish, toggleFeaturedDish } = useMenuStore();

  const [menuData, setMenuData] = useState({ dishName: "", price: "", description: "" });
  const [imageFile, setImageFile] = useState(null);

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

  return (
    <div className="px-6 py-10 max-w-5xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center text-amber-600">Admin Menu Manager</h1>

      {/* Form */}
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

      {/* Dish Cards */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Current Dishes</h2>
      {dishes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dishes.map((dish) => (
            <div key={dish._id} className="bg-white shadow-md rounded-xl p-4 flex gap-4 items-center border relative hover:shadow-lg transition">
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
                  onClick={() => toggleFeaturedDish(dish._id, dish.featured)}
                  className={`text-sm px-3 py-1 rounded-full font-semibold shadow-sm transition ${
                    dish.featured ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {dish.featured ? "Unfeature" : "Feature"}
                </button>
                <button onClick={() => handleRemoveDish(dish._id)} className="text-red-500 hover:underline text-sm">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No dishes found.</p>
      )}
    </div>
  );
};

export default AdminPage;
