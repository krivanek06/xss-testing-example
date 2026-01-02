export type User = {
  id: string;
  username: string;
  role: 'admin' | 'recruiter' | 'employee';
  fullName: string;
  avatar: string;
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
