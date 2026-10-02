import React from 'react';
import CourseAddTemplate from '../../Course/CourseAddTemplate';

const GroupI = () => {
  return (
    <CourseAddTemplate
      courseKey="group1"
      examType="TNPSC"
      title="TNPSC Group I Services - Add"
      subtitle="Upload syllabus for Deputy Collector, DSP, Commercial Tax Officer, and Assistant Commissioner exams."
      viewRoute="/Group-I-View"
      apiEndpoint="/group1_save.php"
    />
  );
};

export default GroupI;
