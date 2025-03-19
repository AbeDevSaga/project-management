import { TInsights } from "./type";

export const insights: TInsights = {
  notifications: {
    count: 3,
    messages: [
      "New user registered",
      "Payment received from user #123",
      "System update available",
    ],
  },
  logs: {
    count: 5,
    entries: [
      "Admin logged in at 10:00 AM",
      "User profile updated at 10:30 AM",
      "New product added at 11:00 AM",
      "System backup completed at 12:00 PM",
      "Database optimization at 1:00 PM",
    ],
  },
  errors: {
    count: 2,
    details: [
      "Database connection failed at 10:05 AM",
      "Payment gateway timeout at 11:30 AM",
    ],
  },
  warnings: {
    count: 3,
    details: [
      "Low disk space on server at 9:00 AM",
      "High memory usage at 10:15 AM",
      "Unusual login activity at 11:45 AM",
    ],
  },
  userActivity: {
    activeUsers: 1200,
    newSignups: 45,
    topActions: ["Login", "Profile Update", "Product Purchase"],
  },
  revenue: {
    totalRevenue: 25000,
    monthlyRevenue: 5000,
    topProducts: ["Product A", "Product B", "Product C"],
  },
  supportTickets: {
    openTickets: 12,
    resolvedTickets: 8,
    recentTickets: [
      "Ticket #123: Login issue",
      "Ticket #124: Payment failure",
      "Ticket #125: Account deletion request",
    ],
  },
  systemPerformance: {
    uptime: "99.9%",
    cpuUsage: 65,
    memoryUsage: 70,
  },
};