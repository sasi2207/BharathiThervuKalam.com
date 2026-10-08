import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // When location changes: trigger top progress bar & scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setLoading(true);
    setProgress(25);

    const timer1 = setTimeout(() => {
      setProgress(75);
    }, 80);

    const timer2 = setTimeout(() => {
      setProgress(100);
    }, 220);

    const timer3 = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 380);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [location.pathname, location.search]);

  return (
    <>
      {/* 1. Sleek Golden Top Progress Bar (NProgress / YouTube / GitHub style) */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: progress / 100, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: 'easeOut', duration: 0.2 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              height: '3.5px',
              transformOrigin: '0%',
              background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 50%, #10b981 100%)',
              boxShadow: '0 0 10px rgba(245, 158, 11, 0.7), 0 0 5px rgba(251, 191, 36, 0.5)',
              zIndex: 9999999,
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      {/* 2. User-Friendly Floating Mini Route Indicator */}
      <AnimatePresence>
        {loading && progress < 100 && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 9999998,
              pointerEvents: 'none',
            }}
          >
            <div
              className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-lg"
              style={{
                background: 'rgba(11, 30, 66, 0.92)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(251, 191, 36, 0.35)',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 600,
              }}
            >
              <div
                className="spinner-border text-warning"
                role="status"
                style={{ width: '15px', height: '15px', borderWidth: '2px' }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <span className="text-white">Loading...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
