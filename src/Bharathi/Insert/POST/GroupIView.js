import React from 'react';
import CourseViewTemplate from '../../Course/CourseViewTemplate';

const GroupIView = () => {
  return (
    <CourseViewTemplate
      courseKey="group1"
      examType="TNPSC"
      title="TNPSC Group I Services Curriculum"
      subtitle="Comprehensive syllabus papers, descriptive scheme, and subject guidelines for Group 1 civil service aspirants."
      addRoute="/Group-I-Add"
    />
  );
};

export default GroupIView;
