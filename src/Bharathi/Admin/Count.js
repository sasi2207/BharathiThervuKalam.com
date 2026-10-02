import React, { useEffect, useRef } from 'react';
import './Count.css';

export default function Count() {
  const countRefs = useRef([]);
  const containerRef = useRef(null);

  const animateCount = (element, start, end, duration) => {
    let range = end - start;
    let current = start;
    let increment = end > start ? 1 : -1;
    let stepTime = Math.abs(Math.floor(duration / range));

    let timer = setInterval(() => {
      current += increment;
      element.textContent = `${current}+`;
      if (current === end) {
        clearInterval(timer);
      }
    }, stepTime);
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(countRefs.current[0], 0, 8, 2000);
          animateCount(countRefs.current[1], 0, 200, 9000);
          animateCount(countRefs.current[2], 0, 100, 7000);
          observer.disconnect(); // Stop observing after animation starts
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (observer && containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div className="counter-container" ref={containerRef}>
      {[
        { value: 8, label: 'Years of Service' },
        { value: 200, label: 'Happy Students' },
        { value: 100, label: 'Success Stories' }
      ].map((item, index) => (
        <div key={index} className="counter-item">
          <p ref={el => countRefs.current[index] = el} className="counter">0</p>
          <h4>{item.label}</h4>
        </div>
      ))}
    </div>
  );
}
