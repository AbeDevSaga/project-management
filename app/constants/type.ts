import { StaticImageData } from "next/image";
type TSection = {
  section: string;
  headline: string;
};

export type TProfile = {
    name: string;
    email: string;
    phone: string;
    image: StaticImageData;
    role: string;
    password: string;
    date: string;
}

export type TLanguage = {
    country: {
        image: StaticImageData;
        language: string;
        code: string;
    };
}

export type TUsers = {
  _id: number;
  name:string;
  email: string;
  phone: string;
  date: string;
  status: string;
  image: string;
}

export type TService = {
  _id?: string;
  name: string;
  description: string;
  category: string;
  features: string[];
  price: number;
  duration: number;
  type: string;
  status?: 'active' | 'inactive';
  createdAt?: Date; 
  updatedAt?: Date;
};

export type TSections = {
  dashboard: TSection;
  users: TSection;
  premium_users: TSection;
  services: TSection;
  notifications: TSection;
  messages: TSection;
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