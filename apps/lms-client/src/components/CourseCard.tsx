import React from 'react';
import { Heart, Award } from 'lucide-react';
import { Button } from '@cms/ui/components/button';
import { Badge } from '@cms/ui/components/badge';
import { Card, CardContent } from '@cms/ui/components/card';
import { cn } from '@cms/ui/lib/utils';
import { useWishlistStore } from '../store/wishlistStore';
import type{ Category, Course, CourseData, Instructor } from '../api/types/courseData';
import { useNavigate, useParams } from 'react-router';
import { useCourseStore } from '../store/course-store';


interface CourseCardProps {
  data : CourseData;
  course: Course;
  instructor: Instructor;
  category : Category;
  variant?: 'default' | 'compact' | 'list';
  hasCertificate?: boolean;
}

export default function CourseCard({
  data,
  instructor,
  category,
  course,
  variant = 'default',
  hasCertificate = false,
}: CourseCardProps) {
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


  const navigate = useNavigate();
  const { tenantSlug } = useParams<{ tenantSlug?: string }>();
  const { setCourseData } = useCourseStore();
  
  const getCoursePath = (courseId: number) => {
    const basePath = tenantSlug ? `/lms/${tenantSlug}` : '';
    return `${basePath}/course/${courseId}`;
  };

  const getCourseLessonPath = (courseId: number) => {
    const basePath = tenantSlug ? `/lms/${tenantSlug}` : '';
    return `${basePath}/course/${courseId}/lesson`;
  };

  if (variant === 'compact') {
    return (
      <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow pt-0">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={course.imgUrl}
            alt={course.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {hasCertificate && (
            <div className="absolute top-2 right-2 z-10">
              <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold px-2 py-1 shadow-md border-0 flex items-center gap-1">
                <Award className="w-3 h-3" />
                Certified
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-3 sm:p-4">
          <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 mb-2">{course.name}</h3>
          <p className="text-xs text-gray-600 mb-2">{instructor.name}</p>
          {hasCertificate && (
            <div className="mb-2 flex items-center gap-1 text-xs text-yellow-600 font-medium">
              <Award className="w-3 h-3" />
              <span>Certificate Earned</span>
            </div>
          )}
          <Button size="sm" className="w-full mt-2 text-xs sm:text-sm "
          onClick={()=>{
            setCourseData(data);
            navigate(getCourseLessonPath(course.id))
          }}>
            Continue Course
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
          navigate(getCoursePath(course.id))
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
                    <span className="text-gray-500">{course.duration}</span>
                    {/* <Badge variant="secondary">{course.level}</Badge> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
    );
  }

  return (
    <Card
      className="overflow-hidden cursor-pointer group relative border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900 rounded-xl"
      onClick={() => {
        setCourseData(data);
        navigate(getCoursePath(course.id));
      }}
    >
      {/* Image Section */}
      <div className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={course.imgUrl}
          alt={course.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Badge - Top Left */}
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-purple-600 text-white text-xs font-semibold px-3 py-1 shadow-md border-0">
            {category.name}
          </Badge>
        </div>

        {/* Wishlist Button - Top Right */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'absolute top-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all h-9 w-9 rounded-full shadow-md z-10',
            isWishlisted ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'
          )}
          onClick={handleWishlistClick}
        >
          <Heart className={cn('h-4 w-4', isWishlisted && 'fill-current')} />
        </Button>
      </div>

      {/* Content Section */}
      <CardContent className="p-5">
        {/* Title */}
        <h3 className="font-bold text-lg line-clamp-2 text-gray-900 dark:text-gray-100 mb-2.5 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-snug">
          {course.name}
        </h3>

        {/* Instructor */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {instructor.name}
        </p>

        {/* Course Info with Icons */}
        <div className="space-y-2 mb-5">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <svg className="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>{course.modules.length} {course.modules.length === 1 ? 'module' : 'modules'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <svg className="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{course.duration}</span>
          </div>
        </div>

        {/* Go to Course Button */}
        <Button
          className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white"
          onClick={(e) => {
            e.stopPropagation();
            setCourseData(data);
            navigate(getCoursePath(course.id));
          }}
        >
          Go to Course
        </Button>
      </CardContent>
    </Card>
  );
}
