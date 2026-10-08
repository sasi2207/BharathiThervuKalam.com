import React from 'react';
import CourseViewTemplate from '../../Course/CourseViewTemplate';

const Tnusrb = () => {
  return (
    <CourseViewTemplate
      courseKey="jointRecruitment"
      examType="TNUSRB"
      title="TNUSRB Joint Recruitment (SIs & Station Officers)"
      subtitle="Official syllabus, written exam pattern, physical measurement guidelines (PMT/PET), and viva-voce instructions."
      addRoute="/Tnusrb-Add"
    />
  );
};

export default Tnusrb;
