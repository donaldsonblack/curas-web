import { useState } from 'react';

export default function Dashboard() {
  const [showVisualization, setShowVisualization] = useState(true);

  const toggleVisualization = () => {
    setShowVisualization(!showVisualization);
  };

  return (
    <div className={`min-h-screen bg-slate-50 ${showVisualization ? 'border-4 border-purple-500' : ''}`}>
      {/* Color Legend - Only show in visualization mode */}
      {showVisualization && (
        <div className="bg-yellow-100 border-2 border-yellow-500 p-3 m-2 rounded">
          <h3 className="font-bold text-sm mb-2">🎨 CSS Visualization Legend:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border-2 border-purple-500"></div>
              <span>Main Container</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border-2 border-blue-500"></div>
              <span>Layout Sections</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border-2 border-green-500"></div>
              <span>Content Cards</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border-2 border-red-500"></div>
              <span>Interactive Elements</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`p-4 m-2 rounded ${showVisualization ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white border border-gray-200 shadow-sm'}`}>
        <div className={`flex justify-between items-center p-3 rounded ${showVisualization ? 'bg-blue-50 border border-blue-300' : 'bg-gray-50'}`}>
          <h1 className={`text-2xl font-bold px-3 py-1 rounded ${showVisualization ? 'text-blue-800 bg-white border border-blue-200' : 'text-gray-800'}`}>
            Dashboard UI
          </h1>
          <div className="flex gap-2">
            <button 
              onClick={toggleVisualization}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                showVisualization 
                  ? 'bg-purple-100 border-2 border-purple-500 text-purple-700 hover:bg-purple-200' 
                  : 'bg-blue-500 text-white hover:bg-blue-600 border border-blue-600'
              }`}
            >
              {showVisualization ? '🎨 Hide CSS Viz' : '🔍 Show CSS Viz'}
            </button>
            <button className={`px-4 py-2 rounded transition-colors ${
              showVisualization 
                ? 'bg-red-100 border-2 border-red-500 hover:bg-red-200' 
                : 'bg-gray-100 border border-gray-300 hover:bg-gray-200'
            }`}>
              Profile
            </button>
            <button className={`px-4 py-2 rounded transition-colors ${
              showVisualization 
                ? 'bg-red-100 border-2 border-red-500 hover:bg-red-200' 
                : 'bg-gray-100 border border-gray-300 hover:bg-gray-200'
            }`}>
              Settings
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className={`flex gap-4 m-2 p-2 rounded ${
        showVisualization 
          ? 'border-2 border-blue-500 bg-blue-50' 
          : 'bg-white border border-gray-200 shadow-sm'
      }`}>
        {/* Sidebar */}
        <aside className={`w-64 p-4 rounded ${
          showVisualization 
            ? 'bg-green-100 border-2 border-green-500' 
            : 'bg-gray-50 border border-gray-200'
        }`}>
          <h2 className={`font-bold mb-4 p-2 rounded text-center ${
            showVisualization 
              ? 'bg-green-200 border border-green-400' 
              : 'bg-white border border-gray-300'
          }`}>
            Navigation
          </h2>
          <nav className={`space-y-2 p-3 rounded ${
            showVisualization 
              ? 'bg-green-50 border border-green-300' 
              : 'bg-white'
          }`}>
            {['Dashboard', 'Analytics', 'Users', 'Settings', 'Reports'].map((item) => (
              <div 
                key={item}
                className={`p-3 rounded cursor-pointer transition-colors ${
                  showVisualization 
                    ? 'bg-white border-2 border-red-500 hover:bg-red-50' 
                    : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                <span className={`px-2 py-1 rounded text-sm ${
                  showVisualization 
                    ? 'bg-red-100' 
                    : 'bg-white'
                }`}>{item}</span>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 p-4 rounded ${
          showVisualization 
            ? 'bg-gray-100 border-2 border-blue-500' 
            : 'bg-white border border-gray-200'
        }`}>
          {/* Stats Cards */}
          <section className={`mb-6 p-3 rounded ${
            showVisualization 
              ? 'bg-gray-200 border border-gray-400' 
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <h2 className={`text-lg font-semibold mb-4 p-2 rounded ${
              showVisualization 
                ? 'bg-white border border-gray-300' 
                : 'text-gray-800'
            }`}>
              {showVisualization ? '📊 Key Metrics (Flexbox with Gap)' : '📊 Key Metrics'}
            </h2>
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-3 rounded ${
              showVisualization 
                ? 'bg-gray-50 border border-gray-300' 
                : 'bg-white'
            }`}>
              {[
                { title: 'Total Users', value: '12,345', color: showVisualization ? 'bg-emerald-100 border-emerald-500' : 'bg-white border-gray-200' },
                { title: 'Revenue', value: '$98,765', color: showVisualization ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-200' },
                { title: 'Orders', value: '1,234', color: showVisualization ? 'bg-purple-100 border-purple-500' : 'bg-white border-gray-200' }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className={`${stat.color} ${showVisualization ? 'border-2' : 'border shadow-sm'} p-4 rounded-lg`}
                >
                  <div className={`p-3 rounded ${
                    showVisualization 
                      ? 'bg-white border border-gray-300' 
                      : 'bg-gray-50'
                  }`}>
                    <h3 className={`text-sm font-medium text-gray-600 px-2 py-1 rounded mb-2 ${
                      showVisualization 
                        ? 'bg-gray-100' 
                        : 'bg-white'
                    }`}>
                      {stat.title}
                    </h3>
                    <p className={`text-2xl font-bold px-2 py-1 rounded text-center ${
                      showVisualization 
                        ? 'bg-yellow-100 border border-yellow-300' 
                        : 'text-gray-800'
                    }`}>
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Charts Section */}
          <section className={`mb-6 p-4 rounded ${
            showVisualization 
              ? 'bg-indigo-100 border-2 border-indigo-500' 
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <h2 className={`text-lg font-semibold mb-4 p-2 rounded ${
              showVisualization 
                ? 'bg-white border border-indigo-300' 
                : 'text-gray-800'
            }`}>
              {showVisualization ? '📈 Analytics (CSS Grid Layout)' : '📈 Analytics'}
            </h2>
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 rounded ${
              showVisualization 
                ? 'bg-indigo-50 border border-indigo-300' 
                : 'bg-white'
            }`}>
              {/* Chart 1 */}
              <div className={`p-4 rounded ${
                showVisualization 
                  ? 'bg-green-100 border-2 border-green-500' 
                  : 'bg-white border border-gray-200 shadow-sm'
              }`}>
                <h3 className={`font-medium mb-3 p-2 rounded text-center ${
                  showVisualization 
                    ? 'bg-green-200 border border-green-400' 
                    : 'bg-gray-50 text-gray-700'
                }`}>
                  Sales Trend
                </h3>
                <div className={`h-32 rounded flex items-center justify-center ${
                  showVisualization 
                    ? 'bg-white border-2 border-red-500' 
                    : 'bg-gray-100 border border-gray-300'
                }`}>
                  <div className={`px-4 py-2 rounded ${
                    showVisualization 
                      ? 'bg-red-100 border border-red-300' 
                      : 'bg-white border border-gray-200 text-gray-600'
                  }`}>
                    📊 Chart Placeholder
                  </div>
                </div>
              </div>

              {/* Chart 2 */}
              <div className={`p-4 rounded ${
                showVisualization 
                  ? 'bg-orange-100 border-2 border-orange-500' 
                  : 'bg-white border border-gray-200 shadow-sm'
              }`}>
                <h3 className={`font-medium mb-3 p-2 rounded text-center ${
                  showVisualization 
                    ? 'bg-orange-200 border border-orange-400' 
                    : 'bg-gray-50 text-gray-700'
                }`}>
                  User Growth
                </h3>
                <div className={`h-32 rounded flex items-center justify-center ${
                  showVisualization 
                    ? 'bg-white border-2 border-red-500' 
                    : 'bg-gray-100 border border-gray-300'
                }`}>
                  <div className={`px-4 py-2 rounded ${
                    showVisualization 
                      ? 'bg-red-100 border border-red-300' 
                      : 'bg-white border border-gray-200 text-gray-600'
                  }`}>
                    📈 Chart Placeholder
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Data Table */}
          <section className={`p-4 rounded ${
            showVisualization 
              ? 'bg-pink-100 border-2 border-pink-500' 
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <h2 className={`text-lg font-semibold mb-4 p-2 rounded ${
              showVisualization 
                ? 'bg-white border border-pink-300' 
                : 'text-gray-800'
            }`}>
              {showVisualization ? '📋 Recent Activity (Table Layout)' : '📋 Recent Activity'}
            </h2>
            <div className={`p-3 rounded overflow-x-auto ${
              showVisualization 
                ? 'bg-pink-50 border border-pink-300' 
                : 'bg-white'
            }`}>
              <table className={`w-full rounded ${
                showVisualization 
                  ? 'bg-white border-2 border-green-500' 
                  : 'bg-white border border-gray-300'
              }`}>
                <thead className={`${
                  showVisualization 
                    ? 'bg-green-100 border-b-2 border-green-500' 
                    : 'bg-gray-50 border-b border-gray-200'
                }`}>
                  <tr>
                    {['User', 'Action', 'Date', 'Status'].map((header) => (
                      <th 
                        key={header}
                        className={`text-left p-3 border-r last:border-r-0 ${
                          showVisualization 
                            ? 'bg-green-200 border-green-400' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { user: 'John Doe', action: 'Login', date: '2024-01-15', status: 'Success' },
                    { user: 'Jane Smith', action: 'Purchase', date: '2024-01-15', status: 'Pending' },
                    { user: 'Bob Johnson', action: 'Logout', date: '2024-01-14', status: 'Success' }
                  ].map((row, index) => (
                    <tr key={index} className={`border-b ${
                      showVisualization 
                        ? 'border-green-300 hover:bg-green-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}>
                      <td className={`p-3 border-r ${
                        showVisualization 
                          ? 'bg-red-100 border-red-300 border-2 border-red-500' 
                          : 'border-gray-200'
                      }`}>
                        {row.user}
                      </td>
                      <td className={`p-3 border-r ${
                        showVisualization 
                          ? 'bg-blue-100 border-blue-300 border-2 border-blue-500' 
                          : 'border-gray-200'
                      }`}>
                        {row.action}
                      </td>
                      <td className={`p-3 border-r ${
                        showVisualization 
                          ? 'bg-yellow-100 border-yellow-300 border-2 border-yellow-500' 
                          : 'border-gray-200'
                      }`}>
                        {row.date}
                      </td>
                      <td className={`p-3 ${
                        showVisualization 
                          ? 'bg-purple-100 border-2 border-purple-500' 
                          : ''
                      }`}>
                        <span className={`px-2 py-1 rounded text-sm border ${
                          row.status === 'Success' 
                            ? (showVisualization ? 'bg-green-200 border-green-400' : 'bg-green-100 border-green-300 text-green-800') 
                            : (showVisualization ? 'bg-orange-200 border-orange-400' : 'bg-orange-100 border-orange-300 text-orange-800')
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className={`p-4 m-2 rounded text-center ${
        showVisualization 
          ? 'bg-gray-100 border-2 border-gray-500' 
          : 'bg-white border border-gray-200'
      }`}>
        <div className={`p-3 rounded ${
          showVisualization 
            ? 'bg-gray-200 border border-gray-400' 
            : 'bg-gray-50'
        }`}>
          <p className={`text-sm text-gray-600 px-3 py-1 rounded inline-block ${
            showVisualization 
              ? 'bg-white border border-gray-300' 
              : ''
          }`}>
            © 2024 Dashboard Demo{showVisualization ? ' - CSS Visualization' : ''}
          </p>
        </div>
      </footer>
    </div>
  );
}
