import React, { useState, useEffect } from 'react';

const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already consented
        const consented = localStorage.getItem('moonvis_gdpr_consent');
        if (!consented) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('moonvis_gdpr_consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#1e293b',
            color: '#f8fafc',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
            flexWrap: 'wrap',
            gap: '16px'
        }}>
            <div style={{ flex: '1 1 300px', fontSize: '14px', lineHeight: '1.5' }}>
                We use cookies to personalize content and ads, to provide social media features, and to analyze our traffic. 
                By using our site, you consent to our use of cookies in accordance with our <a href="/privacy" style={{ color: '#38bdf8', textDecoration: 'underline' }}>Privacy Policy</a>.
            </div>
            <button 
                onClick={handleAccept}
                style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 20px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
            >
                Accept & Continue
            </button>
        </div>
    );
};

export default CookieBanner;
