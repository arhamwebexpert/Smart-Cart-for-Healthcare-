import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const Layout = ({ onLogout }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Sticky Navigation Header */}
            <header className="bg-gradient-to-r from-indigo-900 via-gray-800 to-black text-white sticky top-0 z-50 shadow-lg">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    {/* Logo / Brand */}
                    <NavLink
                        to="/dashboard"
                        className="text-2xl font-extrabold tracking-wide hover:text-indigo-300 transition-colors"
                    >
                        Smart Scanner
                    </NavLink>
                    {/* Mobile Hamburger Button */}
                    <button
                        className="md:hidden p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        )}
                    </button>

                    {/* Navigation Links */}
                    <nav
                        className={`flex-col md:flex-row md:flex md:items-center md:space-x-6 absolute md:static top-full left-0 w-full md:w-auto bg-black md:bg-transparent transition-transform duration-300 transform ${menuOpen ? 'translate-y-0' : '-translate-y-full md:translate-y-0'
                            }`}
                    >
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                `block px-6 py-3 md:py-0 text-center md:text-left font-medium transition-colors hover:text-indigo-300 ${isActive ? 'text-indigo-300' : 'text-white'
                                }`
                            }
                            onClick={() => setMenuOpen(false)}
                        >
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="/Analysis"
                            className={({ isActive }) =>
                                `block px-6 py-3 md:py-0 text-center md:text-left font-medium transition-colors hover:text-indigo-300 ${isActive ? 'text-indigo-300' : 'text-white'
                                }`
                            }
                            onClick={() => setMenuOpen(false)}
                        >
                            Analysis
                        </NavLink>

                        <button
                            onClick={() => {
                                setMenuOpen(false);
                                onLogout();
                            }}
                            className="block px-6 py-3 md:py-0 text-center md:text-left font-medium text-white hover:text-red-400 transition-colors"
                        >
                            Sign Out
                        </button>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-6 py-8 bg-white shadow-inner rounded-t-md">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-4 text-center">
                <div className="container mx-auto">
                    <p>© {new Date().getFullYear()} Smart Scanner. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
