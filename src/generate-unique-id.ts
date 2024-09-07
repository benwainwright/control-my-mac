export const generateUniqueId = (text: string) =>
  text.replace(/[-\s]/g, "_").toLocaleLowerCase();
