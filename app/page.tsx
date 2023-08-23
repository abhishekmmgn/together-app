import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen">
      <h1 className="text-4xl">Learn This</h1>
      <Button>Click me</Button>
      <Alert>
        <AlertTitle>This is an alert</AlertTitle>Alert description
      </Alert>
    </div>
  );
}
