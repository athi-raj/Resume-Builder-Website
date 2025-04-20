import { Link } from 'react-router-dom';
import { Github, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#f8f2ff] via-[#eef6ff] to-[#f0f7ff] py-12 px-6 md:px-10 border-t border-[#e8f3ff]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl text-[#2d2b4e]">
              <img 
                src="/favicon.ico" 
                alt="ResumeBuilder Logo" 
                className="h-6 w-6"
              />
              <span>ResumeBuilder</span>
            </Link>
            <p className="text-sm text-[#4a4869] max-w-xs">
              Create professional resumes in minutes with our intuitive resume builder. Stand out and get hired faster.
            </p>
            <div className="flex gap-4 pt-2">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[#4a4869] hover:text-[#6366f1] transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[#4a4869] hover:text-[#6366f1] transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-4 text-[#2d2b4e]">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Templates', path: '/templates' },
                { name: 'Dashboard', path: '/dashboard' },
                { name: 'Create Resume', path: '/builder' },
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-sm text-[#4a4869] hover:text-[#6366f1] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-4 text-[#2d2b4e]">Resources</h3>
            <ul className="space-y-3">
              {[
                { name: 'Resume Tips', path: '#' },
                { name: 'Cover Letter Guide', path: '#' },
                { name: 'Career Blog', path: '#' },
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-sm text-[#4a4869] hover:text-[#6366f1] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-[#e8f3ff] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#4a4869]">
            © {new Date().getFullYear()} ResumeBuilder. All rights reserved.
          </p>
          <div className="flex gap-6">
            {[
              { name: 'Privacy Policy', path: '#' },
              { name: 'Terms of Service', path: '#' },
            ].map((link, index) => (
              <Link 
                key={index} 
                to={link.path} 
                className="text-xs text-[#4a4869] hover:text-[#6366f1] transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
