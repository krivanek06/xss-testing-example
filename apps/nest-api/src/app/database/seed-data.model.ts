import { faker } from '@faker-js/faker';
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

export type CandidateComment = {
  id: string;
  comment: string;
  timestamp: string;
  username: string;
  userId: string;
};

export type Candidate = {
  id: string;
  name: string;
  email: string;
  status: 'New' | 'Interviewing' | 'Rejected' | 'Hired';
  position: string;
  coverLetter: string;
  resumeUrl: string;
  comments: CandidateComment[];
  createdAt: string;
};

export type CandidateDTO = Omit<Candidate, 'id'>;
export type CommentDTO = Omit<CandidateComment, 'id'>;

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

export const candidates = Array.from({ length: 20 }).map(
  (_, index) =>
    ({
      id: `c${index + 1}`,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      status: faker.helpers.arrayElement(['New', 'Interviewing', 'Rejected', 'Hired']) as Candidate['status'],
      position: faker.person.jobTitle(),
      coverLetter: faker.lorem.paragraphs(2),
      resumeUrl: 'https://pdfobject.com/pdf/sample.pdf',
      comments: Array.from({ length: faker.number.int({ min: 0, max: 5 }) }).map(() => {
        const employee = faker.helpers.arrayElement(employees);
        return {
          id: faker.string.uuid(),
          comment: faker.lorem.sentence(),
          timestamp: faker.date.past().toISOString(),
          username: employee.fullName,
          userId: employee.id,
        };
      }),
      createdAt: faker.date.past().toISOString(),
    }) satisfies Candidate
);
