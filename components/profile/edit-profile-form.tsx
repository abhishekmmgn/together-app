import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResponsiveDialog } from "@/components/ui/responsive-dialog";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { useS3Upload } from "@/hooks/use-s3-upload";
import { Dropzone, DropzoneEmptyState, DropzoneContent } from "@/components/dropzone";
import userIcon from "../../public/user.png";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
	name: z
		.string()
		.min(2, "Name must be at least 2 characters")
		.max(64, "Name must be less than 64 characters"),
	username: z
		.string()
		.min(3, "Username must be at least 3 characters")
		.max(50, "Username must be less than 50 characters")
		.regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
	photo: z.string().optional(),
	bio: z.string().max(128, "Bio must be less than 128 characters").optional(),
});

type formSchemaType = z.infer<typeof formSchema>;

type PropsType = {
	name: string;
	username: string;
	photo: string;
	bio: string;
};

export default function EditProfileForm(props: PropsType) {
	const { closeDialog } = useResponsiveDialog();
	const form = useForm<formSchemaType>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: props.name || "",
			username: props.username || "",
			photo: props.photo || "",
			bio: props.bio,
		},
	});
	const { watch } = form;
	const watchAllFields = watch();

	const hasDataChanged =
		JSON.stringify(watchAllFields) !==
		JSON.stringify(form.formState.defaultValues);

	const uploadProps = useS3Upload({
		maxFiles: 1,
		maxFileSize: 1_000_000, // 1 MB
		allowedMimeTypes: ["image/*"],
	});

	// When upload succeeds, set the photo URL in the form
	useEffect(() => {
		if (uploadProps.isSuccess && uploadProps.uploadedUrls.length > 0) {
			form.setValue("photo", uploadProps.uploadedUrls[0]);
		}
	}, [uploadProps.isSuccess, uploadProps.uploadedUrls, form]);

	const queryClient = useQueryClient();

	const { mutate, isPending } = useMutation({
		mutationFn: async (data: formSchemaType) => {
			const res = await fetch("/api/user", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: data.name,
					username: data.username,
					profilePhoto: data.photo,
					bio: data.bio,
				}),
			});

			if (!res.ok) {
				throw new Error(res.statusText);
			}

			return res.json();
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
			form.reset();
			queryClient.invalidateQueries({ queryKey: ["user-profile"] });
			closeDialog();
		},
		onError: (error: Error) => {
			console.log("Error: ", error.message);
			toast.error(error.message);
		},
	});

	async function onSubmit(data: formSchemaType) {
		mutate(data);
	}

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-full space-y-4"
				>
					<div className="space-y-2">
						<div className="flex flex-col items-center gap-2">
							<Image
								src={form.getValues().photo || userIcon}
								alt="Profile Photo"
								width={148}
								height={148}
								className="w-24 lg:w-28 object-cover aspect-square bg-secondary rounded-md border border-border mx-auto"
							/>
							<Dropzone
								{...uploadProps}
								className="w-full"
							>
								<DropzoneEmptyState />
								<DropzoneContent />
							</Dropzone>
						</div>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="Name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input placeholder="Username" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="bio"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Bio</FormLabel>
									<FormControl>
										<Textarea
											placeholder="..."
											{...field}
											className="h-20 resize-none"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button
						type="submit"
						className="w-full"
						disabled={!hasDataChanged}
						loading={isPending}
						loadingText="Saving"
					>
						Done
					</Button>
				</form>
			</Form>
		</>
	);
}
