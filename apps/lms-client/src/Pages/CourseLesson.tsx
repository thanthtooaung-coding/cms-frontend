import { useVideoStore } from '../store/videoStore.js';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@cms/ui/components/accordion';
import { useCourseStore } from '../store/course-store.js';
import CourseDescription from '../components/CourseDetail.js';
import { mockCourseDetail } from '../api/mockCourseDetail.ts';

const CourseLesson = () => {

  const {courseData} = useCourseStore();
  console.log("mokc ",mockCourseDetail);
  console.log(" this is ppm ", courseData)
  // Select only the needed parts from video store to prevent infinite loops
  const selectedVideo = useVideoStore((state) => state.selectedVideo);
  const setSelectedVideo = useVideoStore((state) => state.setSelectedVideo);

  // Select only modules array from course store to avoid excessive re-renders
  const modules = useCourseStore((state) => state.courseData?.course?.modules) || [];

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8 flex">
      {/* Video Player Section */}
      <section className="w-2/3 border-r border-gray-300 flex flex-col">
        <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg bg-black">
          {selectedVideo ? (
            <iframe
              src={selectedVideo.content}
              title={selectedVideo.title}
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-forms"
              className="w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-lg font-medium bg-gray-100">
              Select a lesson to watch the video
            </div>
          )}
        </div>
        {selectedVideo && (
          <h2 className="mt-4 text-2xl font-semibold text-gray-900">{selectedVideo.title}</h2>
        )}
        <div>
          {' '}
          <CourseDescription data={courseData} />
        </div>
      </section>

      {/* Modules & Lessons Accordion */}
      <aside className="w-1/3 overflow-y-auto">
        <Accordion
          type="single"
          collapsible
          defaultValue={`section-${modules[0]?.id}`}
          className="w-full"
        >
          {modules.map((module) => (
            <AccordionItem key={module.id} value={`section-${module.id}`} className="mb-4 shadow">
              <AccordionTrigger className="px-4 py-3 bg-white border-black font-semibold text-gray-800">
                {module.name}
              </AccordionTrigger>
              <AccordionContent className="bg-white px-6 py-3 text-gray-800 transition-all data-[state=open]:animate-slide-down data-[state=closed]:animate-slide-up">
                <ul>
                  {module.lessons?.map((lesson) => (
                    <li
                      key={lesson.id}
                      role="button"
                      tabIndex={0}
                      className="py-3 border-b last:border-b-0 cursor-pointer hover:font-semibold"
                      onClick={() => setSelectedVideo(lesson)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setSelectedVideo(lesson);
                        }
                      }}
                      aria-selected={selectedVideo?.id === lesson.id}
                    >
                      {lesson.title}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </aside>
    </div>
  );
};

export default CourseLesson;
