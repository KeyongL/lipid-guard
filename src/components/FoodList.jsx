import React from 'react';

function FoodList({ foods }) {
  // Group foods by risk level
  const highRisk = foods.filter(food => food.risk_level === 'HIGH');
  const mediumRisk = foods.filter(food => food.risk_level === 'MEDIUM');
  const lowRisk = foods.filter(food => food.risk_level === 'LOW');

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
      case 'HIGH': return '红灯 (高风险)';
      case 'MEDIUM': return '黄灯 (中风险)';
      case 'LOW': return '绿灯 (低风险)';
      default: return '未知';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">食物红黑榜</h2>
      
      {/* Low Risk (Green) */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
          绿灯行 (低风险)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {lowRisk.map(food => (
            <div key={food.id} className={`p-3 rounded-md ${getRiskColor(food.risk_level)}`}>
              <div className="font-medium">{food.name}</div>
              <div className="text-sm">{food.fat_per_100g}g 饱和脂肪/100g</div>
            </div>
          ))}
        </div>
      </div>

      {/* Medium Risk (Yellow) */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full"></span>
          黄灯停 (中风险)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {mediumRisk.map(food => (
            <div key={food.id} className={`p-3 rounded-md ${getRiskColor(food.risk_level)}`}>
              <div className="font-medium">{food.name}</div>
              <div className="text-sm">{food.fat_per_100g}g 饱和脂肪/100g</div>
            </div>
          ))}
        </div>
      </div>

      {/* High Risk (Red) */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
          红灯停 (高风险)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {highRisk.map(food => (
            <div key={food.id} className={`p-3 rounded-md ${getRiskColor(food.risk_level)}`}>
              <div className="font-medium">{food.name}</div>
              <div className="text-sm">{food.fat_per_100g}g 饱和脂肪/100g</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FoodList;
