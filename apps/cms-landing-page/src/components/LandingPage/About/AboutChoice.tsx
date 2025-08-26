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
