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
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

const formSchema = z.object({
  photo: z.string().min(2),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(20, "Name must be less than 20 characters"),
  bio: z
    .string()
    .min(10, "Name must be at least 2 characters")
    .max(128, "Name must be less than 20 characters"),
});

type formSchemaType = z.infer<typeof formSchema>;

export default function CreateProfileForm() {
  const [disabled, setDisabled] = useState<boolean>(false);

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      photo: "",
      name: "",
      bio: "",
    },
  });

  async function onSubmit(data: formSchemaType) {
    setDisabled(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          photo: data.photo,
          name: data.name,
          bio: data.bio,
        }),
      });
      if (res.ok) {
        console.log("Success");
        toast.success("Done!");
        form.reset();
      } else if (res.status === 500) {
        console.log("Server error");
        toast.error("Server error");
      }
    } catch (err: any) {
      // console.log("Error: ", err.message);
      toast.error(err.message);
    } finally {
      setDisabled(false);
    }
  }

  return (
    <>
      <Toaster />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <div className="space-y-2">
            <Image
              src=""
              alt="Profile Photo"
              className="w-24 aspect-square bg-secondary rounded-full border mx-auto"
            />
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center gap-2">
                  <FormControl>
                    <Input
                      type="file"
                      {...field}
                      className=" border-0 mx-auto w-fit"
                    />
                  </FormControl>
                  <FormLabel>Photo</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      autoComplete="name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={disabled}>
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
