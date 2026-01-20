import React, { useEffect } from 'react';

/**
 * AdBanner Component
 * 
 * Displays a Google AdSense unit.
 * 
 * @param {string} dataAdSlot - The ID of the ad unit from your AdSense dashboard.
 * @param {string} dataAdFormat - "auto", "rectangle", "horizontal", "vertical", etc.
 * @param {string} dataFullWidthResponsive - "true" or "false".
 * @param {object} style - Additional styles for the container.
 * @param {string} className - Additional classes for the container.
 */
const AdBanner = ({
    className,
    style,
    dataAdSlot,
    dataAdFormat = 'auto',
    dataFullWidthResponsive = 'true',
    ...props
}) => {
    useEffect(() => {
        try {
            // AdSense uses a global variable 'adsbygoogle'
            // We push an empty object to it to signal to the script to load an ad into this slot
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error("AdSense error (AdBanner)", e);
        }
    }, []);

    // If no slot is provided, we can render a placeholder or nothing
    // Ideally, one should provide a slot.
    if (!dataAdSlot) {
        return (
            <div
                style={{
                    padding: '20px',
                    background: '#f1f5f9',
                    border: '1px dashed #cbd5e1',
                    textAlign: 'center',
                    color: '#64748b',
                    fontSize: '0.875rem',
                    ...style
                }}
                className={className}
            >
                Ad Placeholder (Missing data-ad-slot)
            </div>
        );
    }

    return (
        <div className={className} style={{ overflow: 'hidden', ...style }}>
            <ins className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-4188234977040621"
                data-ad-slot={dataAdSlot}
                data-ad-format={dataAdFormat}
                data-full-width-responsive={dataFullWidthResponsive}
                {...props}>
            </ins>
        </div>
    );
};

export default AdBanner;
