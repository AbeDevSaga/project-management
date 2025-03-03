// User Type
export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
  }
  
  // Service Type
  export interface Service {
    _id: string;
    name: string;
    description: string;
    category: string;
    features: string[];
    price: number;
    duration: number;
    type: string;
  }
  