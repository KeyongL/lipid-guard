import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import FoodInput from './components/FoodInput';
import FoodList from './components/FoodList';
import LogList from './components/LogList';
import FoodLibrary from './components/FoodLibrary';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/food-library" element={<FoodLibrary />} />
      </Routes>
    </Router>
  );
}

function HomePage() {
  const [foods, setFoods] = useState([]);
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState({ total_fat: 0, daily_limit: 20 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [foodsRes, logsRes] = await Promise.all([
        fetch('/api/foods'),
        fetch('/api/logs')
      ]);

      const foodsData = await foodsRes.json();
      let logsData = await logsRes.json();
      
      // Fix log dates for today's logs and calculate summary locally
      const today = new Date().toISOString().split('T')[0];
      // Filter logs to only include today's entries (using frontend date)
      const todayLogs = logsData.filter(log => {
        const logDate = new Date(log.log_date).toISOString().split('T')[0];
        return logDate === today;
      });
      // Calculate initial summary for today
      const initialTotalFat = todayLogs.reduce((sum, log) => sum + (log.actual_fat || 0), 0);
      
      setFoods(foodsData);
      setLogs(logsData);
      setSummary({
        total_fat: initialTotalFat,
        daily_limit: 20
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set default summary if there's an error
      setSummary({
        total_fat: 0,
        daily_limit: 20
      });
      setLoading(false);
    }
  };

  const addLog = async (foodId, actualFat) => {
    try {
      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ food_id: foodId, actual_fat: actualFat }),
      });

      const newLog = await res.json();
      // Add current date to the log for correct frontend filtering
      const today = new Date().toISOString().split('T')[0];
      const logWithCorrectDate = {
        ...newLog,
        log_date: today
      };
      
      setLogs([logWithCorrectDate, ...logs]);
      // Recalculate summary locally based on logs with correct date
      const todayLogs = [...logs, logWithCorrectDate].filter(log => {
        const logDate = new Date(log.log_date).toISOString().split('T')[0];
        return logDate === today;
      });
      const totalFat = todayLogs.reduce((sum, log) => sum + (log.actual_fat || 0), 0);
      setSummary({
        total_fat: totalFat,
        daily_limit: 20
      });
    } catch (error) {
      console.error('Error adding log:', error);
    }
  };

  const deleteLog = async (id) => {
    try {
      // Delete from server
      const res = await fetch(`/api/logs/${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        // Update local state
        setLogs(logs.filter(log => log.id !== id));
        // Recalculate summary after deletion
        const today = new Date().toISOString().split('T')[0];
        const todayLogs = logs.filter(log => {
          const logDate = new Date(log.log_date).toISOString().split('T')[0];
          return logDate === today && log.id !== id;
        });
        const totalFat = todayLogs.reduce((sum, log) => sum + (log.actual_fat || 0), 0);
        setSummary({
          total_fat: totalFat,
          daily_limit: 20
        });
      }
    } catch (error) {
      console.error('Error deleting log:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-2xl font-bold mb-4 md:mb-0">清脂管家 (LipidGuard)</h1>
            <nav className="flex gap-4">
              <Link 
                to="/" 
                className="bg-white text-blue-600 px-4 py-3 rounded-md hover:bg-gray-100 transition-colors h-12 flex items-center justify-center"
              >
                首页
              </Link>
              <Link 
                to="/food-library" 
                className="bg-white text-blue-600 px-4 py-3 rounded-md hover:bg-gray-100 transition-colors h-12 flex items-center justify-center"
              >
                食物库管理
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto p-4">
        <Dashboard summary={summary} />
        <FoodInput foods={foods} onAddLog={addLog} />
        <FoodList foods={foods} />
        
        {/* Today's Logs List */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">今日已吃列表</h2>
          
          {logs.filter(log => {
            const logDate = new Date(log.log_date).toISOString().split('T')[0];
            const today = new Date().toISOString().split('T')[0];
            return logDate === today;
          }).length === 0 ? (
            <p className="text-gray-500 text-center py-4">今日暂无记录</p>
          ) : (
            <div className="space-y-3">
              {logs.filter(log => {
                const logDate = new Date(log.log_date).toISOString().split('T')[0];
                const today = new Date().toISOString().split('T')[0];
                return logDate === today;
              }).map(log => (
                <div key={log.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                  <div>
                    <p className="font-medium">{new Date(log.created_at).toLocaleTimeString()}</p>
                    <p className="text-sm text-gray-500">{log.actual_fat.toFixed(1)}g 饱和脂肪</p>
                  </div>
                  <button
                    onClick={() => deleteLog(log.id)}
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
      </main>
    </div>
  );
}

export default App;
