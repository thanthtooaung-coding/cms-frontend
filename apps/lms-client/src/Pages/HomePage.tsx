import { useState, useEffect } from 'react';
import { Button } from '@cms/ui/components/button';
import { Card, CardContent } from '@cms/ui/components/card';
import CourseCard from '../components/CourseCard';
import { useNavigate, useParams } from 'react-router';
import HeroSection from '../components/HeroSection';
import { fetchPublishedCourses } from '../utils/courseUtils';
import type { CourseData } from '../api/types/courseData';

const HomePage = () => {
  const { tenantSlug } = useParams<{ tenantSlug?: string }>();
  const [trendingCourses, setTrendingCourses] = useState<CourseData[]>([]);
  const [userCourses, setUserCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const courses = await fetchPublishedCourses();
        setTrendingCourses(courses.slice(0, 10)); // Get first 10 for trending
        // TODO: Fetch user's enrolled courses separately
        setUserCourses([]);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const navigate = useNavigate();

  const handleTopicClick = (topic: string) => {
    const basePath = tenantSlug ? `/lms/${tenantSlug}` : '';
    navigate(`${basePath}/courses?search=${encodeURIComponent(topic)}`);
  };

  const recommendedTopics = [
    'React',
    'Python',
    'JavaScript',
    'UI/UX Design',
    'Data Science',
    'Node.js',
    'Photography',
    'Excel',
    'Digital Marketing',
    'Machine Learning',
  ]

  return (
    <>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <HeroSection/>
          {/* Trending Courses Section */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                Trending courses
              </h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const basePath = tenantSlug ? `/lms/${tenantSlug}` : '';
                  navigate(`${basePath}/courses`);
                }}
              >
                View All
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading courses...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {trendingCourses.map((item, index) => (
                  <CourseCard
                    key={item.course.id || index}
                    data={item}
                    course={item.course}
                    instructor={item.instructor}
                    category={item.category}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Let's Start Learning Section */}
          {userCourses.length > 0 && (
            <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  Let's start learning
                </h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const basePath = tenantSlug ? `/lms/${tenantSlug}` : '';
                    navigate(`${basePath}/my-learning`);
                  }}
                >
                  View All
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {userCourses.slice(0, 5).map((data, index) => (
                  <CourseCard
                    key={index}
                    data={data}
                    course={data.course}
                    instructor={data.instructor}
                    category={data.category}
                    variant="compact"
                    showProgress
                    progress={Math.random() * 100}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Topics Recommended for You */}
          <section className="mb-12">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-6">
              Topics recommended for you
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {recommendedTopics.map((topic) => (
                <Card
                  key={topic}
                  className="cursor-pointer hover:shadow-md transition-shadow group"
                  onClick={() => handleTopicClick(topic)}
                >
                  <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {topic}
                    </h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );

};

export default HomePage;
