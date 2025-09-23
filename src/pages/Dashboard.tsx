export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 border-4 border-purple-500">
      {/* Color Legend */}
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

      {/* Header */}
      <header className="bg-blue-100 border-2 border-blue-500 p-4 m-2 rounded">
        <div className="flex justify-between items-center bg-blue-50 border border-blue-300 p-3 rounded">
          <h1 className="text-2xl font-bold text-blue-800 bg-white border border-blue-200 px-3 py-1 rounded">
            Dashboard UI
          </h1>
          <div className="flex gap-2">
            <button className="bg-red-100 border-2 border-red-500 px-4 py-2 rounded hover:bg-red-200 transition-colors">
              Profile
            </button>
            <button className="bg-red-100 border-2 border-red-500 px-4 py-2 rounded hover:bg-red-200 transition-colors">
              Settings
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex gap-4 m-2 border-2 border-blue-500 bg-blue-50 p-2 rounded">
        {/* Sidebar */}
        <aside className="w-64 bg-green-100 border-2 border-green-500 p-4 rounded">
          <h2 className="font-bold mb-4 bg-green-200 border border-green-400 p-2 rounded text-center">
            Navigation
          </h2>
          <nav className="space-y-2 bg-green-50 border border-green-300 p-3 rounded">
            {['Dashboard', 'Analytics', 'Users', 'Settings', 'Reports'].map((item) => (
              <div 
                key={item}
                className="bg-white border-2 border-red-500 p-3 rounded hover:bg-red-50 cursor-pointer transition-colors"
              >
                <span className="bg-red-100 px-2 py-1 rounded text-sm">{item}</span>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 border-2 border-blue-500 p-4 rounded">
          {/* Stats Cards */}
          <section className="mb-6 bg-gray-200 border border-gray-400 p-3 rounded">
            <h2 className="text-lg font-semibold mb-4 bg-white border border-gray-300 p-2 rounded">
              📊 Key Metrics (Flexbox with Gap)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 border border-gray-300 p-3 rounded">
              {[
                { title: 'Total Users', value: '12,345', color: 'bg-emerald-100 border-emerald-500' },
                { title: 'Revenue', value: '$98,765', color: 'bg-blue-100 border-blue-500' },
                { title: 'Orders', value: '1,234', color: 'bg-purple-100 border-purple-500' }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className={`${stat.color} border-2 p-4 rounded-lg`}
                >
                  <div className="bg-white border border-gray-300 p-3 rounded">
                    <h3 className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded mb-2">
                      {stat.title}
                    </h3>
                    <p className="text-2xl font-bold bg-yellow-100 border border-yellow-300 px-2 py-1 rounded text-center">
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Charts Section */}
          <section className="mb-6 bg-indigo-100 border-2 border-indigo-500 p-4 rounded">
            <h2 className="text-lg font-semibold mb-4 bg-white border border-indigo-300 p-2 rounded">
              📈 Analytics (CSS Grid Layout)
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-indigo-50 border border-indigo-300 p-4 rounded">
              {/* Chart 1 */}
              <div className="bg-green-100 border-2 border-green-500 p-4 rounded">
                <h3 className="font-medium mb-3 bg-green-200 border border-green-400 p-2 rounded text-center">
                  Sales Trend
                </h3>
                <div className="h-32 bg-white border-2 border-red-500 rounded flex items-center justify-center">
                  <div className="bg-red-100 border border-red-300 px-4 py-2 rounded">
                    📊 Chart Placeholder
                  </div>
                </div>
              </div>

              {/* Chart 2 */}
              <div className="bg-orange-100 border-2 border-orange-500 p-4 rounded">
                <h3 className="font-medium mb-3 bg-orange-200 border border-orange-400 p-2 rounded text-center">
                  User Growth
                </h3>
                <div className="h-32 bg-white border-2 border-red-500 rounded flex items-center justify-center">
                  <div className="bg-red-100 border border-red-300 px-4 py-2 rounded">
                    📈 Chart Placeholder
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Data Table */}
          <section className="bg-pink-100 border-2 border-pink-500 p-4 rounded">
            <h2 className="text-lg font-semibold mb-4 bg-white border border-pink-300 p-2 rounded">
              📋 Recent Activity (Table Layout)
            </h2>
            <div className="bg-pink-50 border border-pink-300 p-3 rounded overflow-x-auto">
              <table className="w-full bg-white border-2 border-green-500 rounded">
                <thead className="bg-green-100 border-b-2 border-green-500">
                  <tr>
                    {['User', 'Action', 'Date', 'Status'].map((header) => (
                      <th 
                        key={header}
                        className="text-left p-3 bg-green-200 border-r border-green-400 last:border-r-0"
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
                    <tr key={index} className="border-b border-green-300 hover:bg-green-50">
                      <td className="p-3 bg-red-100 border-r border-red-300 border-2 border-red-500">
                        {row.user}
                      </td>
                      <td className="p-3 bg-blue-100 border-r border-blue-300 border-2 border-blue-500">
                        {row.action}
                      </td>
                      <td className="p-3 bg-yellow-100 border-r border-yellow-300 border-2 border-yellow-500">
                        {row.date}
                      </td>
                      <td className="p-3 bg-purple-100 border-2 border-purple-500">
                        <span className={`px-2 py-1 rounded text-sm border ${
                          row.status === 'Success' 
                            ? 'bg-green-200 border-green-400' 
                            : 'bg-orange-200 border-orange-400'
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
      <footer className="bg-gray-100 border-2 border-gray-500 p-4 m-2 rounded text-center">
        <div className="bg-gray-200 border border-gray-400 p-3 rounded">
          <p className="text-sm text-gray-600 bg-white border border-gray-300 px-3 py-1 rounded inline-block">
            © 2024 Dashboard Demo - CSS Visualization
          </p>
        </div>
      </footer>
    </div>
  );
}
