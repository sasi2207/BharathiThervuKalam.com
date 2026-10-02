import React from 'react';
import CourseAddTemplate from '../../Course/CourseAddTemplate';

const GroupIIA = () => {
  return (
    <CourseAddTemplate
      courseKey="group2A"
      examType="TNPSC"
      title="TNPSC Group II-A (Non-Interview Posts) - Add"
      subtitle="Upload syllabus for Revenue Inspector, Assistant in Secretariat, and Audit Assistant examinations."
      viewRoute="/Group2A-View"
      apiEndpoint="/group2A_save.php"
    />
  );
};

export default GroupIIA;
