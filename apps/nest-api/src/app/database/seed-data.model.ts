export type User = {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'recruiter' | 'employee';
  fullName: string;
  avatar: string;
  loggedIn: boolean;
  authToken?: string;
};

export type Candidate = {
  id: string;
  name: string;
  email: string;
  status: 'New' | 'Interviewing' | 'Rejected' | 'Hired';
  position: string;
  coverLetter: string;
  resumeUrl: string;
};

export const candidates: Candidate[] = [
  {
    id: 'c1',
    name: 'John Smith',
    email: 'john@example.com',
    status: 'New',
    position: 'Frontend Dev',
    coverLetter: 'I have 5 years of experience in React and Angular.',
    resumeUrl: '/resumes/john.pdf',
  },
  {
    id: 'c2',
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    status: 'Interviewing',
    position: 'Security Analyst',
    coverLetter: 'Specialized in threat detection and prevention.',
    resumeUrl: '/resumes/sarah.pdf',
  },
  {
    id: 'c3',
    name: 'Michael Chen',
    email: 'm.chen@example.com',
    status: 'New',
    position: 'Backend Dev',
    coverLetter: 'Expert in Node.js and Microservices.',
    resumeUrl: '/resumes/mike.pdf',
  },
  {
    id: 'c4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    status: 'Rejected',
    position: 'Designer',
    coverLetter: 'Passionate about UI/UX and accessibility.',
    resumeUrl: '/resumes/emily.pdf',
  },
  {
    id: 'c5',
    name: 'David Wilson',
    email: 'david@example.com',
    status: 'Hired',
    position: 'Product Owner',
    coverLetter: 'Looking to lead agile teams.',
    resumeUrl: '/resumes/david.pdf',
  },
  {
    id: 'c6',
    name: 'Lisa Brown',
    email: 'lisa@example.com',
    status: 'New',
    position: 'Marketing',
    coverLetter: 'Growth hacker with SEO experience.',
    resumeUrl: '/resumes/lisa.pdf',
  },
  {
    id: 'c7',
    name: 'James Miller',
    email: 'james@example.com',
    status: 'Interviewing',
    position: 'Frontend Dev',
    coverLetter: 'Recent graduate with strong portfolio.',
    resumeUrl: '/resumes/james.pdf',
  },
  {
    id: 'c8',
    name: 'Patricia Taylor',
    email: 'pat@example.com',
    status: 'New',
    position: 'HR Assistant',
    coverLetter: 'Organized and people-focused.',
    resumeUrl: '/resumes/pat.pdf',
  },
] as const;

export const employees: User[] = [
  {
    id: 'u1',
    username: 'alice_hr',
    password: 'password123',
    role: 'admin',
    fullName: 'Alice Manager',
    avatar: 'https://i.pravatar.cc/150?u=alice',
    loggedIn: false,
  },
  {
    id: 'u2',
    username: 'bob_recruiter',
    password: 'password123',
    role: 'recruiter',
    fullName: 'Bob Talent',
    avatar: 'https://i.pravatar.cc/150?u=bob',
    loggedIn: false,
  },
] as const;
