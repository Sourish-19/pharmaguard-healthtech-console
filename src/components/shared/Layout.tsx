import React from 'react';
import Header from './Header'; // Keep Header for status/user context
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';

interface LayoutProps {
    children: React.ReactNode;
}



const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans relative transition-colors duration-300">
            <ScrollToTop watch={location.pathname} />
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-0">
                <Header />
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
