import React from 'react';
import CourseViewTemplate from '../../Course/CourseViewTemplate';

const GroupIIView = () => {
  return (
    <CourseViewTemplate
      courseKey="group2"
      examType="TNPSC"
      title="TNPSC Group II Services (Interview Posts)"
      subtitle="Preliminary and Mains syllabus papers for Sub-Registrar Grade II, Municipal Commissioner, and ASO."
      addRoute="/Group2-Add"
    />
  );
};

export default GroupIIView;
