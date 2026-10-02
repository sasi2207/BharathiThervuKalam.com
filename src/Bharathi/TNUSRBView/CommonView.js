import React from 'react';
import CourseViewTemplate from '../Course/CourseViewTemplate';

const CommonView = () => {
  return (
    <CourseViewTemplate
      courseKey="commonRecruitment"
      examType="TNUSRB"
      title="Common Recruitment (Police Constables, Warders & Firemen)"
      subtitle="Complete syllabus papers, Tamil eligibility test format, general knowledge, and psychology papers for Police Constables."
      addRoute="/Common-Add"
    />
  );
};

export default CommonView;
