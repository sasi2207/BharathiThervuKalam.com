import React from 'react';
import CourseAddTemplate from '../../Course/CourseAddTemplate';

const GroupIV = () => {
  return (
    <CourseAddTemplate
      courseKey="group4"
      examType="TNPSC"
      title="TNPSC Group IV & VAO Examinations - Add"
      subtitle="Upload syllabus for Village Administrative Officer (VAO), Junior Assistant, Typist, and Bill Collector."
      viewRoute="/Group4-View"
      apiEndpoint="/group4_save.php"
    />
  );
};

export default GroupIV;
