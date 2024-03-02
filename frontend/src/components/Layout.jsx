import React, { useState, useEffect } from 'react';
import { Header } from './Header';

const Layout = () => {
    const [showPreloader, setShowPreloader] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPreloader(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Header />
            {showPreloader && (
                <div id="preloader" className="dot-spinner-area">
                    <div className="dot-spinner">
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Layout