import Image from "next/image";
import { cn } from "@/lib/utils";
import { IoClose, IoCloudUpload } from "react-icons/io5";
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
import { Dropzone } from "@/components/dropzone";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";

const formSchema = z.object({
	name: z
		.string()
		.min(2, "Name must be at least 2 characters")
		.max(64, "Name must be less than 64 characters"),
	username: z
		.string()
		.min(3, "Username must be at least 3 characters")
		.max(50, "Username must be less than 50 characters")
		.regex(
			/^[a-zA-Z0-9_]+$/,
			"Username can only contain letters, numbers, and underscores",
		),
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
		autoUpload: true,
	});

	// When upload succeeds, set the photo URL in the form
	useEffect(() => {
		if (uploadProps.isSuccess && uploadProps.uploadedUrls.length > 0) {
			form.setValue("photo", uploadProps.uploadedUrls[0], {
				shouldDirty: true,
				shouldValidate: true,
			});
		}
	}, [uploadProps.isSuccess, uploadProps.uploadedUrls, form]);

	const router = useRouter();
	const [isPending, setIsPending] = useState(false);

	const handleRemovePhoto = (e: React.MouseEvent) => {
		e.stopPropagation();

		// If the user is removing a photo they just uploaded in this session,
		// we can safely delete it from S3 so it doesn't become orphaned.
		const currentPhotoUrl = form.getValues().photo;
		if (currentPhotoUrl && uploadProps.uploadedUrls.includes(currentPhotoUrl)) {
			uploadProps.deleteUploadedFile(currentPhotoUrl);
		}

		form.setValue("photo", "", { shouldDirty: true, shouldValidate: true });
		uploadProps.setFiles([]);
	};

	async function onSubmit(data: formSchemaType) {
		setIsPending(true);
		try {
			const res = await fetch("/api/user", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: data.name,
					username: data.username,
					profilePhoto: data.photo,
					bio: data.bio,
				}),
			});
			if (!res.ok) {
				const json = await res.json().catch(() => ({}));
				throw new Error(json.error || res.statusText);
			}
			toast.success("Profile updated successfully");
			form.reset();
			router.refresh();
			closeDialog();
		} catch (error: any) {
			toast.error(error.message);
		} finally {
			setIsPending(false);
		}
	}

	const photoPreviewUrl = uploadProps.files[0]?.preview || form.watch("photo");

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-full space-y-4"
				>
					<div className="space-y-3">
						<div className="space-y-2">
							<p className="text-sm font-medium">
								Profile Photo <span className="text-destructive">*</span>
							</p>
							<Dropzone
								{...uploadProps}
								className={cn(
									"size-40 shrink-0 transition-all duration-200 cursor-pointer p-0 overflow-hidden group",
									photoPreviewUrl && !uploadProps.loading
										? "border-none rounded-xl"
										: "flex items-center justify-center border-2 border-dashed rounded-xl bg-muted/20 hover:bg-muted/50 hover:border-primary/50",
								)}
							>
								{photoPreviewUrl && !uploadProps.loading ? (
									<div
										className="relative w-full h-full rounded-xl overflow-hidden"
										onClick={() => uploadProps.inputRef.current?.click()}
									>
										<Image
											src={photoPreviewUrl}
											alt="Profile Photo"
											fill
											className="object-cover"
										/>
										<button
											type="button"
											onClick={handleRemovePhoto}
											className="absolute top-1 right-1 p-1 bg-white/80 hover:bg-white rounded-full shadow-sm transition-colors z-10 text-black"
										>
											<IoClose className="size-3" />
										</button>
										<div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white pointer-events-none">
											<IoCloudUpload className="size-5" />
										</div>
									</div>
								) : (
									<div
										className="w-full h-full flex items-center justify-center"
										onClick={() => uploadProps.inputRef.current?.click()}
									>
										{uploadProps.loading ? (
											<Spinner />
										) : (
											<IoCloudUpload className="size-6 text-muted-foreground group-hover:text-primary transition-colors" />
										)}
									</div>
								)}
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
						disabled={!hasDataChanged || uploadProps.loading}
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
