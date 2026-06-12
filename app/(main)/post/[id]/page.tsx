import PostPageClient from "./post-page-client";



type Props = {
	params: Promise<{ id: string }>;
};

export default async function Page(props: Props) {
	const params = await props.params;
	return <PostPageClient id={params.id} />;
}
