import LoadingSkeleton from "@/components/loading-skeleton";

export default function Loading() {
  return (
    <div className="p-5 space-y-4 ">
      {Array(8)
        .fill(null)
        .map((_, i) => (
          <LoadingSkeleton key={i} />
        ))}
    </div>
  );
}
