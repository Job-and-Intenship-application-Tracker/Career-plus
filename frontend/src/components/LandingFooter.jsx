import React from 'react';
import { Briefcase, Twitter, Linkedin, Github, Mail, Heart } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Briefcase className="w-4.5 h-4.5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                Career <span className="text-blue-500">Plus</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The premier job & internship application tracking platform. Helping job seekers stay organized and land dream offers.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a href="#twitter" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#linkedin" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#github" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="mailto:contact@careerplus.app" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#features" className="hover:text-white transition-colors">Application Tracker</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Kanban Board</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Follow-up Reminders</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Analytics Dashboard</a></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#home" className="hover:text-white transition-colors">Job Search Guide</a></li>
              <li><a href="#home" className="hover:text-white transition-colors">Resume Tips</a></li>
              <li><a href="#home" className="hover:text-white transition-colors">Interview Preparation</a></li>
              <li><a href="#home" className="hover:text-white transition-colors">Salary Insights</a></li>
            </ul>
          </div>

          {/* Column 4: Legal & Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Support</a></li>
              <li><a href="#home" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#home" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} Career Plus. All rights reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>using React, Vite & Tailwind CSS</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
