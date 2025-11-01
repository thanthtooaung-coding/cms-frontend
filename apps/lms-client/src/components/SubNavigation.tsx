import { Link } from 'react-router';
import { categories } from '../api/mockData';
// const categories = [
//   'Development',
//   'Business',
//   'Finance & Accounting',
//   'IT & Software',
//   'Design',
//   'Marketing',
//   'Photography',
//   'Health & Fitness',
//   'Music',
//   'Teaching',
// ];

export default function SubNavigation() {
  return (
    <div className="bg-white border-b border-gray-100 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4 lg:space-x-8 py-3 overflow-x-auto scrollbar-hide">
          <Link
            to={`/`}
            className="text-xs lg:text-sm text-gray-600 hover:text-purple-600 whitespace-nowrap transition-colors font-medium"
          >
            Home
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/courses?category=${encodeURIComponent(category.name)}`}
              className="text-xs lg:text-sm text-gray-600 hover:text-purple-600 whitespace-nowrap transition-colors font-medium"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
