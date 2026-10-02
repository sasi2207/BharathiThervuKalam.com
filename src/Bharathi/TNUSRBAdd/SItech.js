import React from 'react';
import CourseAddTemplate from '../Course/CourseAddTemplate';

const SItechAdd = () => {
  return (
    <CourseAddTemplate
      courseKey="siTechnical"
      examType="TNUSRB"
      title="Sub-Inspector of Police (Technical) - Add"
      subtitle="Publish ECE, Telecommunication, and General Knowledge syllabus for SI Technical exam."
      viewRoute="/SITechnical-View"
      apiEndpoint="/api/courses/siTechnical"
    />
  );
};

export default SItechAdd;
