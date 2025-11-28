import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@cms/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@cms/ui/components/card';
import { Checkbox } from '@cms/ui/components/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@cms/ui/components/select';
import { Separator } from '@cms/ui/components/separator';
import CourseCard from '../components/CourseCard';
import type { CourseData } from '../api/types/courseData';
import { lmsApiFetch } from '../utils/apiClient';
import { fetchPublishedCourses } from '../utils/courseUtils';
import { useAuthDataStore } from '../store/auth-store';

// const categories = [
//   'Development',
//   'Business',
//   'Finance & Accounting',
//   'IT & Software',
//   'Design',
//   'Marketing',
//   'Photography',
//   'Health & Fitness',
//   'Music',
//   'Teaching',
// ];

const sortOptions = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
];

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { tenantSlug } = useParams<{ tenantSlug?: string }>();
  const { user } = useAuthDataStore();

  const [courses, setCourses] = useState<CourseData[]>([]);
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseData[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popular');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesResponse = await lmsApiFetch('/categories', {}, true);
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }

        // Fetch published courses (for students)
        const allCourses = await fetchPublishedCourses();
        setCourses(allCourses);

        // Apply initial category filter from URL params
        const category = searchParams.get('category');
        if (category) {
          setSelectedCategories([category]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  useEffect(() => {
    let filtered = [...courses];

    // Apply search filter (from URL or state)
    const search = searchParams.get('search');
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (data) =>
          data.course.name.toLowerCase().includes(searchLower) ||
          data.course.description.toLowerCase().includes(searchLower) ||
          data.instructor.name.toLowerCase().includes(searchLower) ||
          data.category.name.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((data) => selectedCategories.includes(data.category.name));
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => {
          const dateA = new Date(a.course.createdAt || 0).getTime();
          const dateB = new Date(b.course.createdAt || 0).getTime();
          return dateB - dateA;
        });
        break;
      // case 'price-low':
      //   filtered.sort((a, b) => a.price - b.price);
      //   break;
      // case 'price-high':
      //   filtered.sort((a, b) => b.price - a.price);
      //   break;
      default:
      // Most popular (by reviews)
      // filtered.sort((a, b) => b.reviews - a.reviews);
    }

    setFilteredCourses(filtered);
  }, [courses, selectedCategories, sortBy, searchParams]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, category] : prev.filter((c) => c !== category)
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSortBy('popular');
    // Clear URL search params
    const basePath = tenantSlug ? `/lms/${tenantSlug}` : '';
    const newSearchParams = new URLSearchParams();
    setSearchParams(newSearchParams, { replace: true });
    navigate(`${basePath}/courses`, { replace: true });
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.trim().split(/\s+/);
    if (names.length >= 2) {
      // First letter of first name + first letter of last name
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    // If single name, take first 2 letters
    return user.name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        {user && (
          <div className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-lg p-4 sm:p-6 border border-purple-100 dark:border-purple-900/30">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <span className="text-lg sm:text-xl font-bold text-purple-600 dark:text-purple-400">
                    {getUserInitials()}
                  </span>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 truncate">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  Ready to continue your learning journey?
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Mobile Filter Toggle */}
          {/* <div className="lg:hidden">
            <Button
              variant="outline"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full mb-4"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters ({selectedCategories.length})
            </Button>
          </div> */}

          {/* Filters Sidebar */}
          <div className={`lg:w-72 xl:w-80 `}>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Filters</CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category Filter */}
                <div>
                  <h3 className="font-semibold mb-3">Topic</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {loading ? (
                      <p className="text-sm text-gray-400">Loading categories...</p>
                    ) : (
                      categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={category.id.toString()}
                            checked={selectedCategories.includes(category.name)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCategories([category.name]); // Only one category allowed
                              } else {
                                setSelectedCategories([]); // Clear selection
                              }
                            }}
                          />

                          <label htmlFor={category.name} className="text-sm">
                            {category.name}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course List */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {filteredCourses.length} courses found
              </h1>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="text-sm text-gray-600 hidden sm:inline">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredCourses.map((data, index) => (
                <CourseCard
                  key={index}
                  data={data}
                  course={data.course}
                  instructor={data.instructor}
                  category={data.category}
                  variant="list"
                />
              ))}
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Loading courses...</p>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No courses found matching your filters.</p>
                <Button variant="outline" onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
