export function formatDate(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return date.toString();
  
  const months = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ];
  
  return `${d.getDate()} ${months[d.getMonth()]}`;
}
