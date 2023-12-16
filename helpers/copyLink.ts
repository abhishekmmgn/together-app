import toast from "react-hot-toast";

export default function copyLink(link: string): void {
  try {
    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_DOMAIN}${link}`);
    toast.success("Link copied successfully");
  } catch (error) {
    toast.error("Failed to copy link");
  }
}
