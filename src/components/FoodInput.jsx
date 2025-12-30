import React, { useState } from 'react';

function FoodInput({ foods, onAddLog }) {
  const [selectedFood, setSelectedFood] = useState('');
  const [quantity, setQuantity] = useState(100);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedFood) {
      alert('请选择食物');
      return;
    }

    const food = foods.find(f => f.id === parseInt(selectedFood));
    if (!food) return;

    // Calculate actual fat based on quantity (fat per 100g)
    const actualFat = (food.fat_per_100g * quantity) / 100;
    
    onAddLog(food.id, actualFat);
    
    // Reset form
    setSelectedFood('');
    setQuantity(100);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">记吃</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="food" className="block text-sm font-medium text-gray-700 mb-1">
            选择食物
          </label>
          <select
            id="food"
            value={selectedFood}
            onChange={(e) => setSelectedFood(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">-- 请选择 --</option>
            {foods.map(food => (
              <option key={food.id} value={food.id}>
                {food.name} ({food.fat_per_100g}g 饱和脂肪/100g)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            分量 (g)
          </label>
          <input
            type="number"
            id="quantity"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors h-12"
          >
            记录
          </button>
        </div>
      </form>
    </div>
  );
}

export default FoodInput;
