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
import { UploadButton } from "@/lib/uploadthing";
import userIcon from "../../public/user.png";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
	name: z
		.string()
		.min(2, "Name must be at least 2 characters")
		.max(64, "Name must be less than 64 characters"),
	photo: z.string().optional(),
	bio: z.string().max(128, "Bio must be less than 128 characters").optional(),
});

type formSchemaType = z.infer<typeof formSchema>;

type PropsType = {
	name: string;
	photo: string;
	bio: string;
};

export default function EditProfileForm(props: PropsType) {
	const { closeDialog } = useResponsiveDialog();
	const form = useForm<formSchemaType>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: props.name || "",
			photo: props.photo || "",
			bio: props.bio,
		},
	});
	const { watch } = form;
	const watchAllFields = watch();

	const hasDataChanged =
		JSON.stringify(watchAllFields) !==
		JSON.stringify(form.formState.defaultValues);

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
							<UploadButton
								endpoint="imageUploader"
								onClientUploadComplete={(res) => {
									console.log(res);
									form.setValue("photo", res[0].url);
								}}
								onUploadError={(error: Error) => {
									console.error(error);
									if (error.message === "Invalid config: FileSizeMismatch") {
										toast.error("File size should be less than 1 MB");
									} else {
										toast.error("Error in uploading file");
									}
								}}
								className="text-sm"
							/>
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
