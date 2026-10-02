import React from 'react';
import CourseViewTemplate from '../../Course/CourseViewTemplate';

const GroupIVView = () => {
  return (
    <CourseViewTemplate
      courseKey="group4"
      examType="TNPSC"
      title="TNPSC Group IV & VAO Examination Curriculum"
      subtitle="General Tamil, General Studies, Aptitude, and Samacheer Kalvi revision guides for VAO and Junior Assistants."
      addRoute="/Group4-Add"
    />
  );
};

export default GroupIVView;
