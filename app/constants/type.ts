import { StaticImageData } from "next/image";
export type TProfile = {
    name: string;
    email: string;
    phone: string;
    image: StaticImageData;
    role: string;
}

export type TLanguage = {
    country: {
        image: StaticImageData;
        lanuage: string;
    };
}

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