import React from 'react';

/**
 * AcademicCardCheckmark
 * A subtle, accessible SVG check-mark badge designed for .academic-card components.
 * Animates smoothly via CSS transitions when parent card acquires the .completed class.
 */
export const AcademicCardCheckmark = ({ label = 'Task Completed' }) => {
  return (
    <div className="academic-card-checkmark" role="status" aria-label={label} title={label}>
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 12.5l5.5 5.5L20 6" />
      </svg>
    </div>
  );
};

export default AcademicCardCheckmark;
