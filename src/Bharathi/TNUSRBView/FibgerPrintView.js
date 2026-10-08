import React from 'react';
import CourseViewTemplate from '../Course/CourseViewTemplate';

const FingerPrintView = () => {
  return (
    <CourseViewTemplate
      courseKey="siFingerprint"
      examType="TNUSRB"
      title="Sub-Inspector of Police (Finger Print) Syllabus"
      subtitle="Physical Sciences, Forensic Science, Latent Print Development, and Criminalistics syllabus."
      addRoute="/FingerPrint-Add"
    />
  );
};

export default FingerPrintView;
