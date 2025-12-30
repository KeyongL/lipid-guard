import React from 'react';

function LogList({ logs, onDeleteLog, onUpdate }) {
  // Filter logs to only show today's records
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter(log => {
    const logDate = new Date(log.log_date).toISOString().split('T')[0];
    return logDate === today;
  });

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/logs/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        onDeleteLog(id);
        onUpdate();
      }
    } catch (error) {
      console.error('Error deleting log:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">今日记录</h2>
      
      {todayLogs.length === 0 ? (
        <p className="text-gray-500 text-center py-4">今日暂无记录</p>
      ) : (
        <div className="space-y-3">
          {todayLogs.map(log => (
            <div key={log.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
              <div>
                <p className="font-medium">{new Date(log.created_at).toLocaleTimeString()}</p>
                <p className="text-sm text-gray-500">{log.actual_fat.toFixed(1)}g 饱和脂肪</p>
              </div>
              <button
                onClick={() => handleDelete(log.id)}
                className="text-red-500 hover:text-red-700 transition-colors p-2"
                aria-label="删除记录"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LogList;
