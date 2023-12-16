export default function formatDate(date: Date): string {
  if (!date) {
    return "";
  }

  const currentDate = new Date();

  if (date.toDateString() === currentDate.toDateString()) {
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  } else {
    return date.toLocaleDateString();
  }
}
