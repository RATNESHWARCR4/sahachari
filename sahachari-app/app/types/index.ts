export type Language = 'en' | 'hi' | 'kn' | 'mr';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  language: Language;
  school?: string;
  district?: string;
  state?: string;
  grades?: number[];
  subjects?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Story {
  id: string;
  userId: string;
  title: string;
  content: string;
  topic: string;
  language: Language;
  ageGroup: string;
  createdAt: Date;
  tags?: string[];
}

export interface Worksheet {
  id: string;
  userId: string;
  title: string;
  subject: string;
  topic: string;
  grades: number[];
  questions: WorksheetQuestion[];
  sourceImage?: string;
  createdAt: Date;
}

export interface WorksheetQuestion {
  grade: number;
  question: string;
  type: 'mcq' | 'fillblank' | 'shortanswer' | 'matching';
  options?: string[];
  answer?: string;
  wordBank?: string[];
}

export interface KnowledgeEntry {
  id: string;
  userId: string;
  question: string;
  answer: string;
  language: Language;
  analogy?: string;
  createdAt: Date;
  tags?: string[];
}

export interface VisualAid {
  id: string;
  userId: string;
  title: string;
  description: string;
  imageUrl: string;
  topic: string;
  subject: string;
  createdAt: Date;
}

export interface ReadingAssessment {
  id: string;
  userId: string;
  studentName: string;
  grade: number;
  passageId: string;
  audioUrl: string;
  transcription: string;
  wpm: number;
  accuracy: number;
  errors: string[];
  feedback: string;
  createdAt: Date;
}

export interface EducationalGame {
  id: string;
  userId: string;
  title: string;
  topic: string;
  subject: string;
  instructions: string;
  materials: string[];
  numberOfPlayers: string;
  duration: string;
  createdAt: Date;
}

export interface LessonPlan {
  id: string;
  userId: string;
  title: string;
  subject: string;
  grade: number;
  weekNumber?: number;
  topics: LessonTopic[];
  createdAt: Date;
}

export interface LessonTopic {
  day: string;
  topic: string;
  objectives: string[];
  activities: string[];
  materials?: string[];
  duration: string;
  linkedResources?: {
    stories?: string[];
    worksheets?: string[];
    visualAids?: string[];
    games?: string[];
  };
}

export interface TeacherCirclePost {
  id: string;
  userId: string;
  userName?: string;
  topic: string;
  audioUrl?: string;
  transcription: string;
  summary: string;
  tags: string[];
  helpfulCount: number;
  district?: string;
  state?: string;
  createdAt: Date;
} 