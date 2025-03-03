// import { create } from "zustand";
// import { fetchUsers } from "../api/user";
// import { User } from './type';

// interface UserState {
//   listUsers: User[];
//   setListUsers: (users: User[]) => void;
//   fetchUsers: () => Promise<void>;
// }

// export const useUserStore = create<UserState>((set) => ({
//   listUsers: [],
//   setListUsers: (users) => set({ listUsers: users }),

//   // Fetch all users
//   fetchUsers: async () => {
//     const users = await fetchUsers();
//     set({ listUsers: users });
//   },
// }));
