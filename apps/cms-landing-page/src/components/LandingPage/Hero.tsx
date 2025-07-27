// components/Hero.tsx
import { HeroHeading } from './Hero/HeroHeading';
import { HeroFeatureList } from './Hero/HeroFeatureList';

const Hero = () => {
  return (
    <div id='home' className=" py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeroHeading />
        <HeroFeatureList />
      </div>
    </div>
  );
};

export default Hero;
