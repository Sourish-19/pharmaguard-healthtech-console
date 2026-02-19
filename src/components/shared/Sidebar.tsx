import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Database, LayoutDashboard, Activity, Menu, X, ChevronRight, Settings } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const links = [
        { path: '/intake', icon: <Database size={20} />, label: 'Intake Hub' },
        { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Clinical Dashboard' },
        { path: '/deep-dive', icon: <Activity size={20} />, label: 'Deep-Dive Console' },
        { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
    ];

    return (
        <aside className={`h-screen sticky top-0 bg-[#020617]/80 backdrop-blur-xl border-r border-cyan-500/30 transition-all duration-300 z-50 flex flex-col ${collapsed ? 'w-20' : 'w-72'} shadow-2xl`}>
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-4 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none"></div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20 relative z-10">
                    <Activity className="text-white" size={22} />
                </div>
                {!collapsed && (
                    <div className="flex flex-col relative z-10">
                        <span className="font-bold text-xl tracking-tight text-white leading-none">PharmaGuard</span>
                        <span className="text-[10px] text-cyan-500 font-mono tracking-widest uppercase mt-1">Enterprise v2.4</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="mt-6 flex-1 px-4 space-y-2">
                {links.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
                                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 shadow-[0_0_10px_#06b6d4]"></div>}

                            <span className={`relative z-10 ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400 transition-colors'}`}>
                                {link.icon}
                            </span>

                            {!collapsed && (
                                <span className="font-medium whitespace-nowrap relative z-10 text-sm tracking-wide">
                                    {link.label}
                                </span>
                            )}

                            {isActive && !collapsed && (
                                <ChevronRight size={14} className="ml-auto text-cyan-500 animate-pulse relative z-10" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile / Collapse */}
            <div className={`border-t border-cyan-500/30 bg-black/20 ${collapsed ? 'p-4' : 'p-6'}`}>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={`w-full flex items-center py-3 text-slate-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg ${collapsed ? 'justify-center' : 'gap-4 px-4'}`}
                >
                    {collapsed ? <Menu size={20} /> : (
                        <>
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-400">
                                JD
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-bold text-white">Dr. John Doe</p>
                                <p className="text-[10px] text-slate-500">Chief Geneticist</p>
                            </div>
                            <X size={16} className="ml-auto opacity-50" />
                        </>
                    )}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
