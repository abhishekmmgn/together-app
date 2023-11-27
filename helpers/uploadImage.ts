
export default async function uploadImage(
  event: React.ChangeEvent<HTMLInputElement>
) {
  const file = event.currentTarget.files && event.currentTarget.files[0];
  if (file) {
    if (file.size / 1024 / 1024 > 2) {
      return "File size too big (max 2MB).";
    } else {
      // setFile(file)
      const reader = new FileReader();
      reader.onload = (e) => {
        // setData((prev) => ({ ...prev, image: e.target?.result as string }))
        // vercel blob
      };
      reader.readAsDataURL(file);
    }
  }
}
