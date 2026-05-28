import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, GraduationCap, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Courses', to: '/courses' },
  { label: 'Faculty', to: '/faculty' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Blog', to: '/blog' },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenu(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-navy-900 shadow-xl' : 'bg-navy-900/95 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
            <div className="w-9 h-9 bg-gold-500 rounded-lg flex items-center justify-center group-hover:bg-gold-400 transition-colors">
              <GraduationCap className="w-5 h-5 text-navy-900" />
            </div>
            <div className="leading-tight">
              <p className="text-white font-bold text-sm font-serif">Shreya Commerce</p>
              <p className="text-gold-400 text-xs font-medium">Classes</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                    isActive ? 'text-gold-400 bg-navy-800' : 'text-gray-300 hover:text-gold-400 hover:bg-navy-800'
                  }`
                }
              >{link.label}</NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/admission" className="btn-primary py-2 px-4 text-sm">
              Apply Now
            </Link>
            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 text-gray-300 hover:text-gold-400 transition-colors">
                  <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center text-navy-900 font-bold text-sm">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {userMenu && (
                  <div className="absolute right-0 top-12 bg-white rounded-xl shadow-2xl border border-gray-100 w-52 py-2 z-50">
                    <p className="px-4 py-2 text-xs text-gray-400 font-medium">{user.email}</p>
                    <hr className="my-1" />
                    {isAdmin ? (
                      <Link to="/admin" onClick={() => setUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-navy-800 hover:bg-gold-50 transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    ) : (
                      <Link to="/portal" onClick={() => setUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-navy-800 hover:bg-gold-50 transition-colors">
                        <User className="w-4 h-4" /> My Portal
                      </Link>
                    )}
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-gray-300 hover:text-gold-400 text-sm font-medium transition-colors">
                Student Login
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)} className="lg:hidden text-white p-2">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-navy-900 border-t border-navy-800 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'text-gold-400 bg-navy-800' : 'text-gray-300 hover:text-gold-400 hover:bg-navy-800'
                }`
              }
            >{link.label}</NavLink>
          ))}
          <hr className="border-navy-700 my-2" />
          <Link to="/admission" onClick={() => setOpen(false)}
            className="block w-full text-center btn-primary py-3 text-sm">
            Apply Now
          </Link>
          {user ? (
            <>
              <Link to={isAdmin ? '/admin' : '/portal'} onClick={() => setOpen(false)}
                className="block px-4 py-3 text-sm text-gray-300 hover:text-gold-400">
                {isAdmin ? 'Admin Dashboard' : 'My Portal'}
              </Link>
              <button onClick={handleLogout} className="block px-4 py-3 text-sm text-red-400 w-full text-left">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm text-gray-300 hover:text-gold-400">
              Student Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
