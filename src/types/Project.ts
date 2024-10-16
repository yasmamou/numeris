export interface Project {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  createdAt: Date;
  tags: string[];
  participants: string[];
  status: 'ideation' | 'validation' | 'funding' | 'inProgress' | 'completed';
}