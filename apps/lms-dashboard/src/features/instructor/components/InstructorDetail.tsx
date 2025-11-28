import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTenantNavigate, useTenantUrl } from '../../../hooks/useTenantNavigate';
import { Header } from '../../../components/Layout/Header';
import { Main } from '../../../components/Layout/main';
import { ProfileDropdown } from '../../../components/profile-dropdown';
import { Search } from '../../../components/search';
import { lmsApiFetch } from '../../../utils/apiClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@cms/ui/components/card';
import { Badge } from '@cms/ui/components/badge';
import { Button } from '@cms/ui/components/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@cms/ui/components/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@cms/ui/components/avatar';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  BookOpen, 
  Users, 
  Star, 
  GraduationCap,
  Edit,
  Trash2
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@cms/ui/components/dropdown-menu';
import { MoreVertical } from 'lucide-react';

interface TeacherResponse {
  id: number;
  username: string;
  email: string;
  name: string;
  address?: string;
  phoneNumber?: string;
  role: {
    id: number;
    name: string;
  };
  tenant: {
    id: number;
    name: string;
  };
}

interface CourseResponse {
  id: number;
  title: string;
  description: string;
  category: {
    id: number;
    name: string;
    description?: string;
  };
  instructor: {
    id: number;
    name: string;
    email: string;
  };
}

const InstructorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useTenantNavigate();
  const getTenantUrl = useTenantUrl();
  const [teacher, setTeacher] = useState<TeacherResponse | null>(null);
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInstructorData = async () => {
      if (!id) {
        setError('Instructor ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const instructorId = parseInt(id, 10);
        const [teacherData, allCourses] = await Promise.all([
          lmsApiFetch(`/users/${instructorId}`).then(res => {
            if (!res.ok) throw new Error('Failed to fetch instructor');
            return res.json();
          }),
          lmsApiFetch('/courses').then(res => {
            if (!res.ok) throw new Error('Failed to fetch courses');
            return res.json();
          }),
        ]);

        setTeacher(teacherData);
        // Filter courses by instructor
        const instructorCourses = allCourses.filter(
          (course: CourseResponse) => course.instructor?.id === instructorId
        );
        setCourses(instructorCourses);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load instructor data');
        console.error('Error loading instructor data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInstructorData();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header>
          <Search />
          <div className="ml-auto flex items-center gap-4">
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <div className="flex justify-center items-center h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading instructor information...</p>
            </div>
          </div>
        </Main>
      </>
    );
  }

  if (error || !teacher) {
    return (
      <>
        <Header>
          <Search />
          <div className="ml-auto flex items-center gap-4">
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <div className="flex justify-center items-center h-screen">
            <div className="text-center">
              <p className="text-destructive mb-4">{error || 'Instructor not found'}</p>
              <Button onClick={() => navigate(-1)} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </Main>
      </>
    );
  }

  // Calculate statistics
  const totalStudents = courses.length * 100; // Placeholder - would need enrollment data
  const averageRating = 4.7; // Placeholder - would need course ratings

  return (
    <>
      <Header>
        <Search />
        <div className="ml-auto flex items-center gap-4">
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Instructor Details</h1>
              <p className="text-muted-foreground">View and manage instructor information</p>
            </div>
            <div className="ml-auto flex gap-2">
              <Link to={getTenantUrl(`/instructor/${id}/edit`)}>
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </Link>
            </div>
          </div>

          {/* Instructor Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.name}`}
                    alt={teacher.name}
                  />
                  <AvatarFallback className="text-2xl">
                    {teacher.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{teacher.name}</CardTitle>
                  <CardDescription className="text-base mb-4">
                    {teacher.role.name} • {teacher.tenant.name}
                  </CardDescription>
                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{averageRating.toFixed(1)} Rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{courses.length} Courses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{totalStudents.toLocaleString()} Students</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="courses">Courses ({courses.length})</TabsTrigger>
                  <TabsTrigger value="contact">Contact Information</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Total Courses
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{courses.length}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Total Students
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{totalStudents.toLocaleString()}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Average Rating
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {teacher.role.name === 'Staff' && (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-purple-600">
                          <GraduationCap className="w-5 h-5" />
                          <span className="font-semibold">Certified Instructor</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="courses" className="mt-6">
                  {courses.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                        <p className="text-muted-foreground">
                          This instructor hasn't published any courses yet.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {courses.map((course) => (
                        <Card key={course.id} className="hover:shadow-md transition-shadow">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <CardTitle className="text-lg mb-2">
                                  <Link
                                    to={getTenantUrl(`/course/${course.id}`)}
                                    className="hover:text-purple-600 transition-colors"
                                  >
                                    {course.title}
                                  </Link>
                                </CardTitle>
                                <CardDescription className="line-clamp-2">
                                  {course.description}
                                </CardDescription>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link to={getTenantUrl(`/course/${course.id}`)}>View Details</Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link to={getTenantUrl(`/course/${course.id}/edit`)}>Edit Course</Link>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="flex items-center gap-4 mt-4">
                              <Badge variant="secondary">{course.category.name}</Badge>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="contact" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {teacher.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                            <a
                              href={`mailto:${teacher.email}`}
                              className="text-sm hover:text-purple-600 transition-colors"
                            >
                              {teacher.email}
                            </a>
                          </div>
                        </div>
                      )}
                      {teacher.phoneNumber && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Phone</p>
                            <p className="text-sm">{teacher.phoneNumber}</p>
                          </div>
                        </div>
                      )}
                      {teacher.address && (
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Address</p>
                            <p className="text-sm">{teacher.address}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Tenant</p>
                          <p className="text-sm">{teacher.tenant.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <GraduationCap className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Role</p>
                          <Badge variant="outline">{teacher.role.name}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  );
};

export default InstructorDetail;

