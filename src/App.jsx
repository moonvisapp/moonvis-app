import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CookieBanner from './components/CookieBanner';
import './App.css';

// Lazy loading pages for better performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Guide = lazy(() => import('./pages/Guide'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Methodology = lazy(() => import('./pages/Methodology'));
const CityDetail = lazy(() => import('./pages/CityDetail'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Moon Visibility Explorer</Link>
          </h1>
          <p className="subtitle">Calculate Lunar Calendar & Hijri Dates Using Odeh V-Criterion</p>
          <p className="app-description">
            Generate accurate lunar calendars and Hijri dates with moon sighting predictions for 70+ cities worldwide.
            <br />
            This tool uses the Odeh V-criterion to visualize crescent visibility on a global map.
          </p>

          <nav className="main-nav" style={{ marginTop: '1rem', marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 15px' }}>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/guide">Guide</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/methodology">Methodology</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </nav>
        </header>

        <Suspense fallback={<div className="loader">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="/city/:cityName" element={<CityDetail />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </Suspense>

        <footer className="app-footer">
          <p>Built with React + D3 + Astronomy-Engine | Contact: <a href="mailto:moonvisapp@gmail.com" style={{ color: 'inherit' }}>moonvisapp@gmail.com</a></p>
          <div style={{ marginTop: '10px', fontSize: '12px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px 10px' }}>
            <Link to="/about" style={{ color: '#94a3b8' }}>About</Link>
            <Link to="/guide" style={{ color: '#94a3b8' }}>Guide</Link>
            <Link to="/faq" style={{ color: '#94a3b8' }}>FAQ</Link>
            <Link to="/methodology" style={{ color: '#94a3b8' }}>Methodology</Link>
            <Link to="/terms" style={{ color: '#94a3b8' }}>Terms of Service</Link>
            <Link to="/privacy" style={{ color: '#94a3b8' }}>Privacy Policy</Link>
          </div>
        </footer>

        <CookieBanner />
      </div>
    </Router>
  );
}

export default App;
