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
  createdAt: string;
  comments: Comment[];
};

export type Comment = {
  id: string;
  comment: string;
  timestamp: string;
  username: string;
  userId: string;
};

export type CandidateStatusFilter = Candidate['status'] | 'All';

export type CandidateDTO = Omit<Candidate, 'id'>;
export type CommentDTO = Omit<Comment, 'id'>;
