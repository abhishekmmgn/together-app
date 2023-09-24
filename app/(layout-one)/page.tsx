import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="px-4 min-h-screen flex flex-col items-center justify-center max-w-sm">
        <h1 className="text-5xl">Hello, Next</h1>
        <Button>Hello, Next!</Button>
      </div>
    </div>
  );
}
