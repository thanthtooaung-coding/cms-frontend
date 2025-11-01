import { useMemo, useState } from 'react';
import { Star, Heart } from 'lucide-react';
import { Button } from '@cms/ui/components/button';
import { Badge } from '@cms/ui/components/badge';
import { Card, CardContent } from '@cms/ui/components/card';
//import { cn } from '/lib/utils';
import { cn } from '@cms/ui/lib/utils';
import { useWishlistStore } from '../store/wishlistStore';
import type{ Category, Course, CourseData, Instructor } from '../api/types/courseData';
import { Link, useNavigate } from 'react-router';
import { useCourseStore } from '../store/course-store';


interface CourseCardProps {
  data : CourseData;
  course: Course;
  instructor: Instructor;
  category : Category;
  variant?: 'default' | 'compact' | 'list';
  showProgress?: boolean;
  progress?: number;
}

export default function CourseCard({
  data,
  instructor,
  category,
  course,
  variant = 'default',
  showProgress,
  progress,
}: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(course.id.toString());

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(course.id.toString());
    } else {
      addToWishlist(course);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          'h-3 w-3',
          i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        )}
      />
    ));
  };
  const price = useMemo(() => (Math.random() * (110 - 20) + 20).toFixed(2), []);
  const level = useMemo(() => {
    const levels = ['Beginner', 'Intermediate'];
    return levels[Math.floor(Math.random() * levels.length)];
  }, []);

  const navigate = useNavigate();
  const { setCourseData } = useCourseStore();

  if (variant === 'compact') {
    return (
      <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow pt-0">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={course.imgUrl}
            alt={course.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-3 sm:p-4">
          <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 mb-2">{course.name}</h3>
          <p className="text-xs text-gray-600 mb-2">{instructor.name}</p>
          {showProgress && progress !== undefined && (
            <div className="mb-2">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
          <Button size="sm" className="w-full mt-2 text-xs sm:text-sm "
          onClick={()=>{
            setCourseData(data);
            navigate(`/course-lesson`)
          }}>
            {showProgress ? 'Continue Course' : 'Start Course'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'list') {
    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow" 
        onClick={()=>{
          setCourseData(data);
          navigate(`/course-detail`)
        }}>
          <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-48 h-48 sm:h-32 flex-shrink-0">
              <img src={course.imgUrl} alt={course.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 p-3 sm:p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2">
                    {course.name}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">
                    {course.description}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">By {instructor.name}</p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold text-yellow-600">
                        {course.rating.averageRating}
                      </span>
                      <div className="flex">{renderStars(course.rating.averageRating)}</div>
                      {/* <span className="text-gray-500">({course.reviews.toLocaleString()})</span> */}
                    </div>
                    <span className="text-gray-500">{course.duration}</span>
                    {/* <Badge variant="secondary">{course.level}</Badge> */}
                  </div>
                </div>
                <div className="text-right ml-2 sm:ml-4 mt-2 sm:mt-0">
                  <div className="text-lg sm:text-xl font-bold">${price}</div>
                  {/* {course.originalPrice && (
                  <div className="text-xs sm:text-sm text-gray-500 line-through">
                    ${course.originalPrice}
                  </div>
                )} */}
                </div>
              </div>
            </div>
          </div>
        </Card>
    );
  }

  return (
    <Card
      className="overflow-hidden cursor-pointer group relative pt-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-video relative">
        <img
          src={course.imgUrl}
          alt={course.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'absolute top-1 right-1 sm:top-2 sm:right-2 bg-white/80 backdrop-blur-sm hover:bg-white transition-all h-8 w-8 sm:h-10 sm:w-10',
            isWishlisted ? 'text-red-500' : 'text-gray-600'
          )}
          onClick={handleWishlistClick}
        >
          <Heart className={cn('h-3 w-3 sm:h-4 sm:w-4', isWishlisted && 'fill-current')} />
        </Button>

        {/* Highest Rated Badge */}
        {/* {course.isHighestRated && (
          <Badge className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-yellow-500 text-white text-xs">
            Highest Rated
          </Badge>
        )} */}

        {/* Hover Overlay */}
        <div
          className={cn(
            'absolute inset-0 bg-black/80 flex flex-col justify-center items-center p-2 sm:p-4 transition-opacity duration-300',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
        >
          <p className="text-white text-xs sm:text-sm text-center mb-2 sm:mb-4 line-clamp-3">
            {course.description}
          </p>
          <Button
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-xs sm:text-sm"
            onClick={() =>{
              setCourseData(data);
              navigate('/course-detail')
            }}
          >
            Go to Course
          </Button>
        </div>
      </div>

      <CardContent className="p-3 sm:p-4">
        <h3 className="font-semibold text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-purple-600 transition-colors">
          {course.name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-2">{instructor.name}</p>

        <div className="flex items-center space-x-1 mb-2">
          <span className="font-semibold text-yellow-600 text-xs sm:text-sm">
            {course.rating.averageRating}
          </span>
          <div className="flex">{renderStars(course.rating.averageRating)}</div>
          <span className="text-gray-500 text-xs sm:text-sm">{course.modules.length} modules</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-sm sm:text-lg">${price}</span>
          </div>

          <Badge variant="outline" className="text-xs">
            {level}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
