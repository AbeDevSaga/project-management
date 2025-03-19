import { TLanguage } from "./type";
import usFlag from "@/public/images/usa.png"; 
import frFlag from "@/public/images/france.png"; 
import esFlag from "@/public/images/spain.png";

export const languages: TLanguage[] = [
  {
    country: {
      image: usFlag,
      language: "English (US)",
      code: "en-US",
    },
  },
  {
    country: {
      image: frFlag,
      language: "Français (FR)",
      code: "fr-FR",
    },
  },
  {
    country: {
      image: esFlag,
      language: "Español (ES)",
      code: "es-ES",
    },
  },
];