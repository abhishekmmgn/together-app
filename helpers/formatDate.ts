export default function formatDate(
  dateString: string | null | undefined
): string {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);
  const currentDate = new Date();

  if (date.toDateString() === currentDate.toDateString()) {
    // Return time if it's the current date
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  } else {
    // Return full date if it's a different date
    return date.toLocaleDateString();
  }
}
