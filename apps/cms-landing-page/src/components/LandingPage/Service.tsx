    import { Link } from 'react-router';

    type LMS = {
    name: string;
    path: string;
    description: string;
    lastUpdated: string;
    category: string;
    };

    const lmsList: LMS[] = [
    {
        name: 'LMS One',
        path: '/lms1',
        description: 'Manage courses, track progress, and assign content easily.',
        lastUpdated: 'July 5, 2025',
        category: 'Corporate Training',
    },
    {
        name: 'LMS Two',
        path: '/lms2',
        description: 'An interactive platform for K-12 learning environments.',
        lastUpdated: 'July 3, 2025',
        category: 'Education',
    },
    {
        name: 'LMS Three',
        path: '/lms3',
        description: 'Advanced tools for analytics and remote learning integration.',
        lastUpdated: 'July 2, 2025',
        category: 'Analytics Focused',
    },
    {
        name: 'LMS Four',
        path: '/lms4',
        description: 'Cloud-based LMS designed for universities with flexible modules.',
        lastUpdated: 'July 4, 2025',
        category: 'Higher Education',
    },
    {
        name: 'LMS Five',
        path: '/lms5',
        description: 'Gamified learning experience for engaging corporate teams.',
        lastUpdated: 'July 1, 2025',
        category: 'Corporate Training',
    },
    {
        name: 'LMS Six',
        path: '/lms6',
        description: 'Mobile-first platform optimized for remote learners.',
        lastUpdated: 'June 30, 2025',
        category: 'Remote Learning',
    },
    ];

    export default function Service() {

    return (
        <main id="services" className="p-10 max-w-7xl mx-auto rounded-xl ">
            <section className="text-center mb-12">
            <h2 className="text-4xl font-bold text-zinc-800 mb-2">Visit Demo Website</h2>
            <p className="text-indigo-900 text-lg">
                Select a platform to manage and monitor learning content
            </p>
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {lmsList.map((lms) => (
                <Link 
                    key={lms.name}
                    to={lms.path}>

                <div
                    className="group cursor-pointer rounded-2xl border border-pink-700 p-6 text-left shadow-sm transition-transform transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-violet-700 bg-white text-pink-900"
                >
                    <div className="mb-2">
                    <h3 className="text-xl font-semibold">{lms.name}</h3>
                    <span className="inline-block mt-1 text-xs font-medium bg-violet-700 text-white px-2 py-1 rounded">
                        {lms.category}
                    </span>
                    </div>

                    <p className="text-sm mb-4 text-indigo-700">{lms.description}</p>

                    <div className="flex items-center justify-between text-sm">
                    <span className="text-violet-700">Updated: {lms.lastUpdated}</span>
                    <span className="text-violet-700 flex items-center gap-1 group-hover:translate-x-1 transition">
                        Visit <span className="text-lg">→</span>
                    </span>
                    </div>
                </div>
                </Link>
            ))}
            </div>
        </main>
    );
    }
