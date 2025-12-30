import React from 'react';

function Dashboard({ summary }) {
  // Get total fat from summary endpoint
  const totalFat = summary.total_fat || 0;
  const dailyLimit = summary.daily_limit || 20;
  const percentage = Math.min((totalFat / dailyLimit) * 100, 100);

  // Determine color based on percentage
  let colorClass = 'bg-green-500';
  if (percentage > 75) {
    colorClass = 'bg-red-500';
  } else if (percentage > 50) {
    colorClass = 'bg-yellow-500';
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">今日仪表盘</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">饱和脂肪</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold">{totalFat.toFixed(1)}g</span>
            <span className="text-gray-500">/ {dailyLimit}g</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className={`h-4 rounded-full ${colorClass} transition-all duration-300`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {percentage > 100 ? '已超过每日限量' : `${percentage.toFixed(0)}% 已使用`}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">热量</h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">--</span>
            <span className="text-gray-500">/ --</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">功能开发中</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">胆固醇</h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">--</span>
            <span className="text-gray-500">/ --</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">功能开发中</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
