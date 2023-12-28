"use client";

import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "../ui/input";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { UploadDropzone } from "@/helpers/uploadthing";
import sendNotification from "@/helpers/sendNotification";

const formSchema = z.object({
  thread: z
    .string()
    .min(1, "Thread must be not be empty")
    .max(256, "Thread must be less than 256 characters"),
  tags: z.string().optional(),
});

type formSchemaType = z.infer<typeof formSchema>;

export default function NewPostForm() {
  const [image, setImage] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      thread: "",
      tags: "",
    },
  });
  const { watch } = form;
  const watchAllFields = watch();

  const hasDataChanged =
    JSON.stringify(watchAllFields) !==
    JSON.stringify(form.formState.defaultValues);

  async function onSubmit(data: formSchemaType) {
    setDisabled(true);
    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: image,
          thread: data.thread,
          tags: data.tags,
        }),
      });
      if (res.ok) {
        toast.success("Post created successfully");
        form.reset();
        sendNotification("There are new posts.", "/");
      } else if (res.status === 400) {
        console.log(res.status);
        toast.error(res.statusText);
      } else if (res.status === 500) {
        console.log(res.status);
        toast.error(res.statusText);
      } else {
        console.log(res.status);
        toast.error(res.statusText);
      }
    } catch (err: any) {
      console.log("Error: ", err.message);
      toast.error(err.message);
    } finally {
      setImage("");
      setDisabled(false);
    }
  }
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <div className="space-y-2">
            <div className="relative flex flex-col items-center gap-2 w-full aspect-[4/3]">
              <Image
                src={image}
                alt="New Post"
                fill
                sizes="(max-width: 768px) 400px, 600px"
                className="object-cover bg-secondary rounded-[var(--radius)] border mx-auto"
              />
              <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  console.log(res);
                  setImage(res[0].url);
                  toast.success("Upload Completed");
                }}
                onUploadError={(error: Error) => {
                  toast.error(`ERROR! ${error.message}`);
                }}
                className="absolute z-10 inset-0 bg-black bg-opacity-60 border-border rounded-[var(--radius)] -mt-[2px] text-primary"
              />
            </div>
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
                      className="resize-none"
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
                      placeholder="Write upto 5 tags..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={!hasDataChanged || disabled}>
            {disabled && (
              <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
            )}
            Done
          </Button>
        </form>
      </Form>
    </>
  );
}
