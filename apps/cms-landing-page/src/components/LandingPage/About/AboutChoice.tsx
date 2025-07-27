import { Clock, CheckCircle } from 'lucide-react';

const highlights = [
  'Proven ROI',
  'User-Friendly Experience',
  '24/7 Support',
  'Seamless Updates',
  'Custom Workflows',
];

export const AboutChoice = () => (
  <section className="w-full bg-white py-8 px-0">
    <div className="rounded-2xl border border-gray-200 shadow-md p-0 flex flex-col items-stretch px-2 sm:px-4 lg:px-12 bg-white">
      {/* Top Section */}
      <div className="p-4 flex flex-col gap-3 w-full">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="text-blue-600 w-6 h-6" />
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
            30 Days Delivery
          </span>
        </div>
        <h3 className="w-full text-3xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400">
          One Project. One Month.
        </h3>
        <p className="w-full text-base text-gray-700 leading-relaxed">
          <span className="font-semibold text-gray-900">We don’t just talk speed </span>
          <br />
          <span className="text-blue-700 font-bold">We make it real.</span>
        </p>
        <p className="w-full text-sm text-gray-600 ">
          In just 30 days, we deliver complete software: from UX/UI and backend to database design
          and deployment.
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 w-full" />

      {/* Bottom Section */}
      <div className="p-4 flex flex-col gap-3 w-full">
        <h2 className="w-full text-xl sm:text-2xl font-extrabold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 leading-tight">
          Why Enterprises Choose Us
        </h2>
        <p className="w-full mb-1 text-sm sm:text-base text-gray-700 leading-relaxed">
          Built for momentum and scale, our all-in-one platform empowers teams to move fast with
          clarity, security, and precision. We eliminate complexity and delays so you can focus on
          driving real business impact.
        </p>
        <p className="w-full mb-1 text-sm sm:text-base text-gray-700 leading-relaxed">
          Whether you're streamlining workflows, enhancing collaboration, or scaling operations, our
          platform adapts seamlessly to your evolving needs.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
          {highlights.map((item, idx) => (
            <div key={idx} className="flex items-center text-gray-700 text-sm sm:text-base">
              <CheckCircle className="w-4 h-4 text-purple-600 mr-2 flex-shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
