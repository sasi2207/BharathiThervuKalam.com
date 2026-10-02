import React from 'react';
import CourseAddTemplate from '../Course/CourseAddTemplate';

const CommonAdd = () => {
  return (
    <CourseAddTemplate
      courseKey="commonRecruitment"
      examType="TNUSRB"
      title="Common Recruitment (Police Constables, Warders & Firemen) - Add"
      subtitle="Publish SSLC standard Tamil eligibility, general knowledge, and psychology syllabus."
      viewRoute="/Common-View"
      apiEndpoint="/tnusrbs_save.php"
    />
  );
};

export default CommonAdd;
