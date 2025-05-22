import { StaticImageData } from "next/image";
type TSection = {
  section: string;
  headline: string;
};

// Updated type to match backend schema
export type TEvaluation = {
  _id?: string;
  evaluator: TUser | string;
  date: Date;
  presentation: number;
  knowledgeDomain: number;
  knowledgeMethodology: number;
  questionConfidence: number;
  contentClarity: number;
  problemStatement: number;
  objectivesSignificance: number;
  projectMethodology: number;
  useCaseDiagram: number;
  sequenceActivityDiagram: number;
  classDiagram: number;
  persistenceDiagram: number;
  totalMarks: number;
  comments: string;
  status?: string;
};


export type TProfile = {
  name: string;
  email: string;
  phone: string;
  image: StaticImageData;
  role: string;
  password: string;
  date: string;
};

export type TLanguage = {
  country: {
    image: StaticImageData;
    language: string;
    code: string;
  };
};

export type TLogo = {
  image: StaticImageData;
  title: string;
};

export type TUser = {
  _id?: string;
  username: string;
  email: string;
  phone?: string;
  password: string;
  userId?: string;
  role?: string;
  department?: TDepartment | string;
  project?: TProject[];
  advisor: TUser;
  profileImage?: string;
  proposals?: string;
  submissions?: string;
  visitHistory?: string;

  organization?: string;
  isPremium?: boolean;
  services?: TService[];
  chatGroups?: TChatGroups[];
  file?: TFile[];
  projects?: TProject[];
  tasks?: TTask[];
  created_at: string;
  status?: "active" | "inactive" | "banned" | "pending";
};

export type TRole =
  | "admin"
  | "student"
  | "advisor"
  | "departmentHead"
  | "evaluator";

export type TService = {
  _id?: string;
  name: string;
  description: string;
  category: string;
  features: string[];
  price: number;
  duration: number;
  type: string;
  status?: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
};

export type TOrganization = {
  _id?: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
  superAdmin?: TUser;
  users?: TUser[];
  projects?: TProject[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type TFile = {
  _id?: string;
  name: string;
  path?: string;
  type?: string;
  property?: string;
  uploadedBy?: TUser;
  uploadedAt?: Date;
};

export type TMessage = {
  _id?: string;
  project?: string;
  sender: TUser;
  content: string;
  timestamp?: Date;
  type: "text" | "file";
  file?: string;
};

export type TProject = {
  _id?: string;
  title?: string;
  description?: string;
  department?: TDepartment;
  projectStatus?: "in-progress" | "completed" | "evaluated";
  tasks?: TTask[];
  proposal?: TProposal;
  students?: TUser[];
  files?: TFile[];
  advisor?: TUser;
  submissions?: TFile[];
  evaluators?: TUser[];
  evaluations?: TEvaluation[];
  isApproved?: boolean;
  isRejected?: boolean;
  createdAt?: Date;
};
export type TDepartment = {
  _id?: string;
  name: string;
  head?: TUser;
  advisors?: TUser[];
  evaluators?: TUser[];
  students?: TUser[];
};
export type TSchedule = {
  _id: string;
  title: string;
  project: string | TProject;
  description: string;
  type?: string;
  link?: string;
  place?: string;
  createdBy: string | TUser;
  createdAt: Date;
  updatedAt?: Date;
  date?: Date;
};
export type TTask = {
  _id: string;
  projectId: string;
  taskName: string;
  discription: string;
  assignedTo: TUser[];
  status: "not-started" | "in-progress" | "completed" | "approved" | "rejected";
  startDate: Date;
  endDate: Date;
  percentage: string;
};
export type TChatGroups = {
  _id: string;
  name: string;
};
export type TNotification = {
  _id: string;
  recipients: string[];
  type: string;
  message: string;
  status: 'unread' | 'read';
  timestamp: string;
  projectId?: string;
  sender?: string;
}

export type TManual = {
  _id?: string;
  title: string;
  description: string;
  type?: string;
  file?: string;
  department?: TDepartment | string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: TUser | string;
};

export type TProposal = {
  _id?: string;
  project: TProject | string;
  student?: TUser;
  date?: Date;
  approvedBy?: TUser;
  status?: string;
  file?: string;
  feedback?: string;
  similarityScore?: Number;
};

export type TSections = {
  dashboard: TSection;
  users: TSection;
  premium_users: TSection;
  organizations: TSection;
  projects: TSection;
  services: TSection;
  chat_group: TSection;
  tasks: TSection;
  files: TSection;
  notifications: TSection;
  messages: TSection;
  departments: TSection;
  photo_review: TSection;
  reports_bans: TSection;
  sales_agents: TSection;
  manage_admins: TSection;
};

export type TInsights = {
  notifications: {
    count: number;
    messages: string[];
  };
  logs: {
    count: number;
    entries: string[];
  };
  errors: {
    count: number;
    details: string[];
  };
  warnings: {
    count: number;
    details: string[];
  };
  userActivity: {
    activeUsers: number;
    newSignups: number;
    topActions: string[];
  };
  revenue: {
    totalRevenue: number;
    monthlyRevenue: number;
    topProducts: string[];
  };
  supportTickets: {
    openTickets: number;
    resolvedTickets: number;
    recentTickets: string[];
  };
  systemPerformance: {
    uptime: string;
    cpuUsage: number;
    memoryUsage: number;
  };
};
