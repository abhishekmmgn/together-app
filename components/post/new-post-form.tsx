"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
	IoCheckmarkCircle,
	IoCloudUpload,
	IoClose,
	IoVideocam,
	IoImage,
} from "react-icons/io5";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Textarea } from "@/components/ui/textarea";
import { useS3Upload } from "@/hooks/use-s3-upload";
import { MAX_IMAGE_SIZE, MAX_VIDEO_SIZE } from "@/lib/constants";
import sendNotification from "@/lib/sendNotification";
import { cn, formatBytes } from "@/lib/utils";

const formSchema = z.object({
	thread: z
		.string()
		.min(1, "Thread must not be empty")
		.max(256, "Thread must be less than 256 characters"),
	tags: z.string().optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function NewPostForm() {
	const { closeDialog } = useResponsiveDialog();

	const [step, setStep] = useState<1 | 2>(1);
	const [mediaUrl, setMediaUrl] = useState<string>("");
	const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
	const [uploadInitiated, setUploadInitiated] = useState(false);

	// Mirrors mediaUrl in a ref so the unmount cleanup can read the latest value
	// without needing it as a dependency (avoids re-registering the effect).
	const mediaUrlRef = useRef<string>("");

	const {
		files,
		setFiles,
		loading: uploadLoading,
		uploadProgress,
		isSuccess: uploadSuccess,
		uploadedUrls,
		errors: uploadErrors,
		deleteUploadedFile,
		onUpload,
		getRootProps,
		getInputProps,
		isDragActive,
		isDragReject,
		inputRef,
	} = useS3Upload({
		maxFiles: 1,
		maxFileSize: MAX_VIDEO_SIZE,
		allowedMimeTypes: ["image/*", "video/*"],
		autoUpload: false,
	});

	useEffect(() => {
		mediaUrlRef.current = mediaUrl;
	}, [mediaUrl]);

	useEffect(() => {
		if (uploadSuccess && uploadedUrls.length > 0) {
			const url = uploadedUrls[uploadedUrls.length - 1];
			setMediaUrl(url);
			setMediaType(files[0]?.type.startsWith("video/") ? "video" : "image");
		}
	}, [uploadSuccess, uploadedUrls, files]);

	// If the dialog is closed without posting, delete the orphaned S3 object.
	useEffect(() => {
		return () => {
			if (mediaUrlRef.current) {
				deleteUploadedFile(mediaUrlRef.current);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const form = useForm<FormSchemaType>({
		resolver: zodResolver(formSchema),
		defaultValues: { thread: "", tags: "" },
	});

	const hasDataChanged =
		JSON.stringify(form.watch()) !==
		JSON.stringify(form.formState.defaultValues);

	const currentFile = files[0];
	const fileError = currentFile?.errors?.[0];

	const fileSizeError =
		currentFile && !fileError
			? currentFile.type.startsWith("video/") &&
				currentFile.size > MAX_VIDEO_SIZE
				? `Video must be smaller than ${formatBytes(MAX_VIDEO_SIZE, 2, "MB")}`
				: currentFile.type.startsWith("image/") &&
						currentFile.size > MAX_IMAGE_SIZE
					? `Image must be smaller than ${formatBytes(MAX_IMAGE_SIZE, 2, "MB")}`
					: null
			: null;

	const handleContinue = useCallback(() => {
		if (!currentFile || uploadLoading || !!fileSizeError || !!fileError) return;
		// If a previous upload already landed (user went back and re-selected),
		// delete the old S3 object before starting a fresh upload.
		if (mediaUrl) {
			deleteUploadedFile(mediaUrl);
			setMediaUrl("");
			setMediaType(null);
		}
		setUploadInitiated(true);
		onUpload(); // fire-and-forget — intentionally NOT awaited
		setStep(2);
	}, [
		currentFile,
		uploadLoading,
		fileSizeError,
		fileError,
		mediaUrl,
		deleteUploadedFile,
		onUpload,
	]);

	const handleBack = useCallback(() => {
		if (mediaUrl) {
			deleteUploadedFile(mediaUrl);
			setMediaUrl("");
			setMediaType(null);
		}
		setUploadInitiated(false);
		setStep(1);
	}, [mediaUrl, deleteUploadedFile]);

	const [submitting, setSubmitting] = useState(false);

	async function onSubmit(data: FormSchemaType) {
		setSubmitting(true);
		const toastId = toast.loading("Creating post...");
		try {
			const res = await fetch("/api/post", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					image: mediaUrl,
					thread: data.thread,
					tags: data.tags,
				}),
			});

			if (res.ok) {
				toast.success("Post created!", { id: toastId });
				form.reset();
				// Media is now part of the post — skip orphan cleanup on unmount.
				mediaUrlRef.current = "";
				sendNotification("There are new posts.", "/");
				closeDialog();
			} else {
				toast.error((await res.json())?.error ?? res.statusText, {
					id: toastId,
				});
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Something went wrong", {
				id: toastId,
			});
		} finally {
			setSubmitting(false);
		}
	}

	const isInvalid =
		(isDragActive && isDragReject) ||
		!!fileError ||
		!!fileSizeError ||
		uploadErrors.length > 0;

	const uploadInProgress = uploadInitiated && uploadLoading;
	const uploadFailed = uploadInitiated && uploadErrors.length > 0;

	return (
		<div className="w-full">
			<StepDots step={step} />

			{step === 1 && (
				<div className="space-y-4">
					<p className="text-sm text-muted-foreground text-center -mt-2 mb-4">
						Add a photo or video to your post
					</p>

					<div
						{...getRootProps({
							className: cn(
								"relative w-full aspect-4/3 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all duration-200 cursor-pointer select-none overflow-hidden",
								isInvalid
									? "border-destructive bg-destructive/5"
									: isDragActive
										? "border-primary bg-primary/5 scale-[1.01]"
										: "border-muted-foreground/30 bg-muted/20 hover:border-primary/60 hover:bg-primary/5",
							),
						})}
						onClick={() => inputRef.current?.click()}
					>
						<input {...getInputProps()} />

						{currentFile?.preview && !fileError && !fileSizeError ? (
							<>
								{currentFile.type.startsWith("video/") ? (
									<video
										src={currentFile.preview}
										className="absolute inset-0 w-full h-full object-cover"
										muted
										playsInline
									/>
								) : (
									<Image
										src={currentFile.preview}
										alt="Preview"
										fill
										className="object-cover"
										sizes="600px"
									/>
								)}
							</>
						) : (
							<div className="flex flex-col items-center gap-3 px-6 text-center">
								<div className="rounded-full bg-muted p-4">
									<IoCloudUpload
										size={28}
										className={
											isInvalid ? "text-destructive" : "text-muted-foreground"
										}
									/>
								</div>

								<div>
									<p className="text-sm font-medium">
										{isDragActive ? "Drop to upload" : "Drag & drop or click"}
									</p>
									<div className="flex items-center justify-center gap-3 mt-2 text-xs text-muted-foreground">
										<span className="flex items-center gap-1">
											<IoImage size={14} /> Image up to{" "}
											{formatBytes(MAX_IMAGE_SIZE, 0)}
										</span>
										<span className="text-muted-foreground/40">|</span>
										<span className="flex items-center gap-1">
											<IoVideocam size={14} /> Video up to{" "}
											{formatBytes(MAX_VIDEO_SIZE, 0)}
										</span>
									</div>
								</div>

								{(fileError || fileSizeError) && (
									<p className="text-xs text-destructive">
										{fileError?.code === "file-too-large"
											? `File is larger than ${formatBytes(MAX_VIDEO_SIZE, 2, "MB")}`
											: fileError?.message ?? fileSizeError}
									</p>
								)}
							</div>
						)}
					</div>

					<Button
						className="w-full"
						disabled={
							!currentFile || uploadLoading || !!fileSizeError || !!fileError
						}
						onClick={handleContinue}
					>
						Continue
					</Button>

					<button
						type="button"
						onClick={() => setStep(2)}
						className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
					>
						Skip (post without media)
					</button>
				</div>
			)}

			{step === 2 && (
				<div className="space-y-4">
					{uploadInitiated && (
						<UploadStatusBanner
							loading={uploadLoading}
							progress={uploadProgress}
							success={uploadSuccess}
							error={uploadFailed}
						/>
					)}

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="thread"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Thread</FormLabel>
										<FormControl>
											<Textarea
												placeholder="What's on your mind?"
												{...field}
												className="resize-none min-h-32"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="tags"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tags</FormLabel>
										<FormControl>
											<Input
												type="text"
												placeholder="Travel, Food, etc"
												{...field}
											/>
										</FormControl>
										<FormDescription>Separate tags by comma</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex gap-2">
								<Button
									type="button"
									variant="outline"
									className="flex-1"
									onClick={handleBack}
								>
									Back
								</Button>
								<Button
									type="submit"
									className="flex-1"
									disabled={!hasDataChanged || submitting || uploadInProgress}
									loading={submitting}
									loadingText="Posting…"
								>
									{uploadInProgress ? `Uploading… ${uploadProgress}%` : "Post"}
								</Button>
							</div>
						</form>
					</Form>
				</div>
			)}
		</div>
	);
}

function StepDots({ step }: { step: 1 | 2 }) {
	return (
		<div className="flex items-center justify-center gap-2 mb-5">
			<div
				className={cn(
					"h-1.5 rounded-full transition-all duration-300",
					step === 1 ? "w-6 bg-primary" : "w-3 bg-muted-foreground/40",
				)}
			/>
			<div
				className={cn(
					"h-1.5 rounded-full transition-all duration-300",
					step === 2 ? "w-6 bg-primary" : "w-3 bg-muted-foreground/40",
				)}
			/>
		</div>
	);
}

function UploadStatusBanner({
	loading,
	progress,
	success,
	error,
}: {
	loading: boolean;
	progress: number;
	success: boolean;
	error: boolean;
}) {
	if (success)
		return (
			<div className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-2 text-sm text-green-600 dark:text-green-400">
				<IoCheckmarkCircle size={16} className="shrink-0" />
				<span>Media uploaded successfully</span>
			</div>
		);

	if (error)
		return (
			<div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
				<IoClose size={16} className="shrink-0" />
				<span>Upload failed — go back and try again</span>
			</div>
		);

	if (loading)
		return (
			<div className="space-y-1.5">
				<div className="flex items-center justify-between text-xs text-muted-foreground">
					<span className="flex items-center gap-1.5">
						<IoCloudUpload size={13} />
						Uploading media…
					</span>
					<span>{progress}%</span>
				</div>
				<div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
					<div
						className="h-full rounded-full bg-primary transition-all duration-150"
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>
		);

	return null;
}
