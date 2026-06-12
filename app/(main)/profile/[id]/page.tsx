import ExternalProfile from "./profile-page-client";



type Params = {
	params: Promise<{ id: string }>;
};

export default async function Page(props: Params) {
	const params = await props.params;
	return <ExternalProfile id={params.id} />;
}
