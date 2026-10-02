import React from 'react';
import CourseAddTemplate from '../../Course/CourseAddTemplate';

const TnusrbForm = () => {
  return (
    <CourseAddTemplate
      courseKey="jointRecruitment"
      examType="TNUSRB"
      title="Joint Recruitment (SIs & Station Officers) - Add"
      subtitle="Publish syllabus guidelines, physical endurance test rules, and subject topics for SI Uniformed Services."
      viewRoute="/Tnusrb-View"
      apiEndpoint="/tnusrbs_save.php"
    />
  );
};

export default TnusrbForm;
