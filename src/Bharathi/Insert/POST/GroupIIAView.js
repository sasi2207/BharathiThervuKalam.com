import React from 'react';
import CourseViewTemplate from '../../Course/CourseViewTemplate';

const GroupIIAView = () => {
  return (
    <CourseViewTemplate
      courseKey="group2A"
      examType="TNPSC"
      title="TNPSC Group II-A (Non-Interview Posts)"
      subtitle="Complete syllabus papers for Revenue Inspector, Secretariat Assistant, and Audit cadres."
      addRoute="/Group2A-Add"
    />
  );
};

export default GroupIIAView;
