//  ===============================================================
// Language codes and their corresponding names
//  ===============================================================
export const LANGUAGES = [
  { code: "uz", name: "Uzbek" },
  { code: "ru", name: "Russian" },
  { code: "en", name: "English" },
  { code: "jp", name: "Japanese" },
];

export type Language = (typeof LANGUAGES)[number]["code"];

export const DEFAULT_LANGUAGE: Language = "uz";

//  ===============================================================
// Language codes and their corresponding names
//  ===============================================================
