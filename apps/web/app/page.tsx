"use client";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { useQuery } from "convex/react";

export default function Page() {
  const users = useQuery(api.users.getUsers);
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <Button size="sm">Button</Button>
      </div>
      {JSON.stringify(users, null, 2)}
    </div>
  );
}
