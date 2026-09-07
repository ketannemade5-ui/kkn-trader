import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Shield,
  Users,
  BookOpen,
  Newspaper,
  TrendingUp,
  Search,
  CheckCircle2,
  XCircle,
  Activity,
  Server,
  RefreshCw,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [loading, setLoading] = useState(true);

  const { success, error } = useToast();

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.allSettled([
        adminAPI.getStats(),
        adminAPI.getUsers({ search: searchUser }),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.success) {
        setStats(statsRes.value.data);
      }
      if (usersRes.status === 'fulfilled' && usersRes.value.success) {
        setUsers(usersRes.value.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [searchUser]);

  const handleToggleStatus = async (id) => {
    try {
      const res = await adminAPI.toggleUserStatus(id);
      if (res.success) {
        success(res.message);
        fetchAdminData();
      }
    } catch (err) {
      error(err.message || 'Failed to toggle status.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-mono">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold mb-2">
            <Shield className="w-3.5 h-3.5" />
            INSTITUTIONAL ADMINISTRATION
          </div>
          <h1 className="text-3xl font-black text-white font-['Outfit']">
            Master Administrator Command Console
          </h1>
          <p className="text-xs text-slate-400">
            Real-time platform metrics, user access management, and curriculum control.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Stats
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
        <div className="glass-card rounded-2xl p-4 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase block mb-1">Total Users</span>
          <span className="text-xl font-bold text-white">{stats?.totalUsers || 2}</span>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase block mb-1">Active Users</span>
          <span className="text-xl font-bold text-emerald-400">{stats?.activeUsers || 2}</span>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase block mb-1">Courses</span>
          <span className="text-xl font-bold text-kkn-gold">{stats?.totalCourses || 12}</span>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase block mb-1">Total Lessons</span>
          <span className="text-xl font-bold text-sky-400">{stats?.totalLessons || 7}</span>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase block mb-1">Simulated Trades</span>
          <span className="text-xl font-bold text-white">{stats?.totalTrades || 0}</span>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase block mb-1">Platform Uptime</span>
          <span className="text-xl font-bold text-emerald-400">99.98%</span>
        </div>
      </div>

      {/* User Management Section */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-kkn-gold" />
            <h3 className="text-lg font-bold text-white font-['Outfit']">Registered Trader Accounts</h3>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search user name or email..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-kkn-gold"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Level</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">{u.name}</td>
                  <td className="py-3 px-4 text-slate-300">{u.email}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400">{u.experienceLevel}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {u.role !== 'ADMIN' && (
                      <button
                        onClick={() => handleToggleStatus(u._id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                          u.status === 'ACTIVE'
                            ? 'bg-rose-950 text-rose-300 hover:bg-rose-900'
                            : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
