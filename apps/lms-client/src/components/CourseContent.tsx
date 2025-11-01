import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@cms/ui/components/accordion';
import { PlayCircle } from 'lucide-react';
import { mockCourse } from '../../../../packages/data/src/data/mockData';
import type { Course, Module } from '../../../../packages/data/src/types/mockTypes';
import { Button } from '@cms/ui/components/button';

const CourseContent = () => {

  const course: Course = mockCourse.course;

  const totalModules = course.modules.length;
  const totalLessons = course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const totalTime = course.duration;

  const getModuleDuration = (module: Module) => {
    const totalSeconds = module.lessons.reduce((sum, lesson) => {
      const [min, sec] = lesson.duration.split(':').map(Number);
      return sum + min * 60 + sec;
    }, 0);

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes} min ${seconds < 10 ? `0${seconds}` : seconds} sec`;
  };

  const [openModules, setOpenModules] = useState<string[]>([`module-${course.modules[0].id}`]);

  const allModuleIds = course.modules.map((m) => `module-${m.id}`);
  const areAllOpen = openModules.length === allModuleIds.length;

  const toggleAll = () => {
    if (areAllOpen) {
      setOpenModules([]);
    } else {
      setOpenModules(allModuleIds);
    }
  };

  return (
    <div className="">
      <h2 className="text-3xl font-bold mb-4">Course Content</h2>

      <div className="w-[800px] flex items-center justify-between space-x-4 text-sm text-muted-foreground ">
        <div className="space-x-2">
          <span>{totalModules} Modules</span>
          <span>•</span>
          <span>{totalLessons} Lessons</span>
          <span>•</span>
          <span>{totalTime} Total</span>
        </div>
        <div className=" ">
          <Button
            variant="ghost"
            onClick={toggleAll}
            className="px-4 py-2 text-purple-600  hover:text-purple-500 hover:bg-purple-100"
          >
            {areAllOpen ? 'Collapse All Sections' : 'Expand All Sections'}
          </Button>
        </div>
      </div>

      <Accordion
        type="multiple"
        className="w-[800px] border"
        value={openModules}
        onValueChange={(values) => setOpenModules(values)}
      >
        {course.modules.map((module) => (
          <AccordionItem key={module.id} value={`module-${module.id}`} className="border rounded ">
            <AccordionTrigger className="flex items-center justify-between w-full text-lg font-medium p-4">
              <div className="flex-shrink text-left w-1/2">
                <h2>{module.name}</h2>
              </div>
              <div className="flex w-1/2 items-center justify-end space-x-2 text-sm text-muted-foreground">
                <span>{module.lessons.length} Lessons</span>
                <span>•</span>
                <span>{getModuleDuration(module)}</span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="divide-y ">
              {module.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between px-4 py-4 hover:bg-muted cursor-pointer transition"
                >
                  <div className="flex items-center space-x-3">
                    <PlayCircle className="w-5 h-5 text-primary" />
                    <span>{lesson.title}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CourseContent;
