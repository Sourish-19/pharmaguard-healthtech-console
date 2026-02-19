import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Bell, Shield, ChevronRight, Key, CreditCard, HelpCircle, Mail, Smartphone } from 'lucide-react';
import { gsap } from 'gsap';

const SettingsPage = () => {
    const navigate = useNavigate();
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

    useEffect(() => {
        gsap.fromTo(".settings-item",
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }
        );
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/auth');
    };

    const toggleExpand = (label: string) => {
        setExpandedItem(expandedItem === label ? null : label);
    };

    const sections = [
        {
            title: "Account",
            items: [
                {
                    icon: User,
                    label: "Profile",
                    desc: "Manage your personal information",
                    active: true,
                    content: (
                        <div className="space-y-6 pt-4">
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-white tracking-wide">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                        <User size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        defaultValue="Dr. Sarah Connor"
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:bg-slate-900 transition-all hover:border-slate-700"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-white tracking-wide">Email</label>
                                <input
                                    type="email"
                                    defaultValue="doctor@clinic.com"
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-900 transition-all hover:border-slate-700"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-white tracking-wide">Password</label>
                                <input
                                    type="password"
                                    defaultValue="........"
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-900 transition-all hover:border-slate-700 font-mono tracking-widest"
                                />
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button className="px-4 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg text-xs font-bold hover:bg-cyan-500 hover:text-black transition-all">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )
                },
                { icon: Key, label: "API Keys", desc: "Manage access tokens", active: false }
            ]
        },
        {
            title: "Support",
            items: [
                {
                    icon: HelpCircle,
                    label: "Help Center",
                    desc: "Documentation and FAQ",
                    active: true,
                    content: (
                        <div className="space-y-4 pt-4 text-sm text-slate-400">
                            <div>
                                <h4 className="text-white font-bold mb-1">How do I upload a VCF file?</h4>
                                <p>Navigate to the <strong>Intake Hub</strong> and drag-and-drop your .vcf or .vcf.gz file into the upload zone. Ensure your file is under 50MB.</p>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-1">What is the Confidence Score?</h4>
                                <p>The score (0-100%) indicates the certainty of our AI's variant call, based on read depth, quality metrics, and known database matches.</p>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-1">Supported Guidelines</h4>
                                <p>PrecisionRx strictly adherest to CPIC and DPWG guidelines for all clinical recommendations.</p>
                            </div>
                        </div>
                    )
                },
                {
                    icon: Mail,
                    label: "Contact Support",
                    desc: "Get help from our team",
                    active: true,
                    content: (
                        <div className="space-y-4 pt-4 text-sm text-slate-400">
                            <p>For technical issues, account access, or API integration support:</p>
                            <div className="bg-slate-900/50 p-3 rounded border border-slate-800 font-mono text-cyan-400">
                                support@precisionrx.gen
                            </div>
                            <p>For urgent clinical interpretation discrepancies, please page the on-call geneticist:</p>
                            <div className="flex items-center gap-2 text-white">
                                <Smartphone size={16} />
                                <span>Dr. Chen (Ext. 404)</span>
                            </div>
                            <p className="text-xs text-slate-600 mt-2">Operating Hours: Mon-Fri, 08:00 - 18:00 EST</p>
                        </div>
                    )
                }
            ]
        }
    ];

    return (
        <div className="h-full overflow-y-auto custom-scrollbar bg-[#020617] p-6">
            <div className="max-w-3xl mx-auto space-y-8 pb-12">

                {/* Header */}
                <div className="pb-6 border-b border-slate-800">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
                        <p className="text-slate-400 text-sm">Manage your account and preferences.</p>
                    </div>
                </div>

                {/* Settings Sections */}
                <div className="space-y-8">
                    {sections.map((section, idx) => (
                        <div key={idx} className="settings-item">
                            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 pl-2">{section.title}</h2>
                            <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
                                {section.items.map((item: any, i) => (
                                    <div key={i} className="border-b border-slate-800 last:border-0 transition-colors">
                                        <div
                                            onClick={() => item.active && item.content && toggleExpand(item.label)}
                                            className={`flex items-center gap-4 p-4 ${item.active ? 'hover:bg-slate-800/50 cursor-pointer' : 'opacity-50 cursor-not-allowed'
                                                }`}
                                        >
                                            <div className="text-slate-400">
                                                <item.icon size={18} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-sm font-medium text-slate-200">{item.label}</h3>
                                                <p className="text-xs text-slate-500">{item.desc}</p>
                                            </div>
                                            {item.active ? (
                                                <ChevronRight
                                                    size={14}
                                                    className={`text-slate-600 transition-transform duration-300 ${expandedItem === item.label ? 'rotate-90' : ''}`}
                                                />
                                            ) : (
                                                <span className="text-[10px] font-bold bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded">SOON</span>
                                            )}
                                        </div>

                                        {/* Expandable Content */}
                                        {item.content && expandedItem === item.label && (
                                            <div className="px-14 pb-6 animate-in slide-in-from-top-2 fade-in duration-200">
                                                {item.content}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Logout Action */}
                <div className="settings-item pt-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors text-sm font-medium px-2 py-1"
                    >
                        <LogOut size={16} />
                        Log Out
                    </button>
                    <p className="mt-4 text-[10px] text-slate-600 font-mono px-2">
                        PrecisionRx v2.4.1 • All systems operational
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
