// components/about/AboutSection.tsx
import { AboutHeader } from './About/AboutHeader';
import { AboutFeatureCards } from './About/AboutFeatureCard';
import { AboutChoice } from './About/AboutChoice';

const About = () => (
  <section id="about" className="bg-white py-20 px-6    mx-auto  ">
    <AboutHeader />
    <AboutFeatureCards />
    <AboutChoice />
  </section>
);

export default About;
