import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Breadcrumbs } from './components/Breadcrumbs';
import CookieBanner from './components/CookieBanner';
import { SEOManager } from './components/SEOManager';
import './App.css';

// Lazy loading pages for better performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Guide = lazy(() => import('./pages/Guide'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Methodology = lazy(() => import('./pages/Methodology'));
const Contact = lazy(() => import('./pages/Contact'));
const CityDetail = lazy(() => import('./pages/CityDetail'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const CitiesDirectory = lazy(() => import('./pages/CitiesDirectory'));

// Article pages
const HijriCalendarHistory = lazy(() => import('./pages/articles/HijriCalendarHistory'));
const MoonSightingCommittees = lazy(() => import('./pages/articles/MoonSightingCommittees'));
const IslamicVsGregorianCalendar = lazy(() => import('./pages/articles/IslamicVsGregorianCalendar'));
const LunarPhasesExplained = lazy(() => import('./pages/articles/LunarPhasesExplained'));
const MoonSightingTips = lazy(() => import('./pages/articles/MoonSightingTips'));
const SharedNightExplained = lazy(() => import('./pages/articles/SharedNightExplained'));
const RamadanGuide = lazy(() => import('./pages/articles/RamadanGuide'));
const EidDatesGuide = lazy(() => import('./pages/articles/EidDatesGuide'));

function App() {
  return (
    <Router>
      <SEOManager />
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
            <Link to="/contact">Contact</Link>
            <Link to="/cities">Locations</Link>
          </nav>
        </header>

        <Breadcrumbs />

        <Suspense fallback={<div className="loader">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cities" element={<CitiesDirectory />} />
            <Route path="/city/:cityName" element={<CityDetail />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            {/* Article pages */}
            <Route path="/articles/hijri-calendar-history" element={<HijriCalendarHistory />} />
            <Route path="/articles/moon-sighting-committees" element={<MoonSightingCommittees />} />
            <Route path="/articles/islamic-vs-gregorian-calendar" element={<IslamicVsGregorianCalendar />} />
            <Route path="/articles/lunar-phases" element={<LunarPhasesExplained />} />
            <Route path="/articles/moon-sighting-tips" element={<MoonSightingTips />} />
            <Route path="/articles/shared-night-explained" element={<SharedNightExplained />} />
            <Route path="/articles/ramadan-guide" element={<RamadanGuide />} />
            <Route path="/articles/eid-dates-guide" element={<EidDatesGuide />} />
          </Routes>
        </Suspense>

        <footer className="app-footer">
          <p>Built with React + D3 + Astronomy-Engine | Contact: <a href="mailto:moonvisapp@gmail.com" style={{ color: 'inherit' }}>moonvisapp@gmail.com</a></p>
          <div style={{ marginTop: '10px', fontSize: '12px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px 10px' }}>
            <Link to="/about" style={{ color: '#94a3b8' }}>About</Link>
            <Link to="/guide" style={{ color: '#94a3b8' }}>Guide</Link>
            <Link to="/faq" style={{ color: '#94a3b8' }}>FAQ</Link>
            <Link to="/methodology" style={{ color: '#94a3b8' }}>Methodology</Link>
            <Link to="/contact" style={{ color: '#94a3b8' }}>Contact</Link>
            <Link to="/cities" style={{ color: '#94a3b8' }}>Locations</Link>
            <Link to="/terms" style={{ color: '#94a3b8' }}>Terms of Service</Link>
            <Link to="/privacy" style={{ color: '#94a3b8' }}>Privacy Policy</Link>
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px 10px' }}>
            <Link to="/articles/ramadan-guide" style={{ color: '#64748b' }}>Ramadan Guide</Link>
            <Link to="/articles/eid-dates-guide" style={{ color: '#64748b' }}>Eid Dates</Link>
            <Link to="/articles/hijri-calendar-history" style={{ color: '#64748b' }}>Hijri Calendar History</Link>
            <Link to="/articles/lunar-phases" style={{ color: '#64748b' }}>Lunar Phases</Link>
            <Link to="/articles/moon-sighting-tips" style={{ color: '#64748b' }}>Moon Sighting Tips</Link>
            <Link to="/articles/moon-sighting-committees" style={{ color: '#64748b' }}>Sighting Committees</Link>
            <Link to="/articles/shared-night-explained" style={{ color: '#64748b' }}>Shared Night</Link>
            <Link to="/articles/islamic-vs-gregorian-calendar" style={{ color: '#64748b' }}>Islamic vs Gregorian</Link>
          </div>
        </footer>

        <CookieBanner />
      </div>
    </Router>
  );
}

export default App;
