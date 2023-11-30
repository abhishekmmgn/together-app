export default function formatPostDate(postDate: Date): string {
  const currentDate = new Date();

  if (postDate.toDateString() === currentDate.toDateString()) {
    return postDate.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  } else {
    return postDate.toLocaleDateString();
  }
}
