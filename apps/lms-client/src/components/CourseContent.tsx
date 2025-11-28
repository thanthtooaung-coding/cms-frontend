import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@cms/ui/components/accordion';
import { PlayCircle } from 'lucide-react';
import { useCourseStore } from '../store/course-store';
import type { Module } from '../api/types/courseData';
import { Button } from '@cms/ui/components/button';

const CourseContent = () => {
  const { courseData } = useCourseStore();
  const course = courseData?.course;

  if (!course) {
    return (
      <div className="py-8">
        <p className="text-gray-600">No course data available</p>
      </div>
    );
  }

  const modules = course.modules || [];
  const totalModules = modules.length;
  const totalLessons = modules.reduce((sum, module) => sum + (module.lessons?.length || 0), 0);
  const totalTime = course.duration || '0 hours';

  const getModuleDuration = (module: Module) => {
    if (!module.lessons || module.lessons.length === 0) {
      return '0 min';
    }
    
    // If lessons have duration, calculate it
    // For now, return a placeholder since backend doesn't provide lesson duration
    return `${module.lessons.length} lesson${module.lessons.length !== 1 ? 's' : ''}`;
  };

  const [openModules, setOpenModules] = useState<string[]>(
    modules.length > 0 ? [`module-${modules[0].id}`] : []
  );

  const allModuleIds = modules.map((m) => `module-${m.id}`);
  const areAllOpen = modules.length > 0 && openModules.length === allModuleIds.length;

  const toggleAll = () => {
    if (areAllOpen) {
      setOpenModules([]);
    } else {
      setOpenModules(allModuleIds);
    }
  };

  if (modules.length === 0) {
    return (
      <div className="">
        <h2 className="text-3xl font-bold mb-4">Course Content</h2>
        <div className="w-full max-w-4xl border rounded-lg p-8 text-center">
          <p className="text-gray-600">No modules available for this course yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <h2 className="text-3xl font-bold mb-4">Course Content</h2>

      <div className="w-full max-w-4xl flex items-center justify-between space-x-4 text-sm text-muted-foreground mb-4">
        <div className="space-x-2">
          <span>{totalModules} {totalModules === 1 ? 'Module' : 'Modules'}</span>
          <span>•</span>
          <span>{totalLessons} {totalLessons === 1 ? 'Lesson' : 'Lessons'}</span>
          <span>•</span>
          <span>{totalTime} Total</span>
        </div>
        <div>
          <Button
            variant="ghost"
            onClick={toggleAll}
            className="px-4 py-2 text-purple-600 hover:text-purple-500 hover:bg-purple-100"
          >
            {areAllOpen ? 'Collapse All Sections' : 'Expand All Sections'}
          </Button>
        </div>
      </div>

      <Accordion
        type="multiple"
        className="w-full max-w-4xl border"
        value={openModules}
        onValueChange={(values) => setOpenModules(values)}
      >
        {modules.map((module) => (
          <AccordionItem key={module.id} value={`module-${module.id}`} className="border rounded">
            <AccordionTrigger className="flex items-center justify-between w-full text-lg font-medium p-4">
              <div className="flex-shrink text-left w-1/2">
                <h2>{module.name}</h2>
              </div>
              <div className="flex w-1/2 items-center justify-end space-x-2 text-sm text-muted-foreground">
                <span>{module.lessons?.length || 0} {module.lessons?.length === 1 ? 'Lesson' : 'Lessons'}</span>
                <span>•</span>
                <span>{getModuleDuration(module)}</span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="divide-y">
              {module.lessons && module.lessons.length > 0 ? (
                module.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between px-4 py-4 hover:bg-muted cursor-pointer transition"
                  >
                    <div className="flex items-center space-x-3">
                      <PlayCircle className="w-5 h-5 text-primary" />
                      <span>{lesson.title}</span>
                    </div>
                    {lesson.materialType && (
                      <span className="text-sm text-muted-foreground capitalize">{lesson.materialType}</span>
                    )}
                  </div>
                ))
              ) : (
                <div className="px-4 py-4 text-sm text-muted-foreground">
                  No lessons available in this module yet.
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CourseContent;
