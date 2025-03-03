// import { create } from "zustand";
// import { fetchServices } from "../api/service";
// import { Service } from './type';

// interface ServiceState {
//   listServices: Service[];
//   setListServices: (services: Service[]) => void;
//   fetchServices: () => Promise<void>;
// }

// export const useServiceStore = create<ServiceState>((set) => ({
//   listServices: [],
//   setListServices: (services) => set({ listServices: services }),

//   // Fetch all services
//   fetchServices: async () => {
//     const services = await fetchServices();
//     set({ listServices: services });
//   },
// }));
