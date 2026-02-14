import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdBanner from './components/AdBanner';
import './App.css';

// Lazy loading pages for better performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Guide = lazy(() => import('./pages/Guide'));
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

          <nav className="main-nav" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <Link to="/" style={{ marginRight: '15px' }}>Home</Link>
            <Link to="/about" style={{ marginRight: '15px' }}>About</Link>
            <Link to="/guide" style={{ marginRight: '15px' }}>Guide</Link>
            <Link to="/privacy" style={{ marginRight: '15px' }}>Privacy</Link>
            <Link to="/terms">Terms</Link>
          </nav>

          {/* Top Ad Placeholder */}
          <AdBanner
            style={{ marginTop: '20px', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}
          />
        </header>

        <Suspense fallback={<div className="loader">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/city/:cityName" element={<CityDetail />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </Suspense>

        <footer className="app-footer">
          <p>Built with React + D3 + Astronomy-Engine | Contact: <a href="mailto:moonvisapp@gmail.com" style={{ color: 'inherit' }}>moonvisapp@gmail.com</a></p>
          <div style={{ marginTop: '10px', fontSize: '12px' }}>
            <Link to="/terms" style={{ color: '#94a3b8', marginRight: '10px' }}>Terms of Service</Link>
            <Link to="/privacy" style={{ color: '#94a3b8' }}>Privacy Policy</Link>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
