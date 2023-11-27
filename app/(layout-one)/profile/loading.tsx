import LoadingSkeleton from "@/components/loading-skeleton";

export default function Loading() {
  return (
    <div className="p-5 space-y-4 ">
      <LoadingSkeleton />
      <LoadingSkeleton />
      <LoadingSkeleton />
      <LoadingSkeleton />
      <LoadingSkeleton />
      <LoadingSkeleton />
      <LoadingSkeleton />
      <LoadingSkeleton />
    </div>
  );
}


// import { Separator } from "@radix-ui/react-separator";
// import PostSkeleton from "@/components/post/post-skeleton";
// import ProfileCardSkeleton from "@/components/explore/profile-card-skeleton";
// import TableRow from "@/components/table-row";

// export default function LoadingProfile() {
//   return (
//     <div className="py-4 lg:pb-8 lg:px-5">
//       <ProfileCardSkeleton />
//       <Separator />
//       <TableRow title="Friends" textColor={false} />
//       <div className="pt-6 px-5 lg:px-0 space-y-2">
//         <div className="flex justify-between items-center">
//           <h2 className="font-medium text-2xl">Activity</h2>
//           <p className="text-primary text-sm">See All</p>
//         </div>
//         <PostSkeleton />
//       </div>
//     </div>
//   );
// }
