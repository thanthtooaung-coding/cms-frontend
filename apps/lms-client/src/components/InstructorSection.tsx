
import { Star, Mail, BookOpen, Users } from "lucide-react";
import { Avatar, AvatarImage } from "@cms/ui/components/avatar";

const InstructorSection = () => {
  const title = "Instructor";
  const type = "AWS certified, Professional Web Developer and Instructor";
  const photoUrl = "https://randomuser.me/api/portraits/men/32.jpg";
  const name = "Maximilian Schwarzmüller";
  const email = "maximilian@example.com";
  const coursesCount = 5;
  const studentsCount = 200;
  const rating = 4.7;

  return (
    <div className="py-12 gap-1 flex flex-col ">
      <div className="">
          <h2 className="text-2xl font-bold pb-5">{title}</h2>

      <h2 className="text-xl underline text-purple-600 font-bold">{name}</h2>
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
