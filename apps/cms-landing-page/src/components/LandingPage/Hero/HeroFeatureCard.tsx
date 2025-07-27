// components/hero/HeroFeatureCard.tsx
import { LucideIcon, TrendingUp } from 'lucide-react';

interface HeroFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
  stat: string;
  statColor: string;
}

export const HeroFeatureCard = ({
  icon: Icon,
  title,
  description,
  iconBg,
  iconColor,
  stat,
  statColor,
}: HeroFeatureCardProps) => (
  <div className="text-center p-5 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
    <div
      className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mx-auto mb-4 shadow`}
    >
      <Icon className={`h-5 w-5 ${iconColor}`} />
    </div>
    <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>
    <p className="text-sm text-gray-600 leading-snug">{description}</p>
    <div className={`mt-3 flex items-center justify-center text-xs font-medium ${statColor}`}>
      <TrendingUp className="h-3 w-3 mr-1" />
      {stat}
    </div>
  </div>
);
