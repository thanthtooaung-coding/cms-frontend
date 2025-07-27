// components/hero/HeroHeading.tsx
import { Button } from '@cms/ui/components/button';
import { ArrowRight, FileEdit, Zap } from 'lucide-react';

export const HeroHeading = () => (
  <div className="text-center">
    <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
      <Zap className="h-4 w-4 mr-2" />
      Next-Gen Multi-Tenant CMS
    </div>

    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
      Manage Content Effortlessly &
      <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
        Scale Seamlessly Across Teams
      </span>
    </h1>

    <p className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
      A secure, role-based CMS designed for businesses that demand control and flexibility. Delegate
      tasks, approve content, and monitor progress—all within one powerful platform.
    </p>

    <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10">
      <Button
        size="lg"
        className="bg-blue-600 text-white hover:bg-orange-400 hover:border-orange-600 px-8 py-4 text-lg font-semibold shadow-md cursor-pointer transition-colors duration-200"
      >
        <span>Get Started Today</span>
        <ArrowRight className="h-5 w-5 ml-2" />
      </Button>

      <Button
        size="lg"
        variant="outline"
        className="border border-gray-300 text-gray-800 hover:border-orange-500 hover:bg-orange-100 hover:text-orange-700 px-8 py-4 text-lg font-semibold cursor-pointer transition-colors duration-200"
      >
        <FileEdit className="h-5 w-5 mr-2" />
        <span>Watch Demo</span>
      </Button>
    </div>

    <div className="text-sm text-gray-500 mb-3">
      ✓ 14-day free trial &nbsp;&nbsp;•&nbsp;&nbsp; ✓ No setup fees &nbsp;&nbsp;•&nbsp;&nbsp; ✓
      Cancel anytime
    </div>
  </div>
);
