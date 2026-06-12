"use client";

import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResponsiveDialog } from "@/components/ui/responsive-dialog";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useS3Upload } from "@/hooks/use-s3-upload";
import {
	Dropzone,
	DropzoneEmptyState,
	formatBytes,
} from "@/components/dropzone";
import sendNotification from "@/lib/sendNotification";
import {
	IoCheckmarkCircle,
	IoCloudUpload,
	IoClose,
	IoVideocam,
	IoImage,
} from "react-icons/io5";
import { cn } from "@/lib/utils";

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3 MB
const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20 MB

// ─── Form schema (step 2 only) ───────────────────────────────────────────────

const formSchema = z.object({
	thread: z
		.string()
		.min(1, "Thread must not be empty")
		.max(256, "Thread must be less than 256 characters"),
	tags: z.string().optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

// ─── Step indicator ───────────────────────────────────────────────────────────

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

// ─── Upload progress ring ─────────────────────────────────────────────────────

function ProgressRing({ percent }: { percent: number }) {
	const r = 28;
	const circ = 2 * Math.PI * r;
	const offset = circ - (percent / 100) * circ;

	return (
		<svg className="-rotate-90" width={72} height={72}>
			<circle
				cx={36}
				cy={36}
				r={r}
				fill="none"
				stroke="currentColor"
				strokeWidth={5}
				className="text-muted/40"
			/>
			<circle
				cx={36}
				cy={36}
				r={r}
				fill="none"
				stroke="currentColor"
				strokeWidth={5}
				strokeLinecap="round"
				strokeDasharray={circ}
				strokeDashoffset={offset}
				className="text-primary transition-all duration-150"
			/>
		</svg>
	);
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function NewPostForm() {
	const { closeDialog } = useResponsiveDialog();

	// Step 1 or 2
	const [step, setStep] = useState<1 | 2>(1);

	// The confirmed media URL (set after user proceeds to step 2)
	const [mediaUrl, setMediaUrl] = useState<string>("");
	const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);

	// Tracks whether we should delete the uploaded file on dialog close / media change
	const pendingDeleteUrl = useRef<string>("");

	// ── S3 upload hook (upload starts when Continue is clicked) ──
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

	// Advance to step 2 once upload completes
	useEffect(() => {
		if (uploadSuccess && uploadedUrls.length > 0) {
			const url = uploadedUrls[uploadedUrls.length - 1];
			// Track for potential cleanup
			pendingDeleteUrl.current = url;
			setMediaUrl(url);
			setMediaType(files[0]?.type.startsWith("video/") ? "video" : "image");
			pendingDeleteUrl.current = "";
			setStep(2);
		}
	}, [uploadSuccess, uploadedUrls, files]);

	// ── Delete on dialog close (if user never posted) ──
	useEffect(() => {
		return () => {
			if (pendingDeleteUrl.current) {
				deleteUploadedFile(pendingDeleteUrl.current);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// ── Step 2 form ──
	const form = useForm<FormSchemaType>({
		resolver: zodResolver(formSchema),
		defaultValues: { thread: "", tags: "" },
	});

	const hasDataChanged =
		JSON.stringify(form.watch()) !==
		JSON.stringify(form.formState.defaultValues);

	// ── Derived UI state ──
	const currentFile = files[0];
	const fileError = currentFile?.errors?.[0];

	// Per-file size validation for display (hook-level validation runs on drop)
	const fileSizeError =
		currentFile && !fileError
			? currentFile.type.startsWith("video/") &&
				currentFile.size > MAX_VIDEO_SIZE
				? `Video must be smaller than ${formatBytes(MAX_VIDEO_SIZE)}`
				: currentFile.type.startsWith("image/") &&
						currentFile.size > MAX_IMAGE_SIZE
					? `Image must be smaller than ${formatBytes(MAX_IMAGE_SIZE)}`
					: null
			: null;

	// ── Continue: start upload then advance to step 2 ──
	const handleContinue = useCallback(async () => {
		if (!currentFile || uploadLoading || !!fileSizeError || !!fileError) return;
		await onUpload();
		// uploadedUrls state updates asynchronously — read from the hook's resolved result
		// The useEffect below will pick up the new URL and advance the step
	}, [currentFile, uploadLoading, fileSizeError, fileError, onUpload]);

	// ── Step 1: remove / change media ──
	const handleRemoveMedia = useCallback(() => {
		if (pendingDeleteUrl.current) {
			deleteUploadedFile(pendingDeleteUrl.current);
			pendingDeleteUrl.current = "";
		}
		setFiles([]);
	}, [deleteUploadedFile, setFiles]);

	// ── Submit post ──
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
				sendNotification("There are new posts.", "/");
				closeDialog();
			} else {
				toast.error((await res.json())?.error ?? res.statusText, {
					id: toastId,
				});
			}
		} catch (err: any) {
			toast.error(err.message, { id: toastId });
		} finally {
			setSubmitting(false);
		}
	}

	const isInvalid =
		(isDragActive && isDragReject) ||
		!!fileError ||
		!!fileSizeError ||
		uploadErrors.length > 0;

	// ── Render ────────────────────────────────────────────────────────────────

	return (
		<div className="w-full">
			<StepDots step={step} />

			{/* ── STEP 1: Media upload ── */}
			{step === 1 && (
				<div className="space-y-4">
					<p className="text-sm text-muted-foreground text-center -mt-2 mb-4">
						Add a photo or video to your post
					</p>

					{/* Drop zone */}
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

						{/* Preview */}
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

								{/* Overlay: only show while uploading */}
								{uploadLoading && (
									<div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 text-white">
										<ProgressRing percent={uploadProgress} />
										<p className="text-sm font-medium">
											Uploading… {uploadProgress}%
										</p>
									</div>
								)}
							</>
						) : (
							/* Empty / error state */
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
											<IoImage size={14} /> Image up to 3 MB
										</span>
										<span className="text-muted-foreground/40">|</span>
										<span className="flex items-center gap-1">
											<IoVideocam size={14} /> Video up to 20 MB
										</span>
									</div>
								</div>

								{(fileError || fileSizeError) && (
									<p className="text-xs text-destructive">
										{fileError?.message ?? fileSizeError}
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
						loading={uploadLoading}
						loadingText={`Uploading… ${uploadProgress}%`}
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

			{/* ── STEP 2: Thread + tags ── */}
			{step === 2 && (
				<div className="space-y-4">
					{/* Media thumbnail */}
					{mediaUrl && (
						<div className="relative w-full aspect-4/3 rounded-xl overflow-hidden border bg-muted">
							{mediaType === "video" ? (
								<video
									src={mediaUrl}
									className="w-full h-full object-cover"
									muted
									playsInline
								/>
							) : (
								<Image
									src={mediaUrl}
									alt="Post media"
									fill
									className="object-cover"
									sizes="600px"
								/>
							)}
							<button
								type="button"
								onClick={() => {
									// Delete the claimed URL and go back to step 1
									deleteUploadedFile(mediaUrl);
									setMediaUrl("");
									setMediaType(null);
									setFiles([]);
									pendingDeleteUrl.current = "";
									setStep(1);
								}}
								className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition"
							>
								<IoClose size={16} />
							</button>
						</div>
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
									onClick={() => setStep(1)}
								>
									Back
								</Button>
								<Button
									type="submit"
									className="flex-1"
									disabled={!hasDataChanged || submitting}
									loading={submitting}
									loadingText="Posting…"
								>
									Post
								</Button>
							</div>
						</form>
					</Form>
				</div>
			)}
		</div>
	);
}
