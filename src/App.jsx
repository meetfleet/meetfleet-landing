import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import './App.css';
import { IntroVideo, Navbar, Hero, Message, Sas, Invention, GradientGrid, Ecosystem, Download, Footer } from './components';

function App() {
  // Only play the intro video on the first entrance of the session.
  // Reloads (and later navigations within the tab) skip straight to the hero.
  const [showIntro, setShowIntro] = useState(
    () => !sessionStorage.getItem('introSeen')
  );

  const handleIntroComplete = () => {
    sessionStorage.setItem('introSeen', 'true');
    setShowIntro(false);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full max-w-full">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <IntroVideo key="intro" onComplete={handleIntroComplete} />
        ) : (
          <main key="site" className="w-full max-w-full overflow-x-hidden">
            <Navbar />
            <Hero />
            <Message />
            <Sas />
            <Invention />
            <GradientGrid />
            <Ecosystem />
            <Download />
            <Footer />
          </main>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
