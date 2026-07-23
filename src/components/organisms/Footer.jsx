import { motion } from 'framer-motion';
import logo from '../../assets/logo.svg';

const Footer = () => {
  return (
    <footer className="w-full bg-[#f5f5f7] text-[#6e6e73] text-[12px] leading-relaxed pt-12 pb-16 px-6 sm:px-10 md:px-16 border-t border-gray-200/60 font-normal">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* Apple-style Footnote / Disclaimer Section */}
        <div className="flex flex-col gap-2.5 pb-6 border-b border-gray-300/60 text-[#86868b] text-[11px] leading-[1.45]">
          <p>
            1. Meetfleet Social Activation Score (SAS) is an R&amp;D infrastructure designed to facilitate safe, spontaneous real-world connections. 
            Real-time venue activity and safety verification require an active internet connection and location services enabled.
          </p>
          <p>
            2. Compatible intent matching operates locally and securely. Features and venue coverage may vary by region and city availability.
          </p>
        </div>

        {/* Brand Header — Minimalist Gray Logo + Title */}
        <div className="flex items-center gap-3 pt-2">
          <img 
            src={logo} 
            alt="Meetfleet Logo" 
            className="w-5 h-5 grayscale opacity-40 brightness-75"
          />
          <span className="text-[13px] font-medium tracking-tight text-[#424245]">
            Meetfleet
          </span>
        </div>

        {/* Detailed 5-Column Navigation Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 py-4 border-b border-gray-300/60">
          
          {/* Column 1: Social OS & Product */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-[12px] font-semibold text-[#1d1d1f] tracking-tight mb-1">
              Social OS
            </h3>
            <ul className="flex flex-col gap-2">
              <li><a href="#hero" className="hover:text-[#1d1d1f] transition-colors">Overview</a></li>
              <li><a href="#sas" className="hover:text-[#1d1d1f] transition-colors">Activation Score (SAS)</a></li>
              <li><a href="#invention" className="hover:text-[#1d1d1f] transition-colors">Ascience Technology</a></li>
              <li><a href="#ecosystem" className="hover:text-[#1d1d1f] transition-colors">Compatible Intent</a></li>
              <li><a href="#download" className="hover:text-[#1d1d1f] transition-colors">App Showcase</a></li>
            </ul>
          </div>

          {/* Column 2: Account & Experience */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-[12px] font-semibold text-[#1d1d1f] tracking-tight mb-1">
              Experience
            </h3>
            <ul className="flex flex-col gap-2">
              <li><a href="#download" className="hover:text-[#1d1d1f] transition-colors">Download for iOS</a></li>
              <li><a href="#download" className="hover:text-[#1d1d1f] transition-colors">Download for Android</a></li>
              <li><a href="https://meetfleet.app" target="_blank" rel="noopener noreferrer" className="hover:text-[#1d1d1f] transition-colors">Meetfleet Web App</a></li>
              <li><a href="https://meetfleet.app" target="_blank" rel="noopener noreferrer" className="hover:text-[#1d1d1f] transition-colors">Sign In</a></li>
            </ul>
          </div>

          {/* Column 3: Science & Research */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-[12px] font-semibold text-[#1d1d1f] tracking-tight mb-1">
              Science &amp; R&amp;D
            </h3>
            <ul className="flex flex-col gap-2">
              <li><a href="#invention" className="hover:text-[#1d1d1f] transition-colors">Research Paper</a></li>
              <li><a href="#invention" className="hover:text-[#1d1d1f] transition-colors">Peer Review</a></li>
              <li><a href="#invention" className="hover:text-[#1d1d1f] transition-colors">Loneliness Eradication</a></li>
              <li><a href="#invention" className="hover:text-[#1d1d1f] transition-colors">Safety Infrastructure</a></li>
            </ul>
          </div>

          {/* Column 4: Support & Assistance (Linked to websiteapp) */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-[12px] font-semibold text-[#1d1d1f] tracking-tight mb-1">
              Support
            </h3>
            <ul className="flex flex-col gap-2">
              <li><a href="https://meetfleet.app/support/" target="_blank" rel="noopener noreferrer" className="hover:text-[#1d1d1f] transition-colors">Help Center &amp; Support</a></li>
              <li><a href="https://meetfleet.app/support/" target="_blank" rel="noopener noreferrer" className="hover:text-[#1d1d1f] transition-colors">Contact Us</a></li>
              <li><a href="https://meetfleet.app/support/" target="_blank" rel="noopener noreferrer" className="hover:text-[#1d1d1f] transition-colors">Community Guidelines</a></li>
              <li><a href="https://meetfleet.app/support/" target="_blank" rel="noopener noreferrer" className="hover:text-[#1d1d1f] transition-colors">Safety Verification</a></li>
            </ul>
          </div>

          {/* Column 5: Legal & Policy (Linked to websiteapp) */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-[12px] font-semibold text-[#1d1d1f] tracking-tight mb-1">
              Legal &amp; Policy
            </h3>
            <ul className="flex flex-col gap-2">
              <li><a href="https://meetfleet.app/privacy-policy/" target="_blank" rel="noopener noreferrer" className="hover:text-[#1d1d1f] transition-colors">Privacy Policy</a></li>
              <li><a href="https://meetfleet.app/terms-of-service/" target="_blank" rel="noopener noreferrer" className="hover:text-[#1d1d1f] transition-colors">Terms of Use (EULA)</a></li>
              <li><a href="https://meetfleet.app/privacy-policy/" target="_blank" rel="noopener noreferrer" className="hover:text-[#1d1d1f] transition-colors">Data Safety</a></li>
              <li><a href="https://meetfleet.app/terms-of-service/" target="_blank" rel="noopener noreferrer" className="hover:text-[#1d1d1f] transition-colors">Legal Notices</a></li>
            </ul>
          </div>

        </div>

        {/* Apple-style Bottom Row: Copyright + Links + Region */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 text-[11px] text-[#86868b]">
          <div>
            Copyright &copy; {new Date().getFullYear()} Meetfleet Inc. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <a href="https://meetfleet.app/privacy-policy/" target="_blank" rel="noopener noreferrer" className="hover:text-[#1d1d1f] transition-colors underline-offset-2 hover:underline">
              Privacy Policy
            </a>
            <span className="text-gray-300">|</span>
            <a href="https://meetfleet.app/terms-of-service/" target="_blank" rel="noopener noreferrer" className="hover:text-[#1d1d1f] transition-colors underline-offset-2 hover:underline">
              Terms of Use
            </a>
            <span className="text-gray-300">|</span>
            <a href="https://meetfleet.app/support/" target="_blank" rel="noopener noreferrer" className="hover:text-[#1d1d1f] transition-colors underline-offset-2 hover:underline">
              Sales &amp; Support
            </a>
            <span className="text-gray-300">|</span>
            <a href="https://meetfleet.app/terms-of-service/" target="_blank" rel="noopener noreferrer" className="hover:text-[#1d1d1f] transition-colors underline-offset-2 hover:underline">
              Legal
            </a>
          </div>

          <div className="hover:text-[#1d1d1f] transition-colors cursor-pointer select-none">
            United States / English
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
