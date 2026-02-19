import React from 'react';


const Header = () => (
    <header className="h-16 border-b border-cyan-500/30 flex items-center justify-between px-8 pr-32 bg-[#020617] sticky top-0 z-40 transition-colors duration-300">
        <div className="flex items-center gap-4 text-[10px] font-mono font-bold tracking-widest text-slate-400">
            <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <span className="text-emerald-500">SYSTEM ONLINE</span>
            </span>
            <span className="opacity-20 text-cyan-500">|</span>
            <span className="text-cyan-500">v2.4.1-RC</span>
        </div>


    </header>
);

export default Header;
