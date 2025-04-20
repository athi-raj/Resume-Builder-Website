import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Menu, X, LogOut, User } from 'lucide-react';
import useAuthStore from '@/hooks/useAuthStore';
import { toast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  // Debug log for user data
  useEffect(() => {
    console.log('Navbar user data:', user);
  }, [user]);

  // Change navbar appearance on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    ...(isAuthenticated ? [
      { name: 'Templates', path: '/templates' },
      { name: 'Dashboard', path: '/dashboard' }
    ] : []),
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-10 ${
        isScrolled 
          ? 'py-3 bg-white/80 backdrop-blur-md border-b border-[#e8f3ff]' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center gap-3 font-display font-bold text-xl text-[#2d2b4e] hover:opacity-90 transition-opacity"
        >
          <img 
            src="/favicon.ico" 
            alt="" 
            className="h-8 w-auto"
          />
          <span className="hidden sm:inline">Resume Builder</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm transition-all hover:text-[#2d2b4e] ${
                location.pathname === link.path 
                  ? 'text-[#2d2b4e] font-medium' 
                  : 'text-[#4a4869]/80'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-xl gap-2 border-[#2d2b4e] text-[#2d2b4e] hover:bg-[#2d2b4e]/5"
                  >
                    <div className="h-5 w-5 rounded-full overflow-hidden bg-[#6366f1]/10 flex items-center justify-center">
                      {user?.profileImage ? (
                        <img 
                          src={user.profileImage} 
                          alt={user?.name || 'Profile'} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-3 w-3 text-[#6366f1]" />
                      )}
                    </div>
                    <span className="hidden sm:inline">
                      {user?.name || user?.email?.split('@')[0] || 'User'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border-[#e8f3ff]">
                  <DropdownMenuLabel className="text-[#2d2b4e]">Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#e8f3ff]" />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="text-[#4a4869] hover:text-[#2d2b4e]">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="text-[#4a4869] hover:text-[#2d2b4e]">
                      <FileText className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                asChild 
                size="sm" 
                className="rounded-xl px-5 bg-[#2d2b4e] hover:bg-[#3d3b5e] text-white"
              >
                <Link to="/builder">Create Resume</Link>
              </Button>
            </>
          ) : (
            <>
              <Button 
                asChild 
                variant="outline" 
                size="sm" 
                className="rounded-xl px-5 border-[#2d2b4e] text-[#2d2b4e] hover:bg-[#2d2b4e]/5"
              >
                <Link to="/login">Sign In</Link>
              </Button>
              <Button 
                asChild 
                size="sm" 
                className="rounded-xl px-5 bg-[#2d2b4e] hover:bg-[#3d3b5e] text-white"
              >
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-[#2d2b4e] hover:text-[#3d3b5e] transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#e8f3ff] py-4 animate-fade-in">
          <nav className="flex flex-col gap-4 px-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`py-2 text-sm transition-all hover:text-[#2d2b4e] ${
                  location.pathname === link.path 
                    ? 'text-[#2d2b4e] font-medium' 
                    : 'text-[#4a4869]/80'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-3">
              {isAuthenticated ? (
                <>
                  <Button 
                    asChild 
                    className="rounded-xl w-full bg-[#2d2b4e] hover:bg-[#3d3b5e] text-white"
                  >
                    <Link to="/builder">Create Resume</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl w-full text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    asChild 
                    variant="outline" 
                    className="rounded-xl w-full border-[#2d2b4e] text-[#2d2b4e] hover:bg-[#2d2b4e]/5"
                  >
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button 
                    asChild 
                    className="rounded-xl w-full bg-[#2d2b4e] hover:bg-[#3d3b5e] text-white"
                  >
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
