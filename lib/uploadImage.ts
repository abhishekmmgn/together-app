export default async function uploadImage(
	event: React.ChangeEvent<HTMLInputElement>,
) {
	const file = event.currentTarget.files?.[0];
	if (file) {
		if (file.size / 1024 / 1024 > 1) {
			return "File size too big (max 1MB).";
		}
		const reader = new FileReader();
		reader.onload = (e) => {
			// setData((prev) => ({ ...prev, image: e.target?.result as string }))
		};
		reader.readAsDataURL(file);
	}
}
