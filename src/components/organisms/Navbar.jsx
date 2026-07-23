import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download as DownloadIcon } from 'lucide-react';
import logo from '../../assets/logo.svg';

const NAV_LINKS = [
  { name: 'OS', href: '#hero' },
  { name: 'Message', href: '#message' },
  { name: 'SAS Score', href: '#sas' },
  { name: 'Ascience', href: '#invention' },
  { name: 'Technology', href: '#technology' },
  { name: 'Ecosystem', href: '#ecosystem' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Magnetic / Pill Follower state for desktop
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navContainerRef = useRef(null);

  // Scroll tracking for glass header & active nav section
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      for (let i = NAV_LINKS.length - 1; i >= 0; i--) {
        const id = NAV_LINKS[i].href.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          if (scrollPos >= el.offsetTop) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('has-menu-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('has-menu-open');
    }
  }, [mobileMenuOpen]);

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Magnetic hover handler for desktop nav items
  const handleMouseEnter = (e) => {
    if (!navContainerRef.current) return;
    const containerRect = navContainerRef.current.getBoundingClientRect();
    const itemRect = e.currentTarget.getBoundingClientRect();
    setPillStyle({
      left: itemRect.left - containerRect.left,
      width: itemRect.width,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setPillStyle((prev) => ({ ...prev, opacity: 0 }));
  };

  // Smooth scroll handler
  const handleScrollTo = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Dune Floating Card Header Wrapper */}
      <header className="fixed top-0 inset-x-0 z-[100001] flex justify-center pointer-events-none p-3 sm:p-5 transition-all duration-300 w-full max-w-full overflow-x-hidden">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: isScrolled || mobileMenuOpen ? 0 : -50, opacity: isScrolled || mobileMenuOpen ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className={`pointer-events-auto w-full max-w-5xl rounded-full flex items-center justify-between px-5 sm:px-7 py-3 transition-[background,border-color,box-shadow,padding] duration-500 border will-change-transform ${
            mobileMenuOpen
              ? 'bg-transparent border-transparent shadow-none'
              : isScrolled
              ? 'bg-white/65 backdrop-blur-[22px] backdrop-saturate-[180%] border-white/70 shadow-[0_2px_28px_rgba(0,0,0,0.10)] py-2.5'
              : 'bg-white/18 backdrop-blur-[16px] backdrop-saturate-[150%] border-white/40 shadow-none'
          }`}
        >
          {/* Logo ONLY — No text wordmark beside it */}
          <a
            href="#hero"
            onClick={(e) => handleScrollTo(e, '#hero')}
            className="flex items-center group"
            aria-label="Meetfleet Home"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
              <img src={logo} alt="Meetfleet Logo" className="h-[21px] w-auto block" />
            </div>
          </a>

          {/* Desktop Navigation Links (Centered, Magnetic Pill Follower) */}
          <nav
            ref={navContainerRef}
            onMouseLeave={handleMouseLeave}
            className="hidden md:flex items-center gap-1 relative px-2 py-1 rounded-full"
          >
            {/* Hover Sliding Pill Indicator */}
            <div
              className="absolute h-8 rounded-full bg-[#0033FF]/10 transition-all duration-300 ease-out pointer-events-none"
              style={{
                left: `${pillStyle.left}px`,
                width: `${pillStyle.width}px`,
                opacity: pillStyle.opacity,
              }}
            />

            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onMouseEnter={handleMouseEnter}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className={`relative px-5 py-1.5 text-[13.5px] font-medium rounded-full transition-colors ${
                    isActive
                      ? 'text-[#0033FF] font-semibold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavDot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#0033FF] rounded-full"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action — Download CTA (Desktop) */}
          <div className="hidden md:flex items-center">
            <a
              href="#download"
              onClick={(e) => handleScrollTo(e, '#download')}
              className="px-6 py-2.5 text-[13.5px] font-medium bg-[#0033FF] text-white rounded-full hover:bg-[#0029cc] hover:shadow-[0_6px_20px_rgba(0,51,255,0.35)] active:scale-95 transition-all flex items-center gap-1.5"
            >
              <DownloadIcon size={14} />
              Download App
            </a>
          </div>

          {/* Dune Morphing 3-Bar Burger Button (Mobile) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Navigation'}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/70 border border-white/60 text-black shadow-sm active:scale-95 transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect
                x="3"
                y="6.5"
                width="18"
                height="1.5"
                rx="0.75"
                fill="currentColor"
                className={`transition-transform duration-300 origin-center ${
                  mobileMenuOpen ? 'translate-y-[4.75px] rotate-45' : ''
                }`}
              />
              <rect
                x="3"
                y="11.25"
                width="18"
                height="1.5"
                rx="0.75"
                fill="currentColor"
                className={`transition-opacity duration-300 ${
                  mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <rect
                x="3"
                y="16"
                width="18"
                height="1.5"
                rx="0.75"
                fill="currentColor"
                className={`transition-transform duration-300 origin-center ${
                  mobileMenuOpen ? '-translate-y-[4.75px] -rotate-45' : ''
                }`}
              />
            </svg>
          </button>
        </motion.div>
      </header>

      {/* Dune Custom Mobile Menu — Fullscreen Dark Expansion with Clip-Path & Blur */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0 round 28px)', opacity: 0 }}
            animate={{ clipPath: 'inset(0 0 0% 0 round 0px)', opacity: 1 }}
            exit={{ clipPath: 'inset(0 0 100% 0 round 28px)', opacity: 0 }}
            transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100002] bg-[#050507]/90 backdrop-blur-[40px] backdrop-saturate-[150%] text-white flex flex-col justify-between pt-[clamp(100px,16vh,140px)] pb-12 px-[clamp(36px,10vw,64px)] min-h-dvh overflow-y-auto w-full max-w-full overflow-x-hidden"
          >
            {/* Dune Floating Circular Close Button (Top-Right) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Fermer le menu"
              className="absolute top-7 right-7 w-12 h-12 rounded-full bg-white/[0.07] border border-white/10 text-white/60 hover:text-white flex items-center justify-center hover:scale-108 hover:rotate-90 active:scale-95 transition-all"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Dune Staggered Link List */}
            <ul className="flex flex-col gap-2 my-auto">
              {NAV_LINKS.map((link, idx) => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <motion.li
                    key={link.name}
                    initial={{ x: 56, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.06 + idx * 0.05, duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
                    className="relative py-2.5"
                  >
                    {/* Active item blue glow pill behind */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[52px] h-[72px] rounded-[20px] bg-[#0033FF]/25 blur-[22px] pointer-events-none" />
                    )}

                    <a
                      href={link.href}
                      onClick={(e) => handleScrollTo(e, link.href)}
                      className={`flex items-center gap-4 text-[clamp(2.1rem,8.5vw,3.2rem)] font-light tracking-[-0.035em] leading-[1.08] transition-colors relative z-10 ${
                        isActive ? 'text-white font-normal' : 'text-white/45 hover:text-white/85'
                      }`}
                    >
                      {/* Active thin dash line before text */}
                      {isActive && (
                        <span className="inline-block shrink-0 w-5 h-[1.5px] bg-[#0033FF] rounded-sm opacity-90 self-center" />
                      )}
                      <span>{link.name}</span>
                    </a>
                  </motion.li>
                );
              })}
            </ul>

            {/* Dune Mobile CTA Button — #0033FF Blue */}
            <motion.div
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.44, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="pt-8"
            >
              <a
                href="#download"
                onClick={(e) => handleScrollTo(e, '#download')}
                className="w-full py-4 px-8 bg-[#0033FF] hover:bg-[#0029cc] text-white text-[15px] font-semibold tracking-wide rounded-[16px] text-center shadow-[0_8px_24px_rgba(0,51,255,0.35)] flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <DownloadIcon size={18} />
                Download App
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
