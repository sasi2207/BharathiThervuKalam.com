import React from 'react';
import CourseViewTemplate from '../Course/CourseViewTemplate';

const SITechnicalView = () => {
  return (
    <CourseViewTemplate
      courseKey="siTechnical"
      examType="TNUSRB"
      title="Sub-Inspector of Police (Technical) Syllabus"
      subtitle="Electronics, Communication Engineering, Computer Science, and General Knowledge syllabus for SI Technical posts."
      addRoute="/SI-Technical"
    />
  );
};

export default SITechnicalView;
