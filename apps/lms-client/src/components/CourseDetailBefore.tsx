import React from 'react';
import type { CourseDetailResponse } from '../api/mockDataCourse';
import type { Course } from '../api/types/courseData';

// interface Props {
//   courseDetail: CourseDetailResponse; //courseData
// }
interface Props{
  courseDetail : Course
}

const getCourseIncludes = (course: CourseDetailResponse['course']) => [
  { icon: '📹', text: `${course.duration} on-demand video` },
  { icon: '📝', text: 'Assignments' },
  { icon: '📄', text: '57 articles' },
  { icon: '📂', text: '142 downloadable resources' },
  { icon: '📱', text: 'Access on mobile and TV' },
  { icon: '🗣️', text: 'Closed captions' },
  { icon: '🎓', text: 'Certificate of completion' },
];

const CourseDetailInfo: React.FC<Props> = ({ courseDetail }) => {
  const {
    course: { whatYouWillLearn },
    category,
  } = courseDetail;

  const courseIncludes = getCourseIncludes(courseDetail.course);

  const greyBorder = '1px solid #ccc';
  const greyLine = '#ccc';

  const relatedTopics = ['Angular', category.name, 'Development'];

  return (
    <div
      style={{
        maxWidth: 800,
        margin: 'auto',
        fontFamily: 'Arial, sans-serif',
        padding: '0 16px',
        color: 'black',
      }}
    >
      {/* What you will learn */}
      <section
        style={{
          marginBottom: 24,
          padding: 16,
          border: greyBorder,
          borderRadius: 0,
          backgroundColor: '#fff',
        }}
      >
        <h2
          style={{
            marginBottom: 12,
            borderBottom: `2px solid ${greyLine}`,
            paddingBottom: 6,
            color: 'black',
          }}
        >
          What you will learn
        </h2>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 40,
          }}
        >
          {/* Left column */}
          <ul
            style={{
              listStyle: 'none',
              paddingLeft: 0,
              flex: '1 1 300px',
              color: 'black',
            }}
          >
            {whatYouWillLearn
              .slice(0, Math.ceil(whatYouWillLearn.length / 2))
              .map(({ id, text }) => (
                <li
                  key={id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 8,
                    color: 'black',
                  }}
                >
                  <span
                    style={{
                      fontSize: 20,
                      marginRight: 8,
                      userSelect: 'none',
                      color: 'black',
                      lineHeight: 1,
                    }}
                    aria-label="check"
                    role="img"
                  >
                    ✔️
                  </span>
                  <span>{text}</span>
                </li>
              ))}
          </ul>

          {/* Right column */}
          <ul
            style={{
              listStyle: 'none',
              paddingLeft: 0,
              flex: '1 1 300px',
              color: 'black',
            }}
          >
            {whatYouWillLearn.slice(Math.ceil(whatYouWillLearn.length / 2)).map(({ id, text }) => (
              <li
                key={id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 8,
                  color: 'black',
                }}
              >
                <span
                  style={{
                    fontSize: 20,
                    marginRight: 8,
                    userSelect: 'none',
                    color: 'black',
                    lineHeight: 1,
                  }}
                  aria-label="check"
                  role="img"
                >
                  ✔️
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Explore related topics */}
      <section
        style={{
          marginBottom: 24,
          padding: 16,
          border: greyBorder,
          borderRadius: 0,
          backgroundColor: '#fff',
        }}
      >
        <h2
          style={{
            marginBottom: 12,
            paddingBottom: 0,
            color: 'black',
          }}
        >
          Explore related topics
        </h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {relatedTopics.map((topic, idx) => (
            <span
              key={idx}
              style={{
                padding: '6px 12px',
                border: greyBorder,
                backgroundColor: '#f5f5f5',
                fontSize: 14,
                color: 'black',
              }}
            >
              {topic}
            </span>
          ))}
        </div>
      </section>

      {/* This course includes */}
      <section
        style={{
          marginBottom: 24,
          padding: 16,
          border: greyBorder,
          borderRadius: 0,
          backgroundColor: '#fff',
        }}
      >
        <h2
          style={{
            borderBottom: `2px solid ${greyLine}`,
            paddingBottom: 6,
            marginBottom: 12,
            color: 'black',
          }}
        >
          This course includes:
        </h2>
        <div
          style={{
            display: 'flex',
            gap: 40,
            flexWrap: 'wrap',
            marginTop: 12,
          }}
        >
          {/* Left column */}
          <ul
            style={{
              listStyle: 'none',
              paddingLeft: 0,
              flex: '1 1 300px',
              color: 'black',
            }}
          >
            {courseIncludes
              .slice(0, Math.ceil(courseIncludes.length / 2))
              .map(({ icon, text }, idx) => (
                <li
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 8,
                    fontSize: 15,
                    color: 'black',
                  }}
                >
                  <span
                    style={{
                      fontSize: 20,
                      marginRight: 10,
                      userSelect: 'none',
                      lineHeight: 1,
                      color: 'black',
                    }}
                    aria-label="icon"
                    role="img"
                  >
                    {icon}
                  </span>
                  <span>{text}</span>
                </li>
              ))}
          </ul>

          {/* Right column */}
          <ul
            style={{
              listStyle: 'none',
              paddingLeft: 0,
              flex: '1 1 300px',
              color: 'black',
            }}
          >
            {courseIncludes
              .slice(Math.ceil(courseIncludes.length / 2))
              .map(({ icon, text }, idx) => (
                <li
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 8,
                    fontSize: 15,
                    color: 'black',
                  }}
                >
                  <span
                    style={{
                      fontSize: 20,
                      marginRight: 10,
                      userSelect: 'none',
                      lineHeight: 1,
                      color: 'black',
                    }}
                    aria-label="icon"
                    role="img"
                  >
                    {icon}
                  </span>
                  <span>{text}</span>
                </li>
              ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default CourseDetailInfo;
