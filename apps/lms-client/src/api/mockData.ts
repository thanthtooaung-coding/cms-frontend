import type { CourseData } from './types/courseData';
export const courseData: CourseData[] = [
  {
    category: {
      id: 3,
      name: 'Artificial Intelligence',
    },
    course: {
      id: 3,
      name: 'AI with Python: Build Smart Apps',
      imgUrl:
        'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400&h=225',
      shortDescription:
        'Master AI concepts and build intelligent Python applications using modern tools.',
      rating: {
        averageRating: 4.8,
        totalRating: 420,
      },
      totalEnrolledStudents: 3200,
      createdAt: '',
      updatedAt: '',
      whatYouWillLearn: [
        {
          id: 1,
          text: 'Build AI models using Python and libraries like TensorFlow & scikit-learn',
        },
        { id: 2, text: 'Understand machine learning and neural networks' },
        { id: 3, text: 'Preprocess and analyze data for machine learning tasks' },
        { id: 4, text: 'Implement supervised and unsupervised learning algorithms' },
        { id: 5, text: 'Evaluate model performance and optimize accuracy' },
        { id: 6, text: 'Deploy machine learning models to production environments' },
        { id: 7, text: 'Work on real-world projects to build practical AI skills' },
      ],

      duration: '60 hours',
      modules: [
        {
          id: 1,
          name: 'AI Foundations',
          lessons: [
            {
              id: 1,
              title: 'What is Artificial Intelligence?',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/ad79nYk2keg?si=1WsmNNt99QvZ0sQH',
            },
            {
              id: 2,
              title: 'History of Artificial Intelligence',
              materialType: 'Article',
              content: 'https://www.youtube.com/embed/mSd9nmPM7Vg?si=3U02If4RV7nKYHSp',
            },
            {
              id: 3,
              title: 'Types of AI: Narrow vs General AI',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/XFZ-rQ8eeR8?si=d9S-lPoz75bimLC2',
            },
            {
              id: 4,
              title: 'Machine Learning Basics',
              materialType: 'Article',
              content: 'https://www.youtube.com/embed/9gGnTQTYNaE?si=nlDSVD4DHFEhZ4_t',
            },
          ],
        },
      ],
      requirements: [{ id: 1, text: 'Basic Python knowledge required' }],
      description: 'A hands-on AI course for Python developers wanting to get into smart systems.',
    },
    instructor: {
      id: 3,
      name: 'Dr. Anil Rao',
      email: 'anil.rao@aitech.com',
      phoneNumber: '087-224-0001',
      totalCourses: 25,
      totalStudents: 12000,
    },
  },
  {
    category: {
      id: 4,
      name: 'Digital Marketing',
    },
    course: {
      id: 4,
      name: 'Digital Marketing Bootcamp 2025',
      imgUrl:
        'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=225',
      shortDescription:
        'All-in-one course to master SEO, Google Ads, social media marketing, and analytics.',
      rating: {
        averageRating: 4.5,
        totalRating: 580,
      },
      totalEnrolledStudents: 4500,
      createdAt: '',
      updatedAt: '',
      whatYouWillLearn: [
        { id: 1, text: 'SEO, SEM, Google Analytics, and YouTube marketing' },
        { id: 2, text: 'Run ads on Google, Instagram, Facebook, and LinkedIn' },
      ],
      duration: '42 hours 10 minutes',
      modules: [
        {
          id: 1,
          name: 'Marketing Fundamentals',
          lessons: [
            {
              id: 1,
              title: 'Marketing in the Digital Age',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/ZYw52nVZl_0?si=UYkUwLZKtZ29_tGY',
            },
            {
              id: 2,
              title: 'Understanding Consumer Behavior',
              materialType: 'Article',
              content: 'https://www.youtube.com/embed/QusJ4fpWQwA?si=sRXqVnbsdjSLEKvl',
            },
            {
              id: 3,
              title: 'Social Media Advertising Strategies',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/4ajmfzj9G1g?si=KRqn92VTqKc3x5Jj',
            },
          ],
        },
      ],
      requirements: [{ id: 1, text: 'No prior marketing experience required' }],
      description: 'Master digital marketing from scratch and run successful online campaigns.',
    },
    instructor: {
      id: 4,
      name: 'Sophia King',
      email: 'sophia.king@marketify.io',
      phoneNumber: '090-110-2211',
      totalCourses: 12,
      totalStudents: 5500,
    },
  },
  {
    category: {
      id: 1,
      name: 'Web Development',
    },
    course: {
      id: 5,
      name: 'Full-Stack Web Development with MERN',
      imgUrl:
        'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400&h=225',
      shortDescription: 'Become a full-stack developer using MongoDB, Express, React, and Node.js.',
      rating: {
        averageRating: 4.9,
        totalRating: 910,
      },
      totalEnrolledStudents: 6800,
      createdAt: '',
      updatedAt: '',
      whatYouWillLearn: [
        { id: 1, text: 'Build powerful full-stack apps with the MERN stack' },
        { id: 2, text: 'Deploy and manage web applications on cloud platforms' },
        { id: 3, text: 'Design and implement RESTful APIs using Express.js' },
        { id: 4, text: 'Master MongoDB for flexible and scalable data storage' },
        { id: 5, text: 'Use React to build dynamic and responsive user interfaces' },
        { id: 6, text: 'Handle user authentication and authorization securely' },
        { id: 7, text: 'Understand how to manage application state effectively' },
        { id: 8, text: 'Use Git and GitHub for version control and collaboration' },
        { id: 9, text: 'Integrate third-party APIs and services into applications' },
        { id: 10, text: 'Optimize performance and scalability of web apps' },
        { id: 11, text: 'Test your code using unit, integration, and end-to-end tests' },
        {
          id: 12,
          text: 'Implement responsive design with CSS frameworks like Tailwind or Bootstrap',
        },
        { id: 13, text: 'Work with WebSockets for real-time communication' },
        { id: 14, text: 'Set up continuous integration and deployment (CI/CD)' },
        { id: 15, text: 'Understand core principles of software architecture' },
        { id: 16, text: 'Build and manage modern development environments using Docker' },
        { id: 17, text: 'Debug and monitor applications using modern tools and techniques' },
      ],
      duration: '65 hours 30 minutes',
      modules: [
        {
          id: 1,
          name: 'Setting Up MERN Environment',
          lessons: [
            {
              id: 1,
              title: 'Installing Node.js and MongoDB',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/oOpdX35ZeK0?si=HEscVbzGiF8VN8CF',
            },
            {
              id: 2,
              title: 'Building a REST API with Express.js',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/pKd0Rpw7O48?si=LgUDoHVa9L-7eRxL',
            },
            {
              id: 3,
              title: 'Connecting Node.js to MongoDB',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/TlB_eWDSMt4?si=w8B3Dh0jMPCSh-MD',
            },
          ],
        },
        {
          id: 2,
          name: 'React Fundamentals',
          lessons: [
            {
              id: 1,
              title: 'Introduction to React',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/JJSoEo8JSnc',
            },
            {
              id: 2,
              title: 'React Components and Props',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/dpw9EHDh2bM',
            },
            {
              id: 3,
              title: 'State and Lifecycle in React',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/DPnqb74Smug',
            },
          ],
        },
        {
          id: 4,
          name: 'Express.js Advanced',
          lessons: [
            {
              id: 1,
              title: 'Middleware in Express',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/L72fhGm1tfE',
            },
            {
              id: 2,
              title: 'Authentication with JWT',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/7Q17ubqLfaM',
            },
            {
              id: 3,
              title: 'Error Handling and Debugging',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/gnsO8-xJ8rs',
            },
          ],
        },

        {
          id: 5,
          name: 'Frontend Routing with React Router',
          lessons: [
            {
              id: 1,
              title: 'Setting Up React Router',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/oPpnCh7InLY',
            },
          ],
        },
        {
          id: 6,
          name: 'Working with Redux for State Management',
          lessons: [
            {
              id: 1,
              title: 'Introduction to Redux',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/poQXNp9ItL4',
            },
            {
              id: 2,
              title: 'Redux Toolkit and Setup',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/9zySeP5vH9c',
            },
            {
              id: 3,
              title: 'Using Redux with React Components',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/t2ypzz6gJm0',
            },
          ],
        },
        {
  id: 8,
  name: 'Advanced Authentication Techniques',
  lessons: [
    {
      id: 1,
      title: 'JWT Authentication in Node.js',
      materialType: 'Video',
      content: 'https://www.youtube.com/embed/mbsmsi7l3r4',
    },
    {
      id: 2,
      title: 'OAuth 2.0 and Google Login Integration',
      materialType: 'Video',
      content: 'https://www.youtube.com/embed/Z1ktxiqyiLA',
    },
    {
      id: 3,
      title: 'Session vs Token-Based Authentication',
      materialType: 'Video',
      content: 'https://www.youtube.com/embed/X3qyxo_UTR4',
    },
  ],
},

        {
          id: 8,
          name: 'Deploying MERN Apps',
          lessons: [
            {
              id: 1,
              title: 'Preparing Your App for Deployment',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/gYzHS-n2gqU',
            },
            {
              id: 2,
              title: 'Deploying with Heroku and Vercel',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/71wSzpLyW9k',
            },
          ],
        },
      ],
      requirements: [{ id: 1, text: 'Basic HTML, CSS & JS knowledge' }],
      description: 'From front-end to back-end, become a MERN stack expert.',
    },
    instructor: {
      id: 5,
      name: 'Jake Miller',
      email: 'jake.miller@webhero.com',
      phoneNumber: '089-309-9942',
      totalCourses: 22,
      totalStudents: 11000,
    },
  },
  {
    category: { id: 7, name: 'Information Technology' },
    course: {
      id: 12,
      name: 'IT Support Fundamentals 2025',
      imgUrl:
        'https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&w=400&h=225',
      shortDescription:
        'Launch your IT career by mastering troubleshooting, OS management, and service desk skills.',
      rating: { averageRating: 4.5, totalRating: 400 },
      totalEnrolledStudents: 5100,
      createdAt: '',
      updatedAt: '',
      whatYouWillLearn: [
        { id: 1, text: 'Diagnose hardware & software issues' },
        { id: 2, text: 'Manage Windows & Linux environments' },
      ],
      duration: '40 hours 15 minutes',
      modules: [
        {
          id: 1,
          name: 'IT Basics',
          lessons: [
            {
              id: 1,
              title: 'How Computers Work',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/XZrckLYqdys?si=eEvjyyxwoIVsKsgY',
            },
            {
              id: 2,
              title: 'Introduction to Programming',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/zOjov-2OZ0E',
            },
            {
              id: 3,
              title: 'What is the Internet?',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/Dxcc6ycZ73M',
            },
            {
              id: 4,
              title: 'How Data Travels in a Network',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/3QhU9jd03a0',
            },
            {
              id: 5,
              title: 'Basics of Cybersecurity',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/6W8pmj6Aqoo',
            },
            {
              id: 6,
              title: 'Machine Learning Explained',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/GwIo3gDZCVQ',
            },
          ],
        },
      ],
      requirements: [{ id: 1, text: 'No IT experience needed' }],
      description: 'Prepare for real-world IT support jobs and CompTIA A+ certification.',
    },
    instructor: {
      id: 12,
      name: 'Brian O’Neil',
      email: 'brian.oneil@techlaunch.com',
      phoneNumber: '081-443-2210',
      totalCourses: 14,
      totalStudents: 8100,
    },
  },
  {
    category: { id: 5, name: 'Data Science' },
    course: {
      id: 8,
      name: 'Data Science with Python & Pandas',
      imgUrl: 'https://miro.medium.com/v2/resize:fit:4800/format:webp/0*DypQzAMdE9cudggX',
      shortDescription: 'Analyze and visualize data using Python, NumPy, Pandas, and Matplotlib.',
      rating: { averageRating: 4.7, totalRating: 520 },
      totalEnrolledStudents: 3400,
      createdAt: '',
      updatedAt: '',
      whatYouWillLearn: [
        { id: 1, text: 'Perform data analysis with Pandas' },
        { id: 2, text: 'Visualize insights using Matplotlib & Seaborn' },
      ],
      duration: '52 hours',
      modules: [
        {
          id: 1,
          name: 'Data Analysis Basics',
          lessons: [
            {
              id: 1,
              title: 'Working with DataFrames',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/YRJbhFLLPyE?si=OKaRrAqngn23i_-0',
            },
          ],
        },
        {
          id: 2,
          name: 'Python for Data Science',
          lessons: [
            {
              id: 1,
              title: 'Introduction to Pandas',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/vmEHCJofslg',
            },
            {
              id: 2,
              title: 'Using NumPy Arrays',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/QUT1VHiLmmI',
            },
          ],
        },
        {
          id: 3,
          name: 'Data Visualization',
          lessons: [
            {
              id: 1,
              title: 'Visualizing Data with Matplotlib',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/a9UrKTVEeZA',
            },
            {
              id: 2,
              title: 'Seaborn Basics',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/6GUZXDef2U0',
            },
          ],
        },
        {
          id: 4,
          name: 'Statistics for Data Analysis',
          lessons: [
            {
              id: 1,
              title: 'Descriptive Statistics',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/Gv9_4yMHFhI',
            },
            {
              id: 2,
              title: 'Probability Concepts',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/KzZ_8mNxsIY',
            },
          ],
        },
      ],
      requirements: [{ id: 1, text: 'Python basics' }],
      description: 'Master data wrangling, exploration, and visualization with Python.',
    },
    instructor: {
      id: 8,
      name: 'Dr. Neha Kapoor',
      email: 'neha.kapoor@datasage.ai',
      phoneNumber: '093-112-4567',
      totalCourses: 10,
      totalStudents: 7300,
    },
  },
  {
    category: {
      id: 3,
      name: 'Artificial Intelligence',
    },
    course: {
      id: 6,
      name: 'ChatGPT for Developers & Businesses',
      imgUrl:
        'https://images.pexels.com/photos/15863022/pexels-photo-15863022.jpeg?auto=compress&cs=tinysrgb&w=400&h=225',
      shortDescription:
        'Leverage OpenAI’s ChatGPT in your apps and services using APIs and prompt engineering.',
      rating: {
        averageRating: 4.9,
        totalRating: 610,
      },
      totalEnrolledStudents: 2200,
      createdAt: '',
      updatedAt: '',
      whatYouWillLearn: [
        { id: 1, text: 'Integrate ChatGPT into apps using OpenAI API' },
        { id: 2, text: 'Master prompt engineering for tailored results' },
      ],
      duration: '22 hours 15 minutes',
      modules: [
        {
          id: 2,
          name: 'Machine Learning Basics',
          lessons: [
            {
              id: 1,
              title: 'What is Machine Learning?',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/GwIo3gDZCVQ?si=lxz3fMo-TOFFhNGm',
            },
            {
              id: 2,
              title: 'Supervised vs Unsupervised Learning',
              materialType: 'Article',
              content: 'https://www.ibm.com/topics/supervised-learning',
            },
            {
              id: 3,
              title: 'Overfitting and Underfitting in ML',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/EuBBz3bI-aA?si=I4GkY9a8IRZ1ZT_k',
            },
          ],
        },
      ],

      requirements: [{ id: 1, text: 'Basic programming skills' }],
      description: 'Build smarter apps and services using ChatGPT & OpenAI tools.',
    },
    instructor: {
      id: 6,
      name: "Ava D'Souza",
      email: 'ava.dsouza@genai.co',
      phoneNumber: '088-004-8899',
      totalCourses: 8,
      totalStudents: 4700,
    },
  },
  {
    category: {
      id: 2,
      name: 'Cyber Security',
    },
    course: {
      id: 7,
      name: 'Cybersecurity for Beginners: 2025 Edition',
      imgUrl:
        'https://images.pexels.com/photos/5380667/pexels-photo-5380667.jpeg?auto=compress&cs=tinysrgb&w=400&h=225',
      shortDescription:
        'Understand cyber threats and learn how to protect your digital life and business.',
      rating: {
        averageRating: 4.4,
        totalRating: 310,
      },
      totalEnrolledStudents: 2900,
      createdAt: '',
      updatedAt: '',
      whatYouWillLearn: [
        { id: 1, text: 'Understand how cyberattacks work' },
        { id: 2, text: 'Learn how to secure personal and organizational data' },
      ],
      duration: '35 hours',
      modules: [
        {
          id: 1,
          name: 'Cybersecurity Basics',
          lessons: [
            {
              id: 1,
              title: 'Understanding Threat Vectors',
              materialType: 'Video',
              content: 'https://example.com/threat-vectors',
            },
          ],
        },
      ],
      requirements: [{ id: 1, text: 'No previous cybersecurity knowledge needed' }],
      description: 'A practical guide for anyone who wants to understand and avoid online threats.',
    },
    instructor: {
      id: 7,
      name: 'Kevin Miles',
      email: 'kevin.miles@cybershield.org',
      phoneNumber: '082-230-3030',
      totalCourses: 15,
      totalStudents: 9000,
    },
  },
  {
    category: { id: 2, name: 'Cyber Security' },
    course: {
      id: 11,
      name: 'Advanced Penetration Testing & Exploit Development',
      imgUrl:
        'https://images.pexels.com/photos/5380643/pexels-photo-5380643.jpeg?auto=compress&cs=tinysrgb&w=400&h=225',
      shortDescription:
        'Go beyond ethical hacking and learn to develop custom exploits and advanced attacks.',
      rating: { averageRating: 4.8, totalRating: 310 },
      totalEnrolledStudents: 1900,
      createdAt: '',
      updatedAt: '',
      whatYouWillLearn: [
        { id: 1, text: 'Exploit buffer overflows and vulnerabilities' },
        { id: 2, text: 'Use Metasploit, Burp Suite, and custom scripts' },
      ],
      duration: '50 hours',
      modules: [
        {
          id: 5,
          name: 'Introduction to Cybersecurity',
          lessons: [
            {
              id: 1,
              title: 'What is Cybersecurity?',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/inWWhr5tnEA?si=z1q4Z7gLqPjAHGfg',
            },
            {
              id: 2,
              title: 'Common Cyber Threats',
              materialType: 'Article',
              content: 'https://www.cisa.gov/news-events/news/understanding-cyber-threats',
            },
            {
              id: 3,
              title: 'CIA Triad: Confidentiality, Integrity, Availability',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/Rxtv86YpEVU?si=0mKzD71R9kjTVhtJ',
            },
            {
              id: 4,
              title: 'Careers in Cybersecurity',
              materialType: 'Article',
              content: 'https://www.coursera.org/articles/cybersecurity-careers',
            },
          ],
        },
      ],
      requirements: [{ id: 1, text: 'Strong networking and OS knowledge' }],
      description: 'Master advanced red teaming and vulnerability exploitation techniques.',
    },
    instructor: {
      id: 11,
      name: 'Rajesh Varma',
      email: 'rajesh.varma@pentestforce.org',
      phoneNumber: '082-556-4444',
      totalCourses: 7,
      totalStudents: 5200,
    },
  },

  {
    category: { id: 7, name: 'Information Technology' },
    course: {
      id: 20,
      name: 'Database Administration Basics',
      imgUrl:
        'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400&h=225',
      shortDescription:
        'Learn to design, manage, and optimize relational databases using SQL and MySQL.',
      rating: { averageRating: 4.5, totalRating: 290 },
      totalEnrolledStudents: 3500,
      createdAt: '',
      updatedAt: '',
      whatYouWillLearn: [
        { id: 1, text: 'Database schema design' },
        { id: 2, text: 'SQL querying and optimization' },
      ],
      duration: '38 hours 30 minutes',
      modules: [
        {
          id: 1,
          name: 'Database Basics',
          lessons: [
            {
              id: 1,
              title: 'SQL Fundamentals',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/3s0lFtUrhSQ?si=yWfc9zhZUS_TGXcF',
            },
          ],
        },
        {
          id: 2,
          name: 'Advanced SQL Concepts',
          lessons: [
            {
              id: 1,
              title: 'Understanding Joins',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/9yeOJ0ZMUYw?si=R1Bk-w7ujl9W3kL4',
            },
            {
              id: 2,
              title: 'SQL Indexes Explained',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/Jrwh9iP9K-Y?si=1X9wYfwosZcA1ukH',
            },
          ],
        },
      ],
      requirements: [{ id: 1, text: 'Basic IT skills' }],
      description: 'Build strong database skills for IT and software careers.',
    },
    instructor: {
      id: 20,
      name: 'Anna Kim',
      email: 'anna.kim@dbmasters.com',
      phoneNumber: '080-224-3345',
      totalCourses: 8,
      totalStudents: 4200,
    },
  },
  {
    category: { id: 8, name: 'Networking' },
    course: {
      id: 17,
      name: 'Cisco CCNA Certification Prep',
      imgUrl:
        'https://images.pexels.com/photos/4492101/pexels-photo-4492101.jpeg?auto=compress&cs=tinysrgb&w=400&h=225',
      shortDescription:
        'Prepare for the CCNA exam with hands-on labs and detailed protocol coverage.',
      rating: { averageRating: 4.9, totalRating: 520 },
      totalEnrolledStudents: 5200,
      createdAt: '',
      updatedAt: '',
      whatYouWillLearn: [
        { id: 1, text: 'Routing and switching concepts' },
        { id: 2, text: 'Subnetting, VLANs, and WAN technologies' },
      ],
      duration: '58 hours',
      modules: [
        {
          id: 1,
          name: 'Networking Fundamentals',
          lessons: [
            {
              id: 1,
              title: 'What is Computer Networking?',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/qkJ9wWTkkUQ?si=V4AJN1OukIMCgHQP',
            },
            {
              id: 2,
              title: 'The OSI Model Explained',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/vv4y_uOneC0?si=iK0wWWXlMsKJbmYO',
            },
          ],
        },
        {
          id: 2,
          name: 'Advanced Networking Concepts',
          lessons: [
            {
              id: 1,
              title: 'IP Addressing and Subnetting',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/m6oAR8ZDbqo?si=a3ysOJGE5sC7FnlL',
            },
            {
              id: 2,
              title: 'Routing and Switching Basics',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/7zM5rGc7AFM?si=PAQ14d2qxP3mQ6Qi',
            },
            {
              id: 3,
              title: 'Network Address Translation (NAT)',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/_Ezk1D1fFCI?si=2bWDlvYz5fUohC2G',
            },
          ],
        },
      ],

      requirements: [{ id: 1, text: 'Basic networking knowledge' }],
      description: 'Your complete guide to passing the Cisco CCNA certification.',
    },
    instructor: {
      id: 17,
      name: 'Chris Johnson',
      email: 'chris.johnson@netcerts.com',
      phoneNumber: '088-997-1122',
      totalCourses: 12,
      totalStudents: 9800,
    },
  },
  {
    category: { id: 7, name: 'Information Technology' },
    course: {
      id: 20,
      name: 'Database Administration Basics',
      imgUrl:
        'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400&h=225',
      shortDescription:
        'Learn to design, manage, and optimize relational databases using SQL and MySQL.',
      rating: { averageRating: 4.5, totalRating: 290 },
      totalEnrolledStudents: 3500,
      createdAt: '',
      updatedAt: '',
      whatYouWillLearn: [
        { id: 1, text: 'Database schema design' },
        { id: 2, text: 'SQL querying and optimization' },
      ],
      duration: '38 hours 30 minutes',
      modules: [
        {
          id: 1,
          name: 'Database Basics',
          lessons: [
            {
              id: 1,
              title: 'SQL Fundamentals',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/3s0lFtUrhSQ?si=yWfc9zhZUS_TGXcF',
            },
            {
              id: 2,
              title: 'What is a Relational Database?',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/h0nxCDiD-zg?si=JtZ1hePUsDEylFMJ',
            },
            {
              id: 3,
              title: 'Primary and Foreign Keys',
              materialType: 'Article',
              content: 'https://www.geeksforgeeks.org/primary-key-vs-foreign-key/',
            },
          ],
        },
        {
          id: 2,
          name: 'Advanced SQL Concepts',
          lessons: [
            {
              id: 1,
              title: 'Understanding Joins',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/9yeOJ0ZMUYw?si=R1Bk-w7ujl9W3kL4',
            },
            {
              id: 2,
              title: 'SQL Indexes Explained',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/Jrwh9iP9K-Y?si=1X9wYfwosZcA1ukH',
            },
            {
              id: 3,
              title: 'Subqueries and Nested SELECTs',
              materialType: 'Article',
              content: 'https://mode.com/sql-tutorial/sql-sub-queries/',
            },
          ],
        },
        {
          id: 3,
          name: 'Database Design & Normalization',
          lessons: [
            {
              id: 1,
              title: 'Database Schema Design Basics',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/ztHopE5Wnpc?si=VqO1E63yQ8A_QntF',
            },
            {
              id: 2,
              title: '1NF, 2NF, and 3NF Explained',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/GFQaEYEc8_8?si=NVepuMyI-n2WEVuZ',
            },
            {
              id: 3,
              title: 'ER Diagrams and Modeling',
              materialType: 'Article',
              content: 'https://www.lucidchart.com/pages/er-diagrams',
            },
            {
              id: 4,
              title: 'Denormalization and Performance',
              materialType: 'Article',
              content: 'https://www.geeksforgeeks.org/denormalization-in-databases/',
            },
          ],
        },
        {
          id: 4,
          name: 'Working with NoSQL Databases',
          lessons: [
            {
              id: 1,
              title: 'What is NoSQL?',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/qI_g07C_Q5I?si=MF5WnW6MZXwZ7rKY',
            },
            {
              id: 2,
              title: 'Document vs Key-Value vs Graph DBs',
              materialType: 'Article',
              content: 'https://www.mongodb.com/nosql-explained',
            },
            {
              id: 3,
              title: 'Introduction to MongoDB',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/-56x56UppqQ?si=4c7iD4IjO38zRl_1',
            },
            {
              id: 4,
              title: 'When to Use SQL vs NoSQL',
              materialType: 'Article',
              content: 'https://www.codecademy.com/article/sql-vs-nosql',
            },
          ],
        },
      ],
      requirements: [{ id: 1, text: 'Basic IT skills' }],
      description: 'Build strong database skills for IT and software careers.',
    },
    instructor: {
      id: 20,
      name: 'Anna Kim',
      email: 'anna.kim@dbmasters.com',
      phoneNumber: '080-224-3345',
      totalCourses: 8,
      totalStudents: 4200,
    },
  },

  {
    category: { id: 1, name: 'Web Development' },
    course: {
      id: 14,
      name: 'JavaScript Essentials: From Beginner to Pro',
      imgUrl:
        'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400&h=225',
      shortDescription:
        'Learn JavaScript programming to create dynamic, interactive web applications.',
      rating: { averageRating: 4.8, totalRating: 600 },
      totalEnrolledStudents: 5600,
      createdAt: '',
      updatedAt: '',
      whatYouWillLearn: [
        { id: 1, text: 'JavaScript syntax and programming basics' },
        { id: 2, text: 'DOM manipulation and event handling' },
      ],
      duration: '55 hours',
      modules: [
        {
          id: 1,
          name: 'HTML & CSS Basics',
          lessons: [
            {
              id: 1,
              title: 'Introduction to HTML',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/pQN-pnXPaVg?si=fAVOZTYtUpRGyZIF',
            },
            {
              id: 2,
              title: 'Styling with CSS',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/1PnVor36_40?si=0Ao3z5I-2OEzRa9y',
            },
            {
              id: 3,
              title: 'Box Model & Layouts',
              materialType: 'Article',
              content:
                'https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model',
            },
          ],
        },
        {
          id: 2,
          name: 'JavaScript Essentials',
          lessons: [
            {
              id: 1,
              title: 'JavaScript Basics',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/W6NZfCO5SIk?si=Ft9KJ3etpIRa8Lr5',
            },
            {
              id: 2,
              title: 'DOM Manipulation',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/0ik6X4DJKCc?si=XjvwA5G8GFDRitv4',
            },
            {
              id: 3,
              title: 'Events and Event Handling',
              materialType: 'Article',
              content:
                'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events',
            },
          ],
        },
        {
          id: 3,
          name: 'Frontend Frameworks',
          lessons: [
            {
              id: 1,
              title: 'Getting Started with React',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/bMknfKXIFA8?si=hwg7FOLiHkBp8R-p',
            },
            {
              id: 2,
              title: 'Components and Props in React',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/MhkGQAoc7bc?si=K0ojZEB8Zb4upD7z',
            },
            {
              id: 3,
              title: 'React State and Hooks',
              materialType: 'Article',
              content: 'https://react.dev/learn/state-a-components-memory',
            },
            {
              id: 4,
              title: 'Routing in React',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/Law7wfdg_ls?si=3q7TVeMJpn7QUwMf',
            },
          ],
        },
        {
          id: 4,
          name: 'Backend Development',
          lessons: [
            {
              id: 1,
              title: 'Introduction to Node.js',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/TlB_eWDSMt4?si=NV7sXt5zGHkPAZkF',
            },
            {
              id: 2,
              title: 'Creating a REST API with Express',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/l8WPWK9mS5M?si=TE6h3gvkOfnY9atY',
            },
            {
              id: 3,
              title: 'Connecting to MongoDB',
              materialType: 'Article',
              content: 'https://www.mongodb.com/languages/express-mongodb-rest-api-tutorial',
            },
            {
              id: 4,
              title: 'CRUD Operations with Express & MongoDB',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/-0exw-9YJBo?si=FyfbYKeSKQYeUw9B',
            },
          ],
        },
      ],
      requirements: [{ id: 1, text: 'Basic HTML and CSS knowledge' }],
      description:
        'Step up your front-end skills with one of the most popular programming languages.',
    },
    instructor: {
      id: 14,
      name: 'Maya Patel',
      email: 'maya.patel@codecraft.io',
      phoneNumber: '084-229-4411',
      totalCourses: 15,
      totalStudents: 9500,
    },
  },
  {
    category: { id: 9, name: 'Data Science' },
    course: {
      id: 28,
      name: 'Deep Learning with TensorFlow',
      imgUrl:
        'https://images.pexels.com/photos/1181349/pexels-photo-1181349.jpeg?auto=compress&cs=tinysrgb&w=400&h=225',
      shortDescription: 'Build and train deep neural networks using TensorFlow for complex tasks.',
      rating: { averageRating: 4.9, totalRating: 390 },
      totalEnrolledStudents: 4800,
      createdAt: '',
      updatedAt: '',
      whatYouWillLearn: [
        { id: 1, text: 'Neural network architectures' },
        { id: 2, text: 'Implementing CNNs and RNNs with TensorFlow' },
      ],
      duration: '50 hours',
      modules: [
        {
          id: 1,
          name: 'Introduction to Data Science',
          lessons: [
            {
              id: 1,
              title: 'What is Data Science?',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/X3paOmcrTjQ?si=0gyShbEV8mnvvbL1',
            },
            {
              id: 2,
              title: 'The Data Science Process',
              materialType: 'Article',
              content: 'https://www.ibm.com/topics/data-science',
            },
            {
              id: 3,
              title: 'Roles in a Data Science Team',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/-ETQ97mXXF0?si=X_mMyEkIvkuMxM1u',
            },
          ],
        },
        {
          id: 2,
          name: 'Python for Data Science',
          lessons: [
            {
              id: 1,
              title: 'Using Pandas for Data Analysis',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/vmEHCJofslg?si=AH11Q-o2rK2jHizB',
            },
            {
              id: 2,
              title: 'Data Visualization with Matplotlib & Seaborn',
              materialType: 'Article',
              content: 'https://realpython.com/python-matplotlib-guide/',
            },
            {
              id: 3,
              title: 'Working with NumPy Arrays',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/QUT1VHiLmmI?si=cHhykuRopNLJgGyW',
            },
          ],
        },
      ],
      requirements: [{ id: 1, text: 'Basic Python and machine learning knowledge' }],
      description: 'Advance your AI skills with hands-on deep learning projects.',
    },
    instructor: {
      id: 28,
      name: 'Sophia Nguyen',
      email: 'sophia.nguyen@deeplearners.com',
      phoneNumber: '086-772-9912',
      totalCourses: 11,
      totalStudents: 7200,
    },
  },
  {
    category: { id: 9, name: 'Data Science' },
    course: {
      id: 27,
      name: 'Machine Learning Fundamentals',
      imgUrl:
        'https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?auto=compress&cs=tinysrgb&w=400&h=225',
      shortDescription:
        'Get introduced to machine learning algorithms and concepts for practical applications.',
      rating: { averageRating: 4.8, totalRating: 470 },
      totalEnrolledStudents: 6100,
      createdAt: '',
      updatedAt: '',
      whatYouWillLearn: [
        { id: 1, text: 'Supervised and unsupervised learning techniques' },
        { id: 2, text: 'Model evaluation and optimization' },
      ],
      duration: '55 hours',
      modules: [
        {
          id: 1,
          name: 'Introduction to Data Science',
          lessons: [
            {
              id: 1,
              title: 'What is Data Science?',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/X3paOmcrTjQ?si=0gyShbEV8mnvvbL1',
            },
            {
              id: 2,
              title: 'The Data Science Process',
              materialType: 'Article',
              content: 'https://www.ibm.com/topics/data-science',
            },
            {
              id: 3,
              title: 'Roles in a Data Science Team',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/-ETQ97mXXF0?si=X_mMyEkIvkuMxM1u',
            },
          ],
        },
        {
          id: 2,
          name: 'Python for Data Science',
          lessons: [
            {
              id: 1,
              title: 'Using Pandas for Data Analysis',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/vmEHCJofslg?si=AH11Q-o2rK2jHizB',
            },
            {
              id: 2,
              title: 'Data Visualization with Matplotlib & Seaborn',
              materialType: 'Article',
              content: 'https://realpython.com/python-matplotlib-guide/',
            },
            {
              id: 3,
              title: 'Working with NumPy Arrays',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/QUT1VHiLmmI?si=cHhykuRopNLJgGyW',
            },
          ],
        },
      ],
      requirements: [{ id: 1, text: 'Basic statistics and Python knowledge' }],
      description: 'Learn foundational machine learning skills to build predictive models.',
    },
    instructor: {
      id: 27,
      name: 'Michael Turner',
      email: 'michael.turner@mlacademy.com',
      phoneNumber: '085-661-4433',
      totalCourses: 14,
      totalStudents: 9500,
    },
  },
  {
    category: { id: 9, name: 'Data Science' },
    course: {
      id: 26,
      name: 'Data Science with Python and Pandas',
      imgUrl:
        'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400&h=225',
      shortDescription:
        'Learn data manipulation, analysis, and visualization using Python and Pandas.',
      rating: { averageRating: 4.7, totalRating: 400 },
      totalEnrolledStudents: 5200,
      createdAt: '',
      updatedAt: '',
      whatYouWillLearn: [
        { id: 1, text: 'Data cleaning and preprocessing with Pandas' },
        { id: 2, text: 'Exploratory data analysis and visualization' },
      ],
      duration: '40 hours',
      modules: [
        {
          id: 1,
          name: 'Python Fundamentals',
          lessons: [
            {
              id: 1,
              title: 'Introduction to Python',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/rfscVS0vtbw?si=lZl8yXmH0WZcZW0X',
            },
            {
              id: 2,
              title: 'Variables, Data Types, and Operators',
              materialType: 'Article',
              content: 'https://realpython.com/python-data-types/',
            },
            {
              id: 3,
              title: 'Control Flow: if, else, and loops',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/7qlb1p5YBzA?si=Itcsd5T4-mg65C5d',
            },
          ],
        },
        {
          id: 2,
          name: 'Intermediate Python',
          lessons: [
            {
              id: 1,
              title: 'Functions and Scope',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/NSbOtYzIQI0?si=bUmE5nPni3qRu-T1',
            },
            {
              id: 2,
              title: 'Working with Lists and Dictionaries',
              materialType: 'Article',
              content: 'https://realpython.com/python-lists-tuples/',
            },
            {
              id: 3,
              title: 'File Handling in Python',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/Uh2ebFW8OYM?si=dDcHOAWBfhB1RRTF',
            },
          ],
        },
      ],
      requirements: [{ id: 1, text: 'Basic Python programming skills' }],
      description: 'Master data science essentials with Python’s most powerful libraries.',
    },
    instructor: {
      id: 26,
      name: 'Emily Carter',
      email: 'emily.carter@datasciencestudio.com',
      phoneNumber: '084-775-3321',
      totalCourses: 9,
      totalStudents: 6800,
    },
  },
  {
    category: { id: 8, name: 'Networking' },
    course: {
      id: 25,
      name: 'IPv6 Fundamentals and Configuration',
      imgUrl:
        'https://images.pexels.com/photos/3861957/pexels-photo-3861957.jpeg?auto=compress&cs=tinysrgb&w=400&h=225',
      shortDescription:
        'Learn the IPv6 protocol, addressing, and configuration to prepare for modern networks.',
      rating: { averageRating: 4.6, totalRating: 260 },
      totalEnrolledStudents: 3000,
      createdAt: '',
      updatedAt: '',
      whatYouWillLearn: [
        { id: 1, text: 'IPv6 addressing and subnetting' },
        { id: 2, text: 'IPv6 routing protocols' },
      ],
      duration: '36 hours',
      modules: [
        {
          id: 1,
          name: 'Networking Fundamentals',
          lessons: [
            {
              id: 1,
              title: 'What is Computer Networking?',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/qkJ9wWTkkUQ?si=V4AJN1OukIMCgHQP',
            },
            {
              id: 2,
              title: 'Understanding the OSI Model',
              materialType: 'Article',
              content:
                'https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/',
            },
            {
              id: 3,
              title: 'TCP/IP Protocol Suite',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/6ewMzFYpZcc?si=tuN1DxA69e9vYebS',
            },
          ],
        },
        {
          id: 2,
          name: 'Applied Networking Concepts',
          lessons: [
            {
              id: 1,
              title: 'IP Addressing and Subnetting',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/m6oAR8ZDbqo?si=3s7c5Ac5IGgsZXL9',
            },
            {
              id: 2,
              title: 'Routing and Switching Basics',
              materialType: 'Article',
              content: 'https://www.geeksforgeeks.org/difference-between-routing-and-switching/',
            },
            {
              id: 3,
              title: 'DNS Explained',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/72snZctFFtA?si=sL-X99Dmb9cH3JdC',
            },
          ],
        },
      ],
      requirements: [{ id: 1, text: 'Basic IPv4 knowledge' }],
      description: 'Prepare for the future with IPv6 knowledge and hands-on configuration skills.',
    },
    instructor: {
      id: 25,
      name: 'Jessica Wu',
      email: 'jessica.wu@nextgennetwork.com',
      phoneNumber: '083-991-2244',
      totalCourses: 7,
      totalStudents: 3900,
    },
  },
  {
    category: { id: 8, name: 'Networking' },
    course: {
      id: 23,
      name: 'Advanced Routing and Switching',
      imgUrl:
        'https://images.pexels.com/photos/3861948/pexels-photo-3861948.jpeg?auto=compress&cs=tinysrgb&w=400&h=225',
      shortDescription:
        'Explore advanced routing protocols and switching techniques for enterprise networks.',
      rating: { averageRating: 4.8, totalRating: 415 },
      totalEnrolledStudents: 4800,
      createdAt: '',
      updatedAt: '',
      whatYouWillLearn: [
        { id: 1, text: 'OSPF, EIGRP, and BGP protocols' },
        { id: 2, text: 'VLAN and trunking configuration' },
      ],
      duration: '60 hours',
      modules: [
        {
          id: 1,
          name: 'Networking Fundamentals',
          lessons: [
            {
              id: 1,
              title: 'What is Computer Networking?',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/qkJ9wWTkkUQ?si=V4AJN1OukIMCgHQP',
            },
            {
              id: 2,
              title: 'Understanding the OSI Model',
              materialType: 'Article',
              content:
                'https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/',
            },
            {
              id: 3,
              title: 'TCP/IP Protocol Suite',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/6ewMzFYpZcc?si=tuN1DxA69e9vYebS',
            },
          ],
        },
        {
          id: 2,
          name: 'Applied Networking Concepts',
          lessons: [
            {
              id: 1,
              title: 'IP Addressing and Subnetting',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/m6oAR8ZDbqo?si=3s7c5Ac5IGgsZXL9',
            },
            {
              id: 2,
              title: 'Routing and Switching Basics',
              materialType: 'Article',
              content: 'https://www.geeksforgeeks.org/difference-between-routing-and-switching/',
            },
            {
              id: 3,
              title: 'DNS Explained',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/72snZctFFtA?si=sL-X99Dmb9cH3JdC',
            },
          ],
        },
      ],
      requirements: [{ id: 1, text: 'Intermediate networking knowledge' }],
      description: 'Deepen your understanding of routing and switching for complex networks.',
    },
    instructor: {
      id: 23,
      name: 'Samantha King',
      email: 'samantha.king@advnetworks.com',
      phoneNumber: '088-223-4411',
      totalCourses: 10,
      totalStudents: 8500,
    },
  },
  {
    category: { id: 3, name: 'Artificial Intelligence' },
    course: {
      id: 31,
      name: 'AI Ethics and Policy',
      imgUrl:
        'https://images.pexels.com/photos/1181670/pexels-photo-1181670.jpeg?auto=compress&cs=tinysrgb&w=400&h=225',
      shortDescription:
        'Understand ethical challenges and policy considerations in AI development.',
      rating: { averageRating: 4.5, totalRating: 290 },
      totalEnrolledStudents: 3700,
      createdAt: '',
      updatedAt: '',
      whatYouWillLearn: [
        { id: 1, text: 'Bias and fairness in AI systems' },
        { id: 2, text: 'Global AI regulations and governance' },
      ],
      duration: '30 hours',
      modules: [
        {
          id: 1,
          name: 'AI Fundamentals',
          lessons: [
            {
              id: 1,
              title: 'What is Artificial Intelligence?',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/uMzUB89uSxU?si=xioX-dVXlrzswnhi',
            },
            {
              id: 2,
              title: 'History of Artificial Intelligence',
              materialType: 'Article',
              content: 'https://www.youtube.com/embed/JcXKbUIebrU?si=KoMritbmbU_48MOO',
            },
            {
              id: 3,
              title: 'Types of AI: Narrow vs General AI',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/CyOwrIj6JU4?si=eahVODaxvAhpoO2w',
            },
          ],
        },
        {
          id: 2,
          name: 'Machine Learning Basics',
          lessons: [
            {
              id: 1,
              title: 'Introduction to Machine Learning',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/GwIo3gDZCVQ?si=qUs6upXDtch8cuZn',
            },
            {
              id: 2,
              title: 'Supervised vs Unsupervised Learning',
              materialType: 'Article',
              content:
                'https://machinelearningmastery.com/supervised-and-unsupervised-machine-learning-algorithms/',
            },
            {
              id: 3,
              title: 'Common Algorithms in Machine Learning',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/ukzFI9rgwfU?si=L02_-gJuYMQHGg0P',
            },
          ],
        },
      ],
      requirements: [{ id: 1, text: 'Interest in AI and social impact' }],
      description: 'Learn to develop and deploy AI responsibly and ethically.',
    },
    instructor: {
      id: 31,
      name: 'Dr. Rachel Kim',
      email: 'rachel.kim@aipolicy.org',
      phoneNumber: '089-338-2244',
      totalCourses: 7,
      totalStudents: 5300,
    },
  },
  {
    category: { id: 3, name: 'Artificial Intelligence' },
    course: {
      id: 30,
      name: 'Reinforcement Learning: Basics to Advanced',
      imgUrl:
        'https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=400&h=225',
      shortDescription:
        'Master reinforcement learning algorithms for autonomous decision-making systems.',
      rating: { averageRating: 4.8, totalRating: 350 },
      totalEnrolledStudents: 4100,
      createdAt: '',
      updatedAt: '',
      whatYouWillLearn: [
        { id: 1, text: 'Q-learning and policy gradient methods' },
        { id: 2, text: 'Implement RL in simulated environments' },
      ],
      duration: '50 hours',
      modules: [
        {
          id: 1,
          name: 'AI Fundamentals',
          lessons: [
            {
              id: 1,
              title: 'What is Artificial Intelligence?',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/uMzUB89uSxU?si=xioX-dVXlrzswnhi',
            },
            {
              id: 2,
              title: 'History of Artificial Intelligence',
              materialType: 'Article',
              content: 'https://www.youtube.com/embed/JcXKbUIebrU?si=KoMritbmbU_48MOO',
            },
            {
              id: 3,
              title: 'Types of AI: Narrow vs General AI',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/CyOwrIj6JU4?si=eahVODaxvAhpoO2w',
            },
          ],
        },
        {
          id: 2,
          name: 'Machine Learning Basics',
          lessons: [
            {
              id: 1,
              title: 'Introduction to Machine Learning',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/GwIo3gDZCVQ?si=qUs6upXDtch8cuZn',
            },
            {
              id: 2,
              title: 'Supervised vs Unsupervised Learning',
              materialType: 'Article',
              content:
                'https://machinelearningmastery.com/supervised-and-unsupervised-machine-learning-algorithms/',
            },
            {
              id: 3,
              title: 'Common Algorithms in Machine Learning',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/ukzFI9rgwfU?si=L02_-gJuYMQHGg0P',
            },
          ],
        },
      ],
      requirements: [{ id: 1, text: 'Basic knowledge of machine learning and Python' }],
      description: 'Build intelligent agents that learn from their environment.',
    },
    instructor: {
      id: 30,
      name: 'Jason Lee',
      email: 'jason.lee@reinforceai.com',
      phoneNumber: '088-774-9933',
      totalCourses: 10,
      totalStudents: 6200,
    },
  },
  {
    category: { id: 4, name: 'Digital Marketing' },
    course: {
      id: 32,
      name: 'Social Media Marketing Masterclass',
      imgUrl:
        'https://images.pexels.com/photos/3184299/pexels-photo-3184299.jpeg?auto=compress&cs=tinysrgb&w=400&h=225',
      shortDescription:
        'Learn to create, manage, and optimize social media campaigns across platforms.',
      rating: { averageRating: 4.7, totalRating: 420 },
      totalEnrolledStudents: 5800,
      createdAt: '',
      updatedAt: '',
      whatYouWillLearn: [
        { id: 1, text: 'Social media strategy for Facebook, Instagram, LinkedIn' },
        { id: 2, text: 'Content creation and audience engagement' },
      ],
      duration: '38 hours',
      modules: [
        {
          id: 1,
          name: 'Digital Marketing Basics',
          lessons: [
            {
              id: 1,
              title: 'Introduction to Digital Marketing',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/0aM7v0sGJo4?si=EZ-EsqrTdVzpR3El',
            },
            {
              id: 2,
              title: 'Understanding SEO Fundamentals',
              materialType: 'Article',
              content: 'https://moz.com/beginners-guide-to-seo',
            },
            {
              id: 3,
              title: 'Social Media Marketing Overview',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/8fQ0p4V_29c?si=xpgYKYaTZ9lmm41N',
            },
          ],
        },
        {
          id: 2,
          name: 'Advanced Digital Marketing',
          lessons: [
            {
              id: 1,
              title: 'Pay-Per-Click (PPC) Advertising',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/VyLYkXHyD14?si=SuPOzA4J2k41Hwji',
            },
            {
              id: 2,
              title: 'Email Marketing Strategies',
              materialType: 'Article',
              content: 'https://mailchimp.com/email-marketing/',
            },
            {
              id: 3,
              title: 'Marketing Analytics and Metrics',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/6J3YjKU6i6Q?si=GqwlX0-NG9zEM8M4',
            },
          ],
        },
      ],
      requirements: [{ id: 1, text: 'No prior marketing experience required' }],
      description: 'Master the art of building brands and growing audiences on social media.',
    },
    instructor: {
      id: 32,
      name: 'Rachel Bennett',
      email: 'rachel.bennett@socialboost.com',
      phoneNumber: '090-234-5678',
      totalCourses: 14,
      totalStudents: 7800,
    },
  },
  {
    category: { id: 4, name: 'Digital Marketing' },
    course: {
      id: 33,
      name: 'Google Ads for Beginners',
      imgUrl:
        'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=400&h=225',
      shortDescription: 'Learn to set up and optimize effective Google Ads campaigns.',
      rating: { averageRating: 4.6, totalRating: 350 },
      totalEnrolledStudents: 4600,
      createdAt: '',
      updatedAt: '',
      whatYouWillLearn: [
        { id: 1, text: 'Google Ads account setup and campaign creation' },
        { id: 2, text: 'Keyword research and bidding strategies' },
      ],
      duration: '30 hours',
      modules: [
        {
          id: 1,
          name: 'Digital Marketing Basics',
          lessons: [
            {
              id: 1,
              title: 'Introduction to Digital Marketing',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/0aM7v0sGJo4?si=EZ-EsqrTdVzpR3El',
            },
            {
              id: 2,
              title: 'Understanding SEO Fundamentals',
              materialType: 'Article',
              content: 'https://moz.com/beginners-guide-to-seo',
            },
            {
              id: 3,
              title: 'Social Media Marketing Overview',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/8fQ0p4V_29c?si=xpgYKYaTZ9lmm41N',
            },
          ],
        },
        {
          id: 2,
          name: 'Advanced Digital Marketing',
          lessons: [
            {
              id: 1,
              title: 'Pay-Per-Click (PPC) Advertising',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/VyLYkXHyD14?si=SuPOzA4J2k41Hwji',
            },
            {
              id: 2,
              title: 'Email Marketing Strategies',
              materialType: 'Article',
              content: 'https://mailchimp.com/email-marketing/',
            },
            {
              id: 3,
              title: 'Marketing Analytics and Metrics',
              materialType: 'Video',
              content: 'https://www.youtube.com/embed/6J3YjKU6i6Q?si=GqwlX0-NG9zEM8M4',
            },
          ],
        },
      ],

      requirements: [{ id: 1, text: 'Basic computer skills' }],
      description: 'Drive traffic and sales with targeted Google advertising campaigns.',
    },
    instructor: {
      id: 33,
      name: 'Tom Willis',
      email: 'tom.willis@adsmastery.com',
      phoneNumber: '091-123-4567',
      totalCourses: 10,
      totalStudents: 6900,
    },
  },
];

export const getTrendingCourses1 =():CourseData[]=>{
  return courseData.slice(0,5)
}

export const categories = Array.from(
  new Map(courseData.map((item) => [item.category.id, item.category])).values()
);
export const getAllCourses =(): CourseData[]=>{
  return courseData;
}

export const getUserCourses =() : CourseData[]=>{
  return courseData.slice(10, 15);
}
