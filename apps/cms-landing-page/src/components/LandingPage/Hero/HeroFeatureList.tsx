// components/hero/HeroFeatureList.tsx
import { Users, Shield, FileEdit } from 'lucide-react';
import { HeroFeatureCard } from './HeroFeatureCard';

const features = [
  {
    icon: Users,
    title: 'Role-Based Access Control',
    description:
      'Securely manage permissions with granular roles for Admins, Owners, and Staff that scale with your organization.',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    stat: '99.9% Uptime & Security',
    statColor: 'text-blue-600',
  },
  {
    icon: Shield,
    title: 'Enterprise-Grade Security',
    description:
      'Built to meet stringent compliance standards with end-to-end data protection and SOC 2 certification.',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    stat: 'SOC 2 Compliant',
    statColor: 'text-green-600',
  },
  {
    icon: FileEdit,
    title: 'Streamlined Content Workflows',
    description:
      'Simplify content creation with automated approvals, delegated staff roles, and easy page request management.',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    stat: '75% Time Saved',
    statColor: 'text-purple-600',
  },
];

export const HeroFeatureList = () => (
  <div className="mt-10 grid md:grid-cols-3 gap-8">
    {features.map((feature, idx) => (
      <HeroFeatureCard key={idx} {...feature} icon={feature.icon} />
    ))}
  </div>
);
