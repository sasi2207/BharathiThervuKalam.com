import React from 'react';
import CourseAddTemplate from '../../Course/CourseAddTemplate';

const GroupII = () => {
  return (
    <CourseAddTemplate
      courseKey="group2"
      examType="TNPSC"
      title="TNPSC Group II Services (Interview Posts) - Add"
      subtitle="Upload preliminary and mains syllabus for Sub-Registrar, Municipal Commissioner, and Assistant Section Officer."
      viewRoute="/Group2-View"
      apiEndpoint="/group2_save.php"
    />
  );
};

export default GroupII;
