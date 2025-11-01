import React from 'react';
import type { CourseDetailResponse } from '../api/mockCourseDetail';

interface Props {
  data: CourseDetailResponse;
}

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 600,
  marginBottom: '12px',
  color: '#333',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const sectionSpacingStyle: React.CSSProperties = {
  marginTop: '32px',
  marginBottom: '16px',
};

const CourseDescription: React.FC<Props> = ({ data }) => {
  const { category, course, instructor } = data;

  return (
    <div
      style={{
        padding: '32px',
        maxWidth: '900px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
        color: '#222',
      }}
    >
      {/* Title */}
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '12px', color: '#111' }}>
        {course.name}
      </h1>

      {/* Short Description */}
      <p style={{ fontSize: '18px', lineHeight: 1.6, color: '#555' }}>{course.shortDescription}</p>

      {/* Meta Info */}
      <div style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
        <strong>Category:</strong> {category.name} &nbsp;|&nbsp;
        <strong>Duration:</strong> {course.duration}
      </div>

      <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
        ⭐ <strong>{course.rating.averageRating}</strong> ({course.rating.totalRating} ratings) ·{' '}
        {course.totalEnrolledStudents.toLocaleString()} students
      </div>

      <div style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>
        Last updated: {formatDate(course.updatedAt)}
      </div>

      <hr style={sectionSpacingStyle} />

      {/* Course Description + What You'll Learn */}
      <h2 style={sectionTitleStyle}>📚 Course Overview</h2>

      <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#444', marginBottom: '16px' }}>
        {course.description}
      </p>

      <ul style={{ paddingLeft: '20px', fontSize: '16px', lineHeight: 1.8, listStyle: 'disc' }}>
        {course.whatYouWillLearn.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>

      <hr style={sectionSpacingStyle} />

      {/* Requirements */}
      <h2 style={sectionTitleStyle}>📌 Requirements</h2>
      <ul style={{ paddingLeft: '20px', fontSize: '16px', lineHeight: 1.8, listStyle: 'disc' }}>
        {course.requirements.map((req) => (
          <li key={req.id}>{req.text}</li>
        ))}
      </ul>

      <hr style={sectionSpacingStyle} />

      {/* Instructor */}
      <h2 style={sectionTitleStyle}>👨‍🏫 Instructor</h2>
      <ul style={{ paddingLeft: '20px', fontSize: '16px', lineHeight: 1.6 }}>
        <li>
          <strong>Name:</strong> {instructor.name}
        </li>
        <li>
          <strong>Email:</strong> {instructor.email}
        </li>
        <li>
          <strong>Phone:</strong> {instructor.phoneNumber}
        </li>
        <li>
          <strong>Total Courses:</strong> {instructor.totalCourses}
        </li>
        <li>
          <strong>Total Students:</strong> {instructor.totalStudents.toLocaleString()}
        </li>
      </ul>
    </div>
  );
};

export default CourseDescription;
