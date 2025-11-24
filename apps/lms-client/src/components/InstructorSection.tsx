
import { Star, Mail, BookOpen, Users } from "lucide-react";
import { Avatar, AvatarImage } from "@cms/ui/components/avatar";
import { Link } from "react-router";
import { useCourseStore } from "../store/course-store";

const InstructorSection = () => {
  const { courseData } = useCourseStore();
  const instructor = courseData?.instructor;
  
  if (!instructor) {
    return null;
  }

  const title = "Instructor";
  const type = "Professional Instructor";
  const photoUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${instructor.name}`;
  const name = instructor.name;
  const email = instructor.email;
  const coursesCount = instructor.totalCourses || 0;
  const studentsCount = instructor.totalStudents || 0;
  const rating = 4.7; // Default rating, would come from backend

  return (
    <div className="py-12 gap-1 flex flex-col ">
      <div className="">
          <h2 className="text-2xl font-bold pb-5">{title}</h2>

      <Link to={`/teacher/${instructor.id}`}>
        <h2 className="text-xl underline text-purple-600 font-bold hover:text-purple-800 cursor-pointer transition-colors">
          {name}
        </h2>
      </Link>
      <p className="text-sm text-muted-foreground">{type}</p>

      <div className="flex items-center pt-3 space-x-6">
        <Avatar className="w-34 h-34">
          <AvatarImage src={photoUrl} alt={`${name} photo`} />
        </Avatar>

        <div className="flex flex-col space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 fill-gray-800" />
            <span>{rating}  Instructor Rating</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 " />
            <span>{email}</span>
          </div>
          {/* <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 " />
            <span>{phone}</span>
          </div> */}
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 " />
            <span>{coursesCount} Courses</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 fill-gray-800" />
            
            <span>{studentsCount} Students</span>
          </div>
        </div>
      </div>

      <div className="flex items-center pt-12 space-x-3 text-yellow-500 ">
        <Star className="w-6 h-6  fill-yellow-500 " />
        <span className="font-bold text-gray-800 text-3xl">{rating.toFixed(1)} course rating
        </span> 
      </div>
      </div>
      
    </div>
  );
};

export default InstructorSection;
