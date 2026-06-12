import ExternalProfile from "./profile-page-client";

export default async function Page(props: { params: Promise<{ username: string }> }) {
	const params = await props.params;
	return <ExternalProfile id={params.username} />;
}
