import React from 'react';
import CourseAddTemplate from '../Course/CourseAddTemplate';

const FingerPrintAdd = () => {
  return (
    <CourseAddTemplate
      courseKey="siFingerprint"
      examType="TNUSRB"
      title="Sub-Inspector of Police (Finger Print) - Add"
      subtitle="Publish science, chemistry, physics, and forensic dactyloscopy syllabus documents."
      viewRoute="/FingerPrint-View"
      apiEndpoint="/api/courses/siFingerprint"
    />
  );
};

export default FingerPrintAdd;
