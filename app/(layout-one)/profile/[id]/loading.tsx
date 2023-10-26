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
