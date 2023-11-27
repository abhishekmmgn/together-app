// "use client";

// import * as z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";

// const formSchema = z.object({
//   photo: z.string().optional(),
//   blog: z
//     .string()
//     .min(1, "Password must be at least 1 characters")
//     .max(256, "Password must be less than 256 characters"),
// });

// type formSchemaType = z.infer<typeof formSchema>;

// export default function CreatePostForm() {
//   const router = useRouter();

//   const form = useForm<formSchemaType>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       blog: "",
//     },
//   });

//   async function onSubmit(data: formSchemaType) {}

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
//         <div className="space-y-2">
//           <FormField
//             control={form.control}
//             name="email"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Email</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="email"
//                     placeholder="johndoe@email.com"
//                     className=""
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <Button type="submit">Done</Button>
//       </form>
//     </Form>
//   );
// }

export default function CreatePostForm() {
  return (
    <div>CPF</div>
  )
}

