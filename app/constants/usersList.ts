import { faker } from "@faker-js/faker";
import { TUsers } from "./type";

let count = 0;

const generateUser = (): TUsers => {
    return {
      _id: count++,
      name: faker.person.fullName(), 
      email: faker.internet.email(), 
      phone: faker.phone.number(), 
      date: faker.date.past().toISOString().split("T")[0], 
      status: faker.helpers.arrayElement(["active", "inactive", "pending"]),
      image: faker.image.personPortrait(), 
    };
  };

export const users: TUsers[] = Array.from({ length: 80 }, generateUser);