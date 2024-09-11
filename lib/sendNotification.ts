export default async function sendNotification(
	message: string,
	destination: string,
): Promise<boolean | undefined> {
	try {
		const res = await fetch("/api/notifications", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				message,
				destination,
			}),
		});
		if (res.ok) {
			console.log(res);
			return true;
		}
	} catch (err: any) {
		console.log("Error: ", err.message);
		return false;
	}
}
