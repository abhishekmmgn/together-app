export default function formatAvatarName(name: string): string {
	if (!name) return "";
	else
		return name
			.split(" ")
			.map((word) => word[0])
			.join("");
}
