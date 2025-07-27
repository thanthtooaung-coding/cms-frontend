// components/about/FeatureCards.tsx
import { Card, CardDescription } from '@cms/ui/components/card';
import { Shield, Zap, Settings } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Trust & Security',
    description:
      'Enterprise-grade protection with precise, role-based access to keep your content safe.',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-600',
  },
  {
    icon: Zap,
    title: 'Speed & Scalability',
    description: 'Grow without friction. Fast performance that supports your team as you scale.',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-600',
  },
  {
    icon: Settings,
    title: 'Smart Automation',
    description: 'Automate repetitive tasks and refocus your energy on what matters most.',
    borderColor: 'border-cyan-500',
    textColor: 'text-cyan-600',
  },
];

export const AboutFeatureCards = () => (
  <div className="grid md:grid-cols-3 gap-6 mb-5">
    {features.map(({ icon: Icon, title, description, borderColor, textColor }) => (
      <Card
        key={title}
        className={`border ${borderColor} rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-5`}
      >
        <div className="flex items-center gap-1 text-lg font-semibold ">
          <Icon className={`h-5 w-5 ${textColor}`} />
          <span className={`${textColor}`}>{title}</span>
        </div>
        <CardDescription className="text-sm text-gray-700 leading-snug">
          {description}
        </CardDescription>
      </Card>
    ))}
  </div>
);
