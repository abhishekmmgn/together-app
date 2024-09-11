import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import type * as z from "zod";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// // @ts-expect-error
// import { useFormState } from "react-dom";
// import { loginFormSchema } from "@/lib/definitions";
// import { login } from "@/lib/action";
// import FormButton from "@/components/formbutton";

// type formSchemaType = z.infer<typeof loginFormSchema>;

// export default function LoginForm() {
//   const [state, formAction] = useFormState(login);

//   const form = useForm<formSchemaType>({
//     resolver: zodResolver(loginFormSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });
//   return (
//     <>
//       <Form {...form}>
//         <form action={formAction} className="w-full space-y-4">
//           <div className="space-y-2">
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="email"
//                       autoComplete="email"
//                       placeholder="johndoe@email.com"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Password</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="password"
//                       autoComplete="current-password"
//                       placeholder="********"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           <FormButton title="Sign in" />
//         </form>
//       </Form>
//     </>
//   );
// }
