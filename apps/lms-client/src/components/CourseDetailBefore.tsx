import React, { useState } from 'react';
import type { Course } from '../api/types/courseData';
import { useCourseStore } from '../store/course-store';
import { Button } from '@cms/ui/components/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { lmsApiFetch } from '../utils/apiClient';

interface Props {
  courseDetail: Course;
}

const getCourseIncludes = (course: Course) => [
  { icon: '📹', text: `${course.duration || 'N/A'} on-demand video` },
  { icon: '📝', text: 'Assignments' },
  { icon: '📄', text: '57 articles' },
  { icon: '📂', text: '142 downloadable resources' },
  { icon: '📱', text: 'Access on mobile and TV' },
  { icon: '🗣️', text: 'Closed captions' },
  { icon: '🎓', text: 'Certificate of completion' },
];

const CourseDetailInfo: React.FC<Props> = ({ courseDetail }) => {
  const { courseData } = useCourseStore();
  const [aiTopics, setAiTopics] = useState<Array<{ id: number; name: string }>>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [topicsError, setTopicsError] = useState<string | null>(null);
  
  if (!courseDetail) {
    return (
      <div style={{ padding: '16px', textAlign: 'center', color: '#666' }}>
        <p>Course information is not available.</p>
      </div>
    );
  }
  
  // Get category from courseData store since courseDetail is just the Course object
  const category = courseData?.category;
  const whatYouWillLearn = courseDetail.whatYouWillLearn || [];
  const requirements = courseDetail.requirements || [];

  const courseIncludes = getCourseIncludes(courseDetail);

  const greyBorder = '1px solid #ccc';
  const greyLine = '#ccc';

  // Only show AI-generated topics, no default topics
  const relatedTopics = aiTopics.length > 0 ? aiTopics.map(t => t.name) : [];

  const handleAskAI = async () => {
    if (!courseData?.course?.id) {
      setTopicsError('Course ID is not available');
      return;
    }

    setIsLoadingTopics(true);
    setTopicsError(null);

    try {
      const response = await lmsApiFetch(`/courses/${courseData.course.id}/related-topics`, {
        method: 'POST',
      }, false);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to generate topics' }));
        throw new Error(errorData.message || 'Failed to generate related topics');
      }

      const data = await response.json();
      if (data.topics && Array.isArray(data.topics)) {
        setAiTopics(data.topics);
      } else {
        throw new Error('Invalid response format from AI service');
      }
    } catch (err) {
      setTopicsError(err instanceof Error ? err.message : 'Failed to generate topics');
      console.error('Error generating related topics:', err);
    } finally {
      setIsLoadingTopics(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div
        className="w-full max-w-4xl mx-auto"
        style={{
          fontFamily: 'Arial, sans-serif',
          color: 'black',
        }}
      >
          {/* What you will learn */}
      <section
        className="w-full border rounded-lg mb-6 p-6 bg-white dark:bg-gray-800"
        style={{
          borderColor: '#ccc',
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

        {whatYouWillLearn.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>
            Course learning objectives will be available soon.
          </p>
        ) : (
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
        )}
      </section>

      {/* Explore related topics */}
      <section
        className="w-full border rounded-lg mb-6 p-6 bg-white dark:bg-gray-800"
        style={{
          borderColor: '#ccc',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2
            style={{
              marginBottom: 0,
              paddingBottom: 0,
              color: 'black',
            }}
          >
            Explore related topics
          </h2>
          <Button
            onClick={handleAskAI}
            disabled={isLoadingTopics}
            variant="outline"
            size="sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderColor: '#9333ea',
              color: '#9333ea',
            }}
          >
            {isLoadingTopics ? (
              <>
                <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles style={{ width: '14px', height: '14px' }} />
                <span>Ask AI</span>
              </>
            )}
          </Button>
        </div>

        {topicsError && (
          <div style={{ 
            padding: '8px 12px', 
            marginBottom: 12, 
            backgroundColor: '#fee2e2', 
            color: '#dc2626', 
            borderRadius: '4px',
            fontSize: 14
          }}>
            {topicsError}
          </div>
        )}

        {relatedTopics.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {relatedTopics.map((topic, idx) => (
              <span
                key={idx}
                style={{
                  padding: '6px 12px',
                  border: greyBorder,
                  backgroundColor: '#f3e8ff',
                  fontSize: 14,
                  color: 'black',
                  transition: 'all 0.2s',
                }}
              >
                {topic}
              </span>
            ))}
          </div>
        ) : (
          <div style={{
            padding: '20px',
            backgroundColor: '#f9fafb',
            border: '1px dashed #d1d5db',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#6b7280',
            fontSize: 14,
            lineHeight: '1.6'
          }}>
            <p style={{ margin: 0, marginBottom: '8px' }}>
              <strong style={{ color: '#9333ea' }}>Discover personalized learning paths!</strong>
            </p>
            <p style={{ margin: 0 }}>
              Click the <strong>"Ask AI"</strong> button above to explore related topics tailored to this course and enhance your learning journey.
            </p>
          </div>
        )}
      </section>

      {/* This course includes */}
      <section
        className="w-full border rounded-lg mb-6 p-6 bg-white dark:bg-gray-800"
        style={{
          borderColor: '#ccc',
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
    </>
  );
};

export default CourseDetailInfo;
