import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Admin() {
  const [name, setName] = useState('');
  const [fatPer100g, setFatPer100g] = useState('');
  const [cholesterolMg, setCholesterolMg] = useState('');
  const [riskLevel, setRiskLevel] = useState('LOW');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/foods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          fat_per_100g: parseFloat(fatPer100g),
          cholesterol_mg: parseInt(cholesterolMg),
          risk_level: riskLevel
        }),
      });

      if (res.ok) {
        setMessage('食物添加成功！');
        // Reset form
        setName('');
        setFatPer100g('');
        setCholesterolMg('');
        setRiskLevel('LOW');
        
        // Redirect to home after 1 second
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setMessage('添加失败，请检查输入');
      }
    } catch (error) {
      console.error('Error adding food:', error);
      setMessage('添加失败，服务器错误');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">清脂管家 (LipidGuard) - 管理后台</h1>
          <Link to="/" className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
            返回首页
          </Link>
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">添加新食物</h2>
          
          {message && (
            <div className="mb-4 p-3 rounded-md bg-green-100 text-green-700">
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                食物名称
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="fatPer100g" className="block text-sm font-medium text-gray-700 mb-1">
                饱和脂肪 (g/100g)
              </label>
              <input
                type="number"
                id="fatPer100g"
                value={fatPer100g}
                onChange={(e) => setFatPer100g(e.target.value)}
                required
                step="0.1"
                min="0"
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="cholesterolMg" className="block text-sm font-medium text-gray-700 mb-1">
                胆固醇 (mg/100g)
              </label>
              <input
                type="number"
                id="cholesterolMg"
                value={cholesterolMg}
                onChange={(e) => setCholesterolMg(e.target.value)}
                required
                min="0"
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="riskLevel" className="block text-sm font-medium text-gray-700 mb-1">
                风险等级
              </label>
              <select
                id="riskLevel"
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="LOW">绿灯 (低风险)</option>
                <option value="MEDIUM">黄灯 (中风险)</option>
                <option value="HIGH">红灯 (高风险)</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors h-12"
            >
              添加食物
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Admin;
