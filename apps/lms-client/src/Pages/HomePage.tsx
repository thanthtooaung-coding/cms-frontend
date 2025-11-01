import { Button } from '@cms/ui/components/button';
import { Card, CardContent } from '@cms/ui/components/card';
import CourseCard from '../components/CourseCard';
import { useNavigate } from 'react-router';
import { getTrendingCourses1, getUserCourses } from '../api/mockData';
import HeroSection from '../components/HeroSection';

const HomePage = () => {
  const trendingCourses1 = getTrendingCourses1();
  console.log(trendingCourses1);
  const userCourses = getUserCourses();

  console.log(trendingCourses1[0].course);

  const navigate = useNavigate();

  const handleTopicClick = (topic: string) => {
    navigate(`/courses?search=${encodeURIComponent(topic)}`)}

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
              <Button variant="outline" size="sm" asChild>
                <a href="/courses">View All</a>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {trendingCourses1.map((item, index) => (
                <CourseCard
                  key={index}
                  data={item}
                  course={item.course}
                  instructor={item.instructor}
                  category={item.category}
                />
              ))}
            </div>
          </section>

          {/* Let's Start Learning Section */}
          {userCourses.length > 0 && (
            <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  Let's start learning
                </h2>
                <Button variant="outline" size="sm" asChild>
                  <a href="/my-learning">View All</a>
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
