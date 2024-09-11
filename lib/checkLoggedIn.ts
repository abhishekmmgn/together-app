export async function checkLoggedIn() {
	try {
		const res = await fetch("/api/auth/check-logged-in/");
		if (res.ok) {
			return true;
		}
			return false;
	} catch (err: any) {
		console.log("Error: ", err.message);
		return false;
	}
}
