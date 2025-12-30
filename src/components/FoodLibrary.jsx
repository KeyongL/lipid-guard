import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function FoodLibrary() {
  const [foods, setFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFood, setNewFood] = useState({
    name: '',
    fat_per_100g: '',
    cholesterol_mg: '',
    risk_level: 'LOW'
  });
  const [message, setMessage] = useState('');

  // Fetch all foods on component mount
  useEffect(() => {
    fetchFoods();
  }, []);

  // Fetch foods based on search query
  useEffect(() => {
    if (searchQuery) {
      searchFoods();
    } else {
      fetchFoods();
    }
  }, [searchQuery]);

  const fetchFoods = async () => {
    try {
      const res = await fetch('/api/foods');
      const data = await res.json();
      setFoods(data);
    } catch (error) {
      console.error('Error fetching foods:', error);
    }
  };

  const searchFoods = async () => {
    try {
      const res = await fetch(`/api/foods/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setFoods(data);
    } catch (error) {
      console.error('Error searching foods:', error);
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/foods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newFood,
          fat_per_100g: parseFloat(newFood.fat_per_100g),
          cholesterol_mg: parseInt(newFood.cholesterol_mg)
        }),
      });

      if (res.ok) {
        setMessage('食物添加成功！');
        // Reset form
        setNewFood({
          name: '',
          fat_per_100g: '',
          cholesterol_mg: '',
          risk_level: 'LOW'
        });
        setShowAddForm(false);
        fetchFoods();
        
        // Clear message after 2 seconds
        setTimeout(() => {
          setMessage('');
        }, 2000);
      } else {
        setMessage('添加失败，请检查输入');
      }
    } catch (error) {
      console.error('Error adding food:', error);
      setMessage('添加失败，服务器错误');
    }
  };

  const handleDeleteFood = async (id, name) => {
    if (window.confirm(`确定要删除食物 "${name}" 吗？相关记录也会被删除。`)) {
      try {
        const res = await fetch(`/api/foods/${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          setMessage('食物删除成功！');
          fetchFoods();
          
          // Clear message after 2 seconds
          setTimeout(() => {
            setMessage('');
          }, 2000);
        } else {
          setMessage('删除失败');
        }
      } catch (error) {
        console.error('Error deleting food:', error);
        setMessage('删除失败，服务器错误');
      }
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskText = (level) => {
    switch (level) {
      case 'HIGH': return '🔴 高风险';
      case 'MEDIUM': return '🟡 中风险';
      case 'LOW': return '🟢 低风险';
      default: return '⚠️ 未知';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">清脂管家 (LipidGuard) - 食物库管理</h1>
          <Link 
            to="/" 
            className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors h-12 flex items-center"
          >
            返回首页
          </Link>
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="搜索食物..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors h-12 flex items-center justify-center"
            >
              {showAddForm ? '取消添加' : '添加新食物'}
            </button>
          </div>
        </div>

        {/* Add Food Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">添加新食物</h2>
            
            {message && (
              <div className="mb-4 p-3 rounded-md bg-green-100 text-green-700">
                {message}
              </div>
            )}
            
            <form onSubmit={handleAddFood} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  食物名称
                </label>
                <input
                  type="text"
                  id="name"
                  value={newFood.name}
                  onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="fat_per_100g" className="block text-sm font-medium text-gray-700 mb-1">
                  饱和脂肪 (g/100g)
                </label>
                <input
                  type="number"
                  id="fat_per_100g"
                  value={newFood.fat_per_100g}
                  onChange={(e) => setNewFood({...newFood, fat_per_100g: e.target.value})}
                  required
                  step="0.1"
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="cholesterol_mg" className="block text-sm font-medium text-gray-700 mb-1">
                  胆固醇 (mg/100g)
                </label>
                <input
                  type="number"
                  id="cholesterol_mg"
                  value={newFood.cholesterol_mg}
                  onChange={(e) => setNewFood({...newFood, cholesterol_mg: e.target.value})}
                  required
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="risk_level" className="block text-sm font-medium text-gray-700 mb-1">
                  风险等级
                </label>
                <select
                  id="risk_level"
                  value={newFood.risk_level}
                  onChange={(e) => setNewFood({...newFood, risk_level: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-md"
                >
                  <option value="LOW">🟢 低风险</option>
                  <option value="MEDIUM">🟡 中风险</option>
                  <option value="HIGH">🔴 高风险</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors h-12"
                >
                  保存食物
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Foods Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">食物列表</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left">ID</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">食物名称</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">饱和脂肪 (g/100g)</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">胆固醇 (mg/100g)</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">风险等级</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">操作</th>
                </tr>
              </thead>
              <tbody>
                {foods.map(food => (
                  <tr key={food.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">{food.id}</td>
                    <td className="border border-gray-300 px-4 py-3 font-medium">{food.name}</td>
                    <td className="border border-gray-300 px-4 py-3">{food.fat_per_100g}</td>
                    <td className="border border-gray-300 px-4 py-3">{food.cholesterol_mg}</td>
                    <td className="border border-gray-300 px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded text-sm ${getRiskColor(food.risk_level)}`}>
                        {getRiskText(food.risk_level)}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      <button
                        onClick={() => handleDeleteFood(food.id, food.name)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                        aria-label="删除食物"
                      >
                        🗑️ 删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {foods.length === 0 && (
            <p className="text-gray-500 text-center py-4">没有找到食物</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default FoodLibrary;
