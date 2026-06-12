import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, UserPlus, Settings, Brain, Bell, Search, Menu, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Auth from './Auth';
import { fetchDrivers } from './api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadDrivers();
    }
  }, [isAuthenticated]);

  const loadDrivers = async () => {
    setLoading(true);
    try {
      const data = await fetchDrivers();
      setDrivers(data);
    } catch (err) {
      console.error("Failed to load drivers", err);
      // Fallback mock data if server fails
      setDrivers([
        { id: 1, first_name: "Sipho", last_name: "Ndlovu", email: "sipho.n@example.com", status: "Interviewing", ai_score: 92, vehicle_type: "Motorcycle" },
        { id: 2, first_name: "Thabo", last_name: "Mbeki", email: "thabo.m@example.com", status: "Pending", ai_score: 85, vehicle_type: "Light Truck" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Auth onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-background text-white flex overflow-hidden">
      
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="w-64 border-r border-white/10 glass flex flex-col hidden md:flex"
          >
            <div className="h-16 flex items-center px-6 border-b border-white/10">
              <Brain className="w-6 h-6 text-primary mr-2" />
              <span className="font-bold text-lg tracking-wide">DriverFleet AI</span>
            </div>
            
            <nav className="flex-1 py-6 px-4 space-y-2">
              <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
              <SidebarItem icon={<Users size={20} />} label="Candidates" />
              <SidebarItem icon={<UserPlus size={20} />} label="Recruitment" />
              <SidebarItem icon={<Settings size={20} />} label="Settings" />
            </nav>
            
            <div className="p-4 border-t border-white/10">
              <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                <LogOut size={20} />
                <span className="text-sm font-medium">Log out</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-white/10 glass flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Menu size={20} />
            </button>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input type="text" placeholder="Search candidates..." className="input-glass pl-9 pr-4 py-1.5 w-64" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#141B2D]" />
            </button>
            <button className="btn-primary">Add Candidate</button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-white/50 text-sm mt-1">Here's what's happening with your recruitment pipeline today.</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard title="Total Candidates" value={drivers.length.toString()} trend="+12%" />
              <StatCard title="In Review" value="45" trend="+5%" />
              <StatCard title="Hired this month" value="18" trend="+2%" />
              <StatCard title="AI Approval Rate" value="76%" trend="-3%" />
            </div>

            {/* AI Insights & List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 glass rounded-xl border border-white/10 overflow-hidden">
                <div className="p-5 border-b border-white/10 flex justify-between items-center">
                  <h2 className="font-semibold">Recent Candidates</h2>
                  <button className="text-xs text-primary hover:text-blue-400" onClick={loadDrivers}>Refresh</button>
                </div>
                <div className="divide-y divide-white/5">
                  {loading ? (
                    <div className="p-8 text-center text-white/50">Loading candidates...</div>
                  ) : drivers.length === 0 ? (
                    <div className="p-8 text-center text-white/50">No candidates found. Add one to get started!</div>
                  ) : drivers.map(driver => (
                    <div key={driver.id} className="p-4 hover:bg-white/[0.02] transition-colors flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-medium">
                          {driver.first_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{driver.first_name} {driver.last_name}</div>
                          <div className="text-xs text-white/50">{driver.vehicle_type} · {driver.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-xs text-white/50 mb-1">AI Score</div>
                          <div className={`text-sm font-bold ${(driver.ai_score || 0) >= 90 ? 'text-accent' : (driver.ai_score || 0) >= 70 ? 'text-blue-400' : 'text-red-400'}`}>
                            {driver.ai_score || '--'}/100
                          </div>
                        </div>
                        <div className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          driver.status === 'Hired' ? 'bg-accent/10 text-accent border-accent/20' :
                          driver.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          driver.status === 'Interviewing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          'bg-white/5 text-white/70 border-white/10'
                        }`}>
                          {driver.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-xl border border-white/10 p-5 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-accent" />
                  <h2 className="font-semibold">AI Assistant</h2>
                </div>
                <div className="flex-1 flex flex-col justify-end bg-black/20 rounded-lg p-4 mb-4 border border-white/5">
                  <div className="text-sm space-y-4">
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center"><Brain className="w-3 h-3 text-primary" /></div>
                      <p className="text-white/80 leading-relaxed bg-white/5 p-3 rounded-tr-lg rounded-br-lg rounded-bl-lg">
                        I've analyzed the recent candidates. The pipeline is looking healthy! Ready to add more candidates to score?
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <input type="text" placeholder="Ask AI about candidates..." className="input-glass w-full pl-4 pr-10 py-2.5" />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary rounded-md text-white hover:bg-blue-600 transition-colors">
                    <Search size={14} />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>

    </div>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${
      active ? 'bg-primary/10 text-primary font-medium' : 'text-white/60 hover:text-white hover:bg-white/5'
    }`}>
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  );
}

function StatCard({ title, value, trend }: { title: string, value: string, trend: string }) {
  const isPositive = trend.startsWith('+');
  return (
    <div className="glass p-5 rounded-xl border border-white/10">
      <div className="text-white/50 text-sm mb-2">{title}</div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold">{value}</div>
        <div className={`text-xs font-medium ${isPositive ? 'text-accent' : 'text-red-400'}`}>{trend}</div>
      </div>
    </div>
  );
}

export default App;
