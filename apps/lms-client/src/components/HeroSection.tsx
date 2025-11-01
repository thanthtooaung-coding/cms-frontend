import { Avatar, AvatarFallback, AvatarImage } from '@cms/ui/components/avatar';
import { Button } from '@cms/ui/components/button';
import { Card } from '@cms/ui/components/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@cms/ui/components/carousel';

const promoImages = [
  'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400',
  'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400',
  'https://images.pexels.com/photos/3184295/pexels-photo-3184295.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400',
];

const HeroSection = () => {
  return (
    <div className="mb-12">
      <div className="flex items-center space-x-3 sm:space-x-4 mb-6">
        <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
          <AvatarImage src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop&crop=faces" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Welcome back, John!
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Ready to continue your learning journey?
          </p>
        </div>
      </div>

      {/* Promotional Carousel */}
      <Carousel className="w-full">
        <CarouselContent>
          {promoImages.map((image, index) => (
            <CarouselItem key={index}>
              <Card className="overflow-hidden h-64 sm:h-80 md:h-96 p-0">
                {' '}
                <div className="relative w-full h-full">
                  {' '}
                  <img
                    src={image}
                    alt={`Promotion ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                      <h2 className="text-lg sm:text-2xl md:text-4xl font-bold mb-2 sm:mb-4">
                        {index === 0 && 'New Year, New Skills'}
                        {index === 1 && 'Master Your Craft'}
                        {index === 2 && 'Join Millions of Learners'}
                      </h2>
                      <p className="text-sm sm:text-base lg:text-lg mb-4 sm:mb-6">
                        {index === 0 && 'Start 2024 with courses from $9.99'}
                        {index === 1 && 'Professional courses taught by experts'}
                        {index === 2 && 'Learn at your own pace, anywhere, anytime'}
                      </p>
                      <Button
                        size={window.innerWidth < 640 ? 'default' : 'lg'}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Explore Courses
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
};

export default HeroSection;
